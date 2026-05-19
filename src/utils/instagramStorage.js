import { apiRequest, imageToBase64, resolveAssetUrl, uploadImage, uploadImages } from './apiClient';

const POST_CHANGE_EVENT = 'instagram-posts-changed';

function normalizePost(post) {
  if (!post || typeof post !== 'object') return null;
  return {
    id: post.id == null ? String(Date.now()) : String(post.id),
    caption: post.caption || '',
    hashtag: post.hashtag || '',
    link: post.link || '',
    image: resolveAssetUrl(post.image),
    images: Array.isArray(post.images) ? post.images.filter(Boolean).slice(0, 6).map(resolveAssetUrl) : [],
    createdAt: post.createdAt || Date.now()
  };
}

function notifyPostChange() {
  window.dispatchEvent(new Event(POST_CHANGE_EVENT));
}

export async function getPosts() {
  const posts = await apiRequest('/posts');
  return Array.isArray(posts) ? posts.map(normalizePost).filter(Boolean) : [];
}

export async function getHydratedPosts() {
  return getPosts();
}

export async function addPost(post) {
  const image = await uploadImage(post.image);
  const images = await uploadImages(post.images);
  const stored = normalizePost(await apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify({ ...post, image, images })
  }));
  notifyPostChange();
  return stored;
}

export async function deletePost(id) {
  await apiRequest(`/posts/${id}`, { method: 'DELETE' });
  notifyPostChange();
}

export async function deleteAllPosts() {
  await apiRequest('/posts', { method: 'DELETE' });
  notifyPostChange();
}

export { imageToBase64 };

export default {
  getHydratedPosts,
  addPost,
  deletePost,
  deleteAllPosts,
  imageToBase64,
  getPosts
};
