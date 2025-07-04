import { useState, useEffect, useRef } from "react";
import { MdChecklist } from "react-icons/md";
import { FaCheck, FaTrash } from "react-icons/fa";
import CountdownApp from "./CountdownApp";

function TodoApp() {
  const [görev, setGörev] = useState("");
  const [görevler, setGörevler] = useState([]);
  const [filtreTarihi, setFiltreTarihi] = useState(() => new Date().toISOString().split("T")[0]);
  const initialLoad = useRef(true);

  function getBugununTarihi() {
    return new Date().toISOString().split("T")[0];
  }

  function görevEkle() {
    if (görev.trim() === "") return;
    const yeniGörev = {
      metin: görev,
      tamamlandi: false,
      tarih: getBugununTarihi(),
    };
    setGörevler([...görevler, yeniGörev]);
    setGörev("");
  }

  function görevSil(index) {
    const yeniGörevler = görevler.filter((_, i) => i !== index);
    setGörevler(yeniGörevler);
  }

  function göreviTamamla(index) {
    const yeniListe = görevler.map((g, i) =>
      i === index ? { ...g, tamamlandi: true } : g
    );
    setGörevler(yeniListe);
  }

  useEffect(() => {
    const kayitliGörevler = localStorage.getItem("görevler");
    if (kayitliGörevler) {
      setGörevler(JSON.parse(kayitliGörevler));
    }
  }, []);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    localStorage.setItem("görevler", JSON.stringify(görevler));
  }, [görevler]);

  const filtrelenmisGörevler = filtreTarihi
    ? görevler.filter((g) => g.tarih === filtreTarihi)
    : görevler;

  return (
    <div
      className="min-h-screen bg-gray-200"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="backdrop-blur-sm bg-white/70 min-h-screen px-4 py-8 relative">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-2">
          <MdChecklist className="text-green-600" />
          HoWVia Todo App
        </h1>

        <CountdownApp />

        <div className="flex flex-col md:flex-row justify-center gap-6">
          {/* GÖREV EKLEME */}
          <div className="flex flex-col w-full md:w-1/4 gap-4">
            <input
              className="w-full p-3 border rounded-lg"
              value={görev}
              onChange={(e) => setGörev(e.target.value)}
              placeholder="Görev girin..."
              onKeyDown={(e) => e.key === "Enter" && görevEkle()}
            />
            <button
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
              onClick={görevEkle}
            >
              Görev Ekle
            </button>
          </div>

          {/* GÖREV LİSTESİ */}
          <div className="w-full md:w-2/3">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-xl font-semibold">Görev Listesi</h2>
              <input
                type="date"
                className="p-2 rounded border"
                value={filtreTarihi}
                onChange={(e) => setFiltreTarihi(e.target.value)}
              />
            </div>

            <ul className="space-y-3">
              {filtrelenmisGörevler.length === 0 && (
                <li className="text-gray-500 px-2">Görev bulunamadı.</li>
              )}

              {filtrelenmisGörevler.map((g, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
                >
                  <div>
                    <p
                      className={`text-lg font-medium ${
                        g.tamamlandi ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {g.metin}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">📅 {g.tarih}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {!g.tamamlandi && (
                      <button
                        onClick={() => göreviTamamla(index)}
                        className="text-green-600 hover:text-green-800"
                        title="Tamamla"
                      >
                        <FaCheck size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => görevSil(index)}
                      className="text-red-500 hover:text-red-700"
                      title="Sil"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
