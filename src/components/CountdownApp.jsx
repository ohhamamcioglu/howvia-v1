import { useState, useEffect, useRef } from "react";

function CountdownApp() {
  const [hedefZamanStr, setHedefZamanStr] = useState("");
  const [kalanSüre, setKalanSüre] = useState(null);
  const [aktif, setAktif] = useState(false);
  const intervalRef = useRef(null);

  // ⏱ Başlat
  const geriSayimiBaslat = (manuel = false) => {
    const hedef = new Date(hedefZamanStr);
    const fark = Math.floor((hedef - new Date()) / 1000);
    if (fark <= 0) return;

    setKalanSüre(fark);
    setAktif(true);

    if (manuel) {
      localStorage.setItem("hedefZaman", hedefZamanStr);
    }

    intervalRef.current = setInterval(() => {
      setKalanSüre((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setAktif(false);
          setHedefZamanStr("");
          setKalanSüre(null);
          localStorage.removeItem("hedefZaman");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 🔁 Manuel sıfırla
  const geriSayimiSifirla = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setAktif(false);
    setKalanSüre(null);
    setHedefZamanStr("");
    localStorage.removeItem("hedefZaman");
  };

  // 🔃 Sayfa yüklendiğinde kaldığı yerden devam
  useEffect(() => {
    const kayitli = localStorage.getItem("hedefZaman");
    if (kayitli) {
      setHedefZamanStr(kayitli);
      const hedef = new Date(kayitli);
      const fark = Math.floor((hedef - new Date()) / 1000);
      if (fark > 0) {
        setKalanSüre(fark);
        setAktif(true);

        intervalRef.current = setInterval(() => {
          setKalanSüre((prev) => {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              setAktif(false);
              setHedefZamanStr("");
              setKalanSüre(null);
              localStorage.removeItem("hedefZaman");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  }, []);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // ⏳ Format fonksiyonu
  const formatla = (saniye) => {
    const saat = String(Math.floor(saniye / 3600)).padStart(2, "0");
    const dakika = String(Math.floor((saniye % 3600) / 60)).padStart(2, "0");
    const sn = String(saniye % 60).padStart(2, "0");
    return `${saat}:${dakika}:${sn}`;
  };

  return (
    <div className="fixed bottom-4 right-4 left-4  sm:left-20 sm:top-60 z-50 bg-tranparent backdrop-blur-md shadow-xl rounded-xl p-4 w-auto sm:w-72 sm:h-35 flex flex-col items-center gap-3 transition-all">
      <h2 className="text-base sm:text-lg font-semibold text-gray-700 text-center">
        🕒 Geri Sayım
      </h2>

      {!aktif && (
        <input
          type="datetime-local"
          className="p-2 border rounded-md w-full text-sm"
          value={hedefZamanStr}
          onChange={(e) => setHedefZamanStr(e.target.value)}
        />
      )}

      <div className="flex gap-2 flex-wrap justify-center">
        {!aktif && (
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm"
            onClick={() => geriSayimiBaslat(true)}
            disabled={!hedefZamanStr}
          >
            Başlat
          </button>
        )}
        <button
          className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600 text-sm"
          onClick={geriSayimiSifirla}
        >
          Sıfırla
        </button>
      </div>

      {kalanSüre !== null && (
        <div className="text-base sm:text-lg font-mono text-gray-800 text-center">
          {kalanSüre > 0 ? `⏳ ${formatla(kalanSüre)} kaldı` : "✅ Süre doldu!"}
        </div>
      )}
    </div>
  );
}

export default CountdownApp;
