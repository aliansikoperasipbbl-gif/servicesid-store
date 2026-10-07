# ServicesId Store — Telegram Store + Admin

Starter production untuk:
- Telegram bot dengan inline menu (minim command `/`)
- Kategori & produk
- Saldo/deposit
- QR payment
- Auto credit setelah webhook payment berstatus PAID
- Admin web dashboard
- Logo/banner/welcome text/theme color
- MongoDB Atlas
- Deploy Vercel

## 1. Kebutuhan
- Node.js 20+
- Akun Telegram + BotFather
- MongoDB Atlas
- Akun Vercel
- Akun/payment API Casaku

## 2. Jalankan lokal
```bash
npm install
copy .env.example .env.local
npm run dev
```
Windows PowerShell:
```powershell
Copy-Item .env.example .env.local
```
Buka http://localhost:3000

## 3. Environment
Isi `.env.local` sesuai `.env.example`.

`ADMIN_TELEGRAM_IDS` adalah ID Telegram admin, bukan username. Dapatkan ID dari bot seperti @userinfobot.

## 4. MongoDB
Buat database di MongoDB Atlas, whitelist IP yang diperlukan, lalu salin connection string ke:
`MONGODB_URI=...`

Kode memakai `mongoose.connect(uri)` tanpa option lama seperti `useNewUrlParser` / `useUnifiedTopology`, jadi menghindari error:
`MongoParseError: option useNewUrlParser is not supported`.

## 5. Telegram webhook
Setelah deploy Vercel:
```text
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://DOMAIN-ANDA/api/telegram
```
Contoh:
```text
https://api.telegram.org/bot123:ABC/setWebhook?url=https://servicesid-store.vercel.app/api/telegram
```

## 6. Casaku
File:
`src/lib/casaku.ts`

dan webhook:
`src/app/api/casaku/webhook/route.ts`

Karena format API Casaku dapat bergantung pada produk/akun/API version, sesuaikan:
- URL create QR
- Authorization header
- request body
- field response QR
- field webhook reference/status
- signature webhook

Di dashboard Casaku, arahkan webhook pembayaran ke:
`https://DOMAIN-ANDA/api/casaku/webhook`

Gunakan secret yang sama dengan `CASAKU_WEBHOOK_SECRET`.

## 7. Deploy Vercel
1. Push folder ini ke GitHub.
2. Vercel > Add New Project > Import repository.
3. Framework: Next.js.
4. Tambahkan semua variable dari `.env.example` ke Vercel Environment Variables.
5. Deploy.
6. Setelah deploy, jalankan setWebhook Telegram.
7. Set webhook Casaku.
8. Buka `https://DOMAIN-ANDA/` untuk admin.

## 8. Domain
`URL_ADMIN` harus berisi URL project Vercel Anda, contoh:
`https://servicesid-store.vercel.app`

Jangan menulis `https://vercel.app/` karena itu hanya domain utama Vercel, bukan URL project Anda.

## 9. Alur deposit
User:
Deposit -> `deposit 25000` -> server membuat invoice/QR Casaku -> user scan -> Casaku callback -> server mencari reference -> status PAID -> saldo user bertambah.

Untuk benar-benar auto-payment, webhook Casaku harus mengirim reference transaksi yang sama.

## 10. Catatan penting
Versi ini adalah fondasi yang aman untuk dikembangkan. Modul fulfillment produk digital masih perlu dihubungkan ke sumber stok Anda bila produk harus dikirim otomatis (misalnya serial/key/account/API provider).
