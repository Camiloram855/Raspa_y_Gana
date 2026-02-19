// Utility para generar un fingerprint único del dispositivo
// Esto ayuda a identificar usuarios sin necesidad de backend

export const generateDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Canvas fingerprinting
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('fingerprint', 2, 2);
  const canvasData = canvas.toDataURL();
  
  // Recopilar información del navegador
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvasData,
    plugins: Array.from(navigator.plugins || []).map(p => p.name).join(','),
  };
  
  // Generar hash simple
  const fingerprintString = JSON.stringify(fingerprint);
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const char = fingerprintString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
};

export const hasUserPlayed = () => {
  const played = localStorage.getItem('scratchCardPlayed');
  return played === 'true';
};

export const markUserAsPlayed = () => {
  localStorage.setItem('scratchCardPlayed', 'true');
  localStorage.setItem('scratchCardPlayedAt', Date.now().toString());
};

export const getUserPlayedTime = () => {
  const time = localStorage.getItem('scratchCardPlayedAt');
  return time ? parseInt(time) : null;
};

export const resetUserPlay = () => {
  localStorage.removeItem('scratchCardPlayed');
  localStorage.removeItem('scratchCardPlayedAt');
  localStorage.removeItem('scratchCardPrize');
};

export const saveUserPrize = (prize) => {
  localStorage.setItem('scratchCardPrize', JSON.stringify(prize));
};

export const getUserPrize = () => {
  const prize = localStorage.getItem('scratchCardPrize');
  return prize ? JSON.parse(prize) : null;
};
