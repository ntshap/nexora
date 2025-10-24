# NEXORA Pitch Deck (PDF Outline)

This outline maps directly to the hackathon submission requirements. Each slide includes suggested talking points and data sources so the content can be exported to Keynote, Google Slides, or Marp for PDF delivery.

## Slide 1 - Judul & Tagline
- Branding: NEXORA - *DeFi co-pilot untuk kreator mandiri*.
- Hero message: "Bangun passive income transparan tanpa kehilangan kendali atas aset Anda."
- Include logo (`docs/logo.png`) and Sepolia network badge.

## Slide 2 - Masalah
- Kreator memiliki arus kas tidak menentu; sulit mengatur alokasi crypto.
- Platform DeFi existing terlalu teknis, minim panduan risiko, dan sering kental custodial.
- Dampak: saldo idle, kehilangan peluang yield, kekhawatiran atas keamanan.

## Slide 3 - Solusi
- NEXORA menggabungkan profil risiko personal, vault ERC-4626 non-kustodial, dan analitik realtime.
- UI terkurasi untuk kreator: rekomendasi plan konservatif/balanced/growth dalam sekali klik.
- Sepolia testnet saat ini -> siap scale ke mainnet setelah audit.

## Slide 4 - Produk (Demo Highlight)
- Tangkapan layar dashboard (`apps/web/src/pages/dashboard.tsx`) dengan callout fitur.
- Alur pengguna: connect wallet -> isi profil risiko -> terima rekomendasi -> deposit.
- Statistik MVP: 3 rencana investasi, 1 vault aktif, respon API < 100 ms (lab tests).

## Slide 5 - Nilai untuk Kreator
- Transparansi penuh: dana tersimpan di wallet sendiri.
- Bahasa visual: copywriting dan CTA disusun khusus pekerja kreatif.
- Insight: estimasi APY, distribusi strategi, histori transaksi.

## Slide 6 - Model Bisnis
- Freemium dashboard (gratis) untuk entry users.
- **Pendapatan**: fee 1.5% dari yield vault, white-label untuk komunitas DAO kreatif, API premium untuk manajer kolektif.
- Tokenomics on hold sampai skala teruji; fokus trust & compliance terlebih dahulu.

## Slide 7 - Strategi Adopsi & Ekosistem
- Community partnerships dengan label indie, studio desain, marketplace NFT lokal.
- Konten edukasi bulanan + program referal "Creator Circle".
- Integrasi roadmap: The Graph untuk histori, Safe multisig untuk DAO treasury, kolaborasi OJK x Ekraf.

## Slide 8 - Arsitektur Teknis
- Ringkas diagram dari `docs/hackathon/technical-diagram.md`.
- Sorot modul: Next.js (SSR off, React Query), FastAPI (plan engine, portfolio), Foundry contracts, `@nexora/sdk`.
- Highlight keamanan: ERC-4626 pausability, backend validation, non-custodial design.

## Slide 9 - Roadmap
- Gunakan fase dari `docs/hackathon/roadmap.md` (Phase 1-4).
- Tekankan deliverables nyata: integrasi on-chain riil, pipeline CI/CD, mainnet launch.

## Slide 10 - Traction & KPI Target
- Target 3 pilot komunitas kreator -> 5k MAU dalam 6 bulan.
- KPI: jumlah wallet connect, TVL Sepolia, retention weekly.
- Sorot feedback awal (contoh kutipan persona dari PRD).

## Slide 11 - Tim & Peran
- Profil singkat core team: Frontend, Backend, Solidity, Growth (gunakan nama/handle).
- Advisor opsional: compliance, ekosistem kreatif.
- Tunjukkan pengalaman sebelumnya (hackathon, DeFi projects).

## Slide 12 - Kebutuhan & Call-to-Action
- Kebutuhan: akses mentor compliance, audit partner, grant ekosistem.
- Ajakan: "Uji coba beta tertutup" + QR menuju formulir waitlist (Google Form/Typeform).
- Kontak email, sosial (@nexora.xyz) dan link repo GitHub.

### Catatan Produksi
- Format ratio 16:9, minimal teks per slide, gunakan gradient hero brand (#6358FF -> #8A3FFC).
- Setelah deck final, ekspor ke PDF dan unggah sesuai instruksi panitia.
- Lampirkan demo URL dan repositori GitHub di slide CTA serta halaman pengumpulan.
