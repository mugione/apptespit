# APP PLAKA TESPİT - Yapay Zeka Destekli Plaka Analiz Sistemi

Bu uygulama, Türkiye'deki araç plakalarının resmi standartlara (TŞOF ve EGM mevzuatına) uygunluğunu analiz etmek için geliştirilmiş, profesyonel bir yapay zeka aracıdır.

## 🌟 Amme Hizmeti ve Projenin Amacı

Bu proje, son dönemlerde artan plaka denetimleri, standart dışı font kullanımı ve buna bağlı olarak vatandaşlarımızın yaşadığı mağduriyetleri (cezalar, muayene tekrarları vb.) azaltmak amacıyla tamamen **bir amme hizmeti (kamu yararı)** olarak geliştirilmiştir. 

Amacımız, araç sahiplerinin plakalarının yasal standartlara uygun olup olmadığını saniyeler içinde, hiçbir ücret ödemeden kontrol edebilmelerini sağlamaktır.

## 🚀 Özellikler

- **Görsel Doğrulama:** Yüklenen görselin gerçekten bir araç plakası olup olmadığını otomatik olarak tespit eder; plaka dışı görsellerde kullanıcıyı uyarır.
- **Kamera Desteği:** Mobil cihazlarda doğrudan kamera üzerinden plaka fotoğrafı çekme ve analiz etme özelliği.
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

## 🔑 Gemini API Kurulumu

Bu uygulamayı kendi ortamınızda çalıştırmak için bir Google Gemini API anahtarına ihtiyacınız vardır:

1. [Google AI Studio](https://aistudio.google.com/) adresine gidin ve ücretsiz bir API anahtarı oluşturun.
2. Projenin kök dizininde `.env` dosyası oluşturun (veya mevcut olanı kullanın).
3. Aşağıdaki satırı ekleyin:
   ```env
   GEMINI_API_KEY=SİZİN_API_ANAHTARINIZ
   ```
4. Uygulama bu anahtarı kullanarak analizleri gerçekleştirecektir.

## 📖 Kullanım

1. Uygulama ana sayfasındaki görsel yükleme alanına plaka fotoğrafını yükleyin, sürükleyin veya **kamera butonuna** tıklayarak anlık fotoğraf çekin.
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
