import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";

// Komponen Animasi Background Modern (Floating Color Blobs)
const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-slate-50">
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-200/40 mix-blend-multiply filter blur-[80px]"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-200/40 mix-blend-multiply filter blur-[80px]"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-emerald-200/40 mix-blend-multiply filter blur-[80px]"
        animate={{
          x: [0, 50, 0],
          y: [0, -100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

const templateThemes = [
  {
    id: 'default',
    name: 'Pita Putih',
    bgColor: '#ffffff',
    textClass: 'text-[#1a1a1a]',
    photoWrapperClass: 'bg-white rounded-sm',
    dividerClass: 'bg-[#1a1a1a] opacity-60 h-[2px]',
    containerClass: '',
  },
  {
    id: 'dark',
    name: 'Dark Elegance',
    bgColor: '#111827',
    textClass: 'text-white font-serif tracking-widest',
    photoWrapperClass: 'bg-[#1f2937] rounded-md border border-slate-700 p-2 shadow-lg',
    dividerClass: 'bg-white opacity-40 h-[1px]',
    containerClass: '',
  },
  {
    id: 'vintage',
    name: 'Vintage Film',
    bgColor: '#f0e6d2',
    textClass: 'text-[#4a3f35] font-mono font-bold tracking-tight',
    photoWrapperClass: 'bg-transparent border-x-4 border-y-[10px] border-[#4a3f35] p-0 shadow-inner',
    dividerClass: 'bg-[#4a3f35] opacity-80 h-[4px]',
    containerClass: 'border-8 border-double border-[#4a3f35]',
  },
  {
    id: 'slate',
    name: 'Slate Minimal',
    bgColor: '#f1f5f9',
    textClass: 'text-slate-800 font-sans tracking-widest font-light',
    photoWrapperClass: 'bg-white rounded-xl shadow-md p-1 border border-slate-200',
    dividerClass: 'bg-slate-300 h-[2px]',
    containerClass: '',
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    bgColor: '#e5e5e5',
    textClass: 'text-black font-black uppercase tracking-tighter',
    photoWrapperClass: 'bg-black p-1 shadow-2xl',
    dividerClass: 'bg-black h-[6px]',
    containerClass: 'border-x-[12px] border-b-[20px] border-t-[12px] border-black',
  },
  {
    id: 'warm',
    name: 'Warm Aesthetic',
    bgColor: '#e8ded1',
    textClass: 'text-[#5c544d] font-serif italic tracking-wider',
    photoWrapperClass: 'bg-white/60 backdrop-blur-sm rounded-3xl p-2 border border-white/40 shadow-sm',
    dividerClass: 'bg-[#5c544d] opacity-30 h-[1px]',
    containerClass: '',
  }
];

const Photobox = () => {
  const webcamRef = useRef(null);
  const stripRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(3);
  const [showFlash, setShowFlash] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [maxPhotos, setMaxPhotos] = useState(3);
  const [stripColor, setStripColor] = useState("#ffffff");
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [titleTop, setTitleTop] = useState("Agung");
  const [titleBottom, setTitleBottom] = useState("Photobooth");
  const [dateText, setDateText] = useState(
    new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  );
  const isTakingPhoto = useRef(false);

  const currentTemplate = templateThemes.find(t => t.id === selectedTemplate) || templateThemes[0];

  // Constraints kamera (tanpa resolusi hardcode agar responsif di HP, tidak gepeng)
  const videoConstraints = {
    facingMode: "user",
  };

  const capture = useCallback(() => {
    if (isTakingPhoto.current || photos.length >= maxPhotos) return;

    isTakingPhoto.current = true;
    const imageSrc = webcamRef.current.getScreenshot();
    setPhotos((prev) => [...prev, imageSrc]);
    setShowFlash(true);

    setTimeout(() => {
      setShowFlash(false);
      isTakingPhoto.current = false;
    }, 200);
  }, [photos.length, maxPhotos]);

  useEffect(() => {
    let timer;
    if (isRunning && photos.length < maxPhotos) {
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

    if (photos.length >= maxPhotos && isRunning) {
      setIsRunning(false);
    }

    return () => clearInterval(timer);
  }, [isRunning, capture, photos.length, maxPhotos]);

  const startPhotobox = () => {
    setIsRunning(true);
    setCountdown(3);
    setPhotos([]);
  };

  const resetPhotos = () => {
    setIsRunning(false);
    setPhotos([]);
    setCountdown(3);
  };

  const downloadStrip = async () => {
    if (!stripRef.current || photos.length === 0) return;
    
    setIsDownloading(true);
    try {
      const element = stripRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 3, 
        useCORS: true,
        backgroundColor: stripColor,
        logging: false,
        // Hapus window height parameters untuk menghindari space kosong.
        // Biarkan html2canvas merender exactly selebar dan setinggi elemennya.
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      
      const link = document.createElement("a");
      link.href = image;
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `photobooth-${dateStr}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Gagal mendownload foto:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen relative font-sans overflow-x-hidden pb-10">
      <BackgroundAnimation />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 p-4 md:p-8 min-h-screen text-slate-800"
      >
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-6 rounded-2xl bg-white/90 backdrop-blur-lg shadow-sm border border-slate-200/60 text-center"
          >
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Photobox Study Case
            </h1>
            <p className="mt-2 text-slate-500">
              Buat kenang-kenanganmu secara instan
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            <motion.div
              className="w-full lg:w-[60%] bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {!isRunning && photos.length === 0 && (
                <div className="w-full mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <label className="font-semibold text-slate-700">Jumlah Cetakan:</label>
                    <div className="flex bg-white rounded-lg border border-slate-300 overflow-hidden shadow-sm">
                      <button 
                        onClick={() => maxPhotos > 1 && setMaxPhotos(maxPhotos - 1)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        min="1" 
                        max="8" 
                        value={maxPhotos} 
                        readOnly
                        className="w-12 text-center text-slate-800 font-semibold focus:outline-none" 
                      />
                      <button 
                        onClick={() => maxPhotos < 8 && setMaxPhotos(maxPhotos + 1)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="font-semibold text-slate-700">Warna Kertas:</label>
                    <input 
                      type="color" 
                      value={stripColor}
                      onChange={(e) => setStripColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                    />
                  </div>
                </div>
              )}

              <div className={`w-full relative rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center border border-slate-300 shadow-inner ${photos.length < maxPhotos ? "aspect-[4/3]" : "py-8"}`}>
                {photos.length < maxPhotos ? (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className={`w-full h-full object-cover left-0 top-0 absolute ${
                        showFlash ? "opacity-0" : "opacity-100"
                      } transition-opacity duration-200 filter contrast-[1.05] brightness-105`}
                      mirrored={true} 
                    />
                    {isRunning && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.span
                          className="text-[12rem] font-black text-white drop-shadow-2xl"
                          style={{ textShadow: "0px 8px 30px rgba(0,0,0,0.8)" }}
                          key={countdown}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 1.2, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          {countdown}
                        </motion.span>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center w-full px-4 gap-4 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-3 text-emerald-600">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xl font-bold">Sesi Foto Selesai</span>
                    </div>

                    <div className="w-full max-w-sm bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 text-left">
                      <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Kustomisasi Hasil</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Template</label>
                          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {templateThemes.map((t) => (
                              <button
                                key={t.id}
                                onClick={() => {
                                  setSelectedTemplate(t.id);
                                  setStripColor(t.bgColor);
                                }}
                                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                                  selectedTemplate === t.id 
                                  ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/30" 
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                {t.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Baris Pertama</label>
                          <input 
                            type="text" 
                            value={titleTop} 
                            onChange={(e) => setTitleTop(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-slate-700 font-medium text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Baris Kedua</label>
                          <input 
                            type="text" 
                            value={titleBottom} 
                            onChange={(e) => setTitleBottom(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-slate-700 font-medium text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tanggal / Catatan</label>
                          <input 
                            type="text" 
                            value={dateText} 
                            onChange={(e) => setDateText(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-slate-700 font-medium text-sm"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Warna Kertas</label>
                          <input 
                            type="color" 
                            value={stripColor}
                            onChange={(e) => setStripColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 w-full flex flex-wrap justify-center gap-4">
                {!isRunning && photos.length === 0 && (
                  <button
                    onClick={startPhotobox}
                    className="px-10 py-4 rounded-full text-white text-lg font-bold bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all shadow-md shadow-emerald-500/40"
                  >
                    🚀 MULAI FOTO
                  </button>
                )}

                {isRunning && (
                  <button
                    onClick={resetPhotos}
                    className="px-8 py-3 rounded-full text-white font-medium bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all shadow-sm shadow-rose-500/30"
                  >
                    HENTIKAN SESI
                  </button>
                )}

                {!isRunning && photos.length > 0 && (
                  <button
                    onClick={resetPhotos}
                    className="px-8 py-3 rounded-full text-slate-700 font-medium bg-white hover:bg-slate-50 active:scale-95 transition-all border-2 border-slate-300 shadow-sm"
                  >
                    🔁 ULANG FOTO 
                  </button>
                )}
              </div>
              
              <div className="mt-6 text-sm text-slate-400 font-medium bg-slate-100 px-4 py-2 rounded-full">
                Progress: {photos.length} / {maxPhotos} Foto Diambil
              </div>
            </motion.div>

            <motion.div
              className="w-full lg:w-[40%] bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col items-center"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex w-full justify-between items-center mb-6 border-b border-slate-200 pb-4">
                <h2 className="text-xl font-bold text-slate-800">
                  Hasil Photobox
                </h2>
                {photos.length > 0 && photos.length === maxPhotos && (
                  <button 
                    onClick={downloadStrip}
                    disabled={isDownloading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
                      isDownloading 
                      ? "bg-slate-400 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 active:scale-95"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {isDownloading ? "Menyimpan..." : "Download Strip"}
                  </button>
                )}
              </div>
              
              <div className="flex-1 w-full bg-slate-100 rounded-xl p-4 flex justify-center items-start overflow-y-auto max-h-[70vh] custom-scrollbar border-inner shadow-inner">
                {photos.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400 opacity-60">
                    <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="font-medium text-center">Tunggu sampai 100%<br/>baru hasil cetak muncul di sini</p>
                  </div>
                ) : (
                  <div 
                    ref={stripRef}
                    className={`w-full max-w-[260px] p-3 pb-6 flex flex-col items-center gap-3 shadow-2xl transform-gpu relative overflow-hidden ${currentTemplate.containerClass}`}
                    style={{ backgroundColor: stripColor }}
                  >
                    <AnimatePresence>
                      {photos.map((photo, index) => (
                        <motion.div
                          key={`strip-${index}`}
                          className={`relative z-10 w-full aspect-[4/3] flex items-center justify-center overflow-hidden ${currentTemplate.photoWrapperClass}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        >
                          <div
                            className="w-full h-full filter contrast-[1.05] rounded-[inherit]"
                            style={{
                              backgroundImage: `url(${photo})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <motion.div 
                      className={`mt-4 flex flex-col items-center justify-center text-center w-full px-2 z-10 ${currentTemplate.textClass}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-[1.15rem] leading-none font-bold tracking-[0.15em] uppercase break-all w-full" style={{ fontFamily: currentTemplate.id === 'default' ? 'monospace' : 'inherit' }}>
                        {titleTop || ' '}
                      </h3>
                      <h3 className="text-[1.15rem] leading-none font-bold tracking-[0.15em] uppercase mt-1 break-all w-full" style={{ fontFamily: currentTemplate.id === 'default' ? 'monospace' : 'inherit' }}>
                        {titleBottom || ' '}
                      </h3>
                      <div className={`w-10 mt-3 mb-2 ${currentTemplate.dividerClass}`}></div>
                      <p className="text-[0.65rem] font-semibold tracking-widest opacity-80 uppercase break-all w-full">
                        {dateText || ' '}
                      </p>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {showFlash && (
            <motion.div
              className="fixed inset-0 bg-white z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Photobox;
