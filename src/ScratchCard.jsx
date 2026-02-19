import { useRef, useEffect, useState } from 'react';

const ScratchCard = ({ 
  coverText = "Raspa y descubre tu regalo",
  revealContent = "¡Felicidades! Has ganado un premio especial 🎉",
  width = 400,
  height = 300,
  brushSize = 30
}) => {
  const canvasRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedPercentage, setScratchedPercentage] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Configurar canvas con resolución alta
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Dibujar capa de raspado con gradiente
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#9333ea');
    gradient.addColorStop(0.5, '#c026d3');
    gradient.addColorStop(1, '#db2777');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Agregar texto en la capa de raspado
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(coverText, width / 2, height / 2);

    // Agregar textura
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 50; i++) {
      ctx.fillRect(
        Math.random() * width,
        Math.random() * height,
        2,
        2
      );
    }
  }, [width, height, coverText]);

  const scratch = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasX = (x - rect.left) * scaleX / dpr;
    const canvasY = (y - rect.top) * scaleY / dpr;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, brushSize, 0, 2 * Math.PI);
    ctx.fill();

    // Calcular porcentaje raspado
    checkScratchedPercentage();
  };

  const checkScratchedPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percentage = (transparent / (pixels.length / 4)) * 100;
    setScratchedPercentage(percentage);

    // Si se ha raspado más del 70%, revelar completamente
    if (percentage > 70 && !isRevealed) {
      setIsRevealed(true);
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }, 300);
    }
  };

  const handleMouseDown = (e) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (isScratching) {
      scratch(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsScratching(true);
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (isScratching) {
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setIsScratching(false);
  };

  const resetCard = () => {
    setIsRevealed(false);
    setScratchedPercentage(0);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Redibujar la capa de raspado
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#9333ea');
    gradient.addColorStop(0.5, '#c026d3');
    gradient.addColorStop(1, '#db2777');
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(coverText, width / 2, height / 2);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 50; i++) {
      ctx.fillRect(
        Math.random() * width,
        Math.random() * height,
        2,
        2
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative rounded-2xl shadow-2xl overflow-hidden cursor-pointer select-none"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {/* Contenido revelado */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 p-8">
          <div className="text-center">
            <p className="text-white text-2xl font-bold drop-shadow-lg">
              {revealContent}
            </p>
          </div>
        </div>

        {/* Canvas de raspado */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 touch-none transition-opacity duration-300 ${
            isRevealed ? 'opacity-0' : 'opacity-100'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      {/* Indicador de progreso */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progreso de raspado</span>
          <span className="font-semibold">{Math.round(scratchedPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${scratchedPercentage}%` }}
          />
        </div>
      </div>

      {/* Botón de reinicio */}
      {scratchedPercentage > 10 && (
        <button
          onClick={resetCard}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Reiniciar
        </button>
      )}
    </div>
  );
};

export default ScratchCard;