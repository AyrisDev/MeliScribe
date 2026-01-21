# MeliScribe SaaS

**Ses ve video dosyalarınızı metne çevirin** - AssemblyAI altyapısı ile yüksek doğrulukta transkripsiyon, konuşmacı ayrımı ve AI destekli özet çıkarma.

## 🚀 Özellikler

- ✨ **Yüksek Doğrulukta Transkripsiyon**: AssemblyAI altyapısı ile %95+ doğruluk
- 🎯 **Konuşmacı Ayrımı**: Otomatik konuşmacı tanıma ve ayrıştırma (Speaker Diarization)
- 📝 **AI Özet**: Otomatik özet çıkarma
- 🎨 **Modern UI**: Next.js 16 ve Tailwind CSS ile premium tasarım
- 🔐 **Güvenli**: Directus ile kullanıcı yönetimi ve kimlik doğrulama
- 📤 **Kolay Export**: TXT ve SRT formatında dışa aktarım
- 🎵 **Ses Oynatıcı**: Transkripte tıklayarak o anı dinleme (Seek)
- ✏️ **Düzenlenebilir**: Konuşmacı isimlerini düzenleme

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji | Açıklama |
|--------|-----------|----------|
| Frontend | Next.js 16 (App Router) | UI, Server Actions, Modern React |
| Backend / CMS | Directus (Self-Hosted) | Veritabanı, Auth, Dosya Yönetimi, API |
| Otomasyon | Directus Flows | Webhook karşılama, API istekleri (No-Code) |
| Database | PostgreSQL | Directus'un arkasında çalışan veritabanı |
| AI Engine | AssemblyAI | STT (Speech-to-Text) ve Audio Intelligence |
| Deploy | Docker / Coolify | Kendi sunucunda barındırma |

## 📋 Gereksinimler

- Node.js 18+ ve npm
- Docker ve Docker Compose (Directus için)
- AssemblyAI API Key ([buradan alın](https://www.assemblyai.com/))

## 🔧 Kurulum

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd stt
npm install
```

### 2. Directus'u Kurun (Docker ile)

Directus'u Docker ile çalıştırmak için bir `docker-compose.yml` dosyası oluşturun:

```yaml
version: '3'
services:
  directus:
    image: directus/directus:latest
    ports:
      - 8055:8055
    volumes:
      - ./directus/database:/directus/database
      - ./directus/uploads:/directus/uploads
      - ./directus/extensions:/directus/extensions
    environment:
      KEY: 'replace-with-random-value'
      SECRET: 'replace-with-random-value'
      
      DB_CLIENT: 'sqlite3'
      DB_FILENAME: '/directus/database/data.db'
      
      ADMIN_EMAIL: 'admin@example.com'
      ADMIN_PASSWORD: 'admin123'
      
      CORS_ENABLED: 'true'
      CORS_ORIGIN: 'http://localhost:3000'
      
      PUBLIC_URL: 'http://localhost:8055'
```

Directus'u başlatın:

```bash
docker-compose up -d
```

Directus paneline erişin: http://localhost:8055

### 3. Directus Koleksiyonlarını Oluşturun

Directus panelinde (`http://localhost:8055`) aşağıdaki koleksiyonu oluşturun:

#### `transcriptions` Koleksiyonu

| Alan | Tip | Ayarlar |
|------|-----|---------|
| `id` | UUID | Primary Key, Auto-generate |
| `status` | Dropdown | Seçenekler: uploaded, processing, completed, error |
| `user` | Many-to-One | → directus_users |
| `audio_file` | File | → directus_files |
| `title` | String | Required |
| `language` | String | Default: "tr" |
| `assembly_id` | String | Nullable |
| `text_raw` | Text | Nullable |
| `speakers_json` | JSON | Nullable |
| `summary` | Text | Nullable |
| `date_created` | Timestamp | Auto-generate |

### 4. Directus Flows Oluşturun

#### Flow 1: "İşlemi Başlat"

**Trigger**: `transcriptions` koleksiyonuna yeni kayıt eklendiğinde

**Adımlar**:
1. **Read Data**: Yüklenen dosyanın URL'ini al
2. **HTTP Request**: AssemblyAI'a POST isteği
   - URL: `https://api.assemblyai.com/v2/transcript`
   - Headers: `Authorization: YOUR_ASSEMBLYAI_API_KEY`
   - Body:
     ```json
     {
       "audio_url": "{{$trigger.audio_file.data.full_url}}",
       "speaker_labels": true,
       "webhook_url": "http://your-domain.com/api/assembly-callback"
     }
     ```
3. **Update Data**: `assembly_id` ve `status` alanlarını güncelle

#### Flow 2: "Sonucu Yakala"

**Trigger**: Webhook (`/api/assembly-callback`)

**Adımlar**:
1. **HTTP Request**: AssemblyAI'dan sonucu çek
   - URL: `https://api.assemblyai.com/v2/transcript/{{$trigger.body.transcript_id}}`
   - Headers: `Authorization: YOUR_ASSEMBLYAI_API_KEY`
2. **Update Data**: Transkript verisini veritabanına kaydet

### 5. Environment Variables

`.env.local` dosyası oluşturun:

```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
```

### 6. Uygulamayı Çalıştırın

```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 📁 Proje Yapısı

```
stt/
├── app/
│   ├── page.tsx              # Ana sayfa (Landing)
│   ├── login/
│   │   └── page.tsx          # Giriş sayfası
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard
│   ├── upload/
│   │   └── page.tsx          # Dosya yükleme
│   └── project/[id]/
│       └── page.tsx          # Proje detay sayfası
├── components/
│   └── ui/                   # UI bileşenleri
│       ├── button.tsx
│       ├── input.tsx
│       └── card.tsx
├── lib/
│   ├── directus.ts           # Directus SDK ve helper'lar
│   └── utils.ts              # Yardımcı fonksiyonlar
└── docs/
    └── prd                   # Proje gereksinimleri
```

## 🎯 Kullanım

1. **Giriş Yapın**: Directus'ta oluşturduğunuz kullanıcı ile giriş yapın
2. **Dosya Yükleyin**: "Yeni Yükle" butonuna tıklayarak ses/video dosyanızı yükleyin
3. **İşlemi Bekleyin**: AssemblyAI dosyanızı işleyecektir (genellikle dosya uzunluğunun yarısı kadar sürer)
4. **Transkripti Görüntüleyin**: İşlem tamamlandığında transkripti görüntüleyin ve düzenleyin
5. **Export Edin**: TXT veya SRT formatında indirin

## 🔐 Güvenlik

- Directus'un `ADMIN_EMAIL` ve `ADMIN_PASSWORD` değerlerini mutlaka değiştirin
- `KEY` ve `SECRET` değerlerini güçlü rastgele değerlerle değiştirin
- Production ortamında PostgreSQL veya MySQL kullanın (SQLite yerine)
- CORS ayarlarını production domain'inize göre yapılandırın

## 📝 Lisans

MIT

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır!

## 📧 İletişim

Sorularınız için issue açabilirsiniz.
