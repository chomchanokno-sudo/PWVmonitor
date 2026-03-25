/*
 * PWV Project — Guide Page
 * Design: Blush Vitality Dashboard
 * Step-by-step instructions for using PWV Monitor
 * iPad-first responsive layout
 */

import { Button } from "@/components/ui/button";
import {
  Heart,
  Activity,
  ArrowRight,
  ArrowLeft,
  Wifi,
  MonitorSmartphone,
  CircleDot,
  AlertTriangle,
  CheckCircle2,
  Info,
  FileText,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const GUIDE_IMG = "/images/step-1-setup.png";

export default function Guide() {
  return (
    <div className="min-h-screen bg-[#FFF0F0]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#FFF0F0]/80 border-b border-[#E8A0BF]/20">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E8A0BF] to-[#BA2D65] flex items-center justify-center shadow-lg shadow-[#E8A0BF]/30">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-display text-xl font-bold text-[#3D1C2A] tracking-tight">
              PWV <span className="text-[#BA2D65]">Monitor</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" className="text-[#6B4C5A] hover:text-[#BA2D65] hover:bg-[#FFDDD2]/50 font-body font-semibold">
                <ArrowLeft className="w-4 h-4 mr-1" />
                หน้าหลัก
              </Button>
            </Link>
            <Link href="/monitor">
              <Button className="bg-gradient-to-r from-[#E8A0BF] to-[#BA2D65] hover:from-[#d98db0] hover:to-[#a82659] text-white shadow-lg shadow-[#E8A0BF]/40 font-body font-semibold rounded-full px-6">
                <Activity className="w-4 h-4 mr-2" />
                เริ่มวัด
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-8 md:pt-32 md:pb-12 relative overflow-hidden">
        <div className="absolute top-20 -right-32 w-80 h-80 rounded-full bg-[#FFDDD2]/50 blur-3xl" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-[#3D1C2A] mb-4">
              คำแนะนำการใช้งาน
            </h1>
            <p className="text-lg text-[#6B4C5A] font-body max-w-2xl mx-auto">
              เรียนรู้วิธีตั้งค่าและใช้งานระบบ PWV Monitor อย่างถูกต้อง เพื่อผลการวัดที่แม่นยำ
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img
              src={GUIDE_IMG}
              alt="Guide Steps Illustration"
              className="w-full max-w-3xl mx-auto rounded-3xl shadow-xl shadow-[#E8A0BF]/15"
            />
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 md:py-20">
        <div className="container max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Step 1 */}
            <StepCard
              step={1}
              icon={<CircleDot className="w-6 h-6" />}
              title="เตรียมอุปกรณ์"
              delay={0}
            >
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>ESP32</strong> ที่ติดตั้งเฟิร์มแวร์ PWV Monitor แล้ว</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>MAX30102 Sensor 2 ตัว</strong> — Sensor A (Proximal) และ Sensor B (Distal)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>iPad หรืออุปกรณ์ใดก็ได้</strong> ที่เชื่อมต่อ WiFi เดียวกับ ESP32</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>วัดระยะห่าง</strong> ระหว่าง Sensor A และ B (เป็นเซนติเมตร)</span>
                </li>
              </ul>
            </StepCard>

            {/* Step 2 */}
            <StepCard
              step={2}
              icon={<Wifi className="w-6 h-6" />}
              title="เชื่อมต่อ WiFi"
              delay={0.1}
            >
              <ol className="space-y-3 list-decimal list-inside">
                <li className="text-[#6B4C5A]">
                  เปิด ESP32 และรอให้เชื่อมต่อ WiFi (ไฟ LED จะกระพริบ)
                </li>
                <li className="text-[#6B4C5A]">
                  ตรวจสอบ IP Address ของ ESP32 จาก Serial Monitor หรือหน้าจอ OLED
                </li>
                <li className="text-[#6B4C5A]">
                  ตรวจสอบว่า iPad เชื่อมต่อ WiFi เดียวกันกับ ESP32
                </li>
              </ol>
              <div className="mt-4 bg-[#FFDDD2]/50 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#BA2D65] mt-0.5 shrink-0" />
                <p className="text-sm text-[#6B4C5A]">
                  ESP32 จะเปิด WebSocket Server ที่พอร์ต <code className="font-mono bg-white/60 px-1.5 py-0.5 rounded text-[#BA2D65]">81</code> โดยอัตโนมัติ
                </p>
              </div>
            </StepCard>

            {/* Step 3 */}
            <StepCard
              step={3}
              icon={<MonitorSmartphone className="w-6 h-6" />}
              title="เปิดหน้า Monitor"
              delay={0.2}
            >
              <ol className="space-y-3 list-decimal list-inside">
                <li className="text-[#6B4C5A]">
                  กดปุ่ม <strong>"เริ่มวัด"</strong> เพื่อเข้าสู่หน้า Monitor Dashboard
                </li>
                <li className="text-[#6B4C5A]">
                  กรอก IP Address ของ ESP32 ในช่อง <strong>"ESP32 IP"</strong>
                </li>
                <li className="text-[#6B4C5A]">
                  กดปุ่ม <strong>"CONNECT"</strong> เพื่อเชื่อมต่อ WebSocket
                </li>
                <li className="text-[#6B4C5A]">
                  รอจนสถานะเปลี่ยนเป็น <span className="text-emerald-600 font-semibold">CONNECTED</span>
                </li>
              </ol>
            </StepCard>

            {/* Step 4 */}
            <StepCard
              step={4}
              icon={<Activity className="w-6 h-6" />}
              title="วางเซ็นเซอร์และเริ่มวัด"
              delay={0.3}
            >
              <ol className="space-y-3 list-decimal list-inside">
                <li className="text-[#6B4C5A]">
                  วาง <strong>Sensor A (Proximal)</strong> ที่ตำแหน่งใกล้หัวใจ เช่น คอ (Carotid)
                </li>
                <li className="text-[#6B4C5A]">
                  วาง <strong>Sensor B (Distal)</strong> ที่ตำแหน่งไกลหัวใจ เช่น ข้อมือ (Radial) หรือขา (Femoral)
                </li>
                <li className="text-[#6B4C5A]">
                  กดเซ็นเซอร์ให้แน่นพอดี ไม่แน่นเกินไป
                </li>
                <li className="text-[#6B4C5A]">
                  ระบบจะเริ่มแสดงคลื่น IR และคำนวณค่า PWV อัตโนมัติ
                </li>
              </ol>
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800">
                  ผู้ถูกวัดควรนั่งนิ่งและผ่อนคลาย อย่าขยับร่างกายขณะวัด เพื่อผลลัพธ์ที่แม่นยำ
                </p>
              </div>
            </StepCard>

            {/* Step 5 */}
            <StepCard
              step={5}
              icon={<FileText className="w-6 h-6" />}
              title="อ่านผลและส่งออกรายงาน"
              delay={0.4}
            >
              <div className="space-y-4">
                <p className="text-[#6B4C5A]">
                  หลังจากระบบตรวจจับชีพจรได้แล้ว จะแสดงข้อมูลดังนี้:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#FFDDD2]/40 rounded-xl p-3">
                    <div className="text-xs font-mono text-[#BA2D65] font-bold mb-1">PWV (m/s)</div>
                    <div className="text-sm text-[#6B4C5A]">ค่าความเร็วคลื่นชีพจร</div>
                  </div>
                  <div className="bg-[#FFDDD2]/40 rounded-xl p-3">
                    <div className="text-xs font-mono text-[#BA2D65] font-bold mb-1">Transit Time</div>
                    <div className="text-sm text-[#6B4C5A]">เวลาที่คลื่นเดินทาง (ms)</div>
                  </div>
                  <div className="bg-[#FFDDD2]/40 rounded-xl p-3">
                    <div className="text-xs font-mono text-[#BA2D65] font-bold mb-1">Risk Level</div>
                    <div className="text-sm text-[#6B4C5A]">ระดับความเสี่ยง</div>
                  </div>
                  <div className="bg-[#FFDDD2]/40 rounded-xl p-3">
                    <div className="text-xs font-mono text-[#BA2D65] font-bold mb-1">Beats</div>
                    <div className="text-sm text-[#6B4C5A]">จำนวนชีพจรที่ตรวจจับ</div>
                  </div>
                </div>
                <p className="text-[#6B4C5A]">
                  กดปุ่ม <strong>"PDF REPORT"</strong> เพื่อดาวน์โหลดรายงานผลการวัดเป็นไฟล์ PDF
                </p>
              </div>
            </StepCard>
          </div>
        </div>
      </section>

      {/* Warning Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-amber-900 mb-3">
                  ข้อควรระวัง
                </h3>
                <ul className="space-y-2 text-amber-800 font-body">
                  <li>อุปกรณ์นี้ใช้เพื่อ<strong>การศึกษาเท่านั้น</strong> ไม่ใช่เครื่องมือแพทย์ที่ได้รับการรับรอง</li>
                  <li>ผลการวัดอาจมีความคลาดเคลื่อน ไม่ควรใช้ทดแทนการตรวจจากแพทย์</li>
                  <li>หากมีข้อกังวลเรื่องสุขภาพหลอดเลือด ควรปรึกษาแพทย์ผู้เชี่ยวชาญ</li>
                  <li>ค่า PWV อาจเปลี่ยนแปลงตามปัจจัยต่างๆ เช่น ความเครียด อุณหภูมิ ท่าทาง</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container text-center">
          <Link href="/monitor">
            <Button size="lg" className="bg-gradient-to-r from-[#E8A0BF] to-[#BA2D65] hover:from-[#d98db0] hover:to-[#a82659] text-white shadow-xl shadow-[#E8A0BF]/40 font-body font-bold rounded-full px-10 h-14 text-base">
              <Activity className="w-5 h-5 mr-2" />
              เริ่มใช้งาน Monitor
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#FFDDD2]">
        <div className="container text-center">
          <p className="text-sm text-[#6B4C5A]/60 font-body">
            PWV Monitor — สำหรับการศึกษาเท่านั้น ไม่ใช่อุปกรณ์ทางการแพทย์ที่ได้รับการรับรอง
          </p>
        </div>
      </footer>
    </div>
  );
}

/* Step Card Component */
function StepCard({
  step,
  icon,
  title,
  children,
  delay = 0,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl border border-[#FFDDD2]/80 shadow-sm overflow-hidden"
    >
      <div className="flex items-stretch">
        {/* Step Number */}
        <div className="w-20 md:w-24 bg-gradient-to-b from-[#E8A0BF] to-[#BA2D65] flex flex-col items-center justify-center shrink-0">
          <div className="text-white/60 text-xs font-mono mb-1">STEP</div>
          <div className="text-white font-display text-3xl font-bold">{step}</div>
        </div>
        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFDDD2] flex items-center justify-center text-[#BA2D65]">
              {icon}
            </div>
            <h3 className="font-display text-xl font-bold text-[#3D1C2A]">{title}</h3>
          </div>
          <div className="font-body text-[#6B4C5A] leading-relaxed">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
