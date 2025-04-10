import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";

const Photobox = () => {
  const webcamRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(3);
  const [showFlash, setShowFlash] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const isTakingPhoto = useRef(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  const [startColor, setStartColor] = useState("#1e293b");
  const [endColor, setEndColor] = useState("#0f172a");
  const [galleryBg, setGalleryBg] = useState("linear-gradient(135deg, #1e293b, #0f172a)");

  const [headerStartColor, setHeaderStartColor] = useState("#4b5563");
  const [headerEndColor, setHeaderEndColor] = useState("#1f2937");

  useEffect(() => {
    setGalleryBg(`linear-gradient(135deg, ${startColor}, ${endColor})`);
  }, [startColor, endColor]);

  const bgGradients = [
    "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
    "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
    "linear-gradient(135deg, #6b21a8 0%, #7e22ce 100%)",
    "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
    "linear-gradient(135deg, #701a75 0%, #86198f 100%)",
  ];

  const themes = [
    {
      name: "Midnight Blue",
      className: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-200",
    },
    {
      name: "Deep Purple",
      className: "bg-gradient-to-br from-purple-900 via-violet-900 to-purple-900 text-gray-200",
    },
    {
      name: "Dark Emerald",
      className: "bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 text-gray-200",
    },
    {
      name: "Charcoal Smoke",
      className: "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-gray-200",
    },
    {
      name: "Blood Crimson",
      className: "bg-gradient-to-br from-rose-900 via-red-900 to-rose-900 text-gray-200",
    },
  ];

  const [selectedTheme, setSelectedTheme] = useState(themes[0].className);

  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    if (isTakingPhoto.current || photos.length >= 5) return;

    isTakingPhoto.current = true;
    const imageSrc = webcamRef.current.getScreenshot();
    setPhotos((prev) => [...prev, imageSrc]);
    setShowFlash(true);

    setTimeout(() => {
      setShowFlash(false);
      isTakingPhoto.current = false;
    }, 300);
  }, [photos.length]);

  useEffect(() => {
    let timer;
    if (isRunning && photos.length < 5) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            capture();
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    }

    if (photos.length >= 5 && isRunning) {
      setIsRunning(false);
    }

    return () => clearInterval(timer);
  }, [isRunning, capture, photos.length]);

  const startPhotobox = () => {
    setIsRunning(true);
    setCountdown(3);
  };

  const resetPhotos = () => {
    setIsRunning(false);
    setPhotos([]);
    setCountdown(3);
  };

  const handleThemeChange = (e) => {
    setIsThemeChanging(true);
    setSelectedTheme(e.target.value);
    setTimeout(() => setIsThemeChanging(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen p-8 transition-all duration-500 ${selectedTheme}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8 p-6 rounded-xl shadow-lg text-center border border-gray-700"
          style={{
            background: `linear-gradient(135deg, ${headerStartColor}, ${headerEndColor})`,
          }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.h1
            className="text-4xl font-bold text-white drop-shadow-md font-poppins"
            animate={{
              textShadow: "0 0 8px rgba(255,255,255,0.5)",
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2,
            }}
          >
            Driyo Photobooth
          </motion.h1>
          <motion.p
            className="mt-2 text-lg font-medium text-gray-300 drop-shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            Dibuat pake React JS sama Tailwind
          </motion.p>
        </motion.div>

        {/* KONTEN UTAMA */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel Kamera */}
          <motion.div
            className="w-full lg:w-1/2 bg-gray-800 text-gray-200 p-6 rounded-xl shadow-lg border border-gray-700"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className={`w-full h-auto rounded-lg ${
                  showFlash ? "opacity-0" : "opacity-100"
                } transition-opacity duration-300`}
              />
              {isRunning && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <motion.span
                    className="text-9xl font-bold text-white drop-shadow-lg"
                    key={countdown}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    {countdown}
                  </motion.span>
                </motion.div>
              )}
            </div>

            <div className="flex justify-center gap-4 mt-6">
              {!isRunning && photos.length < 5 && (
                <motion.button
                  onClick={startPhotobox}
                  className="px-8 py-3 rounded-lg text-white font-bold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all shadow-md"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(72, 187, 120, 0.7)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  START
                </motion.button>
              )}
              <div className="flex flex-col">
                <label className="font-semibold mr-2 text-gray-300">Theme Background:</label>
                <motion.select
                  className="p-2 rounded-lg bg-gray-700 text-gray-200 shadow border border-gray-600"
                  value={selectedTheme}
                  onChange={handleThemeChange}
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  {themes.map((theme, idx) => (
                    <option key={idx} value={theme.className}>
                      {theme.name}
                    </option>
                  ))}
                </motion.select>
              </div>

              {isRunning && (
                <motion.button
                  onClick={resetPhotos}
                  className="px-8 py-3 rounded-lg text-white font-bold bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-all shadow-md"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(239, 68, 68, 0.7)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  STOP & RESET
                </motion.button>
              )}

              {!isRunning && photos.length >= 5 && (
                <motion.button
                  onClick={resetPhotos}
                  className="px-8 py-3 rounded-lg text-white font-bold bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 transition-all shadow-md"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(234, 179, 8, 0.7)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  RESET FOTO
                </motion.button>
              )}
            </div>

            {/* Pilihan Gradasi */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2 text-gray-300">Pilih Gradien Cepat:</h3>
              <div className="flex flex-wrap gap-2">
                {bgGradients.map((gradient, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      const colors = gradient.match(/#([a-f0-9]{6})/gi);
                      if (colors && colors.length === 2) {
                        setStartColor(colors[0]);
                        setEndColor(colors[1]);
                      }
                    }}
                    className="w-10 h-10 rounded-full border-2 border-gray-600 overflow-hidden"
                    title={`Gradient ${index + 1}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="w-full h-full" style={{ background: gradient }} />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom Gradient Picker */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2 text-gray-300">Custom Background Gradient</h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-gray-300">
                  Start
                  <motion.input
                    type="color"
                    value={startColor}
                    onChange={(e) => setStartColor(e.target.value)}
                    className="w-10 h-10 p-0 border-none cursor-pointer bg-gray-700 rounded"
                    whileHover={{ scale: 1.1 }}
                  />
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  End
                  <motion.input
                    type="color"
                    value={endColor}
                    onChange={(e) => setEndColor(e.target.value)}
                    className="w-10 h-10 p-0 border-none cursor-pointer bg-gray-700 rounded"
                    whileHover={{ scale: 1.1 }}
                  />
                </label>
              </div>
            </div>
          </motion.div>

          {/* Panel Galeri Foto */}
          <motion.div
            className="w-full lg:w-1/2 p-6 rounded-xl shadow-lg min-h-[500px] transition-all border border-gray-700"
            style={{ background: galleryBg }}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h2
              className="text-2xl font-semibold mb-4 text-white drop-shadow-md"
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 5px rgba(255,255,255,0.3)",
                  "0 0 15px rgba(255,255,255,0.5)",
                  "0 0 5px rgba(255,255,255,0.3)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              Foto Kamu ({photos.length}/5)
            </motion.h2>
            <div className="grid grid-cols-2 gap-4">
              <AnimatePresence>
                {photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    className="relative p-1 rounded-xl bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 shadow-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="bg-gray-800 p-2 rounded-lg">
                      <motion.img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-auto object-cover rounded-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Flash animation */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            className="fixed inset-0 bg-white z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Theme change animation */}
      <AnimatePresence>
        {isThemeChanging && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Photobox;
