# Directus Kurulum ve Yapılandırma Rehberi

## 1. Directus'u Başlatma

### Docker ile Başlatma

```bash
# Directus ve PostgreSQL'i başlat
docker-compose up -d

# Logları kontrol et
docker-compose logs -f directus
```

Directus paneline erişin: http://localhost:8055

**Varsayılan Giriş Bilgileri:**
- Email: `admin@meliscribe.com`
- Şifre: `admin123`

⚠️ **ÖNEMLİ**: İlk girişten sonra şifrenizi mutlaka değiştirin!

## 2. Koleksiyon Oluşturma

### `transcriptions` Koleksiyonu

1. Directus panelinde **Settings** → **Data Model** → **Create Collection**
2. Collection Name: `transcriptions`
3. Primary Key Field: `id` (UUID, Auto-generate)

#### Alanları Ekleyin:

**status** (Dropdown)
- Type: Dropdown
- Options:
  - `uploaded` (Yüklendi)
  - `processing` (İşleniyor)
  - `completed` (Tamamlandı)
  - `error` (Hata)
- Default: `uploaded`
- Required: Yes

**user** (Many-to-One Relationship)
- Type: Many-to-One
- Related Collection: `directus_users`
- Field Name: `user`

**audio_file** (File)
- Type: File
- Related Collection: `directus_files`
- Field Name: `audio_file`
- Required: Yes

**title** (String)
- Type: String
- Field Name: `title`
- Required: Yes
- Interface: Input

**language** (String)
- Type: String
- Field Name: `language`
- Default: `tr`
- Interface: Dropdown
- Options: `tr`, `en`, `de`, `fr`, `es`

**assembly_id** (String)
- Type: String
- Field Name: `assembly_id`
- Nullable: Yes

**result_text** (Text)
- Type: Text
- Field Name: `result_text`
- Interface: Textarea
- Nullable: Yes

**speaker_data** (JSON)
- Type: JSON
- Field Name: `speaker_data`
- Nullable: Yes

**duration** (Float/Decimal)
- Type: Float
- Field Name: `duration`
- Nullable: Yes

**summary** (Text)
- Type: Text
- Field Name: `summary`
- Interface: Textarea
- Nullable: Yes

**date_created** (Timestamp)
- Type: Timestamp
- Field Name: `date_created`
- Auto-generate: Yes
- Interface: Datetime

## 3. İzinleri Yapılandırma

### Public Role İzinleri

1. **Settings** → **Roles & Permissions** → **Public**
2. `transcriptions` koleksiyonu için:
   - ❌ Create: No
   - ❌ Read: No
   - ❌ Update: No
   - ❌ Delete: No

### Authenticated Users İzinleri

1. **Settings** → **Roles & Permissions** → **Create New Role**
2. Role Name: `User`
3. `transcriptions` koleksiyonu için:
   - ✅ Create: Yes (Sadece kendi kayıtları)
   - ✅ Read: Yes (Sadece kendi kayıtları)
   - ✅ Update: Yes (Sadece kendi kayıtları)
   - ✅ Delete: Yes (Sadece kendi kayıtları)

**Filter Rule** (Her işlem için):
```json
{
  "user": {
    "_eq": "$CURRENT_USER"
  }
}
```

## 4. Directus Flows Kurulumu

### Flow 1: "İşlemi Başlat"

1. **Settings** → **Flows** → **Create Flow**
2. Flow Name: `Start Transcription`
3. Status: Active

#### Trigger: Event Hook
- Type: `Event Hook`
- Scope: `items.create`
- Collections: `transcriptions`

#### Operation 1: Read Data
- Type: `Read Data`
- Collection: `directus_files`
- Filter:
  ```json
  {
    "id": {
      "_eq": "{{$trigger.audio_file}}"
    }
  }
  ```

#### Operation 2: HTTP Request (AssemblyAI)
- Type: `Request URL`
- Method: `POST`
- URL: `https://api.assemblyai.com/v2/transcript`
- Headers:
  ```json
  {
    "Authorization": "YOUR_ASSEMBLYAI_API_KEY",
    "Content-Type": "application/json"
  }
  ```
- Body:
  ```json
  {
    "audio_url": "{{$last.data.full_url}}",
    "speaker_labels": true,
    "language_code": "{{$trigger.language}}",
    "webhook_url": "http://your-domain.com/api/assembly-callback"
  }
  ```

#### Operation 3: Update Data
- Type: `Update Data`
- Collection: `transcriptions`
- Key: `{{$trigger.id}}`
- Payload:
  ```json
  {
    "status": "processing",
    "assembly_id": "{{$last.id}}"
  }
  ```

### Flow 2: "Sonucu Yakala"

⚠️ **NOT**: Bu flow için önce Next.js'te bir API route oluşturmanız gerekir.

1. **Settings** → **Flows** → **Create Flow**
2. Flow Name: `Process Transcription Result`
3. Status: Active

#### Trigger: Webhook
- Type: `Webhook`
- Method: `POST`
- Path: `/assembly-callback`

#### Operation 1: Condition
- Type: `Condition`
- Rule:
  ```json
  {
    "$last.status": {
      "_eq": "completed"
    }
  }
  ```

#### Operation 2: HTTP Request (Get Result)
- Type: `Request URL`
- Method: `GET`
- URL: `https://api.assemblyai.com/v2/transcript/{{$trigger.body.transcript_id}}`
- Headers:
  ```json
  {
    "Authorization": "YOUR_ASSEMBLYAI_API_KEY"
  }
  ```

#### Operation 3: Transform Data
- Type: `Run Script`
- Code:
  ```javascript
  module.exports = async function(data) {
    const result = data.$last;
    const speakers = result.utterances || [];
    
    return {
      result_text: result.text,
      speaker_data: speakers.map(s => ({
        speaker: s.speaker,
        text: s.text,
        start: s.start / 1000,
        end: s.end / 1000
      }))
    };
  }
  ```

#### Operation 4: Update Data
- Type: `Update Data`
- Collection: `transcriptions`
- Filter:
  ```json
  {
    "assembly_id": {
      "_eq": "{{$trigger.body.transcript_id}}"
    }
  }
  ```
- Payload:
  ```json
  {
    "status": "completed",
    "result_text": "{{$last.result_text}}",
    "speaker_data": "{{$last.speaker_data}}"
  }
  ```

## 5. AssemblyAI API Key Alma

1. https://www.assemblyai.com/ adresine gidin
2. Ücretsiz hesap oluşturun
3. Dashboard'dan API Key'inizi kopyalayın
4. Directus Flows'ta `YOUR_ASSEMBLYAI_API_KEY` yerine yapıştırın

## 6. Production Ayarları

### Güvenlik

`docker-compose.yml` dosyasında aşağıdaki değerleri değiştirin:

```yaml
KEY: 'RANDOM-STRONG-KEY-HERE'  # openssl rand -hex 32
SECRET: 'RANDOM-STRONG-SECRET-HERE'  # openssl rand -hex 32
ADMIN_EMAIL: 'your-email@domain.com'
ADMIN_PASSWORD: 'strong-password-here'
```

### CORS

Production domain'inizi ekleyin:

```yaml
CORS_ORIGIN: 'https://yourdomain.com,http://localhost:3000'
PUBLIC_URL: 'https://api.yourdomain.com'
```

### Database Backup

PostgreSQL backup için:

```bash
# Backup oluştur
docker exec meliscribe_postgres pg_dump -U directus directus > backup.sql

# Backup'tan geri yükle
docker exec -i meliscribe_postgres psql -U directus directus < backup.sql
```

## 7. Sorun Giderme

### Directus başlamıyor

```bash
# Logları kontrol et
docker-compose logs directus

# Container'ı yeniden başlat
docker-compose restart directus
```

### Dosya yükleme hatası

1. `directus_uploads` volume'ünün yazma izinleri olduğundan emin olun
2. Directus Settings → Files → Storage'da ayarları kontrol edin

### CORS hatası

1. `CORS_ORIGIN` değerini kontrol edin
2. Frontend URL'ini doğru yazdığınızdan emin olun

## 8. Yardımcı Komutlar

```bash
# Tüm servisleri başlat
docker-compose up -d

# Servisleri durdur
docker-compose down

# Servisleri durdur ve volume'leri sil (DİKKAT: Tüm veri silinir!)
docker-compose down -v

# Logları izle
docker-compose logs -f

# Sadece Directus loglarını izle
docker-compose logs -f directus

# Container'a bağlan
docker exec -it meliscribe_directus sh
```

## 9. Sonraki Adımlar

1. ✅ Directus kurulumunu tamamladınız
2. ✅ Koleksiyonları oluşturdunuz
3. ✅ Flows'ları yapılandırdınız
4. 🔄 Next.js uygulamasını çalıştırın: `npm run dev`
5. 🎉 Uygulamayı test edin!

## Destek

Sorun yaşarsanız:
- Directus Docs: https://docs.directus.io
- AssemblyAI Docs: https://www.assemblyai.com/docs
- GitHub Issues: Proje repository'sinde issue açın
