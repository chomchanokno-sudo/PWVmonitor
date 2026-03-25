/*
 * PWV Project — Landing Page
 * Design: Blush Vitality Dashboard
 * Color: Dusty Rose, Peach Cream, Berry accents on Rose White background
 * Typography: Outfit (display), Nunito Sans (body), Space Mono (data)
 * iPad-first responsive layout
 */

import { Button } from "@/components/ui/button";
import { Heart, Activity, ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const HERO_IMG = "/images/hero-heart.png";
const HEART_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663443504399/YxdtWhxNG8eC6JhDXu355m/heart-pulse-icon-5zjzB3UZM6bjMFahrBNjNy.webp";

export default function Home() {
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
            <Link href="/guide">
              <Button variant="ghost" className="text-[#6B4C5A] hover:text-[#BA2D65] hover:bg-[#FFDDD2]/50 font-body font-semibold">
                คำแนะนำ
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

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 -right-32 w-96 h-96 rounded-full bg-[#FFDDD2]/60 blur-3xl" />
        <div className="absolute -bottom-20 -left-32 w-80 h-80 rounded-full bg-[#E8A0BF]/30 blur-3xl" />

        <div className="container relative">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="order-2 md:order-1"
            >
              <div className="inline-flex items-center gap-2 bg-[#FFDDD2] rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#BA2D65] animate-pulse" />
                <span className="text-sm font-body font-semibold text-[#BA2D65]">ESP32 + MAX30102</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#3D1C2A] leading-tight mb-6">
                วัดความยืดหยุ่น
                <br />
                <span className="bg-gradient-to-r from-[#E8A0BF] to-[#BA2D65] bg-clip-text text-transparent">
                  หลอดเลือด
                </span>
                <br />
                แบบเรียลไทม์
              </h1>

              <p className="text-lg text-[#6B4C5A] font-body leading-relaxed mb-8 max-w-lg">
                ระบบวัดค่า Pulse Wave Velocity (PWV) ผ่าน WebSocket 
                แสดงผลบน iPad ของคุณได้ทันที พร้อมวิเคราะห์ระดับความเสี่ยง 
                ตามมาตรฐาน ESH/ESC 2018
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/monitor">
                  <Button size="lg" className="bg-gradient-to-r from-[#E8A0BF] to-[#BA2D65] hover:from-[#d98db0] hover:to-[#a82659] text-white shadow-xl shadow-[#E8A0BF]/40 font-body font-bold rounded-full px-8 h-14 text-base">
                    เริ่มใช้งาน
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/guide">
                  <Button size="lg" variant="outline" className="border-2 border-[#E8A0BF] text-[#BA2D65] hover:bg-[#FFDDD2]/50 font-body font-bold rounded-full px-8 h-14 text-base">
                    ดูคำแนะนำ
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="order-1 md:order-2 relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E8A0BF]/20 to-[#FFDDD2]/40 rounded-3xl blur-2xl transform scale-105" />
                <img
                  src={HERO_IMG}
                  alt="PWV Pulse Wave Velocity Illustration"
                  className="relative w-full rounded-3xl shadow-2xl shadow-[#E8A0BF]/20"
                />
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 md:-left-8 bg-white rounded-2xl p-4 shadow-xl shadow-[#E8A0BF]/15 border border-[#FFDDD2]"
                >
                  <div className="flex items-center gap-3">
                    <img src={HEART_ICON} alt="Heart" className="w-12 h-12" />
                    <div>
                      <div className="font-mono text-2xl font-bold text-[#BA2D65]">6.2</div>
                      <div className="text-xs text-[#6B4C5A] font-body">m/s — Normal</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#3D1C2A] mb-4">
              ฟีเจอร์หลัก
            </h2>
            <p className="text-[#6B4C5A] font-body text-lg max-w-xl mx-auto">
              ระบบวัดค่า PWV ที่ครบครัน ใช้งานง่าย ออกแบบมาสำหรับ iPad
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "เรียลไทม์",
                desc: "แสดงผลคลื่นชีพจรและค่า PWV แบบ real-time ผ่าน WebSocket เชื่อมต่อกับ ESP32 โดยตรง",
                color: "from-[#FFB7C5] to-[#E8A0BF]",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "วิเคราะห์ความเสี่ยง",
                desc: "ประเมินระดับความเสี่ยงหลอดเลือดแข็งตัวอัตโนมัติ ตามเกณฑ์มาตรฐาน ESH/ESC 2018",
                color: "from-[#E8A0BF] to-[#D48EAD]",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "รายงาน PDF",
                desc: "ส่งออกรายงานผลการวัดเป็น PDF พร้อมกราฟ ตารางบันทึก และข้อมูลอ้างอิงทางการแพทย์",
                color: "from-[#D48EAD] to-[#BA2D65]",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group bg-white rounded-2xl p-7 border border-[#FFDDD2]/80 shadow-sm hover:shadow-xl hover:shadow-[#E8A0BF]/15 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 shadow-lg shadow-[#E8A0BF]/25 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-[#3D1C2A] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#6B4C5A] font-body leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reference Ranges Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent to-[#FFDDD2]/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#3D1C2A] mb-4">
              ค่าอ้างอิง PWV
            </h2>
            <p className="text-[#6B4C5A] font-body text-lg max-w-xl mx-auto">
              เกณฑ์การประเมินตามมาตรฐาน ESH/ESC 2018
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                range: "< 7 m/s",
                label: "Normal",
                labelTh: "ปกติ",
                desc: "หลอดเลือดยืดหยุ่นดี ความเสี่ยง cardiovascular ต่ำ",
                color: "#2ECC71",
                bg: "bg-emerald-50",
                border: "border-emerald-200",
              },
              {
                range: "7 — 10 m/s",
                label: "Borderline",
                labelTh: "เฝ้าระวัง",
                desc: "หลอดเลือดเริ่มแข็งตัว ควรติดตามและปรับพฤติกรรม",
                color: "#F39C12",
                bg: "bg-amber-50",
                border: "border-amber-200",
              },
              {
                range: "> 10 m/s",
                label: "High Risk",
                labelTh: "เสี่ยงสูง",
                desc: "หลอดเลือดแข็งตัวมาก เสี่ยงสูง ควรพบแพทย์",
                color: "#E74C3C",
                bg: "bg-red-50",
                border: "border-red-200",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`${item.bg} ${item.border} border-2 rounded-2xl p-6 text-center`}
              >
                <div
                  className="font-mono text-3xl font-bold mb-2"
                  style={{ color: item.color }}
                >
                  {item.range}
                </div>
                <div
                  className="font-display text-lg font-bold mb-1"
                  style={{ color: item.color }}
                >
                  {item.label}
                </div>
                <div className="text-sm text-[#6B4C5A] font-body font-semibold mb-3">
                  {item.labelTh}
                </div>
                <p className="text-sm text-[#6B4C5A] font-body leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden bg-gradient-to-br from-[#E8A0BF] to-[#BA2D65] rounded-3xl p-10 md:p-16 text-center"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                พร้อมเริ่มวัดค่า PWV แล้วหรือยัง?
              </h2>
              <p className="text-white/80 font-body text-lg mb-8 max-w-lg mx-auto">
                เชื่อมต่อ ESP32 ของคุณผ่าน WiFi แล้วเริ่มวัดค่าความยืดหยุ่นหลอดเลือดได้ทันที
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/monitor">
                  <Button size="lg" className="bg-white text-[#BA2D65] hover:bg-white/90 font-body font-bold rounded-full px-8 h-14 text-base shadow-xl">
                    <Activity className="w-5 h-5 mr-2" />
                    เปิด Monitor
                  </Button>
                </Link>
                <Link href="/guide">
                  <Button size="lg" variant="outline" className="border-2 border-white/40 text-white hover:bg-white/10 font-body font-bold rounded-full px-8 h-14 text-base">
                    อ่านคำแนะนำก่อน
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
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
