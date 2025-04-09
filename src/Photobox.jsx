import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";

const Photobox = () => {
  const webcamRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(3);
  const [showFlash, setShowFlash] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const isTakingPhoto = useRef(false);

  const [startColor, setStartColor] = useState("#cbd5e1");
  const [endColor, setEndColor] = useState("#94a3b8");
  const [galleryBg, setGalleryBg] = useState("linear-gradient(135deg, #e0f7fa, #e1f5fe)");

  const [headerStartColor, setHeaderStartColor] = useState("#89f7fe");
  const [headerEndColor, setHeaderEndColor] = useState("#66a6ff");

  useEffect(() => {
    setGalleryBg(`linear-gradient(135deg, ${startColor}, ${endColor})`);
  }, [startColor, endColor]);

  const bgGradients = [
    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 100%)",
  ];
  const themes = [
    {
      name: "Pinky Cream",
      className: "bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 text-gray-800",
    },
    {
      name: "Soft Blue Mist",
      className: "bg-gradient-to-br from-blue-100 via-cyan-100 to-indigo-100 text-gray-800",
    },
    {
      name: "Fresh Green Tea",
      className: "bg-gradient-to-br from-green-100 via-teal-100 to-lime-100 text-gray-800",
    },
    {
      name: "Cloudy Sky",
      className: "bg-gradient-to-br from-sky-100 via-slate-100 to-indigo-100 text-gray-800",
    },
    {
      name: "Peach & Cream",
      className: "bg-gradient-to-br from-orange-100 via-pink-100 to-yellow-100 text-gray-800",
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

  return (
    <div className={`min-h-screen p-8 transition-all duration-500 ${selectedTheme}`}>
      <div className="max-w-6xl mx-auto">
        {/* HEADER SECTION */}
        <div
          className="mb-8 p-6 rounded-xl shadow-lg text-center"
          style={{
            background: `linear-gradient(135deg, ${headerStartColor}, ${headerEndColor})`,
          }}
        >
          <h1 className="text-4xl font-bold text-white drop-shadow-md font-poppins">
            Driyo Photobooth
          </h1>
          <p className="mt-2 text-lg font-medium text-gray-200 drop-shadow-md">
            Dibuat pake React JS sama Tailwind
          </p>
        </div>

        {/* KONTEN UTAMA */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel Kamera */}
          <div className="w-full lg:w-1/2 bg-slate-300 text-black p-6 rounded-xl shadow-lg">
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl font-bold text-white drop-shadow-lg">{countdown}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4 mt-6">
              {!isRunning && photos.length < 5 && (
                <button
                  onClick={startPhotobox}
                  className="px-8 py-3 rounded-lg text-white font-bold bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition-all shadow-md"
                >
                  START
                </button>
              )}
              <div className="flex flex-col">
                <label className="font-semibold mr-2">Theme Background:</label>
                <select
                  className="p-2 rounded-lg bg-white text-gray-700 shadow"
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                >
                  {themes.map((theme, idx) => (
                    <option key={idx} value={theme.className}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>

              {isRunning && (
                <button
                  onClick={resetPhotos}
                  className="px-8 py-3 rounded-lg text-white font-bold bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 transition-all shadow-md"
                >
                  STOP & RESET
                </button>
              )}

              {!isRunning && photos.length >= 5 && (
                <button
                  onClick={resetPhotos}
                  className="px-8 py-3 rounded-lg text-white font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md"
                >
                  RESET FOTO
                </button>
              )}
            </div>

            {/* Pilihan Gradasi */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Pilih Gradien Cepat:</h3>
              <div className="flex flex-wrap gap-2">
                {bgGradients.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const colors = gradient.match(/#([a-f0-9]{6})/gi);
                      if (colors && colors.length === 2) {
                        setStartColor(colors[0]);
                        setEndColor(colors[1]);
                      }
                    }}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden"
                    title={`Gradient ${index + 1}`}
                  >
                    <div className="w-full h-full" style={{ background: gradient }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Gradient Picker */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Custom Background Gradient</h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  Start
                  <input
                    type="color"
                    value={startColor}
                    onChange={(e) => setStartColor(e.target.value)}
                    className="w-10 h-10 p-0 border-none cursor-pointer "
                  />
                </label>
                <label className="flex items-center gap-2">
                  End
                  <input
                    type="color"
                    value={endColor}
                    onChange={(e) => setEndColor(e.target.value)}
                    className="w-10 h-10 p-0 border-none cursor-pointer "
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Panel Galeri Foto */}
          <div
            className="w-full lg:w-1/2 p-6 rounded-xl shadow-lg min-h-[500px] transition-all"
            style={{ background: galleryBg }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">
              Foto Kamu ({photos.length}/5)
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative p-1 rounded-xl bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 shadow-lg"
                >
                  <div className="bg-white p-2 rounded-lg">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-auto object-cover rounded-md animate-bounce-in"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photobox;
