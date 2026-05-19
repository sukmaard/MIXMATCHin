import { useState, useEffect } from 'react';
import { FaInstagram, FaExternalLinkAlt, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getHydratedPosts, getPosts } from '../utils/instagramStorage';

var PRESET_CAPTIONS = [
  'New Arrival', 'Look of the Day', 'Style Inspiration',
  'OOTD', 'Weekend Vibes', 'Luxury Look', 'Casual Chic',
  'Bold & Beautiful', 'Mix & Match Magic', 'Street Style'
];

var InstagramGrid = function () {
  var _a = useState([]), posts = _a[0], setPosts = _a[1];
  var [hasPosts, setHasPosts] = useState(true);

  useEffect(function () {
    var load = async function () {
      var raw = await getPosts();
      if (raw.length === 0) {
        setHasPosts(false);
        // show hardcoded placeholder images when empty, using CSS grid placeholders
        var blobs = await Promise.all(PRESET_CAPTIONS.slice(0, 6).map(function () {
          return new Promise(function (resolve) { resolve('/assets/hero-bg.png'); });
        }));
        setPosts(blobs.map(function (src) {
          return {
            image: src,
            caption: '',
            hashtag: '',
            link: '',
            _placeholder: true
          };
        }));
        return;
      }
      var hydrated = await getHydratedPosts();
      setPosts(hydrated.filter(Boolean));
      setHasPosts(true);
    };
    load();
    window.addEventListener('storage', load);
    window.addEventListener('instagram-posts-changed', load);
    return function () {
      window.removeEventListener('storage', load);
      window.removeEventListener('instagram-posts-changed', load);
    };
  }, []);

  return (
    <section className="py-12 bg-luxury-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl font-playfair text-center mb-10 text-luxury-black"
        >
          <FaInstagram className="inline mr-2 text-pink-500" />
          Instagram Feed
        </motion.h2>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {posts.filter(Boolean).map(function (post, index) {
            var delay = Math.min(index, 5) * 0.05;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay, duration: 0.5 }}
                className="relative overflow-hidden luxury-card group cursor-pointer"
              >
                <img
                  src={post.image || '/assets/hero-bg.png'}
                  alt={(post.caption || 'Instagram post') + ' ' + (index + 1)}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-luxury-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                  <p className="text-luxury-white font-playfair text-sm text-center line-clamp-2">
                    {post.caption || 'Outfit Inspiration'}
                  </p>
                  {post.hashtag && (
                    <p className="text-luxury-white/80 text-xs mt-1">
                      {post.hashtag}
                    </p>
                  )}
                </div>
                {/* Instagram heart icon watermark */}
                <div className="absolute bottom-3 right-3 text-luxury-white/50 group-hover:text-luxury-white transition-colors">
                  <FaHeart size={16} />
                </div>
                {post.link && (
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 text-luxury-white/60 hover:text-luxury-white transition-colors z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaExternalLinkAlt size={14} />
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>

        {!hasPosts && (
          <p className="text-center text-luxury-black/40 mt-6">
            Upload Instagram feed posts via the Admin Upload page.
          </p>
        )}

        <div className="mt-8 text-center">
          <a href="https://www.instagram.com/mixmatchin?igsh=dXMxZG1wMnl4bXI1" target="_blank" rel="noopener noreferrer" className="luxury-btn-outline inline-flex items-center">
            <FaInstagram className="mr-2" />
            Follow us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramGrid;
