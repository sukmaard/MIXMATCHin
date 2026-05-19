import { apiRequest, imageToBase64, resolveAssetUrl, uploadImage } from './apiClient';

const PROMOTION_CHANGE_EVENT = 'promotions-changed';

function normalizePromotion(promotion) {
  if (!promotion || typeof promotion !== 'object') return null;
  return {
    id: promotion.id == null ? String(Date.now()) : String(promotion.id),
    title: promotion.title || 'Current Promotion',
    discount: promotion.discount || '',
    buttonText: promotion.buttonText || 'Shop Now',
    link: promotion.link || '#',
    image: resolveAssetUrl(promotion.image),
    createdAt: promotion.createdAt || Date.now()
  };
}

function notifyPromotionChange() {
  window.dispatchEvent(new Event(PROMOTION_CHANGE_EVENT));
}

export async function getPromotions() {
  const promotions = await apiRequest('/promotions');
  return Array.isArray(promotions) ? promotions.map(normalizePromotion).filter(Boolean) : [];
}

export async function getHydratedPromotions() {
  return getPromotions();
}

export async function addPromotion(promotion) {
  const image = await uploadImage(promotion.image);
  const stored = normalizePromotion(await apiRequest('/promotions', {
    method: 'POST',
    body: JSON.stringify({ ...promotion, image })
  }));
  notifyPromotionChange();
  return stored;
}

export async function deletePromotion(id) {
  await apiRequest(`/promotions/${id}`, { method: 'DELETE' });
  notifyPromotionChange();
}

export async function deleteAllPromotions() {
  await apiRequest('/promotions', { method: 'DELETE' });
  notifyPromotionChange();
}

export { imageToBase64 };
