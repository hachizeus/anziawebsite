const requestCache = new Map();
const pendingRequests = new Map();

export const cachedFetch = async (url, options = {}) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  // Return cached result if available
  if (requestCache.has(cacheKey)) {
    const cached = requestCache.get(cacheKey);
    if (Date.now() - cached.timestamp < 300000) { // 5 min cache
      return cached.data;
    }
    requestCache.delete(cacheKey);
  }
  
  // Return pending request if in progress
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }
  
  // Make new request
  const promise = fetch(url, options).then(async response => {
    const data = await response.json();
    requestCache.set(cacheKey, { data, timestamp: Date.now() });
    pendingRequests.delete(cacheKey);
    return data;
  }).catch(error => {
    pendingRequests.delete(cacheKey);
    throw error;
  });
  
  pendingRequests.set(cacheKey, promise);
  return promise;
};