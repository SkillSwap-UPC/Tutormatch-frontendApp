import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MembershipWaitingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Aquí podrías hacer polling para verificar si la membresía fue aprobada
    // y redirigir al dashboard si es así
    // Por ahora solo muestra el mensaje de espera
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#a91d3a] to-[#4a0c2e] py-10">
      <div className="bg-dark rounded-2xl p-8 w-full max-w-md shadow-xl flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#a91d3a]">¡Gracias por tu envío!</h2>
        <p className="text-gray-200 text-center mb-6">
          Tu comprobante fue enviado correctamente y está en revisión.<br/>
          Un administrador revisará tu pago y te notificaremos cuando tu membresía sea activada.<br/>
          Por favor, espera la aprobación para acceder a las funciones de tutor.
        </p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a91d3a] mb-4"></div>
        <button
          className="bg-[#a91d3a] hover:bg-[#7a142a] text-white font-bold py-2 px-6 rounded transition-colors mt-2"
          onClick={() => navigate('/login')}
        >
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
}
