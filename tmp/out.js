import { useState, useEffect } from "react";
import { FaInstagram, FaExternalLinkAlt, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { getHydratedPosts, getPosts } from "../utils/instagramStorage";
var PRESET_CAPTIONS = [
  "New Arrival",
  "Look of the Day",
  "Style Inspiration",
  "OOTD",
  "Weekend Vibes",
  "Luxury Look",
  "Casual Chic",
  "Bold & Beautiful",
  "Mix & Match Magic",
  "Street Style"
];
var InstagramGrid = function() {
  var _a = useState([]), posts = _a[0], setPosts = _a[1];
  var [hasPosts, setHasPosts] = useState(true);
  useEffect(function() {
    var load = async function() {
      var raw = getPosts();
      if (raw.length === 0) {
        setHasPosts(false);
        var blobs = await Promise.all(PRESET_CAPTIONS.slice(0, 6).map(function() {
          return new Promise(function(resolve) {
            resolve("/assets/hero-bg.png");
          });
        }));
        setPosts(blobs.map(function(src) {
          return {
            image: src,
            caption: "",
            hashtag: "",
            link: "",
            _placeholder: true
          };
        }));
        return;
      }
      var hydrated = await getHydratedPosts();
      setPosts(hydrated);
      setHasPosts(true);
    };
    load();
    window.addEventListener("storage", load);
    return function() {
      window.removeEventListener("storage", load);
    };
  }, []);
  return /* @__PURE__ */ React.createElement(
    "section",
    { className: "py-12 bg-luxury-white" },
    React.createElement(
      "div",
      { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
      React.createElement(
        motion.h2,
        {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.2, duration: 0.8 },
          className: "text-3xl font-playfair text-center mb-10 text-luxury-black"
        },
        React.createElement(FaInstagram, { className: "inline mr-2 text-pink-500" }),
        " Instagram Feed"
      ),
      React.createElement(
        "div",
        { className: "grid gap-4 sm:grid-cols-3 lg:grid-cols-4" },
        posts.map(function(post, index) {
          var delay = Math.min(index, 5) * 0.05;
          return /* @__PURE__ */ React.createElement(
            motion.div,
            {
              key: index,
              initial: { opacity: 0, scale: 0.85 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay, duration: 0.5 },
              className: "relative overflow-hidden luxury-card group cursor-pointer"
            },
            React.createElement("img", {
              src: post.image,
              alt: (post.caption || "Instagram post") + " " + (index + 1),
              className: "w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            }),
            React.createElement(
              "div",
              { className: "absolute inset-0 flex flex-col items-center justify-center bg-luxury-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4" },
              React.createElement(
                "p",
                { className: "text-luxury-white font-playfair text-sm text-center line-clamp-2" },
                post.caption || "Outfit Inspiration"
              ),
              post.hashtag && /* @__PURE__ */ React.createElement(
                "p",
                { className: "text-luxury-white/80 text-xs mt-1" },
                post.hashtag
              )
            ),
            /* Instagram heart icon watermark */
            React.createElement(
              "div",
              {
                className: "absolute bottom-3 right-3 text-luxury-white/50 group-hover:text-luxury-white transition-colors"
              },
              React.createElement(FaHeart, { size: 16 })
            ),
            post.link && /* @__PURE__ */ React.createElement(
              "a",
              {
                href: post.link,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "absolute top-3 right-3 text-luxury-white/60 hover:text-luxury-white transition-colors z-10",
                onClick: function(e) {
                  e.stopPropagation();
                }
              },
              React.createElement(FaExternalLinkAlt, { size: 14 })
            )
          );
        })
      ),
      !hasPosts && /* @__PURE__ */ React.createElement(
        "p",
        { className: "text-center text-luxury-black/40 mt-6" },
        "Upload Instagram feed posts via the Admin Upload page."
      ),
      React.createElement(
        "div",
        { className: "mt-8 text-center" },
        React.createElement(
          "a",
          {
            href: "#",
            className: "luxury-btn-outline inline-flex items-center"
          },
          React.createElement(FaInstagram, { className: "mr-2" }),
          " Follow us on Instagram"
        )
      )
    )
  );
};
export default InstagramGrid;
//# sourceMappingURL=out.js.map
