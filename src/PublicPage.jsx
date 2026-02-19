import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScratchCard from './ScratchCard';
import { 
  hasUserPlayed, 
  markUserAsPlayed, 
  getUserPrize,
  saveUserPrize,
  getUserPlayedTime 
} from './deviceFingerprint';

function PublicPage() {
  const navigate = useNavigate();
  
  // Premios iniciales por defecto
  const defaultPrizes = [
    { id: '1', title: '¡Ganaste un viaje a París!', emoji: '✈️', probability: 10, color: 'blue' },
    { id: '2', title: '¡Premio: $1,000 USD!', emoji: '💵', probability: 15, color: 'green' },
    { id: '3', title: '¡Descuento del 50%!', emoji: '🎁', probability: 25, color: 'purple' },
    { id: '4', title: '¡Ganaste una cena para dos!', emoji: '🍽️', probability: 20, color: 'orange' },
    { id: '5', title: '¡Premio sorpresa!', emoji: '🎊', probability: 30, color: 'pink' },
  ];

  // Cargar premios desde localStorage o usar los por defecto
  const [prizes, setPrizes] = useState(() => {
    const saved = localStorage.getItem('scratchCardPrizes');
    return saved ? JSON.parse(saved) : defaultPrizes;
  });

  const [currentPrize, setCurrentPrize] = useState(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [playedTime, setPlayedTime] = useState(null);

  // Verificar si el usuario ya jugó
  useEffect(() => {
    const played = hasUserPlayed();
    setHasPlayed(played);
    
    if (played) {
      const savedPrize = getUserPrize();
      const time = getUserPlayedTime();
      setCurrentPrize(savedPrize);
      setPlayedTime(time);
    } else {
      // Solo generar premio si no ha jugado
      const prize = getRandomPrize();
      setCurrentPrize(prize);
    }
  }, [prizes]);

  // Actualizar premios si cambian en localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('scratchCardPrizes');
      if (saved) {
        setPrizes(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Función para obtener un premio aleatorio basado en probabilidades
  const getRandomPrize = () => {
    if (prizes.length === 0) {
      return { title: 'No hay premios configurados', emoji: '❌', color: 'yellow' };
    }

    const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0);
    const random = Math.random() * totalProbability;
    
    let accumulated = 0;
    for (const prize of prizes) {
      accumulated += prize.probability;
      if (random <= accumulated) {
        return prize;
      }
    }
    
    return prizes[0];
  };

  // Cuando el usuario termina de raspar, marcar como jugado
  const handleCardRevealed = () => {
    if (!hasPlayed && currentPrize) {
      markUserAsPlayed();
      saveUserPrize(currentPrize);
      setHasPlayed(true);
      setPlayedTime(Date.now());
    }
  };

  const getColorGradient = (color) => {
    const gradients = {
      yellow: 'from-yellow-400 via-orange-400 to-red-500',
      blue: 'from-blue-400 via-cyan-400 to-teal-500',
      green: 'from-green-400 via-emerald-400 to-lime-500',
      pink: 'from-pink-400 via-rose-400 to-red-500',
      purple: 'from-purple-400 via-violet-400 to-indigo-500',
      orange: 'from-orange-400 via-amber-400 to-yellow-500',
    };
    return gradients[color] || gradients.yellow;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
          Raspa y Gana
        </h1>
        <p className="text-gray-300 text-lg">
          {hasPlayed ? 'Ya has participado en esta promoción' : 'Usa tu mouse o dedo para raspar la tarjeta'}
        </p>
      </div>

      {/* Tarjeta principal */}
      {currentPrize && (
        <div className="mb-8">
          <ScratchCard
            coverText={hasPlayed ? "Ya participaste" : "Raspa y descubre tu regalo"}
            revealContent={`${currentPrize.emoji} ${currentPrize.title}`}
            revealColor={getColorGradient(currentPrize.color)}
            width={400}
            height={300}
            brushSize={30}
            disabled={hasPlayed}
            onRevealed={handleCardRevealed}
          />
        </div>
      )}

      {/* Información de participación */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-md w-full shadow-2xl">
        {hasPlayed ? (
          <>
            <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-orange-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-semibold">Ya has participado</span>
              </div>
              <p className="text-orange-200 text-sm mt-2">
                Solo se permite una participación por persona
              </p>
            </div>

            <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
              <h3 className="text-blue-300 font-semibold mb-2">Tu premio:</h3>
              <p className="text-white text-lg font-bold">
                {currentPrize.emoji} {currentPrize.title}
              </p>
              {playedTime && (
                <p className="text-blue-200 text-sm mt-2">
                  Participaste el {formatDate(playedTime)}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-white text-xl font-semibold mb-4 text-center">
              ¡Buena suerte! 🍀
            </h2>
            
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Información importante</span>
              </div>
              <p className="text-green-200 text-sm mt-2">
                Solo tienes una oportunidad para raspar y ganar. ¡Aprovéchala!
              </p>
            </div>
          </>
        )}

        {prizes.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              {prizes.length} premio{prizes.length !== 1 ? 's' : ''} disponible{prizes.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Footer con link al admin */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Sistema de premios aleatorios con probabilidades</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-3 text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mx-auto transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Acceso Administrador
        </button>
      </div>
    </div>
  );
}

export default PublicPage;
