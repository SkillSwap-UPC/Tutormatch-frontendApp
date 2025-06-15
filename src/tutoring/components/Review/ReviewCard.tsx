import { Card } from 'primereact/card';
import { Rating } from 'primereact/rating';
import { TutoringReview } from '../../types/Tutoring';
import { useState } from 'react';
import { Heart, MoreVertical } from 'lucide-react';
import { Menu } from 'primereact/menu';
import { useRef } from 'react';
import EditReviewModal from './EditReviewModal';
import DeleteReviewModal from './DeleteReviewModal';
import { TutoringService } from '../../services/TutoringService';
import { Toast } from 'primereact/toast';

interface ReviewCardProps {
  review: TutoringReview;
  currentUserId?: string;
  onReviewUpdated?: () => void;
  onReviewDeleted?: () => void;
  tutorName?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ 
  review, 
  currentUserId, 
  onReviewUpdated, 
  onReviewDeleted,
  tutorName 
}) => {
  const [likes, setLikes] = useState<number>(review.likes || 0);
  const [liked, setLiked] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const menuRef = useRef<Menu>(null);
  const toast = useRef<Toast>(null);

  const isOwner = currentUserId === review.studentId;

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
    } else {
      setLikes(likes - 1);
      setLiked(false);
    }
  };

  const handleDeleteReview = async () => {
    setIsDeleting(true);
    try {
      await TutoringService.deleteReview(review.id);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Reseña eliminada correctamente',
        life: 3000
      });

      setDeleteModalVisible(false);
      
      // Notificar al componente padre
      if (onReviewDeleted) {
        onReviewDeleted();
      }
    } catch (error) {
      console.error('Error al eliminar reseña:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar la reseña',
        life: 3000
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReviewUpdated = () => {
    if (onReviewUpdated) {
      onReviewUpdated();
    }
  };

  const menuItems = [
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => setEditModalVisible(true)
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      command: () => setDeleteModalVisible(true),
      className: 'text-red-500'
    }
  ];

  const formatDate = (date?: string | Date) => {
    if (!date) return 'Fecha no disponible';
    // Convertir la cadena a un objeto Date si es necesario
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return parsedDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const StudentAvatar = () => (
    <>
      {review.student?.avatar ? (
      <img 
        src={review.student.avatar} 
        alt={`${review.student.firstName} ${review.student.lastName}`} 
        className="w-12 h-12 rounded-full object-cover shadow-md"
      />
      ) : (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-md">
        {review.student?.firstName?.charAt(0)?.toUpperCase()}
        {review.student?.lastName?.charAt(0)?.toUpperCase()}
      </div>
      )}
    </>
  );
  const header = (
    <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
      <div className="flex items-center gap-4">
        <StudentAvatar />
        <div>
          <h3 className="text-lg font-semibold dark:text-white">
            {review.student?.firstName + ' ' + review.student?.lastName} 
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(review.createdAt)}</p>
        </div>
      </div>
      
      {isOwner && (
        <div className="relative">
          <button
            onClick={(e) => menuRef.current?.toggle(e)}
            className="p-2 rounded-full hover:bg-[#1e1e1e] transition-colors"
            title="Opciones"
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>
          <Menu
            ref={menuRef}
            model={menuItems}
            popup
            className="bg-[#1e1e1e] border border-[#4a4a4a]"
          />
        </div>
      )}
    </div>
  );

  const RatingDisplay = () => (
    <div className="flex items-center gap-2">
      <Rating value={review.rating} readOnly stars={5} cancel={false} />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{review.rating}/5</span>
    </div>
  );

  return (
    <Card className="shadow-lg overflow-hidden transition-all hover:shadow-xl bg-[#252525] rounded-lg" header={header}>
      <div className="flex flex-col gap-4">
        <RatingDisplay />

        {/* Comentario */}
        <div className="p-4 rounded-lg bg-[#1f1f1f]">
          <p className="dark:text-gray-300 text-base leading-relaxed">{review.comment || 'Sin comentarios adicionales.'}</p>
        </div>        {/* Likes */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-all ${
              liked
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title={liked ? 'No me gusta' : 'Me gusta'} // Texto de hover dinámico
          >
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            {liked ? 'Te gusta' : 'Me gusta'}
          </button>
          <span className="text-sm text-gray-400">{likes} {likes === 1 ? 'like' : 'likes'}</span>
        </div>{/* Modal para editar reseña */}
        <EditReviewModal 
          visible={editModalVisible} 
          onHide={() => setEditModalVisible(false)} 
          review={review}
          onReviewUpdated={handleReviewUpdated}
          tutorName={tutorName}
        />{/* Modal para eliminar reseña */}
        <DeleteReviewModal 
          visible={deleteModalVisible} 
          onHide={() => setDeleteModalVisible(false)} 
          onConfirm={handleDeleteReview}
          review={review}
          loading={isDeleting}
        />

        {/* Toast para notificaciones */}
        <Toast ref={toast} />
      </div>
    </Card>
  );
};

export default ReviewCard;