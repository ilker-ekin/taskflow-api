# TaskFlow — Görev ve Proje Yönetim Sistemi API

**Proje Tanıtım Dokümanı**
Geliştirici: İlker Ekin Erdoğdu · TNC Group Node.js Backend Eğitimi Bitirme Projesi

## 1. Projenin Amacı

TaskFlow, ekiplerin iş takibini tek bir merkezden yapabilmesi için geliştirilmiş bir REST API'dir. Amaç; görevlerin kayıt altına alınması, doğru çalışana atanması, ilerleme durumunun izlenmesi ve önceliklerin net biçimde belirlenmesidir. API, herhangi bir web veya mobil arayüzün kullanabileceği sade ve tutarlı bir JSON arayüzü sunar.

## 2. Senaryo

Bir yazılım şirketi; görevlerini, projelerini ve çalışan sorumluluklarını takip etmek istemektedir. Proje yöneticisi yeni bir iş çıktığında görev oluşturur, görevi bir çalışana atar ve önceliğini belirler. Çalışanlar görevlerde ilerledikçe durumu `pending` (bekliyor) → `in-progress` (devam ediyor) → `completed` (tamamlandı) şeklinde günceller. Yönetici, yüksek öncelikli veya tamamlanan görevleri filtreleyerek görebilir ve özet raporla ekibin genel durumunu takip eder.

## 3. Sistem Özeti

- **Mimari:** Node.js + Express 5 ile katmanlı yapı. İstek sırasıyla şu katmanlardan geçer:
  `logger` → `express.json()` → **route** (Express Router) → doğrulama middleware'i → **controller** → **service** → JSON dosyası.
- **Veri saklama:** Görevler `data/tasks.json` dosyasında tutulur. Dosya yoksa ilk çalıştırmada örnek verilerden (`data/tasks.seed.json`) oluşturulur. Yazma işlemi önce geçici dosyaya yapılıp ardından yeniden adlandırıldığı için dosya yarım kalmaz.
- **Logger:** Her isteğin method, endpoint ve zaman damgası (ayrıca durum kodu ve süre) konsola ve `logs/requests.log` dosyasına yazılır.
- **Doğrulama (⭐ ekstra):** Hatalı veya eksik alanlarda 400 durum kodu ve Türkçe, alan bazlı hata mesajları döner.
- **Hata yönetimi:** Bulunamayan görev ve adresler için 404, bozuk JSON için 400, beklenmeyen hatalar için 500 döner. Merkezi hata yöneticisi istemciye hiçbir zaman stack trace göndermez.
- **Filtreleme ve raporlama (⭐ ekstra):** Görevler durum ve önceliğe göre filtrelenebilir; tamamlanan, bekleyen ve özet raporlar alınabilir.

## 4. Veri Modeli

Sistemdeki temel varlık **Görev (Task)**'tir. Çalışan bilgisi görev üzerinde `assignee` alanında tutulur.

| Alan | Tip | Kural | Açıklama |
|---|---|---|---|
| `id` | string (UUID) | Sunucu atar | Görevin benzersiz kimliği |
| `title` | string | Zorunlu, 3–120 karakter | Görev başlığı |
| `description` | string | İsteğe bağlı, ≤1000 karakter, varsayılan `""` | Görev açıklaması |
| `status` | `pending` \| `in-progress` \| `completed` | Varsayılan `pending` | Görevin durumu |
| `priority` | `low` \| `medium` \| `high` | Varsayılan `medium` | Görevin önceliği |
| `assignee` | string | Zorunlu, 2–50 karakter | Görevin atandığı çalışan |
| `createdAt` | ISO tarih | Sunucu atar | Oluşturulma zamanı |
| `updatedAt` | ISO tarih | Sunucu atar | Son güncellenme zamanı |

Örnek görev:

```json
{
  "id": "8a2d4e6f-1c3b-4a5d-8e7f-9a0b1c2d3e02",
  "title": "Veritabanı yedekleme betiği yaz",
  "description": "Her gece 02:00'de çalışacak otomatik yedekleme betiğini hazırla.",
  "status": "in-progress",
  "priority": "high",
  "assignee": "Mehmet Kaya",
  "createdAt": "2026-09-03T10:15:00.000Z",
  "updatedAt": "2026-09-10T08:45:00.000Z"
}
```

## 5. API Tasarımı — Endpoint Listesi

| Method | Endpoint | Açıklama | Yanıt |
|---|---|---|---|
| POST | `/tasks` | Görev ekleme | 201 + oluşturulan görev / 400 |
| GET | `/tasks` | Tüm görevleri listeleme | 200 + görev dizisi |
| GET | `/tasks/:id` | Görev detayı | 200 / 404 |
| PUT | `/tasks/:id` | Görev güncelleme (title, description, status, priority, assignee) | 200 / 400 / 404 |
| DELETE | `/tasks/:id` | Görev silme | 200 + `{ message }` / 404 |
| GET | `/tasks?status=completed` | ⭐ Duruma göre filtreleme | 200 |
| GET | `/tasks?priority=high` | ⭐ Önceliğe göre filtreleme (status ile birlikte kullanılabilir) | 200 |
| GET | `/reports/completed` | ⭐ Tamamlanan görevler raporu | 200 + `{ count, tasks }` |
| GET | `/reports/pending` | ⭐ Bekleyen görevler raporu | 200 + `{ count, tasks }` |
| GET | `/reports/summary` | ⭐ Duruma ve önceliğe göre sayılar, toplam | 200 |

Hata yanıtları `{ "error": "Türkçe açıklayıcı mesaj" }` biçimindedir; doğrulama hatalarında ek olarak `details` dizisi döner.

## 6. Klasör Yapısı

```
src/
  app.js            Express uygulaması (middleware'ler, route'lar, 404, hata yöneticisi)
  server.js         Sunucuyu başlatır
  routes/           Endpoint tanımları (Express Router)
  controllers/      İstek/yanıt işlemleri
  services/         İş mantığı ve JSON dosyası okuma/yazma
  middlewares/      logger, validateTask, notFound, errorHandler
data/               Görev verileri
postman/            Postman koleksiyonu
docs/               Tanıtım dokümanı ve ekran görüntüleri
```

## 7. Test

Tüm endpoint'ler Postman ile test edilmiştir. Koleksiyon `postman/TaskFlow.postman_collection.json` dosyasındadır; ekran görüntüleri `docs/screenshots/` klasöründedir. Kurulum ve kullanım adımları için [README.md](../README.md) dosyasına bakınız.
