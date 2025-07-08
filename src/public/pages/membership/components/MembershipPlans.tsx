import { useState } from 'react';
import { MembershipService } from '../services/MembershipService';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'BASIC Plan',
    features: [
      'Basic profile on the platform.',
      'Access to interested students.',
      'History of tutoring.',
      'Support with response within 48 hours.'
    ],
    price: 'S/ 5.00',
  },
  {
    name: 'STANDARD Plan',
    features: [
      'Everything in the basic plan.',
      'Access to tutoring management tools (advanced calendars, automatic reminders).',
      'Personalized recommendations for students.',
      'Improved visibility in searches.',
      'Support with a response within 24 hours.'
    ],
    price: 'S/ 10.00',
  },
  {
    name: 'PREMIUM Plan',
    features: [
      'Everything in the standard plan.',
      'Featured profile with greater exposure on the platform.',
      'Access to advanced statistics on tutoring performance.',
      'Promotions and discounts on ads within the platform.',
      'Priority support with a response within 12 hours.',
      'Access to exclusive events and professional development opportunities.'
    ],
    price: 'S/ 15.00',
  },
];

const qrImages = {
  yape: 'https://xdqnuesrahrusfnxcwvm.supabase.co/storage/v1/object/public/qr//qr.png',
  plin: 'https://xdqnuesrahrusfnxcwvm.supabase.co/storage/v1/object/public/qr//plin.jpg',
};

export default function MembershipPlans() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState<'yape' | 'plin'>('yape');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleBuy = (idx: number) => {
    setSelectedPlan(idx);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!file || selectedPlan === null) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // 1. Subir comprobante
      const paymentProofUrl = await MembershipService.uploadPaymentProof(file);
      // 2. Crear membresía
      const planType = ['BASIC', 'STANDARD', 'PREMIUM'][selectedPlan] as 'BASIC' | 'STANDARD' | 'PREMIUM';
      await MembershipService.createMembership(planType, paymentProofUrl);
      setSuccess('¡Comprobante enviado y membresía registrada! Un administrador revisará tu pago.');
      setShowModal(false);
      setFile(null);
      setShowConfirmation(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el comprobante.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#a91d3a] to-[#4a0c2e] py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">Conviértete en tutor y guía el éxito académico de otros.</h1>
      <p className="text-white text-lg mb-10 text-center max-w-2xl">Ofrece tu conocimiento y ayuda a otros a alcanzar el éxito académico, ¡comienza a ofrecer tus tutorías hoy!</p>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch w-full max-w-5xl">
        {plans.map((plan, idx) => (
          <div
            key={plan.name}
            className="bg-[#2d010e] rounded-2xl flex flex-col justify-between p-8 w-full md:w-80 shadow-lg"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">{plan.name}</h2>
              <ul className="text-white text-base mb-8 list-disc list-inside space-y-2">
                {plan.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded mt-4 transition-colors"
              onClick={() => handleBuy(idx)}
            >
              Buy Plan
            </button>
          </div>
        ))}
      </div>

      {/* Modal para pago y comprobante */}
      {showModal && selectedPlan !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-xl">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={handleClose}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-2 text-center">Pago de membresía: {plans[selectedPlan].name}</h3>
            <p className="text-center mb-4 font-semibold">Monto a pagar: <span className="text-[#a91d3a]">{plans[selectedPlan].price}</span></p>
            <div className="flex justify-center mb-4">
              <button
                className={`px-4 py-2 rounded-l ${tab === 'yape' ? 'bg-[#a91d3a] text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setTab('yape')}
              >
                Yape
              </button>
              <button
                className={`px-4 py-2 rounded-r ${tab === 'plin' ? 'bg-[#a91d3a] text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setTab('plin')}
              >
                Plin
              </button>
            </div>
            <div className="flex flex-col items-center mb-4">
              <img
                src={qrImages[tab]}
                alt={`QR ${tab}`}
                className="w-48 h-48 object-contain rounded-lg border border-gray-300 bg-white"
              />
              <p className="text-sm text-gray-700 mt-2">Escanea el QR y paga el monto exacto.</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Sube tu comprobante de pago:</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="block w-full text-gray-700 border border-gray-300 rounded px-2 py-1"
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
            </div>
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
            <button
              className="w-full bg-[#a91d3a] hover:bg-[#7a142a] text-white font-bold py-2 rounded transition-colors disabled:opacity-50"
              disabled={!file || loading}
              onClick={handleSubmit}
            >
              {loading ? 'Enviando...' : 'Enviar comprobante'}
            </button>
          </div>
        </div>
      )}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-dark rounded-2xl p-8 w-full max-w-md relative shadow-xl flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 text-center text-[#a91d3a]">¡Comprobante enviado!</h3>
            <p className="text-white text-center mb-6">Tu comprobante fue enviado correctamente y está en revisión.<br/>Recibirás una notificación cuando tu membresía sea activada.</p>
            <button
              className="bg-[#a91d3a] hover:bg-[#7a142a] text-white font-bold py-2 px-6 rounded transition-colors"
              onClick={() => {
                setShowConfirmation(false);
                navigate('/membership/waiting');
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
