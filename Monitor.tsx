/*
 * PWV Project — Monitor Dashboard
 * Design: Blush Vitality Dashboard (adapted from original dark theme)
 * Color: Dusty Rose, Peach Cream, Berry accents on Rose White background
 * Typography: Outfit (display), Nunito Sans (body), Space Mono (data)
 * iPad-first responsive layout
 */

import { Button } from "@/components/ui/button";
import {
  Heart,
  ArrowLeft,
  Wifi,
  WifiOff,
  Trash2,
  FileDown,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

/* ── Types ── */
interface WSData {
  irA?: number[];
  irB?: number[];
  pwv?: number;
  risk?: string;
  transit?: number;
  beats?: number;
}

interface LogEntry {
  time: string;
  pwv: number;
  transit: number | null;
  beats: number;
  risk: string;
}

const RISK_STYLES: Record<string, { color: string; bg: string; label: string; desc: string }> = {
  NORMAL: {
    color: "#2ECC71",
    bg: "rgba(46,204,113,0.08)",
    label: "NORMAL",
    desc: "หลอดเลือดยืดหยุ่นดี ความเสี่ยง cardiovascular ต่ำ",
  },
  BORDERLINE: {
    color: "#F39C12",
    bg: "rgba(243,156,18,0.08)",
    label: "BORDERLINE",
    desc: "หลอดเลือดเริ่มแข็งตัว ควรติดตามและปรับพฤติกรรม",
  },
  HIGH_RISK: {
    color: "#E74C3C",
    bg: "rgba(231,76,60,0.08)",
    label: "HIGH RISK",
    desc: "หลอดเลือดแข็งตัวมาก เสี่ยงสูง ควรพบแพทย์",
  },
  MEASURING: {
    color: "#9B8A8A",
    bg: "transparent",
    label: "MEASURING",
    desc: "กำลังตรวจจับชีพจร...",
  },
};

const MAX_WAVE_PTS = 200;
const MAX_PWV_PTS = 60;

const MONITOR_HEADER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663443504399/YxdtWhxNG8eC6JhDXu355m/monitor-header-Gh2x9iwKMC28dA5NnuhHtd.webp";

export default function Monitor() {
  /* ── State ── */
  const [espIP, setEspIP] = useState("192.168.1.100");
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected" | "error">("disconnected");
  const [pwvValue, setPwvValue] = useState<number | null>(null);
  const [risk, setRisk] = useState("MEASURING");
  const [ptt, setPtt] = useState<number | null>(null);
  const [beats, setBeats] = useState(0);
  const [logData, setLogData] = useState<LogEntry[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const chartARef = useRef<HTMLCanvasElement>(null);
  const chartBRef = useRef<HTMLCanvasElement>(null);
  const chartPWVRef = useRef<HTMLCanvasElement>(null);
  const chartAInst = useRef<any>(null);
  const chartBInst = useRef<any>(null);
  const chartPWVInst = useRef<any>(null);
  const lastLogRef = useRef<{ risk: string; ms: number }>({ risk: "", ms: 0 });

  /* ── Chart.js dynamic import ── */
  const [chartsReady, setChartsReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
    script.onload = () => setChartsReady(true);
    document.head.appendChild(script);

    const pdfScript = document.createElement("script");
    pdfScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    document.head.appendChild(pdfScript);

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  /* ── Initialize Charts ── */
  useEffect(() => {
    if (!chartsReady) return;
    const Chart = (window as any).Chart;
    if (!Chart) return;

    const makeCfg = (label: string, color: string) => ({
      type: "line" as const,
      data: {
        labels: Array(MAX_WAVE_PTS).fill(""),
        datasets: [
          {
            label,
            data: Array(MAX_WAVE_PTS).fill(null),
            borderColor: color,
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.3,
            fill: true,
            backgroundColor: color + "15",
          },
        ],
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: {
            display: true,
            grid: { color: "rgba(186,45,101,0.08)" },
            ticks: {
              color: "#9B8A8A",
              font: { family: "Space Mono", size: 9 },
            },
          },
        },
      },
    });

    if (chartARef.current && !chartAInst.current) {
      chartAInst.current = new Chart(chartARef.current, makeCfg("Sensor A (IR)", "#E8A0BF"));
    }
    if (chartBRef.current && !chartBInst.current) {
      chartBInst.current = new Chart(chartBRef.current, makeCfg("Sensor B (IR)", "#BA2D65"));
    }
    if (chartPWVRef.current && !chartPWVInst.current) {
      chartPWVInst.current = new Chart(chartPWVRef.current, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "PWV (m/s)",
              data: [],
              borderColor: "#BA2D65",
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: "#BA2D65",
              tension: 0.2,
              fill: false,
            },
          ],
        },
        options: {
          animation: { duration: 300 },
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              ticks: { color: "#9B8A8A", font: { family: "Space Mono", size: 9 } },
              grid: { color: "rgba(186,45,101,0.08)" },
            },
            y: {
              min: 0,
              max: 20,
              ticks: { color: "#9B8A8A", font: { family: "Space Mono", size: 9 } },
              grid: { color: "rgba(186,45,101,0.08)" },
            },
          },
        },
      });
    }
  }, [chartsReady]);

  /* ── Push waveform data ── */
  const pushData = useCallback((chart: any, pts: number[]) => {
    if (!chart) return;
    const ds = chart.data.datasets[0].data;
    pts.forEach((v: number) => {
      ds.push(v);
      if (ds.length > MAX_WAVE_PTS) ds.shift();
    });
    chart.update("none");
  }, []);

  /* ── Handle WS message ── */
  const handleMessage = useCallback(
    (e: MessageEvent) => {
      try {
        const d: WSData = JSON.parse(e.data);
        if (d.irA?.length) pushData(chartAInst.current, d.irA);
        if (d.irB?.length) pushData(chartBInst.current, d.irB);

        if (d.pwv && d.pwv > 0) {
          const riskKey = d.risk || "MEASURING";
          const s = RISK_STYLES[riskKey] || RISK_STYLES.MEASURING;

          setPwvValue(d.pwv);
          setRisk(riskKey);
          setPtt(d.transit ?? null);
          setBeats(d.beats ?? 0);

          // Update PWV chart
          const chart = chartPWVInst.current;
          if (chart) {
            const now = new Date().toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            chart.data.labels.push(now);
            chart.data.datasets[0].data.push(d.pwv);
            if (chart.data.labels.length > MAX_PWV_PTS) {
              chart.data.labels.shift();
              chart.data.datasets[0].data.shift();
            }
            chart.data.datasets[0].pointBackgroundColor = chart.data.datasets[0].data.map(
              (v: number) => (v < 7 ? "#2ECC71" : v < 10 ? "#F39C12" : "#E74C3C")
            );
            chart.update();
          }

          // Log
          const nowMs = Date.now();
          if (
            !lastLogRef.current.ms ||
            riskKey !== lastLogRef.current.risk ||
            nowMs - lastLogRef.current.ms > 5000
          ) {
            const time = new Date().toLocaleTimeString("th-TH");
            setLogData((prev) => [
              { time, pwv: d.pwv!, transit: d.transit ?? null, beats: d.beats ?? 0, risk: riskKey },
              ...prev,
            ]);
            lastLogRef.current = { risk: riskKey, ms: nowMs };
          }
        }
      } catch {}
    },
    [pushData]
  );

  /* ── Connect WebSocket ── */
  const connectWS = useCallback(() => {
    if (!espIP.trim()) return;
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setStatus("connecting");
    const ip = "192.168.108"
    const ws = new WebSocket(`ws://${ip}:81`);

    ws.onopen = () => setStatus("connected");
    ws.onmessage = handleMessage;
    ws.onerror = () => setStatus("error");
    ws.onclose = () => {
      setStatus("connecting");
      setTimeout(connectWS, 3000);
    };

    wsRef.current = ws;
  }, [espIP, handleMessage]);

  /* ── Disconnect ── */
  const disconnectWS = () => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus("disconnected");
  };

  /* ── Clear Log ── */
  const clearLog = () => setLogData([]);

  /* ── PDF Report ── */
  const downloadPDF = () => {
    const jspdf = (window as any).jspdf;
    if (!jspdf) return;
    const { jsPDF } = jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = 210;
    const H = 297;
    const now = new Date();

    // Background
    doc.setFillColor(255, 240, 240);
    doc.rect(0, 0, W, H, "F");

    // Header bar
    doc.setFillColor(232, 160, 191);
    doc.rect(0, 0, W, 32, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("PULSE WAVE VELOCITY REPORT", 20, 14);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(186, 45, 101);
    doc.text("ARTERIAL STIFFNESS ASSESSMENT  |  ESP32 + MAX30102", 20, 22);
    doc.text(`Generated: ${now.toLocaleString("th-TH")}`, 20, 29);

    // Current PWV
    const pwvNow = pwvValue ?? 0;
    const riskStyle = pwvNow < 7 ? [46, 204, 113] : pwvNow < 10 ? [243, 156, 18] : [231, 76, 60];

    doc.setDrawColor(...riskStyle);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 40, W - 30, 45, 4, 4, "S");

    doc.setTextColor(155, 138, 138);
    doc.setFontSize(8);
    doc.text("PULSE WAVE VELOCITY", 20, 50);

    doc.setTextColor(...riskStyle);
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.text(`${pwvNow.toFixed(2)} m/s`, 20, 70);

    const riskS = RISK_STYLES[risk] || RISK_STYLES.MEASURING;
    doc.setFontSize(14);
    doc.text(riskS.label, 20, 80);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 76, 90);
    doc.text(`Transit Time: ${ptt?.toFixed(1) ?? "---"} ms   |   Beats: ${beats}`, 20, 88);

    // Reference ranges
    doc.setTextColor(186, 45, 101);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("REFERENCE RANGES (ESH/ESC 2018)", 15, 105);
    doc.setDrawColor(186, 45, 101);
    doc.setLineWidth(0.3);
    doc.line(15, 107, W - 15, 107);

    const refs = [
      { range: "< 7 m/s", riskLabel: "NORMAL", color: [46, 204, 113], desc: "Healthy, elastic arteries" },
      { range: "7-10 m/s", riskLabel: "BORDERLINE", color: [243, 156, 18], desc: "Mild arterial stiffening" },
      { range: "> 10 m/s", riskLabel: "HIGH RISK", color: [231, 76, 60], desc: "Significant stiffening" },
    ];
    refs.forEach((r, i) => {
      const y = 117 + i * 14;
      doc.setFillColor(...r.color, 30);
      doc.roundedRect(15, y - 6, W - 30, 12, 2, 2, "F");
      doc.setTextColor(...r.color);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(r.range, 20, y);
      doc.text(r.riskLabel, 65, y);
      doc.setTextColor(107, 76, 90);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(r.desc, 110, y);
    });

    // Log table
    if (logData.length > 0) {
      doc.setTextColor(186, 45, 101);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("MEASUREMENT LOG", 15, 170);
      doc.line(15, 172, W - 15, 172);

      const headers = ["#", "TIME", "PWV (m/s)", "PTT (ms)", "BEATS", "RISK"];
      const colX = [15, 25, 60, 100, 135, 160];

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(155, 138, 138);
      headers.forEach((h, i) => doc.text(h, colX[i], 180));
      doc.line(15, 182, W - 15, 182);

      const rows = logData.slice(0, 12);
      rows.forEach((row, idx) => {
        const y = 189 + idx * 7;
        const c = row.risk === "NORMAL" ? [46, 204, 113] : row.risk === "BORDERLINE" ? [243, 156, 18] : [231, 76, 60];

        doc.setFont("helvetica", "normal");
        doc.setTextColor(155, 138, 138);
        doc.text(String(idx + 1), colX[0], y);
        doc.setTextColor(107, 76, 90);
        doc.text(row.time, colX[1], y);
        doc.setTextColor(...c);
        doc.text(row.pwv.toFixed(2), colX[2], y);
        doc.setTextColor(107, 76, 90);
        doc.text(row.transit ? row.transit.toFixed(1) : "-", colX[3], y);
        doc.text(String(row.beats || "-"), colX[4], y);
        doc.setTextColor(...c);
        doc.text(row.risk, colX[5], y);
      });
    }

    // Footer
    doc.setFillColor(255, 240, 240);
    doc.rect(0, H - 18, W, 18, "F");
    doc.setDrawColor(232, 160, 191);
    doc.line(15, H - 18, W - 15, H - 18);
    doc.setTextColor(155, 138, 138);
    doc.setFontSize(7.5);
    doc.text("FOR EDUCATIONAL PURPOSES ONLY — NOT A CERTIFIED MEDICAL DEVICE", 15, H - 10);
    doc.text(`PWV Monitor v1.0  |  ESP32 + Dual MAX30102  |  ${now.toLocaleDateString("th-TH")}`, 15, H - 5);

    doc.save(`PWV_Report_${now.toISOString().slice(0, 10)}.pdf`);
  };

  /* ── Derived ── */
  const riskS = RISK_STYLES[risk] || RISK_STYLES.MEASURING;

  const statusConfig = {
    disconnected: { text: "DISCONNECTED", color: "#9B8A8A", icon: <WifiOff className="w-3.5 h-3.5" /> },
    connecting: { text: "CONNECTING...", color: "#F39C12", icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
    connected: { text: "CONNECTED", color: "#2ECC71", icon: <Wifi className="w-3.5 h-3.5" /> },
    error: { text: "ERROR", color: "#E74C3C", icon: <WifiOff className="w-3.5 h-3.5" /> },
  };
  const sc = statusConfig[status];

  return (
    <div className="min-h-screen bg-[#FFF0F0]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#FFF0F0]/80 border-b border-[#E8A0BF]/20">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E8A0BF] to-[#BA2D65] flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="font-display text-lg font-bold text-[#3D1C2A]">
                PWV <span className="text-[#BA2D65]">Monitor</span>
              </span>
            </Link>

            {/* Pulse dot */}
            <div
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: sc.color, boxShadow: `0 0 8px ${sc.color}` }}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Status badge */}
            <span
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border"
              style={{ borderColor: sc.color, color: sc.color }}
            >
              {sc.icon}
              {sc.text}
            </span>

            <Link href="/guide">
              <Button variant="ghost" size="sm" className="text-[#6B4C5A] hover:text-[#BA2D65] hover:bg-[#FFDDD2]/50 font-body text-xs">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                คำแนะนำ
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* IP Bar */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-[#FFDDD2]">
        <div className="flex items-center gap-3 px-4 md:px-6 py-2.5">
          <label className="text-xs font-mono text-[#9B8A8A] shrink-0">ESP32 IP:</label>
          <input
            type="text"
            value={espIP}
            onChange={(e) => setEspIP(e.target.value)}
            placeholder="192.168.x.x"
            className="bg-[#FFF0F0] border border-[#E8A0BF]/30 text-[#BA2D65] px-3 py-1.5 rounded-lg font-mono text-sm w-44 outline-none focus:border-[#BA2D65] focus:ring-2 focus:ring-[#E8A0BF]/20 transition-all"
          />
          {status === "connected" ? (
            <Button
              size="sm"
              onClick={disconnectWS}
              className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 font-mono text-xs rounded-lg"
            >
              DISCONNECT
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={connectWS}
              className="bg-gradient-to-r from-[#E8A0BF] to-[#BA2D65] text-white hover:from-[#d98db0] hover:to-[#a82659] font-mono text-xs rounded-lg shadow-md shadow-[#E8A0BF]/30"
            >
              CONNECT
            </Button>
          )}

          <span className="text-xs text-[#9B8A8A] font-mono hidden md:inline ml-2">
            WebSocket ws://[IP]:81
          </span>

          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={clearLog}
              className="border-[#E8A0BF]/40 text-[#BA2D65] hover:bg-[#FFDDD2]/50 font-mono text-xs rounded-lg"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              CLEAR
            </Button>
            <Button
              size="sm"
              onClick={downloadPDF}
              className="bg-[#FFDDD2] text-[#BA2D65] hover:bg-[#f5cfc3] font-mono text-xs rounded-lg border border-[#E8A0BF]/30"
            >
              <FileDown className="w-3.5 h-3.5 mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <main className="pt-[7.5rem] pb-6 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] gap-4 max-w-[1600px] mx-auto">
          {/* Waveform A */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-[#FFDDD2]/80 p-5 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E8A0BF] to-transparent opacity-50" />
            <div className="flex items-center gap-2 text-xs font-mono text-[#9B8A8A] tracking-widest mb-3">
              <span className="text-[#E8A0BF]">&#9673;</span>
              SENSOR A — PROXIMAL WAVEFORM (IR)
            </div>
            <div className="h-[140px]">
              <canvas ref={chartARef} />
            </div>
          </motion.div>

          {/* Waveform B */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bg-white rounded-2xl border border-[#FFDDD2]/80 p-5 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#BA2D65] to-transparent opacity-50" />
            <div className="flex items-center gap-2 text-xs font-mono text-[#9B8A8A] tracking-widest mb-3">
              <span className="text-[#BA2D65]">&#9673;</span>
              SENSOR B — DISTAL WAVEFORM (IR)
            </div>
            <div className="h-[140px]">
              <canvas ref={chartBRef} />
            </div>
          </motion.div>

          {/* Summary Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:row-span-3 flex flex-col gap-4"
          >
            {/* PWV Value */}
            <div className="bg-white rounded-2xl border border-[#FFDDD2]/80 p-6 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E8A0BF] to-transparent opacity-50" />
              <div className="text-xs font-mono text-[#9B8A8A] tracking-widest mb-3">PULSE WAVE VELOCITY</div>
              <div
                className="font-display text-5xl font-bold leading-none transition-colors duration-300"
                style={{ color: riskS.color }}
              >
                {pwvValue !== null ? pwvValue.toFixed(2) : "---"}
              </div>
              <div className="text-sm font-mono text-[#9B8A8A] mt-2">m/s</div>
            </div>

            {/* Risk Box */}
            <div
              className="rounded-2xl p-5 text-center border-2 transition-all duration-400"
              style={{
                borderColor: riskS.color,
                color: riskS.color,
                background: riskS.bg,
              }}
            >
              <div className="font-display text-xl font-bold tracking-wider">{riskS.label}</div>
              <div className="text-sm mt-2 leading-relaxed font-body" style={{ color: "#6B4C5A" }}>
                {riskS.desc}
              </div>
            </div>

            {/* Mini Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-[#FFDDD2]/80 p-4 text-center shadow-sm">
                <div className="text-[10px] font-mono text-[#9B8A8A] tracking-widest">TRANSIT TIME</div>
                <div className="font-display text-2xl font-bold text-[#BA2D65] mt-1">
                  {ptt !== null ? ptt.toFixed(1) : "---"}
                </div>
                <div className="text-[10px] font-mono text-[#9B8A8A]">ms</div>
              </div>
              <div className="bg-white rounded-xl border border-[#FFDDD2]/80 p-4 text-center shadow-sm">
                <div className="text-[10px] font-mono text-[#9B8A8A] tracking-widest">BEATS</div>
                <div className="font-display text-2xl font-bold text-[#BA2D65] mt-1">{beats}</div>
                <div className="text-[10px] font-mono text-[#9B8A8A]">detected</div>
              </div>
            </div>

            {/* Reference */}
            <div className="bg-white rounded-xl border border-[#FFDDD2]/80 p-4 shadow-sm">
              <div className="text-[10px] font-mono text-[#9B8A8A] tracking-widest mb-3">
                REFERENCE (ESH/ESC 2018)
              </div>
              <div className="space-y-2 text-sm font-body">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[#6B4C5A]">&lt;7 m/s — Normal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-[#6B4C5A]">7–10 m/s — Borderline</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-[#6B4C5A]">&gt;10 m/s — High Risk</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* PWV History Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-[#FFDDD2]/80 p-5 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E8A0BF] to-transparent opacity-50" />
            <div className="flex items-center gap-2 text-xs font-mono text-[#9B8A8A] tracking-widest mb-3">
              <span className="text-[#E8A0BF]">&#9673;</span>
              PWV HISTORY — BEAT BY BEAT
            </div>
            <div className="h-[180px]">
              <canvas ref={chartPWVRef} />
            </div>
          </motion.div>

          {/* Reference Bar */}
          <div className="lg:col-span-2 flex rounded-xl overflow-hidden h-8 text-xs font-mono font-bold">
            <div className="flex-1 flex items-center justify-center bg-emerald-100 text-emerald-700">
              &lt;7 NORMAL
            </div>
            <div className="flex-1 flex items-center justify-center bg-amber-100 text-amber-700">
              7–10 BORDERLINE
            </div>
            <div className="flex-1 flex items-center justify-center bg-red-100 text-red-700">
              &gt;10 HIGH RISK
            </div>
          </div>

          {/* Log Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-[#FFDDD2]/80 p-5 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E8A0BF] to-transparent opacity-50" />
            <div className="flex items-center justify-between text-xs font-mono text-[#9B8A8A] tracking-widest mb-3">
              <span className="flex items-center gap-2">
                <span className="text-[#E8A0BF]">&#9673;</span>
                MEASUREMENT LOG
              </span>
              <span>{logData.length} records</span>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#FFDDD2]">
                    <th className="text-left py-2 px-3 text-[10px] font-mono text-[#9B8A8A] tracking-widest">#</th>
                    <th className="text-left py-2 px-3 text-[10px] font-mono text-[#9B8A8A] tracking-widest">TIME</th>
                    <th className="text-left py-2 px-3 text-[10px] font-mono text-[#9B8A8A] tracking-widest">PWV (m/s)</th>
                    <th className="text-left py-2 px-3 text-[10px] font-mono text-[#9B8A8A] tracking-widest">PTT (ms)</th>
                    <th className="text-left py-2 px-3 text-[10px] font-mono text-[#9B8A8A] tracking-widest">BEATS</th>
                    <th className="text-left py-2 px-3 text-[10px] font-mono text-[#9B8A8A] tracking-widest">RISK</th>
                  </tr>
                </thead>
                <tbody>
                  {logData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-[#9B8A8A] font-body">
                        ยังไม่มีข้อมูล — เชื่อมต่อ ESP32 เพื่อเริ่มวัด
                      </td>
                    </tr>
                  ) : (
                    logData.map((row, idx) => {
                      const rs = RISK_STYLES[row.risk] || RISK_STYLES.MEASURING;
                      return (
                        <tr
                          key={idx}
                          className="border-b border-[#FFDDD2]/40 hover:bg-[#FFF0F0]/50 transition-colors"
                        >
                          <td className="py-2 px-3 font-mono text-[#9B8A8A]">{logData.length - idx}</td>
                          <td className="py-2 px-3 font-mono text-[#6B4C5A]">{row.time}</td>
                          <td className="py-2 px-3 font-mono font-bold" style={{ color: rs.color }}>
                            {row.pwv.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 font-mono text-[#6B4C5A]">
                            {row.transit ? row.transit.toFixed(1) : "-"}
                          </td>
                          <td className="py-2 px-3 font-mono text-[#6B4C5A]">{row.beats || "-"}</td>
                          <td className="py-2 px-3 font-mono font-bold" style={{ color: rs.color }}>
                            {rs.label}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-[#FFDDD2]">
        <div className="text-center text-xs text-[#9B8A8A] font-mono">
          PWV Monitor v1.0 — FOR EDUCATIONAL PURPOSES ONLY
        </div>
      </footer>
    </div>
  );
}
