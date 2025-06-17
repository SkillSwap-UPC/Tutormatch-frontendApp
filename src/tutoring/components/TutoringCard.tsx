import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TutoringSession } from '../types/Tutoring';
import { User } from '../../user/types/User';
import { Rating } from 'primereact/rating';
import { UserService } from '../../user/services/UserService';
import { TutoringService } from '../services/TutoringService';
import { Calendar } from 'lucide-react';

interface TutoringCardProps {
  tutoring: TutoringSession;
  onClick?: (tutoringId: string | number) => void;
}

const TutoringCard: React.FC<TutoringCardProps> = ({ tutoring }) => {
  const [tutor, setTutor] = useState<User | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTutorAndReviews = async () => {
      try {
        // Obtener información del tutor
        if (tutoring.tutorId) {
          const tutorData = await UserService.getUserById(tutoring.tutorId.toString());
          setTutor(tutorData);
        }

        // Obtener reseñas y calcular valoración
        const reviews = await TutoringService.getReviews(tutoring.id.toString());
        if (reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          setRating(parseFloat((totalRating / reviews.length).toFixed(1)));
          setReviewCount(reviews.length);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorAndReviews();
  }, [tutoring.id, tutoring.tutorId]);

  const customStyles = `
  .p-rating .p-rating-item .p-rating-icon {
    color: red;
  }
  
  .p-rating .p-rating-item:not(.p-rating-item-active) .p-rating-icon {
    color: rgba(240, 92, 92, 0.4);
  }
  
  .p-rating:not(.p-disabled):not(.p-readonly) .p-rating-item:hover .p-rating-icon {
    color: #d14949;
  }
`;

  // Imagen por defecto si no hay una
  const defaultImage = 'https://i0.wp.com/port2flavors.com/wp-content/uploads/2022/07/placeholder-614.png';

  return (
    <Link to={`/tutoring/${tutoring.id}`} className="block bg-dark-card p-4 rounded-lg shadow hover:shadow-lg transition">
      <img
        src={tutoring.imageUrl || defaultImage}
        alt={tutoring.title}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h2 className="text-xl font-bold text-white">{tutoring.title}</h2>
      
      <div className="flex items-center mt-2 mb-2">
        <span className="text-primary text-sm">
         {loading ? 'Cargando...' : tutor ? `${tutor.firstName} ${tutor.lastName}` : 'Tutor desconocido'}
        </span>
      </div>

      <div className="flex items-center mt-1 mb-2">
      <style>{customStyles}</style>
        <span className="text-primary font-semibold text-sm mr-2">{rating > 0 ? rating : '0.0'}</span>
        <Rating value={Math.round(rating)} disabled cancel={false} className="custom-rating" />
        <span className="text-gray-400 text-xs ml-2">({reviewCount} reseñas)</span>
      </div>
      <p className="text-[#9CA3AF] line-clamp-2">{tutoring.description}</p>
      <p className="text-[#D1D5DB] font-bold mt-2">S/. {tutoring.price.toFixed(2)}</p>
      <div className="flex items-center text-[#64B5F6] mt-2">
        <Calendar className="w-4 h-4 mr-2" />
        <span>{tutoring.createdAt ? new Date(tutoring.createdAt).toLocaleString('es-PE', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }) : 'Fecha no disponible'}</span>
      </div>
    </Link>
  );
};

export default TutoringCard;