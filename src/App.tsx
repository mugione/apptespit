import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Sparkles, Image as ImageIcon, X, Loader2, ShieldCheck, ShieldAlert, Info, Gauge, HelpCircle, ExternalLink, Camera } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface AnalysisResult {
  isLicensePlate: boolean;
  isAppPlate: boolean;
  probability: number;
  reason: string;
  details: {
    fontThickness: string;
    spacing: string;
    borderStyle: string;
  };
}

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const ai = new GoogleGenAI({ 
    apiKey: (import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '') as string 
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const base64Data = image.split(',')[1];
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
              { text: "Görseli analiz et. Önce bu görselin bir araç plakası olup olmadığını tespit et (isLicensePlate). Eğer bir plaka ise, Türkiye standartlarına göre analiz et. Plakanın 'APP' (Avrupa Pres Plaka - kalın fontlu, genellikle yasal olmayan) olup olmadığını tespit et. Karakter kalınlığı, font tipi, mavi TR şeridi ve çerçeve yapısını incele. Eğer görsel bir plaka değilse, isLicensePlate değerini false yap ve diğer alanları buna göre doldur. Yanıtı tamamen Türkçe ve JSON formatında ver." }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isLicensePlate: { type: Type.BOOLEAN, description: "Görsel bir araç plakası mı?" },
              isAppPlate: { type: Type.BOOLEAN, description: "Plaka APP mi?" },
              probability: { type: Type.NUMBER, description: "APP olma olasılığı yüzdesi (0-100)" },
              reason: { type: Type.STRING, description: "Kısa teknik özet (Türkçe)" },
              details: {
                type: Type.OBJECT,
                properties: {
                  fontThickness: { type: Type.STRING, description: "Font kalınlığı analizi (Türkçe)" },
                  spacing: { type: Type.STRING, description: "Karakter aralığı analizi (Türkçe)" },
                  borderStyle: { type: Type.STRING, description: "Çerçeve yapısı analizi (Türkçe)" }
                },
                required: ["fontThickness", "spacing", "borderStyle"]
              }
            },
            required: ["isLicensePlate", "isAppPlate", "probability", "reason", "details"]
          }
        }
      });

      const data = JSON.parse(response.text);
      setResult(data);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.message?.toLowerCase() || '';
      
      if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
        setErrorMsg("API limitleri doldu. Lütfen 1-2 dakika bekleyip tekrar deneyin. Eğer günlük limite ulaşıldıysa, kotalar yarın sıfırlanacaktır.");
      } else {
        setErrorMsg("Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clear = () => {
    setImage(null);
    setResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-orange-500/10 overflow-x-hidden">
      {/* Arka Plan Efektleri */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-500/5 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[140px] rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-4 sm:py-8 lg:py-12 max-w-7xl">
        <header className="mb-8 sm:mb-12 lg:mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white border border-slate-200 mb-6 sm:mb-8 shadow-sm"
          >
            <Gauge className="w-3.5 h-3.5 sm:w-4 h-4 text-orange-500" />
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">Yapay Zeka Görsel Analizi</span>
          </motion.div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-2 sm:mb-4 leading-none text-slate-900">
            APP PLAKA <span className="text-orange-500">KONTROL</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-lg lg:text-xl font-light px-2 sm:px-4">
            Türkiye plaka standartlarına göre font ve karakter analizi yapan profesyonel yapay zeka tespit sistemi.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Sol Panel: Kontroller */}
          <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 lg:sticky lg:top-24">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 shadow-sm"
              >
                <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium leading-relaxed">
                  {errorMsg}
                </p>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`relative aspect-[4/3] sm:aspect-video lg:aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem] border-2 border-dashed transition-all duration-700 overflow-hidden group shadow-xl ${
                image ? 'border-orange-500/40 bg-orange-500/5' : 'border-slate-200 bg-white hover:border-orange-500/30'
              }`}
            >
              {!image ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <div className="flex gap-4 mb-6">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-slate-100 cursor-pointer shadow-sm hover:bg-white"
                    >
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                    </div>
                    <div 
                      onClick={() => cameraInputRef.current?.click()}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-orange-100 cursor-pointer shadow-sm hover:bg-white"
                    >
                      <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                    </div>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-slate-600">Görseli Yükleyin veya Çekin</p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">Dosya seçin veya kamerayı kullanın</p>
                </div>
              ) : (
                <>
                  <img src={image} alt="Yüklenen plaka görseli" className="w-full h-full object-contain p-4" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button onClick={clear} aria-label="Görseli temizle" className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 hover:bg-red-500 hover:text-white transition-colors z-20 shadow-lg text-slate-400">
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" aria-label="Dosya yükle" />
              <input type="file" ref={cameraInputRef} onChange={handleImageUpload} accept="image/*" capture="environment" className="hidden" aria-label="Kamera ile fotoğraf çek" />
            </motion.div>

            {image && (
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="w-full py-5 sm:py-6 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(249,115,22,0.2)] text-sm sm:text-base"
              >
                {isAnalyzing ? <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 animate-spin" /> : <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />}
                {isAnalyzing ? "Analiz Ediliyor..." : "Sistemi Çalıştır"}
              </motion.button>
            )}
          </div>

          {/* Sağ Panel: Analiz Sonuçları */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="h-full bg-white border border-slate-200 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 lg:p-12 flex flex-col shadow-xl"
                >
                  {!result.isLicensePlate ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center mb-6 text-orange-500">
                        <ShieldAlert className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Geçersiz Görsel</h3>
                      <p className="text-slate-500 max-w-sm leading-relaxed mb-8">
                        Yüklediğiniz görsel bir araç plakası olarak tanımlanamadı. Lütfen net bir plaka görseli yükleyerek tekrar deneyin.
                      </p>
                      <button 
                        onClick={clear}
                        aria-label="Yeni görsel yüklemek için mevcut görseli değiştir"
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-colors"
                      >
                        Görseli Değiştir
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center ${result.isAppPlate ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                            {result.isAppPlate ? <ShieldAlert className="w-6 h-6 sm:w-8 sm:h-8" /> : <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />}
                          </div>
                          <div>
                            <h3 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900">
                              {result.isAppPlate ? "APP TESPİTİ" : "STANDART"}
                            </h3>
                            <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Yapay Zeka Analiz Sonucu</p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                          <div className="flex items-center sm:justify-end gap-2 mb-1">
                            <span className={`text-4xl sm:text-6xl font-black leading-none ${result.isAppPlate ? 'text-red-500' : 'text-emerald-500'}`}>
                              %{result.isAppPlate ? result.probability : (100 - result.probability)}
                            </span>
                            <button 
                              onClick={() => setShowInfo(!showInfo)}
                              aria-label="Güven oranı hakkında bilgi"
                              aria-expanded={showInfo}
                              className="text-slate-300 hover:text-slate-500 transition-colors p-1"
                            >
                              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                          <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black">Güven Oranı</p>
                        </div>
                      </div>

                      {/* Bilgi Kutusu */}
                      <AnimatePresence>
                        {showInfo && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-8"
                          >
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 leading-relaxed">
                              <p className="font-bold text-slate-900 mb-2 uppercase tracking-widest">Güven Oranı Nedir?</p>
                              Bu yüzde, yapay zekanın plakanın mevcut durumuna dair ne kadar emin olduğunu gösterir. 
                              <br /><br />
                              Plaka <strong>APP</strong> olarak tespit edilirse, yüzde APP olma olasılığını; <strong>Standart</strong> olarak tespit edilirse, yüzde standart olma olasılığını temsil eder.
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* İlerleme Çubuğu */}
                      <div className="w-full h-3 sm:h-4 bg-slate-100 rounded-full mb-10 sm:mb-12 overflow-hidden border border-slate-200/50">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.isAppPlate ? result.probability : (100 - result.probability)}%` }}
                          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                          className={`h-full rounded-full ${result.isAppPlate ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`}
                        />
                      </div>

                      <div className="space-y-8 flex-grow">
                        <div>
                          <div className="flex items-center gap-2 mb-4 text-slate-400">
                            <Info className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Teknik Özet</span>
                          </div>
                          <p className="text-xl sm:text-2xl font-light text-slate-700 leading-snug italic">
                            "{result.reason}"
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <DetailCard label="Font Kalınlığı" value={result.details.fontThickness} />
                          <DetailCard label="Karakter Aralığı" value={result.details.spacing} />
                          <DetailCard label="Çerçeve Yapısı" value={result.details.borderStyle} />
                        </div>
                      </div>

                      <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Gemini Multimodal Motoru</span>
                        </div>
                        <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${result.isAppPlate ? 'border-red-500/30 text-red-500 bg-red-50' : 'border-emerald-500/30 text-emerald-500 bg-emerald-50'}`}>
                          {result.isAppPlate ? "Yasal Risk Var" : "Yasal Standart"}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] sm:min-h-[500px] flex flex-col items-center justify-center text-center border border-slate-100 rounded-[2.5rem] bg-white relative overflow-hidden group p-6 shadow-sm">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-50 flex items-center justify-center mb-8 relative z-10 border border-slate-100">
                    <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-slate-200" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-400 relative z-10">Analiz İçin Görsel Bekleniyor</h3>
                  <p className="text-slate-300 max-w-xs mt-4 relative z-10 text-sm sm:text-base">
                    Sistem, plaka üzerindeki mikro detayları incelemek için hazır.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Resmi Duyuru Bölümü */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-24 bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-10 lg:p-16 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest font-black text-blue-600">Resmi Duyuru</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-6">
                Plaka Mevzuatı ve <span className="text-blue-600">Yasal Bilgilendirme</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Emniyet Genel Müdürlüğü tarafından paylaşılan güncel mevzuat bilgilerine göre araç plakalarındaki standartlar ve değişim süreçleri hakkında önemli bilgilendirme.
              </p>
              <a 
                href="https://x.com/EmniyetGM/status/2030400789026582777" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors group"
              >
                Kaynak: Emniyet Genel Müdürlüğü (X)
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
            
            <div className="lg:w-2/3 space-y-8 text-slate-600 text-sm sm:text-base leading-relaxed">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="font-medium text-slate-900 mb-4">
                  Türkiye’de kullanılmakta olan standart plakalar, TŞOF tarafından basılan ve üzerinde mühür ile birlikte diğer güvenlik özellikleri bulunan plakalar olup herhangi bir değişim zorunluluğu bulunmamaktadır.
                </p>
                <p className="text-slate-500 italic text-sm">
                  Ancak aşağıdaki durumlarda plaka değişimi veya yeniden basımı gerekmektedir:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                    APP (Standart Dışı) Kullanımı
                  </h4>
                  <p className="text-slate-500 text-sm">
                    Standart ölçülere uygun olmayan, üzerinde mühür ve güvenlik özellikleri bulunmayan plakaların kullanımı yasaktır. Bu durumda:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-500 list-disc pl-4">
                    <li>Polis/Jandarma birimlerine kayıp/tespit başvurusu</li>
                    <li>Noter aracılığıyla yeni plaka başvurusu</li>
                    <li>TŞOF yetkili birimlerinde basım süreci</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                    Nitelik ve Ölçü Değişimi
                  </h4>
                  <p className="text-slate-500 text-sm">
                    TŞOF mühürlü plakaların nitelik ve ölçülerinin değiştirilmiş olması durumunda noterden basım talep belgesi alınarak yeniden basım yapılmalıdır.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-6 py-2">
                <p className="text-slate-900 font-bold mb-2">Önemli Hatırlatma:</p>
                <p className="text-slate-500 text-sm">
                  Standart dışı plaka takılı araçlara yönelik denetimler <strong>1 Nisan 2026</strong> tarihine kadar rehberlik amaçlı yapılacak olup, bu tarihten sonra idari para cezası ve trafikten men işlemleri uygulanacaktır.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <footer className="mt-16 sm:mt-24 pb-12 text-center">
          <div className="inline-block px-6 py-3 rounded-2xl bg-slate-100/50 border border-slate-200/60">
            <p className="text-xs sm:text-sm text-slate-600 font-semibold tracking-tight">
              Bu uygulama bilgilendirme amaçlıdır. Resmi işlemler için ilgili kurumlara başvurunuz.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
      <p className="text-[10px] text-slate-400 uppercase font-black mb-2 tracking-widest">{label}</p>
      <p className="text-sm font-medium text-slate-600 leading-tight">{value}</p>
    </div>
  );
}
