import { apiRequest, imageToBase64, resolveAssetUrl, uploadImage, uploadImages } from './apiClient';

const PRODUCT_CHANGE_EVENT = 'products-changed';

function normalizeProduct(product) {
  if (!product || typeof product !== 'object') return null;
  return {
    ...product,
    id: product.id == null ? String(Date.now()) : String(product.id),
    name: product.name || 'Untitled Product',
    price: Number(product.price) || 0,
    category: product.category || 'Uncategorized',
    description: product.description || '',
    image: resolveAssetUrl(product.image),
    images: Array.isArray(product.images) ? product.images.filter(Boolean).map(resolveAssetUrl) : [],
    colors: Array.isArray(product.colors) ? product.colors.filter(Boolean) : [],
    sizes: Array.isArray(product.sizes) ? product.sizes.filter(Boolean) : [],
    badge: product.badge || '',
    purchaseLink: product.purchaseLink || product.link || '',
    createdAt: product.createdAt || Date.now()
  };
}

function notifyProductChange() {
  window.dispatchEvent(new Event(PRODUCT_CHANGE_EVENT));
}

export async function getProducts() {
  const products = await apiRequest('/products');
  return Array.isArray(products) ? products.map(normalizeProduct).filter(Boolean) : [];
}

export async function getHydratedProducts() {
  return getProducts();
}

export async function addProduct(product) {
  const image = await uploadImage(product.image);
  const images = await uploadImages(product.images);
  const stored = normalizeProduct(await apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify({ ...product, image, images })
  }));
  notifyProductChange();
  return stored;
}

export async function updateProduct(id, updates) {
  const nextUpdates = { ...updates };
  if (nextUpdates.image) nextUpdates.image = await uploadImage(nextUpdates.image);
  if (Array.isArray(nextUpdates.images)) nextUpdates.images = await uploadImages(nextUpdates.images);
  const stored = normalizeProduct(await apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(nextUpdates)
  }));
  notifyProductChange();
  return stored;
}

export async function deleteProduct(id) {
  await apiRequest(`/products/${id}`, { method: 'DELETE' });
  notifyProductChange();
}

export async function deleteAllProducts() {
  await apiRequest('/products', { method: 'DELETE' });
  notifyProductChange();
}

export async function getProductById(id) {
  try {
    return normalizeProduct(await apiRequest(`/products/${id}`));
  } catch (error) {
    if (error.message === 'Not found') return null;
    throw error;
  }
}

export async function getHydratedProductById(id) {
  return getProductById(id);
}

export async function clearImageStore() {
  await deleteAllProducts();
}

export { imageToBase64 };
