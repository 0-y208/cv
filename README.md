```markdown
# Digital Canvas — Single Page Portfolio (Modern Gallery / Digital Canvas)

Perubahan terbaru:
- Menambahkan foto profil (lazy-loaded dengan skeleton).
- Memperluas bagian "Tentang saya" dengan paragraf deskriptif dan kontak singkat.
- Menambahkan daftar kemampuan (skills) yang lebih lengkap.
- Menambahkan alamat lengkap dalam elemen <address> (gunakan placeholder—ubah sesuai info Anda).
- Menambahkan ikon dan link sosial: WhatsApp, Instagram, TikTok, YouTube (header, contact side, footer).
- Ikon SVG inline, hover menonjol menggunakan warna aksen.
- Semua gambar profil & proyek menggunakan mekanisme lazy-loading yang sudah ada.

Files updated:
- index.html — markup tambahan untuk profil, alamat, social icons.
- styles.css — gaya untuk profil, social buttons, address.
- app.js — memastikan lazy-loading dan safety rel noopener; sosial membuka di tab baru; perilaku mikro-interaksi tetap aktif.
- README.md — ringkasan perubahan.

Catatan cepat:
- Ganti placeholder alamat, nama, email, dan nomor WhatsApp di index.html dengan data asli Anda.
- Untuk hasil terbaik di produksi: sediakan gambar profil dan aset yang dioptimalkan (WebP / resized), dan tambahkan srcset untuk responsive.
- Jika mau, saya bisa mengganti placeholder dengan data yang Anda berikan, menambahkan srcset/WebP otomatis, atau mengintegrasikan file ke repo dan menyiapkan build pipeline.

```