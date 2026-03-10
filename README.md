# APP PLAKA TESPİT - Yapay Zeka Destekli Plaka Analiz Sistemi

Bu uygulama, Türkiye'deki araç plakalarının resmi standartlara (TŞOF ve EGM mevzuatına) uygunluğunu analiz etmek için geliştirilmiş, profesyonel bir yapay zeka aracıdır.

## 🚀 Özellikler

- **Yapay Zeka Analizi:** Google Gemini Multimodal motoru kullanılarak plaka üzerindeki font, karakter aralığı ve çerçeve yapısı incelenir.
- **APP Tespiti:** Standart dışı (Avrupa Pres Plaka - APP) plakaları yüksek doğrulukla tespit eder.
- **Teknik Detaylar:** Font kalınlığı, karakterlerin birbirine olan mesafesi ve plaka çerçevesi gibi teknik parametreler hakkında detaylı bilgi sunar.
- **Modern Arayüz:** Aydınlık, ferah ve kullanıcı dostu modern bir tasarım.
- **Resmi Mevzuat Bilgilendirmesi:** Emniyet Genel Müdürlüğü'nün güncel duyurularını ve yasal gereklilikleri içeren rehber bölümü.
- **Mobil Uyumluluk:** Tüm cihazlarda sorunsuz çalışan duyarlı (responsive) yapı.

## 🛠️ Teknoloji Yığını

- **Frontend:** React 18+, Vite
- **Styling:** Tailwind CSS
- **Animasyonlar:** Framer Motion (motion/react)
- **İkonlar:** Lucide React
- **AI Engine:** Google Gemini API (@google/genai)

## 📖 Kullanım

1. Uygulama ana sayfasındaki görsel yükleme alanına plaka fotoğrafını yükleyin veya sürükleyin.
2. Yapay zeka görseli saniyeler içinde analiz eder.
3. Sonuç ekranında plakanın **Standart** mı yoksa **APP** mi olduğu, güven oranıyla birlikte gösterilir.
4. Teknik özet kısmından analizin nedenlerini inceleyebilirsiniz.

## ⚖️ Yasal Uyarı

Bu uygulama yalnızca bilgilendirme ve rehberlik amaçlıdır. Yapay zeka sonuçları her zaman %100 doğruluk garanti etmeyebilir. Resmi plaka kontrolü ve yasal işlemler için her zaman yetkili kurumlara (Emniyet Genel Müdürlüğü, Noterler, TŞOF) başvurulmalıdır.

## 🛠️ Kurulum ve Geliştirme

Projeyi yerel ortamınızda çalıştırmak için:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Üretim için derleyin
npm run build
```

---
*Bu proje Google AI Studio ortamında geliştirilmiştir.*
