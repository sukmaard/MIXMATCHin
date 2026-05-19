const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function getApiOrigin() {
  if (!/^https?:\/\//i.test(API_BASE_URL)) return '';
  return new URL(API_BASE_URL).origin;
}

export function resolveAssetUrl(url) {
  if (!url || typeof url !== 'string') return '';
  if (/^(data:|blob:|https?:\/\/|\/assets\/)/i.test(url)) return url;
  if (url.startsWith('/')) return `${getApiOrigin()}${url}`;
  return url;
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error((data && data.error) || `API request failed with ${response.status}`);
  }
  return data;
}

export async function uploadImage(image) {
  if (!image || !String(image).startsWith('data:image/')) return image || '';
  const result = await apiRequest('/uploads', {
    method: 'POST',
    body: JSON.stringify({ image })
  });
  return result.url;
}

export async function uploadImages(images) {
  const list = Array.isArray(images) ? images.filter(Boolean) : [];
  return Promise.all(list.map(uploadImage));
}

export function imageToBase64(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () { resolve(reader.result); };
    reader.onerror = function (error) { reject(error); };
  });
}
