import React, { useState, useEffect } from "react";
import {
  Home, Search, User, Bell, Plane, ArrowRight, Clock,
  Calendar, X, TrendingDown, CheckCircle2, Zap, Heart,
  MapPin, ChevronRight, Star,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "home" | "search" | "alerts" | "profile";

interface Flight {
  id: number;
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  flag: string;
  airline: string;
  airlineName: string;
  airlineCode: string;
  date: string;
  duration: string;
  stops: string;
  price: number;
  imageId: string;
  discount?: number;
}

interface PriceAlert {
  id: number;
  from: string;
  to: string;
  toCity: string;
  flag: string;
  airline: string;
  airlineCode: string;
  currentPrice: number;
  targetPrice: number;
  active: boolean;
}

// ─── Airline Config ──────────────────────────────────────────────────────────

const AIRLINE_CFG: Record<string, { color: string; bg: string; text: string }> = {
  THY: { color: "#C0392B", bg: "#FDF2F2", text: "#9B2335" },
  PC:  { color: "#E67E22", bg: "#FEF9F0", text: "#B35A0A" },
  XQ:  { color: "#7B5EA7", bg: "#F3F0F9", text: "#5E3D8F" },
  TK2: { color: "#2980B9", bg: "#EEF6FB", text: "#1A6FA8" },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const FLIGHTS: Flight[] = [
  {
    id: 1, from: "SAW", fromCity: "İstanbul", to: "AMS", toCity: "Amsterdam",
    flag: "🇳🇱", airline: "Pegasus", airlineName: "Pegasus", airlineCode: "PC",
    date: "15 Tem 2026", duration: "3sa 45dk", stops: "Direkt", price: 1240,
    imageId: "photo-1534351590666-13e3e96b5017", discount: 22,
  },
  {
    id: 2, from: "IST", fromCity: "İstanbul", to: "LHR", toCity: "Londra",
    flag: "🇬🇧", airline: "THY", airlineName: "Türk Hava Yolları", airlineCode: "THY",
    date: "18 Tem 2026", duration: "4sa 10dk", stops: "Direkt", price: 1890,
    imageId: "photo-1513635269975-59663e0ac1ad",
  },
  {
    id: 3, from: "ESB", fromCity: "Ankara", to: "BCN", toCity: "Barselona",
    flag: "🇪🇸", airline: "SunExpress", airlineName: "SunExpress", airlineCode: "XQ",
    date: "20 Tem 2026", duration: "4sa 20dk", stops: "Direkt", price: 980,
    imageId: "photo-1583422409516-2895a77efded", discount: 15,
  },
  {
    id: 4, from: "IST", fromCity: "İstanbul", to: "CDG", toCity: "Paris",
    flag: "🇫🇷", airline: "THY", airlineName: "Türk Hava Yolları", airlineCode: "THY",
    date: "22 Tem 2026", duration: "3sa 55dk", stops: "Direkt", price: 2150,
    imageId: "photo-1502602898657-3e91760cbb34",
  },
  {
    id: 5, from: "AYT", fromCity: "Antalya", to: "FCO", toCity: "Roma",
    flag: "🇮🇹", airline: "Pegasus", airlineName: "Pegasus", airlineCode: "PC",
    date: "25 Tem 2026", duration: "2sa 30dk", stops: "Direkt", price: 760,
    imageId: "photo-1552832230-c0197dd311b5", discount: 30,
  },
  {
    id: 6, from: "SAW", fromCity: "İstanbul", to: "BRU", toCity: "Brüksel",
    flag: "🇧🇪", airline: "AnadoluJet", airlineName: "AnadoluJet", airlineCode: "TK2",
    date: "28 Tem 2026", duration: "4sa 05dk", stops: "1 aktarma", price: 1560,
    imageId: "photo-1559570278-eb8d71d06403",
  },
  {
    id: 7, from: "ADB", fromCity: "İzmir", to: "FRA", toCity: "Frankfurt",
    flag: "🇩🇪", airline: "SunExpress", airlineName: "SunExpress", airlineCode: "XQ",
    date: "1 Ağu 2026", duration: "3sa 25dk", stops: "Direkt", price: 1120,
    imageId: "photo-1560969184-10fe8719e047",
  },
  {
    id: 8, from: "IST", fromCity: "İstanbul", to: "MAD", toCity: "Madrid",
    flag: "🇪🇸", airline: "THY", airlineName: "Türk Hava Yolları", airlineCode: "THY",
    date: "5 Ağu 2026", duration: "5sa 10dk", stops: "Direkt", price: 2340,
    imageId: "photo-1543783207-ec64e4d95325",
  },
];

const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: 1, from: "IST", to: "LHR", toCity: "Londra", flag: "🇬🇧",
    airline: "THY", airlineCode: "THY", currentPrice: 1890, targetPrice: 1500, active: true,
  },
  {
    id: 2, from: "SAW", to: "AMS", toCity: "Amsterdam", flag: "🇳🇱",
    airline: "Pegasus", airlineCode: "PC", currentPrice: 1240, targetPrice: 1100, active: true,
  },
  {
    id: 3, from: "IST", to: "CDG", toCity: "Paris", flag: "🇫🇷",
    airline: "THY", airlineCode: "THY", currentPrice: 2150, targetPrice: 2000, active: false,
  },
];

const POPULAR_DESTINATIONS = [
  { city: "Amsterdam", code: "AMS", flag: "🇳🇱", imageId: "photo-1534351590666-13e3e96b5017" },
  { city: "Londra", code: "LHR", flag: "🇬🇧", imageId: "photo-1513635269975-59663e0ac1ad" },
  { city: "Paris", code: "CDG", flag: "🇫🇷", imageId: "photo-1502602898657-3e91760cbb34" },
  { city: "Roma", code: "FCO", flag: "🇮🇹", imageId: "photo-1552832230-c0197dd311b5" },
];

// ─── Airline Badge ────────────────────────────────────────────────────────────

function AirlineBadge({ code, name }: { code: string; name: string }) {
  const cfg = AIRLINE_CFG[code] ?? { bg: "#F3F4F6", text: "#374151" };
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold leading-none"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {name}
    </span>
  );
}

// ─── Flight Card ──────────────────────────────────────────────────────────────

function FlightCard({ flight, onClick }: { flight: Flight; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border border-black/[0.06] overflow-hidden text-left hover:border-emerald-200 hover:shadow-md transition-all duration-200 group flex flex-col"
    >
      <div className="relative h-28 bg-gray-100 overflow-hidden flex-shrink-0">
        <img
          src={`https://images.unsplash.com/${flight.imageId}?w=300&h=200&fit=crop&auto=format`}
          alt={flight.toCity}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {flight.discount && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
            -%{flight.discount}
          </div>
        )}
        <div className="absolute top-2 right-2 text-base leading-none">{flight.flag}</div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{flight.toCity}</h3>
        <div className="mt-1.5">
          <AirlineBadge code={flight.airlineCode} name={flight.airline} />
        </div>

        <div className="flex items-center gap-1 mt-2">
          <span className="text-[11px] font-bold text-gray-700">{flight.from}</span>
          <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
          <span className="text-[11px] font-bold text-gray-700">{flight.to}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Clock className="w-2.5 h-2.5 text-gray-300" />
          <span className="text-[10px] text-gray-400">{flight.duration}</span>
          <span className="text-[10px] text-gray-200 mx-0.5">·</span>
          <span className="text-[10px] text-gray-400 truncate">{flight.stops}</span>
        </div>

        <div className="mt-auto pt-2.5 border-t border-gray-50 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">{flight.date}</span>
          <span className="text-base font-extrabold text-emerald-500 leading-none">
            ₺{flight.price.toLocaleString("tr-TR")}
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Flight Detail Modal ───────────────────────────────────────────────────────

function FlightModal({
  flight,
  onClose,
  onAlertAdded,
  alreadyAdded,
}: {
  flight: Flight;
  onClose: () => void;
  onAlertAdded: (f: Flight, target: number) => void;
  alreadyAdded: boolean;
}) {
  const [targetPrice, setTargetPrice] = useState(Math.round(flight.price * 0.85));
  const min = Math.round(flight.price * 0.5);
  const max = flight.price;

  const stats = [
    { icon: Calendar, label: "Tarih", value: flight.date },
    { icon: Clock, label: "Süre", value: flight.duration },
    { icon: Plane, label: "Havayolu", value: flight.airlineName },
    { icon: MapPin, label: "Aktarma", value: flight.stops },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[92vh] overflow-y-auto scrollbar-hide">
        {/* Hero Image */}
        <div className="relative h-56">
          <img
            src={`https://images.unsplash.com/${flight.imageId}?w=600&h=420&fit=crop&auto=format`}
            alt={flight.toCity}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{flight.flag}</span>
                  <AirlineBadge code={flight.airlineCode} name={flight.airline} />
                </div>
                <h3 className="text-white font-extrabold text-2xl leading-tight">{flight.toCity}</h3>
                <p className="text-white/60 text-sm mt-0.5">
                  {flight.fromCity} <span className="opacity-60">→</span> {flight.toCity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-xs mb-0.5">Kişi başı</p>
                <p className="text-emerald-400 font-extrabold text-2xl leading-none">
                  ₺{flight.price.toLocaleString("tr-TR")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    {label}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{value}</p>
              </div>
            ))}
          </div>

          {/* Price Alert Slider */}
          <div className="border border-emerald-100 bg-emerald-50/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <Bell className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Fiyat Alarmı Kur</p>
                <p className="text-[11px] text-gray-500">Hedef fiyata düşünce bildirim gönderelim</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Hedef fiyatım</span>
              <span className="text-sm font-extrabold text-emerald-600">
                ₺{targetPrice.toLocaleString("tr-TR")}
              </span>
            </div>

            <input
              type="range"
              min={min}
              max={max}
              step={50}
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              className="w-full accent-emerald-500 mb-1.5"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mb-3">
              <span>₺{min.toLocaleString("tr-TR")}</span>
              <span className="text-gray-300">——</span>
              <span>₺{max.toLocaleString("tr-TR")}</span>
            </div>

            <div className="bg-white rounded-lg px-3 py-2 border border-emerald-100 flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500">Mevcut fiyatından tasarruf</span>
              <span className="text-xs font-bold text-emerald-600">
                ₺{(flight.price - targetPrice).toLocaleString("tr-TR")} ({Math.round((1 - targetPrice / flight.price) * 100)}%)
              </span>
            </div>

            <button
              onClick={() => !alreadyAdded && onAlertAdded(flight, targetPrice)}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                alreadyAdded
                  ? "bg-emerald-100 text-emerald-700 cursor-default"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              {alreadyAdded ? (
                <><CheckCircle2 className="w-4 h-4" /> Alarm Kuruldu</>
              ) : (
                <><Bell className="w-4 h-4" /> Alarm Kur</>
              )}
            </button>
          </div>

          {/* Book CTA */}
          <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
            <Plane className="w-4 h-4" style={{ transform: "rotate(45deg)" }} />
            Bilet Satın Al — ₺{flight.price.toLocaleString("tr-TR")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Splash Screen ────────────────────────────────────────────────────────────

function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 3.5));
    }, 60);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-24 h-24 rounded-[28px] bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-200">
            <Plane className="w-12 h-12 text-white" style={{ transform: "rotate(45deg)" }} />
          </div>
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-200 opacity-70" />
          <div className="absolute -bottom-1 -left-2 w-4 h-4 rounded-full bg-emerald-300 opacity-50" />
        </div>
        <div className="text-center">
          <h1
            className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Nimbus
          </h1>
          <p className="text-sm font-semibold tracking-[0.3em] text-emerald-500 mt-1.5 uppercase">
            FlightDeal
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-52 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400">En iyi uçuş fırsatları yükleniyor…</p>
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({
  lang,
  onLangToggle,
  onAlertsBell,
}: {
  lang: "TR" | "EN";
  onLangToggle: () => void;
  onAlertsBell: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-black/[0.06] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[10px] bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <Plane className="w-4 h-4 text-white" style={{ transform: "rotate(45deg)" }} />
        </div>
        <div className="leading-none">
          <span
            className="font-extrabold text-gray-900 text-[15px] block"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Nimbus
          </span>
          <span className="text-emerald-500 font-semibold text-[10px] tracking-wide">FlightDeal</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onLangToggle}
          className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {lang}
        </button>
        <button
          onClick={onAlertsBell}
          className="relative w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-4 h-4 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  );
}

// ─── Home Screen ─────────────────────────────────────────────────────────────

function HomeScreen({ onFlightClick }: { onFlightClick: (f: Flight) => void }) {
  const [activeAirline, setActiveAirline] = useState("all");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  const filtered = FLIGHTS.filter((f) => {
    const airlineOk = activeAirline === "all" || f.airlineCode === activeAirline;
    const priceOk = f.price <= maxPrice;
    return airlineOk && priceOk;
  });

  const airlinePills = [
    { id: "all", label: "Tümü", color: "#27ae60", bg: "#eaf6ef", text: "#15803d" },
    { id: "THY", label: "THY", ...AIRLINE_CFG.THY },
    { id: "PC", label: "Pegasus", ...AIRLINE_CFG.PC },
    { id: "XQ", label: "SunExpress", ...AIRLINE_CFG.XQ },
    { id: "TK2", label: "AnadoluJet", ...AIRLINE_CFG.TK2 },
  ];

  return (
    <>
      {/* Hero */}
      <section className="px-4 pt-7 pb-14 relative overflow-hidden" style={{background: "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop') center/cover no-repeat"}}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
      <svg viewBox="0 0 800 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
  <g fill="#e8f4ff" opacity="0.35">
    {/* Sol üst bulut */}
    <ellipse cx="100" cy="60" rx="110" ry="38" />
    <ellipse cx="55" cy="72" rx="70" ry="40" />
    <ellipse cx="155" cy="70" rx="65" ry="36" />
    <ellipse cx="100" cy="45" rx="55" ry="30" />
    {/* Sağ üst bulut */}
    <ellipse cx="680" cy="50" rx="110" ry="36" />
    <ellipse cx="630" cy="62" rx="70" ry="38" />
    <ellipse cx="730" cy="60" rx="65" ry="34" />
    <ellipse cx="680" cy="38" rx="52" ry="28" />
    {/* Orta sağ küçük bulut */}
    <ellipse cx="500" cy="180" rx="75" ry="26" />
    <ellipse cx="460" cy="170" rx="48" ry="28" />
    <ellipse cx="540" cy="172" rx="45" ry="24" />
  </g>
</svg>
        </div>
        <div className="relative max-w-2xl mx-auto">
          <p className="text-emerald-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
            Bugünün En İyi Fırsatları
          </p>
          <h2
            className="text-white text-2xl font-extrabold mb-5 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Nereye uçmak<br />istiyorsunuz? ✈️
          </h2>

          <div className="bg-white rounded-2xl p-4 space-y-3 shadow-xl shadow-black/20">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 block">
                  Nereden
                </label>
                <input
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  placeholder="IST, SAW, ADB…"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 placeholder-gray-300 outline-none focus:border-emerald-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 block">
                  Nereye
                </label>
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="AMS, LHR, BCN…"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 placeholder-gray-300 outline-none focus:border-emerald-400 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 block">
                Gidiş Tarihi
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-emerald-400 focus:bg-white transition-colors"
              />
            </div>
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-200">
              <Search className="w-4 h-4" />
              Uçuş Ara
            </button>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="bg-white border-b border-black/[0.06] sticky top-[61px] z-30">
        <div className="px-4 py-2.5 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {airlinePills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setActiveAirline(pill.id)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-150"
                style={
                  activeAirline === pill.id
                    ? { backgroundColor: pill.color, color: "#fff" }
                    : { backgroundColor: pill.bg, color: pill.text }
                }
              >
                {pill.label}
              </button>
            ))}

            <div className="flex-shrink-0 flex items-center gap-2 ml-1 pl-3 border-l border-gray-100">
              <span className="text-[11px] font-semibold text-gray-500 whitespace-nowrap">
                ≤ ₺{maxPrice.toLocaleString("tr-TR")}
              </span>
              <input
                type="range"
                min={500}
                max={3000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-20 accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="px-4 py-4 max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-800">
            {filtered.length} uçuş bulundu
          </p>
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-emerald-500" />
            Fiyata göre sıralı
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">✈️</div>
            <p className="text-gray-600 font-semibold">Bu kriterlere uygun uçuş bulunamadı.</p>
            <p className="text-gray-400 text-sm mt-1">Filtrelerinizi değiştirmeyi deneyin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((f) => (
              <FlightCard key={f.id} flight={f} onClick={() => onFlightClick(f)} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Search Screen ────────────────────────────────────────────────────────────

function SearchScreen({ onFlightClick }: { onFlightClick: (f: Flight) => void }) {
  const [query, setQuery] = useState("");

  const results = query.length > 0
    ? FLIGHTS.filter(
        (f) =>
          f.toCity.toLowerCase().includes(query.toLowerCase()) ||
          f.to.toLowerCase().includes(query.toLowerCase()) ||
          f.fromCity.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="px-4 py-4 max-w-screen-xl mx-auto">
      <h2
        className="text-xl font-extrabold text-gray-900 mb-4"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Uçuş Ara
      </h2>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Şehir, havalimanı veya kod ara…"
          className="w-full bg-white border border-black/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-gray-800 placeholder-gray-300 outline-none focus:border-emerald-400 transition-colors shadow-sm"
          autoFocus
        />
        {query.length > 0 && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        )}
      </div>

      {query.length === 0 ? (
        <>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Popüler Destinasyonlar
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest.code}
                onClick={() => setQuery(dest.city)}
                className="relative h-28 rounded-xl overflow-hidden group text-left"
              >
                <img
                  src={`https://images.unsplash.com/${dest.imageId}?w=300&h=200&fit=crop&auto=format`}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <span className="text-base">{dest.flag}</span>
                  <p className="text-white font-bold text-sm leading-tight">{dest.city}</p>
                  <p className="text-white/60 text-[10px]">{dest.code}</p>
                </div>
              </button>
            ))}
          </div>

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Son Aramalar
          </p>
          {["İstanbul → Amsterdam", "Ankara → Barselona", "Antalya → Roma"].map((item) => (
            <button
              key={item}
              className="w-full flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 text-left hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-700">{item}</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto" />
            </button>
          ))}
        </>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 font-semibold">"{query}" için sonuç bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {results.map((f) => (
            <FlightCard key={f.id} flight={f} onClick={() => onFlightClick(f)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Alerts Screen ────────────────────────────────────────────────────────────

function AlertsScreen({ alerts, setAlerts }: { alerts: PriceAlert[]; setAlerts: React.Dispatch<React.SetStateAction<PriceAlert[]>> }) {
  const toggleAlert = (id: number) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };
  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="px-4 py-4 max-w-screen-xl mx-auto">
      <div className="mb-4">
        <h2
          className="text-xl font-extrabold text-gray-900"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Fiyat Alarmları
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">Hedef fiyata ulaşınca bildirim alırsınız.</p>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-500 font-semibold">Henüz alarm kurulmadı.</p>
          <p className="text-gray-400 text-sm mt-1">Bir uçuş detayından alarm kurabilirsiniz.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const cfg = AIRLINE_CFG[alert.airlineCode] ?? { bg: "#F3F4F6", text: "#374151", color: "#374151" };
            const reached = alert.currentPrice <= alert.targetPrice;
            const gap = alert.currentPrice - alert.targetPrice;
            const progressPct = Math.min(100, Math.max(0,
              Math.round((1 - gap / alert.targetPrice) * 100)
            ));

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-xl border overflow-hidden transition-all ${
                  alert.active ? "border-black/[0.06]" : "border-black/[0.04] opacity-60"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl leading-none">{alert.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-gray-900 text-sm">{alert.from}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                          <span className="font-extrabold text-gray-900 text-sm">{alert.to}</span>
                          <span className="text-gray-400 text-sm">· {alert.toCity}</span>
                        </div>
                        <div className="mt-1">
                          <AirlineBadge code={alert.airlineCode} name={alert.airline} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full transition-colors ${
                          alert.active
                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${alert.active ? "bg-emerald-500" : "bg-gray-300"}`}
                        />
                        {alert.active ? "Aktif" : "Durduruldu"}
                      </button>
                      <button
                        onClick={() => removeAlert(alert.id)}
                        className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-red-50 flex items-center justify-center transition-colors"
                      >
                        <X className="w-3 h-3 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                        Güncel Fiyat
                      </p>
                      <p className={`text-xl font-extrabold leading-none ${reached ? "text-emerald-500" : "text-gray-900"}`}>
                        ₺{alert.currentPrice.toLocaleString("tr-TR")}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                        Hedef Fiyat
                      </p>
                      <p className="text-xl font-extrabold text-gray-400 leading-none">
                        ₺{alert.targetPrice.toLocaleString("tr-TR")}
                      </p>
                    </div>
                    <div className="text-right">
                      {reached ? (
                        <div className="bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Hedef!
                        </div>
                      ) : (
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Fark</p>
                          <p className="text-sm font-bold text-red-500">
                            ₺{gap.toLocaleString("tr-TR")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Hedefe ilerleme</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progressPct}%`,
                          backgroundColor: reached ? "#27ae60" : "#f97316",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Profile Screen ───────────────────────────────────────────────────────────

function ProfileScreen({ alertCount }: { alertCount: number }) {
  const menuItems = [
    "Hesap Ayarları",
    "Bildirim Tercihleri",
    "Ödeme Yöntemleri",
    "Seyahat Geçmişi",
    "Gizlilik ve Güvenlik",
    "Yardım ve Destek",
  ];

  return (
    <div className="px-4 py-4 max-w-screen-xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-black/[0.06] p-5 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-extrabold text-xl flex-shrink-0 shadow-lg shadow-emerald-200"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          AY
        </div>
        <div className="min-w-0">
          <h3
            className="font-extrabold text-gray-900 truncate"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Ahmet Yılmaz
          </h3>
          <p className="text-gray-400 text-sm truncate">ahmet@ornek.com</p>
          <div className="flex items-center gap-1 mt-1">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-amber-600">Gold Üye</span>
            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Kaydedilen", value: "12", icon: Heart, color: "text-rose-500" },
          { label: "Alarmlar", value: String(alertCount), icon: Bell, color: "text-emerald-500" },
          { label: "Mil Puanı", value: "4.2K", icon: Zap, color: "text-amber-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-black/[0.06] p-3 text-center">
            <Icon className={`w-4 h-4 ${color} mx-auto mb-1.5`} />
            <p
              className="text-xl font-extrabold text-gray-900 leading-none"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {value}
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="bg-white rounded-xl border border-black/[0.06] overflow-hidden">
        {menuItems.map((item, i) => (
          <button
            key={item}
            className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors text-left ${
              i < menuItems.length - 1 ? "border-b border-gray-50" : ""
            }`}
          >
            <span className="text-sm font-semibold text-gray-700">{item}</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        ))}
      </div>

      <button className="w-full mt-4 py-3 rounded-xl border border-red-100 bg-red-50 text-red-500 text-sm font-bold hover:bg-red-100 transition-colors">
        Çıkış Yap
      </button>
    </div>
  );
}

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────

const NAV_TABS: { screen: Screen; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { screen: "home", icon: Home, label: "Ana Sayfa" },
  { screen: "search", icon: Search, label: "Ara" },
  { screen: "alerts", icon: Bell, label: "Alarmlar" },
  { screen: "profile", icon: User, label: "Profil" },
];

function BottomTabBar({
  active,
  onChange,
  alertCount,
}: {
  active: Screen;
  onChange: (s: Screen) => void;
  alertCount: number;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-black/[0.06] flex items-center px-2">
      {NAV_TABS.map(({ screen, icon: Icon, label }) => {
        const isActive = active === screen;
        const showBadge = screen === "alerts" && alertCount > 0;
        return (
          <button
            key={screen}
            onClick={() => onChange(screen)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors relative ${
              isActive ? "text-emerald-500" : "text-gray-400 hover:text-gray-500"
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {showBadge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-semibold leading-none ${isActive ? "text-emerald-500" : ""}`}>
              {label}
            </span>
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeScreen, setActiveScreen] = useState<Screen>("home");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [alerts, setAlerts] = useState<PriceAlert[]>(INITIAL_ALERTS);
  const [addedAlertIds, setAddedAlertIds] = useState<number[]>([]);
  const [lang, setLang] = useState<"TR" | "EN">("TR");

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2800);
    return () => clearTimeout(t);
  }, []);

  const handleFlightClick = (f: Flight) => setSelectedFlight(f);

  const handleAlertAdded = (f: Flight, target: number) => {
    if (addedAlertIds.includes(f.id)) return;
    setAddedAlertIds((prev) => [...prev, f.id]);
    setAlerts((prev) => [
      ...prev,
      {
        id: Date.now(),
        from: f.from,
        to: f.to,
        toCity: f.toCity,
        flag: f.flag,
        airline: f.airline,
        airlineCode: f.airlineCode,
        currentPrice: f.price,
        targetPrice: target,
        active: true,
      },
    ]);
  };

  if (showSplash) return <SplashScreen />;

  const activeAlertCount = alerts.filter((a) => a.active).length;

  return (
    <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header
        lang={lang}
        onLangToggle={() => setLang((l) => (l === "TR" ? "EN" : "TR"))}
        onAlertsBell={() => setActiveScreen("alerts")}
      />

      <main className="pb-20">
        {activeScreen === "home" && <HomeScreen onFlightClick={handleFlightClick} />}
        {activeScreen === "search" && <SearchScreen onFlightClick={handleFlightClick} />}
        {activeScreen === "alerts" && (
          <AlertsScreen alerts={alerts} setAlerts={setAlerts} />
        )}
        {activeScreen === "profile" && <ProfileScreen alertCount={activeAlertCount} />}
      </main>

      <BottomTabBar
        active={activeScreen}
        onChange={setActiveScreen}
        alertCount={activeAlertCount}
      />

      {selectedFlight && (
        <FlightModal
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
          onAlertAdded={handleAlertAdded}
          alreadyAdded={addedAlertIds.includes(selectedFlight.id)}
        />
      )}
    </div>
  );
}
