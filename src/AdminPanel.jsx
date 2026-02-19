import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = ({ prizes, onPrizesUpdate }) => {
  const navigate = useNavigate();
  const [editingPrize, setEditingPrize] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPrize, setNewPrize] = useState({
    id: '',
    title: '',
    emoji: '',
    probability: 20,
    color: 'yellow'
  });

  const colorOptions = [
    { name: 'Amarillo', value: 'yellow', gradient: 'from-yellow-400 via-orange-400 to-red-500' },
    { name: 'Azul', value: 'blue', gradient: 'from-blue-400 via-cyan-400 to-teal-500' },
    { name: 'Verde', value: 'green', gradient: 'from-green-400 via-emerald-400 to-lime-500' },
    { name: 'Rosa', value: 'pink', gradient: 'from-pink-400 via-rose-400 to-red-500' },
    { name: 'Púrpura', value: 'purple', gradient: 'from-purple-400 via-violet-400 to-indigo-500' },
    { name: 'Naranja', value: 'orange', gradient: 'from-orange-400 via-amber-400 to-yellow-500' },
  ];

  const handleLogout = () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminSession');
      navigate('/login');
    }
  };

  const handleResetParticipations = () => {
    if (confirm('¿Estás seguro de resetear TODAS las participaciones? Esto permitirá que todos los usuarios vuelvan a jugar.')) {
      // Limpiar solo los datos de participación, no los premios
      localStorage.removeItem('scratchCardPlayed');
      localStorage.removeItem('scratchCardPlayedAt');
      localStorage.removeItem('scratchCardPrize');
      setShowResetModal(false);
      alert('✅ Participaciones reseteadas. Todos los usuarios pueden volver a jugar.');
    }
  };

  const handleAddPrize = () => {
    if (!newPrize.title.trim()) {
      alert('Por favor ingresa un título para el premio');
      return;
    }

    const prize = {
      ...newPrize,
      id: Date.now().toString(),
    };

    onPrizesUpdate([...prizes, prize]);
    setNewPrize({
      id: '',
      title: '',
      emoji: '',
      probability: 20,
      color: 'yellow'
    });
  };

  const handleEditPrize = (prize) => {
    setEditingPrize(prize);
  };

  const handleSaveEdit = () => {
    const updatedPrizes = prizes.map(p =>
      p.id === editingPrize.id ? editingPrize : p
    );
    onPrizesUpdate(updatedPrizes);
    setEditingPrize(null);
  };

  const handleDeletePrize = (id) => {
    if (confirm('¿Estás seguro de eliminar este premio?')) {
      onPrizesUpdate(prizes.filter(p => p.id !== id));
    }
  };

  const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header con logout */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-2xl mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowResetModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Resetear Participaciones
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Ver Raspa y Gana
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-90 mb-2">Total Premios</div>
            <div className="text-4xl font-bold">{prizes.length}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-90 mb-2">Probabilidad Total</div>
            <div className="text-4xl font-bold">{totalProbability}%</div>
          </div>
          <div className={`bg-gradient-to-br ${totalProbability === 100 ? 'from-purple-500 to-purple-600' : 'from-orange-500 to-orange-600'} rounded-xl p-6 text-white shadow-xl`}>
            <div className="text-sm opacity-90 mb-2">Estado</div>
            <div className="text-2xl font-bold">
              {totalProbability === 100 ? '✓ Balanceado' : '⚠ Ajustar'}
            </div>
          </div>
        </div>

        {/* Agregar nuevo premio */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Nuevo Premio
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Título del Premio
              </label>
              <input
                type="text"
                value={newPrize.title}
                onChange={(e) => setNewPrize({ ...newPrize, title: e.target.value })}
                placeholder="Ej: ¡Ganaste $1,000!"
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Emoji
              </label>
              <input
                type="text"
                value={newPrize.emoji}
                onChange={(e) => setNewPrize({ ...newPrize, emoji: e.target.value })}
                placeholder="💵 🎁 ✈️ 🍽️"
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Probabilidad (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={newPrize.probability}
                onChange={(e) => setNewPrize({ ...newPrize, probability: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Color de Fondo
              </label>
              <select
                value={newPrize.color}
                onChange={(e) => setNewPrize({ ...newPrize, color: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {colorOptions.map(color => (
                  <option key={color.value} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAddPrize}
            className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
          >
            ➕ Agregar Premio
          </button>
        </div>

        {/* Lista de premios */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-4">Premios Configurados</h3>

          {prizes.length === 0 ? (
            <div className="text-center text-gray-400 py-12 bg-white/5 rounded-lg">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg">No hay premios configurados</p>
              <p className="text-sm mt-2">¡Agrega el primer premio arriba!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {prizes.map((prize) => (
                <div
                  key={prize.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  {editingPrize?.id === prize.id ? (
                    // Modo edición
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={editingPrize.title}
                          onChange={(e) => setEditingPrize({ ...editingPrize, title: e.target.value })}
                          className="px-3 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="text"
                          value={editingPrize.emoji}
                          onChange={(e) => setEditingPrize({ ...editingPrize, emoji: e.target.value })}
                          className="px-3 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="number"
                          value={editingPrize.probability}
                          onChange={(e) => setEditingPrize({ ...editingPrize, probability: parseInt(e.target.value) || 0 })}
                          className="px-3 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <select
                          value={editingPrize.color}
                          onChange={(e) => setEditingPrize({ ...editingPrize, color: e.target.value })}
                          className="px-3 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {colorOptions.map(color => (
                            <option key={color.value} value={color.value}>
                              {color.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                        >
                          ✓ Guardar
                        </button>
                        <button
                          onClick={() => setEditingPrize(null)}
                          className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors"
                        >
                          ✕ Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Modo visualización
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-3xl">{prize.emoji}</div>
                        <div className="flex-1">
                          <div className="text-white font-semibold">{prize.title}</div>
                          <div className="text-sm text-gray-400">
                            Probabilidad: {prize.probability}% • Color: {colorOptions.find(c => c.value === prize.color)?.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPrize(prize)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeletePrize(prize.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Advertencia si no suma 100% */}
        {totalProbability !== 100 && prizes.length > 0 && (
          <div className="mt-6 bg-orange-500/20 border border-orange-500 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-semibold">
                {totalProbability < 100 
                  ? `Faltan ${100 - totalProbability}% para completar el 100%`
                  : `Hay ${totalProbability - 100}% de más. Reduce las probabilidades`
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación de reseteo */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 max-w-md w-full border border-white/20">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Resetear Participaciones</h3>
              <p className="text-gray-300">
                ¿Estás seguro de que quieres resetear todas las participaciones?
              </p>
            </div>

            <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-6">
              <p className="text-yellow-200 text-sm">
                ⚠️ Esta acción permitirá que todos los usuarios vuelvan a jugar. Los premios configurados no se verán afectados.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetParticipations}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg transition-colors font-semibold"
              >
                Sí, Resetear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
