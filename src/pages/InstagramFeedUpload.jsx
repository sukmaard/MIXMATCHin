import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaInstagram, FaUpload, FaTrash, FaImages, FaTrashAlt,
  FaPlus, FaHashtag, FaLink
} from 'react-icons/fa';
import {
  addPost, deletePost, deleteAllPosts, getPosts, imageToBase64
} from '../utils/instagramStorage';

const MAX_IMAGES = 6;

const PRESET_HASHTAGS = [
  '#ootd', '#outfitinspiration', '#mixmatchoutfit',
  '#fashioninspo', '#styleinsporation', '#todaysoutfit',
  '#streetstyle', '#casualchic', '#luxurystyle'
];

var InstagramFeedUpload = function () {
  var _a = useState([]), images         = _a[0], setImages         = _a[1];
  var _b = useState([]), previewUrls    = _b[0], setPreviewUrls    = _b[1];
  var _c = useState(''), caption        = _c[0], setCaption        = _c[1];
  var _d = useState(''), hashtag        = _d[0], setHashtag        = _d[1];
  var _e = useState(''), postLink       = _e[0], setPostLink       = _e[1];
  var _f = useState(false), isSubmitting = _f[0], setIsSubmitting = _f[1];
  var _g = useState(''), message        = _g[0], setMessage       = _g[1];
  var _h = useState(false), showReset   = _h[0], setShowReset     = _h[1];
  var _j = useState(false), isResetting = _j[0], setIsResetting   = _j[1];
  var _k = useState(0), postCount       = _k[0], setPostCount     = _k[1];

  var loadPostCount = async function () {
    try {
      var posts = await getPosts();
      setPostCount(posts.length);
    } catch (err) {
      setPostCount(0);
    }
  };

  useEffect(function () {
    loadPostCount();
    window.addEventListener('instagram-posts-changed', loadPostCount);
    return function () {
      window.removeEventListener('instagram-posts-changed', loadPostCount);
    };
  }, []);

  var handleImageChange = async function (e) {
    try {
      var files = Array.from(e.target.files || []);
      if (files.length === 0) return;
      var slotsLeft = MAX_IMAGES - images.length;
      if (slotsLeft <= 0) {
        setMessage({ type: 'error', text: 'Maksimal ' + MAX_IMAGES + ' gambar dalam satu postingan.' });
        return;
      }
      var toProcess  = files.slice(0, slotsLeft);
      var newPreviews = [];
      var newImages   = [];
      for (var i = 0; i < toProcess.length; i++) {
        var file = toProcess[i];
        if (file.type.startsWith('image/')) {
          var base64 = await imageToBase64(file);
          newPreviews.push(base64);
          newImages.push({ file: file, base64: base64 });
        }
      }
      setImages(function (prev) { return prev.concat(newImages); });
      setPreviewUrls(function (prev) { return prev.concat(newPreviews); });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal membaca file gambar.' });
    }
  };

  var removeImage = function (index) {
    setImages(function (prev) { return prev.filter(function (_, j) { return j !== index; }); });
    setPreviewUrls(function (prev) { return prev.filter(function (_, j) { return j !== index; }); });
  };

  var toggleTag = function (ht) {
    var tags = hashtag.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    var idx  = tags.indexOf(ht);
    if (idx === -1) {
      tags.push(ht);
    } else {
      tags.splice(idx, 1);
    }
    setHashtag(tags.join(', '));
  };

  var handleSubmit = async function (e) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      if (images.length === 0) throw new Error('Tambahkan setidaknya satu gambar');
      if (!caption.trim()) throw new Error('Masukkan deskripsi/caption postingan');
      var mainImage = images[0].base64;
      var allImages = images.map(function (x) { return x.base64; });
      await addPost({
        caption: caption.trim(),
        hashtag: hashtag.trim(),
        link:    postLink.trim(),
        image:   mainImage,
        images:  allImages
      });
      await loadPostCount();
      setMessage({ type: 'success', text: 'Postingan Instagram berhasil ditambahkan!' });
      setCaption('');
      setHashtag('');
      setPostLink('');
      setImages([]);
      setPreviewUrls([]);
    } catch (err) {
      setMessage({ type: 'error', text: (err && err.message) || 'Terjadi kesalahan saat menambahkan postingan' });
    } finally {
      setIsSubmitting(false);
    }
  };

  var handleResetAll = async function () {
    setIsResetting(true);
    try {
      await deleteAllPosts();
      await loadPostCount();
      setMessage({ type: 'success', text: 'Semua postingan Instagram sudah dihapus.' });
      setShowReset(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menghapus postingan.' });
    } finally {
      setIsResetting(false);
    }
  };

  var activeTags = {};
  hashtag.split(',').map(function (t) { return t.trim(); }).filter(Boolean).forEach(function (t) { activeTags[t] = true; });

  return (
    <section className="py-12 bg-luxury-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-playfair text-luxury-black mb-2 text-center">
            <FaInstagram className="inline mr-2 text-pink-500" />
            Instagram Feed Upload
          </h1>
          <p className="text-luxury-black/50 text-center mb-8">
            Upload foto outfit inspirasi ke feed Instagram kamu
          </p>

          {message.text && (
            <div className={`p-4 mb-6 rounded ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ---- Image Grid ---- */}
            <div className="luxury-card p-6">
              <label className="block text-lg font-medium mb-4">
                <FaImages className="inline mr-2" />
                Gambar Feed (maks {MAX_IMAGES}) *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {previewUrls.map(function (url, index) {
                  return (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={url}
                        alt={'Feed ' + (index + 1)}
                        className="w-full h-full object-cover rounded-lg luxury-card"
                      />
                      <button
                        type="button"
                        onClick={function () { return removeImage(index); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  );
                })}
                {images.length < MAX_IMAGES && (
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-luxury-black/30 rounded-lg cursor-pointer hover:border-luxury-black/50 transition-colors">
                    <FaPlus className="text-2xl mb-1 text-luxury-black/50" />
                    <span className="text-xs text-center">
                      {images.length === 0 ? 'Tambah Gambar' : 'Tambah Lagi'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-luxury-black/50 mt-2">
                Klik untuk upload foto outfit. Gambar pertama akan menjadi foto utama feed.
              </p>
            </div>

            {/* ---- Caption ---- */}
            <div>
              <label htmlFor="caption" className="block text-lg font-medium mb-2">
                <FaInstagram className="inline mr-1" />
                Caption *
              </label>
              <textarea
                id="caption"
                value={caption}
                onChange={function (e) { return setCaption(e.target.value); }}
                rows={3}
                className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20 resize-none"
                placeholder={'Tulis caption Instagram kamu...'}
              />
            </div>

            {/* ---- Hashtag ---- */}
            <div>
              <label htmlFor="hashtag" className="block text-lg font-medium mb-2">
                <FaHashtag className="inline mr-1" />
                Hashtag
              </label>
              <input
                type="text"
                id="hashtag"
                value={hashtag}
                onChange={function (e) { return setHashtag(e.target.value); }}
                className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20"
                placeholder="e.g. #ootd #fashioninspo"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {PRESET_HASHTAGS.map(function (ht) {
                  return (
                    <button
                      key={ht}
                      type="button"
                      onClick={function () { return toggleTag(ht); }}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        activeTags[ht]
                          ? 'bg-luxury-black text-luxury-white border-luxury-black'
                          : 'border-luxury-black/20 hover:border-luxury-black/40'
                      }`}
                    >
                      {ht}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ---- Post Link ---- */}
            <div>
              <label htmlFor="postLink" className="block text-lg font-medium mb-2">
                <FaLink className="inline mr-1" />
                Link Instagram (opsional)
              </label>
              <input
                type="url"
                id="postLink"
                value={postLink}
                onChange={function (e) { return setPostLink(e.target.value); }}
                className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20"
                placeholder="https://instagram.com/p/..."
              />
            </div>

            {/* ---- Submit ---- */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full luxury-btn py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaInstagram className="inline mr-2" />
                {isSubmitting ? 'Mengunggah...' : 'Post ke Feed Instagram'}
              </button>
            </div>
          </form>

          {/* ---- Danger Zone ---- */}
          <div className="mt-12 pt-8 border-t border-luxury-black/10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center">
                <FaTrashAlt className="mr-2" />
                Zona Berbahaya
              </h3>
              <p className="text-red-700 text-sm mb-4">
                Hapus permanen semua postingan Instagram feed. Tindakan ini tidak bisa dibatalkan.
              </p>
              <button
                onClick={function () { return setShowReset(true); }}
                className="luxury-btn-outline border-red-300 text-red-700 hover:bg-red-100 px-6 py-2"
              >
                Reset Semua Postingan
              </button>
            </div>
          </div>
        </motion.div>

        {/* ---- Reset Confirm Modal ---- */}
        {showReset && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-playfair mb-4">
                Hapus Semua Postingan Instagram?
              </h3>
              <p className="text-luxury-black/70 mb-6">
                Akan dihapus permanen sebanyak {postCount} postingan. Tindakan ini tidak bisa dibatalkan. Yakin?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={function () { return setShowReset(false); }}
                  className="flex-1 px-4 py-2 border border-luxury-black/20 rounded hover:bg-luxury-black/5 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleResetAll}
                  disabled={isResetting}
                  className="flex-1 luxury-btn bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2"
                >
                  {isResetting ? 'Menghapus...' : 'Ya, Hapus Semua'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InstagramFeedUpload;
