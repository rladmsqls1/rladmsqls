/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  Heart, 
  Stethoscope, 
  Users, 
  Image as ImageIcon, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  HandHeart,
  Globe,
  Award,
  Droplets,
  Activity,
  Medal,
  Coins,
  GraduationCap,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  FileText,
  Upload,
  Download,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Report {
  name: string;
  url: string;
  id: string;
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchReports();
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('report', file);

    try {
      const response = await fetch('/api/reports/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchReports();
        alert('보고서가 성공적으로 업로드되었습니다.');
      } else {
        alert('업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const menuItems = [
    { name: '소개', href: '#about' },
    { name: '활동내용', href: '#activities' },
    { name: '사진 및 소식', href: '#news' },
    { name: '후원 및 참여', href: '#support' },
    { name: '모금 및 실적', href: '#donation-results' },
    { name: '연락처', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-emerald-800' : 'text-emerald-900'}`}>
              한캄봉사회
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                className="text-sm font-medium hover:text-emerald-600 transition-colors"
              >
                {item.name}
              </a>
            ))}
            <a 
              href="#support" 
              className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all shadow-sm"
            >
              후원하기
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white shadow-xl border-t md:hidden"
            >
              <div className="flex flex-col p-4 gap-4">
                {menuItems.map((item) => (
                  <a 
                    key={item.name} 
                    href={item.href} 
                    className="text-lg font-medium py-2 border-b border-slate-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <a 
                  href="#support" 
                  className="bg-emerald-600 text-white text-center py-3 rounded-xl font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  후원하기
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/cambodia-medical/1920/1080?blur=2" 
            alt="Cambodian Patient Treatment" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-white"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-emerald-700 uppercase bg-emerald-100 rounded-full">
              Korean Community for Service In Cambodia
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Love Of Human Beings <br />
              <span className="text-emerald-600">with CAMBODIA</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              순천향 인간사랑, 캄보디아와 함께
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#about" className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                단체 소개 보기
              </a>
              <a href="#support" className="px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-100 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all">
                후원 참여하기
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Users className="text-emerald-600" />
                한캄봉사회 소개
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  한캄봉사회는 인간 사랑의 순천향 정신을 바탕으로<br className="hidden md:block" />
                  캄보디아 국민이 건강한 삶을 영위하도록 적극적으로 돕는 것이 목적입니다.
                </p>
                <p>
                  캄보디아 국민의 역사적 아픔을 이해하면서, 열악한 의료환경 속에서<br className="hidden md:block" />
                  고통받는 캄보디아 국민의 질병을 치료하고 있습니다.
                </p>
                <p>
                  또한 장기적으로 선진 의료 교육과 함께 더 나은 의료환경을 갖출 수 있도록<br className="hidden md:block" />
                  물심양면으로 지원하고 있습니다.
                </p>
                <p>
                  단순한 일회성 원조를 넘어, 현지 의료 인력 양성과 보건 환경 개선을 통해<br className="hidden md:block" />
                  스스로 자립할 수 있는 기반을 마련하는 데 주력하고 있습니다.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/cambodia-patient-care/800/1000" 
                alt="치료받는 캄보디아 환자와 의료진" 
                className="rounded-3xl shadow-2xl w-full object-cover aspect-[3/4]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 bg-emerald-600 text-white p-8 rounded-3xl shadow-xl hidden lg:block max-w-xs border-4 border-white">
                <p className="italic text-lg font-medium leading-relaxed">
                  "우리는 위대한 일을 할 수 없다.<br />
                  그러나 위대한 사랑으로 작은 일을 할 수 있다."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">주요 활동 내용</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">지속 가능한 변화를 위해 한캄봉사회는 다양한 분야에서 활동하고 있습니다.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Stethoscope className="w-8 h-8" />,
                title: "정기 의료 봉사",
                desc: "매년 정기적으로 의료진을 파견하여 내과, 외과, 치과 등 종합적인 진료와 수술을 지원합니다."
              },
              {
                icon: <HandHeart className="w-8 h-8" />,
                title: "보건 교육 및 위생",
                desc: "현지 주민들을 대상으로 기초 위생 교육과 질병 예방 캠페인을 실시하여 보건 인식을 개선합니다."
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "현지 의료인 양성",
                desc: "캄보디아 현지 의대생 및 간호 인력에게 장학금을 지원하고 한국 연수 기회를 제공합니다."
              }
            ].map((activity, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  {activity.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{activity.title}</h3>
                <p className="text-slate-600 leading-relaxed">{activity.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="text-emerald-600 w-6 h-6" />
              <h3 className="text-2xl font-bold">주요 활동 통계 (2002-2022)</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">1,029명</div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">누적 회원수</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Stethoscope className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">37,562건</div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">누적 진료</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Activity className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">858건</div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">누적 수술</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Globe className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">18회</div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">현지의료봉사</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">71명</div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">의료진 연수</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Heart className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">35명</div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">심장병 초청수술</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">12,788명</div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">결핵 퇴치 지원</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Droplets className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">3개</div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">우물 완공</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Medal className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">11회</div>
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">정부 훈장 수훈</div>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-3xl border border-emerald-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <Coins className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">37.1억원</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">누적 주요 사업비</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-3xl border border-emerald-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  <HandHeart className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">9.3억원</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">누적 후원금</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News/Photos Section */}
      <section id="news" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">사진 및 소식</h2>
              <p className="text-slate-500">현장의 생생한 감동을 전해드립니다.</p>
            </div>
            <button className="text-emerald-600 font-semibold flex items-center gap-1 hover:underline">
              전체보기 <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-video">
                  <img 
                    src={`https://picsum.photos/seed/news${i}/600/400`} 
                    alt="News" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-xs text-emerald-600 font-bold mb-2 uppercase tracking-wider">2024.02.15</div>
                <h3 className="text-lg font-bold group-hover:text-emerald-600 transition-colors">제 42차 캄보디아 프놈펜 의료 봉사 현장</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-24 bg-emerald-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Award className="w-full h-full" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-6">여러분의 후원이 <br />큰 기적을 만듭니다</h2>
            <p className="text-emerald-100 text-lg mb-10 leading-relaxed">
              한캄봉사회의 모든 활동은 후원자 여러분의 소중한 정성으로 이루어집니다. 
              커피 한 잔의 여유를 캄보디아 아이들의 건강한 미소로 바꿔주세요.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <h4 className="font-bold text-xl mb-2">정기 후원</h4>
                <p className="text-emerald-200 text-sm">매월 일정 금액으로 지속적인 봉사 활동을 지원합니다.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <h4 className="font-bold text-xl mb-2">일시 후원</h4>
                <p className="text-emerald-200 text-sm">특별한 날, 소중한 마음을 일시적으로 전하실 수 있습니다.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-emerald-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl">
                온라인 후원 신청
              </button>
              <div className="flex items-center gap-3 px-6 py-4 bg-emerald-800/50 rounded-2xl border border-emerald-700">
                <span className="text-emerald-200 text-sm font-medium">후원 계좌:</span>
                <span className="font-bold">신한은행 100-035-441346 (예금주 : 한캄봉사회)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Results Section */}
      <section id="donation-results" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">기부금 모금액 및 활용실적</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">투명한 운영과 성실한 보고를 통해 후원자님의 소중한 마음을 정직하게 전달합니다.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Utilization Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-8">
                <PieChartIcon className="text-emerald-600 w-6 h-6" />
                <h3 className="text-xl font-bold">주요 사업비 활용 실적</h3>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: '의료봉사', value: 1489480151 },
                        { name: '의사연수', value: 888712190 },
                        { name: '의료기관 지원', value: 832177200 },
                        { name: '심장병 수술', value: 444487725 },
                        { name: '결핵 퇴치', value: 54864000 },
                        { name: '우물 개발', value: 6240000 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        '#059669', // emerald-600
                        '#10b981', // emerald-500
                        '#34d399', // emerald-400
                        '#6ee7b7', // emerald-300
                        '#a7f3d0', // emerald-200
                        '#d1fae5', // emerald-100
                      ].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">총 주요 사업비 (누적)</span>
                  <span className="text-2xl font-bold text-emerald-600">3,715,961,266원</span>
                </div>
              </div>
            </div>

            {/* Donation Summary */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="text-emerald-600 w-6 h-6" />
                  <h3 className="text-xl font-bold">기부금 모금 현황</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">누적 후원금액</span>
                      <span className="font-bold text-slate-900">937,090,888원</span>
                    </div>
                    <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full w-full rounded-full"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-slate-500 mb-1">개인</div>
                      <div className="font-bold text-emerald-600">70%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-500 mb-1">기관</div>
                      <div className="font-bold text-emerald-600">20%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-500 mb-1">단체</div>
                      <div className="font-bold text-emerald-600">10%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-600 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <FileText className="w-32 h-32 -mr-8 -mt-8" />
                </div>
                <h3 className="text-xl font-bold mb-4 relative z-10">투명한 공시 안내</h3>
                <p className="text-emerald-50 mb-6 relative z-10 leading-relaxed">
                  한캄봉사회는 상속세 및 증여세법에 따라 매년 기부금 모금액 및 활용실적을 국세청 홈페이지와 단체 홈페이지에 투명하게 공시하고 있습니다.
                </p>
                
                <div className="flex flex-col gap-3 relative z-10">
                  {reports.length > 0 ? (
                    <div className="space-y-2">
                      {reports.map((report) => (
                        <a 
                          key={report.id}
                          href={report.url}
                          download={report.name}
                          className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all group"
                        >
                          <span className="text-sm font-medium truncate pr-4">{report.name}</span>
                          <Download className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-emerald-200 text-sm italic mb-2">등록된 보고서가 없습니다.</p>
                  )}

                  <div className="pt-4 flex flex-wrap gap-2">
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleUpload}
                      accept=".pdf,.doc,.docx,.hwp"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all flex items-center gap-2"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      보고서 업로드
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white rounded-3xl border border-slate-100 text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">100%</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">사업비 집행률</div>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-slate-100 text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">0원</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">행정 수수료</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-8">연락처 및 오시는 길</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">사무국 주소</h4>
                    <p className="text-slate-600">경기도 부천시 조마루로 170 순천향대학교 부천병원 한캄봉사회 사무국</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <Phone />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">대표 전화</h4>
                    <p className="text-slate-600">032-621-5130, 010-2074-6764 (김은빈 사무국장)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <Mail />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">이메일 문의</h4>
                    <p className="text-slate-600">20130656@schmc.ac.kr</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-100 rounded-3xl overflow-hidden min-h-[400px] relative">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 flex-col gap-2">
                <MapPin className="w-12 h-12" />
                <p className="font-medium">지도가 표시되는 영역입니다</p>
              </div>
              <img 
                src="https://picsum.photos/seed/map/800/600?grayscale" 
                alt="Map Placeholder" 
                className="w-full h-full object-cover opacity-30"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1 rounded-lg">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-white">한캄봉사회</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-white transition-colors">이용약관</a>
              <a href="#" className="hover:text-white transition-colors">이메일무단수집거부</a>
            </div>
          </div>
          
          <div className="text-sm border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between gap-4">
            <p>© 2024 한캄봉사회 (Korea-Cambodia Volunteer Association). All rights reserved.</p>
            <p>고유번호: 130-82-63087 | 대표자: 유병욱</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
