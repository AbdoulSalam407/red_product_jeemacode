/**
 * Utilitaire pour vider le cache localStorage
 */

export const clearCache = () => {
  try {
    // Vider les clés de cache des hôtels
    localStorage.removeItem('hotels_cache');
    localStorage.removeItem('hotels_cache_time');
    
    console.log('✅ Cache vidé avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du vidage du cache:', error);
    return false;
  }
};

export const clearAllCache = () => {
  try {
    // Vider tout le localStorage
    localStorage.clear();
    console.log('✅ Tout le cache a été vidé');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du vidage complet du cache:', error);
    return false;
  }
};

export const getCacheInfo = () => {
  try {
    const cacheData = localStorage.getItem('hotels_cache');
    const cacheTime = localStorage.getItem('hotels_cache_time');
    
    return {
      hasCacheData: !!cacheData,
      hasCacheTime: !!cacheTime,
      cacheSize: cacheData ? cacheData.length : 0,
      cacheTime: cacheTime ? new Date(parseInt(cacheTime)).toLocaleString() : null,
    };
  } catch (error) {
    console.error('❌ Erreur lors de la lecture du cache:', error);
    return null;
  }
};
