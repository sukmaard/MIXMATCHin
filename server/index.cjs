const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const PORT = Number(process.env.API_PORT || 3001);
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const MAX_BODY_BYTES = 30 * 1024 * 1024;
const IMAGE_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
};

const collections = {
  products: {
    file: 'products.json',
    normalize: normalizeProduct
  },
  promotions: {
    file: 'promotions.json',
    normalize: normalizePromotion
  },
  posts: {
    file: 'instagram-posts.json',
    normalize: normalizePost
  }
};

function createId() {
  if (typeof randomUUID === 'function') return randomUUID();
  return String(Date.now());
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

async function readCollection(name) {
  await ensureDataDir();
  const config = collections[name];
  const filePath = path.join(DATA_DIR, config.file);

  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(config.normalize).filter(Boolean) : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeCollection(name, []);
      return [];
    }
    throw error;
  }
}

async function writeCollection(name, items) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, collections[name].file);
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf8');
}

function normalizeProduct(product) {
  if (!product || typeof product !== 'object') return null;
  return {
    id: product.id == null ? createId() : String(product.id),
    name: product.name || 'Untitled Product',
    price: Number(product.price) || 0,
    category: product.category || 'Uncategorized',
    description: product.description || '',
    image: product.image || '',
    images: Array.isArray(product.images) ? product.images.filter(Boolean) : [],
    colors: Array.isArray(product.colors) ? product.colors.filter(Boolean) : [],
    sizes: Array.isArray(product.sizes) ? product.sizes.filter(Boolean) : [],
    badge: product.badge || '',
    purchaseLink: product.purchaseLink || product.link || '',
    createdAt: product.createdAt || Date.now()
  };
}

function isDataUrl(value) {
  return typeof value === 'string' && value.startsWith('data:image/');
}

function publicUrlForUpload(filename) {
  return `/uploads/${filename}`;
}

async function saveDataUrlImage(dataUrl) {
  if (!isDataUrl(dataUrl)) return dataUrl || '';

  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw Object.assign(new Error('Invalid image data URL'), { status: 400 });
  }

  const mime = match[1].toLowerCase();
  const extension = IMAGE_EXTENSIONS[mime];
  if (!extension) {
    throw Object.assign(new Error(`Unsupported image type: ${mime}`), { status: 400 });
  }

  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length === 0) {
    throw Object.assign(new Error('Uploaded image is empty'), { status: 400 });
  }

  await ensureUploadDir();
  const filename = `${Date.now()}-${createId()}.${extension}`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return publicUrlForUpload(filename);
}

async function saveImageList(values) {
  const images = Array.isArray(values) ? values.filter(Boolean) : [];
  return Promise.all(images.map(saveDataUrlImage));
}

async function persistPayloadImages(payload) {
  const next = { ...payload };
  if (next.image) next.image = await saveDataUrlImage(next.image);
  if (Array.isArray(next.images)) next.images = await saveImageList(next.images);
  return next;
}

async function sendUpload(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const payload = await readBody(req);
  const url = await saveDataUrlImage(payload.image || payload.dataUrl || '');
  sendJson(res, 201, { url });
}

async function sendUploadFile(res, filename) {
  const safeName = path.basename(filename || '');
  if (!safeName) {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  const filePath = path.join(UPLOAD_DIR, safeName);
  const extension = path.extname(safeName).slice(1).toLowerCase();
  const mime = Object.entries(IMAGE_EXTENSIONS).find(([, ext]) => ext === extension)?.[0] || 'application/octet-stream';

  try {
    const file = await fs.readFile(filePath);
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(file);
  } catch (error) {
    if (error.code === 'ENOENT') {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }
    throw error;
  }
}

function normalizePromotion(promotion) {
  if (!promotion || typeof promotion !== 'object') return null;
  return {
    id: promotion.id == null ? createId() : String(promotion.id),
    title: promotion.title || 'Current Promotion',
    discount: promotion.discount || '',
    buttonText: promotion.buttonText || 'Shop Now',
    link: promotion.link || '#',
    image: promotion.image || '',
    createdAt: promotion.createdAt || Date.now()
  };
}

function normalizePost(post) {
  if (!post || typeof post !== 'object') return null;
  return {
    id: post.id == null ? createId() : String(post.id),
    caption: post.caption || '',
    hashtag: post.hashtag || '',
    link: post.link || '',
    image: post.image || '',
    images: Array.isArray(post.images) ? post.images.filter(Boolean).slice(0, 6) : [],
    createdAt: post.createdAt || Date.now()
  };
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function sendNoContent(res) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end();
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Request body is too large'), { status: 413 }));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(Object.assign(new Error('Invalid JSON body'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

async function handleCollection(req, res, collectionName, id) {
  const config = collections[collectionName];
  const items = await readCollection(collectionName);

  if (req.method === 'GET' && !id) {
    sendJson(res, 200, items);
    return;
  }

  if (req.method === 'GET' && id) {
    const item = items.find(entry => String(entry.id) === String(id));
    sendJson(res, item ? 200 : 404, item || { error: 'Not found' });
    return;
  }

  if (req.method === 'POST' && !id) {
    const payload = await persistPayloadImages(await readBody(req));
    const item = config.normalize({
      ...payload,
      id: createId(),
      createdAt: Date.now()
    });
    items.unshift(item);
    await writeCollection(collectionName, items);
    sendJson(res, 201, item);
    return;
  }

  if (req.method === 'PUT' && id) {
    const index = items.findIndex(entry => String(entry.id) === String(id));
    if (index === -1) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }
    const payload = await persistPayloadImages(await readBody(req));
    items[index] = config.normalize({ ...items[index], ...payload, id: items[index].id });
    await writeCollection(collectionName, items);
    sendJson(res, 200, items[index]);
    return;
  }

  if (req.method === 'DELETE' && id) {
    await writeCollection(
      collectionName,
      items.filter(entry => String(entry.id) !== String(id))
    );
    sendNoContent(res);
    return;
  }

  if (req.method === 'DELETE' && !id) {
    await writeCollection(collectionName, []);
    sendNoContent(res);
    return;
  }

  sendJson(res, 405, { error: 'Method not allowed' });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      sendNoContent(res);
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const parts = url.pathname.split('/').filter(Boolean);

    if (parts[0] === 'uploads') {
      await sendUploadFile(res, parts[1]);
      return;
    }

    if (url.pathname === '/api/uploads') {
      await sendUpload(req, res);
      return;
    }

    if (parts[0] === 'api' && collections[parts[1]]) {
      await handleCollection(req, res, parts[1], parts[2]);
      return;
    }

    if (url.pathname === '/api/health') {
      sendJson(res, 200, { ok: true });
      return;
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (error) {
    const status = error.status || 500;
    sendJson(res, status, { error: error.message || 'Server error' });
  }
});

server.listen(PORT, () => {
  console.log(`MIXMATCHin API listening on http://localhost:${PORT}`);
});
