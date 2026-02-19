import { useState, useEffect } from 'react';
import AdminPanel from './AdminPanel';

function AdminPage() {
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

  // Guardar premios en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('scratchCardPrizes', JSON.stringify(prizes));
  }, [prizes]);

  const handlePrizesUpdate = (newPrizes) => {
    setPrizes(newPrizes);
  };

  return <AdminPanel prizes={prizes} onPrizesUpdate={handlePrizesUpdate} />;
}

export default AdminPage;