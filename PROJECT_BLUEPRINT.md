Dokumen Perancangan Proyek: Pelajarin.ai
Versi: 1.0

1. Ringkasan Eksekutif
Pelajarin.ai adalah sebuah platform e-learning cerdas berbasis AI yang dirancang untuk berfungsi sebagai tutor pribadi. Platform ini secara fundamental mengubah cara orang belajar mandiri dengan mengambil topik apa pun yang diajukan pengguna—beserta tingkat keahlian dan tujuan mereka—dan secara otomatis menghasilkan sebuah kurikulum kursus online yang lengkap, terstruktur, dan siap untuk dipelajari.

2. Visi, Misi, Masalah, & Solusi
Visi: Menjadi platform pilihan utama bagi pembelajar mandiri di seluruh dunia, menyediakan jalur belajar yang dipersonalisasi dan efektif untuk subjek apa pun.

Misi: Mendemokratisasi akses terhadap pendidikan terstruktur dengan memanfaatkan kekuatan AI generatif untuk menciptakan pengalaman belajar yang berkualitas dan adaptif.

Masalah yang Dipecahkan:

  1. Kelumpuhan Informasi: Pembelajar mandiri sering kali bingung harus mulai dari mana.
  2. Kurikulum Generik: Kursus online yang ada bersifat "satu untuk semua".
  3. Pembelajaran Pasif: Belajar dengan hanya membaca teks seringkali membosankan.

Solusi Pelajarin.ai:

  1. Struktur Otomatis: Menyediakan peta jalan belajar (silabus) yang logis.
  2. Personalisasi Mendalam: Menghasilkan kurikulum yang disesuaikan dengan tingkat keahlian (pemula, menengah, mahir) dan tujuan pengguna.
  3. Pengalaman Interaktif: Mengintegrasikan konten yang kaya visual dan asesmen interaktif untuk menjaga keterlibatan pengguna.

3. Tumpukan Teknologi (Tech Stack)
  1. Backend: Python 3.11+, FastAPI
  2. Frontend: Next.js (App Router), TypeScript, Tailwind CSS
  3. Database: PostgreSQL
  4. AI Core: Google Gemini API (model gemini-2.5-flash atau pro)
  5. Lingkungan Dev: Docker & Docker Compose

4. Arsitektur & Alur Kerja Sistem End-to-End
  1. Input Pengguna: Pengguna memasukkan Topik, memilih Tingkat Keahlian, dan (opsional) menuliskan Tujuan Spesifik.
  2. Panggilan API: Frontend mengirimkan data ini ke endpoint POST /api/v1/courses.
  3. Validasi Cerdas (Gatekeeper): Backend memanggil Agen AI #1 (Gatekeeper) untuk memvalidasi dan menyempurnakan topik.
  4. Perancangan Kurikulum (Architect): Jika valid, backend memanggil Agen AI #2 (Architect). Agen ini menghasilkan blueprint kurikulum lengkap dalam format JSON, termasuk penempatan untuk kuis (assessment_point) dan ujian (final_assessment).
  5. Penyimpanan Awal: Sistem menyimpan blueprint mentah dan mem-parsing-nya untuk membuat entri di tabel courses, modules, dan sub_topics.
  6. Pekerjaan Latar Belakang (Asynchronous Tasks): Sistem menjadwalkan pekerjaan di latar belakang untuk:
    1. Memanggil Agen AI #3 (Experience Generator) untuk setiap sub-topik guna mengisi konten.
    2. Memanggil Agen AI #4 (Assessment Master) untuk setiap assessment_point dan final_assessment guna membuat soal.
  7. Konsumsi Konten: Pengguna dapat menavigasi kursus, membaca materi, dan mengerjakan kuis/ujian.


5. Agen AI

- Agen #1: The Gatekeeper (Sang Penjaga Gerbang yang Bijak)
  - Persona: Bayangkan seorang dekan universitas yang sangat berpengalaman dan teliti. Dia adalah filter kualitas pertama. Sebelum sebuah ide bisa menjadi kursus di "Pelajarin.ai", ide itu harus lolos dari penilaiannya. Dia tidak akan menyetujui proposal kursus yang ambigu, terlalu luas, atau kurang substansi.
  - Tugas Inti & Filosofi: Tugas utamanya adalah menjaga kualitas input dan memberikan arah awal. Sistem AI yang hebat tidak akan ada artinya jika diberi input "sampah". Gatekeeper mencegah hal ini dengan:
    - Menganalisis Kelayakan: Ia menilai apakah topik yang diajukan memiliki cakupan yang pas untuk sebuah kursus. "Matematika" ditolak karena itu adalah fakultas, bukan kursus. "Sepatu" ditolak karena kurangnya kedalaman akademis.
    - Menyempurnakan & Memfokuskan: Ini adalah tugasnya yang paling krusial. Ia mengambil ide mentah pengguna (misal: "Next.js") dan, dengan mempertimbangkan level keahlian ("pemula"), ia mengubahnya menjadi judul yang jauh lebih spesifik dan terarah (misal: "Dasar-Dasar Next.js untuk Pemula: Pengenalan Rendering dan Routing"). Proses penyempurnaan ini memastikan Agen #2 (Arsitek) menerima instruksi yang sangat jelas.
    - Input: topic (string), difficulty (string), goal (string).
    - Output (JSON):

  ```json
  {
    "is_viable": true,
    "refined_topic": "Dasar-Dasar Next.js untuk Pemula: Pengenalan Rendering dan Routing",
    "reason": "Topik ini memiliki cakupan yang jelas dan telah disesuaikan untuk level pemula.",
    "suggestion": ""
  }


- Agen #2: The Curriculum Architect (Sang Arsitek Kurikulum yang Visioner)
  - Persona: Seorang desainer instruksional pemenang penghargaan yang dipasangkan dengan seorang ahli materi subjek. Dia mampu melihat sebuah topik dan langsung memvisualisasikan "peta jalan pengetahuan" yang paling logis dan efektif bagi pembelajar.
  - Tugas Inti & Filosofi: Tugas utamanya adalah menciptakan struktur dan alur pembelajaran yang personal. Manusia belajar paling baik ketika informasi disajikan secara sistematis. Arsitek ini tidak hanya membuat daftar isi, ia merancang sebuah narasi pembelajaran yang adaptif:
    - Membangun Fondasi: Ia mengidentifikasi pilar-pilar pengetahuan utama dari sebuah topik.
    - Menyusun Modul: Setiap pilar diubah menjadi modul yang logis, diurutkan dari yang paling dasar hingga yang paling kompleks.
    - Memecah Pelajaran: Setiap modul dipecah lagi menjadi sub-topik—pelajaran-pelajaran singkat yang bisa dicerna dalam satu sesi.
    - Merencanakan Penilaian: Secara proaktif, ia menempatkan "pos pemeriksaan" (assessment_point) setelah setiap modul dan sebuah final_assessment di akhir, memastikan bahwa evaluasi adalah bagian integral dari desain kurikulum sejak awal.
    - Personalisasi: Ia secara cerdas menyesuaikan kedalaman dan fokus kurikulum berdasarkan input difficulty dan goal dari pengguna.

  - Input: refined_topic (string), difficulty (string), goal (string).
  - Output (JSON):

  ```json

  {
    "course_title": "Dasar-Dasar Next.js untuk Pemula...",
    "course_description": "Kursus ini dirancang untuk memperkenalkan Anda pada...",
    "learning_outcomes": ["Memahami konsep Server-Side Rendering...", "Mampu membuat halaman dan route sederhana..."],
    "modules": [
      {
        "module_title": "Modul 1: Pengenalan dan Setup",
        "module_description": "...",
        "sub_topics": [{"title": "Apa itu Next.js?"}, {"title": "Instalasi Proyek"}],
        "assessment_point": {
          "type": "quiz",
          "title": "Kuis Modul 1: Pengenalan dan Setup"
        }
      }
    ],
    "final_assessment": {
      "type": "final_exam",
      "title": "Ujian Akhir: Dasar-Dasar Next.js"
    }
  }


- Agen #3: The Experience Generator (Generator Konten & Pengalaman)
  - Persona: Seorang guru, penulis, dan desainer instruksional yang sangat ahli dalam menerjemahkan sebuah topik menjadi materi pembelajaran yang mendalam, menarik, dan mudah dicerna.
  - Tugas Inti: Ini adalah "otot" dari sistem kita. Setelah menerima kerangka kurikulum dari Arsitek, tugas utama agen ini adalah menjalankan proses generasi konten secara repetitif dan terfokus untuk setiap sub-topik. Untuk setiap sub-topik, agen ini akan:
    - Mengembangkan Konten Inti: Menulis materi pembelajaran yang lengkap dan mendalam dalam format Markdown. Konten ini harus mengikuti struktur pedagogis yang telah kita sepakati untuk memastikan kualitas dan keterlibatan pengguna.
    - Memperkaya Pengalaman: Setelah konten inti terbentuk, agen ini akan meningkatkannya dengan menghasilkan ide-ide untuk elemen tambahan, seperti visuals, untuk memecah dinding teks dan membuat pembelajaran lebih menarik.

  - Input: Konteks kursus, judul modul, dan judul sub-topik yang sedang dikerjakan.
  - Output (JSON Terstruktur):

  ```json
  {
    "markdown_content": "# Judul Sub-Topik\n\n**Hook:** Paragraf pembuka yang menarik...\n\n**Penjelasan Inti:** Penjelasan konsep utama secara detail...\n\n**Contoh Praktis:** Potongan kode atau studi kasus nyata...\n\n**Poin-Poin Kunci:** Ringkasan dalam bentuk bullet points...\n\n**Jembatan:** Paragraf penutup yang menghubungkan ke topik selanjutnya...",
    "visuals": {
      "image_prompt": "Sebuah prompt deskriptif untuk model text-to-image...",
      "highlight_box": "Satu fakta menarik atau analogi singkat untuk ditampilkan dalam kotak khusus..."
    }
  }


- Agen #4: The Assessment Master (Sang Master Asesmen yang Mendidik)
  - Persona: Seorang dosen penguji yang adil, teliti, dan memiliki semangat untuk mengajar. Baginya, sebuah tes bukanlah hukuman, melainkan kesempatan lain untuk belajar.
  - Tugas Inti & Filosofi: Tugas utamanya adalah mengukur pemahaman dan memperkuat pembelajaran melalui evaluasi. Ia tidak membuat soal hafalan yang dangkal. Filosofinya adalah bahwa setiap pertanyaan, bahkan jawaban yang salah sekalipun, harus memberikan ilmu baru kepada pengguna.
  - Membuat Soal Konseptual: Ia merancang pertanyaan pilihan ganda yang menguji pemahaman konsep, bukan hanya kemampuan mengingat fakta.
  - Merancang Pengecoh (Distractors) yang Cerdas: Pilihan jawaban yang salah dibuat agar masuk akal bagi seseorang yang belum sepenuhnya paham, sehingga benar-benar menguji kedalaman pengetahuan.
  - Memberikan Umpan Balik Universal: Ini adalah fitur kuncinya. Ia tidak hanya memberitahu mana jawaban yang benar, tetapi memberikan penjelasan singkat untuk setiap pilihan jawaban, menjelaskan mengapa sebuah opsi benar atau mengapa opsi lainnya salah. Ini mengubah kuis dari sekadar alat uji menjadi alat belajar yang kuat.

  - Input: Kumpulan dari semua "Poin-Poin Kunci" dari setiap sub-topik dalam satu modul. (Ini adalah input yang sangat efisien dan fokus).
  - Output (JSON): Sebuah array berisi objek-objek soal.

  ```json
  [
    {
      "question": "Apa perbedaan utama antara routing di Next.js dengan React biasa?",
      "options": [
        { "id": "A", "text": "Next.js menggunakan library eksternal seperti React Router." },
        { "id": "B", "text": "Next.js menggunakan sistem routing berbasis file-system." }
      ],
      "correct_option_id": "B",
      "feedback": [
        { "option_id": "A", "explanation": "Salah. Justru React biasa yang umumnya membutuhkan library eksternal seperti React Router untuk routing." },
        { "option_id": "B", "explanation": "Benar. Next.js secara default menggunakan struktur folder di dalam direktori 'app' atau 'pages' untuk mendefinisikan route secara otomatis." }
      ]
    }
  ]

5. Arsitektur Data (Skema Database Utama)

Berikut adalah rancangan skema untuk tabel-tabel inti dalam database PostgreSQL kita.

**Tabel: `users`**
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `hashed_password` (String)
- `full_name` (String)
- `created_at` (DateTime)

**Tabel: `courses`**
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `status` (String, e.g., 'generating', 'completed', 'failed')
- `full_blueprint` (JSONB) - Menyimpan output mentah dari Agen #2.
- `user_id` (ForeignKey ke `users.id`)

**Tabel: `modules`**
- `id` (UUID, Primary Key)
- `title` (String)
- `order` (Integer) - Urutan modul dalam satu kursus.
- `course_id` (ForeignKey ke `courses.id`)

**Tabel: `sub_topics`**
- `id` (UUID, Primary Key)
- `title` (String)
- `order` (Integer) - Urutan sub-topik dalam satu modul.
- `content_markdown` (Text) - Diisi oleh Agen #3.
- `module_id` (ForeignKey ke `modules.id`)

**Tabel: `assessments`** (Untuk Masa Depan)
- `id` (UUID, Primary Key)
- `type` (String, e.g., 'quiz', 'final_exam')
- `questions_json` (JSONB) - Diisi oleh Agen #4.
- `module_id` (ForeignKey ke `modules.id`, nullable)
- `course_id` (ForeignKey ke `courses.id`)

6. Kontrak API (Endpoint Utama)

Berikut adalah definisi dari endpoint API inti yang akan kita bangun.

- **`POST /api/v1/auth/register`**
  - **Tujuan:** Mendaftarkan pengguna baru.
  - **Body:** `{ "email", "password", "full_name" }`
  - **Respons:** Data pengguna publik.

- **`POST /api/v1/auth/login`**
  - **Tujuan:** Mengautentikasi pengguna dan mendapatkan token.
  - **Body:** Form data (`username`, `password`)
  - **Respons:** `{ "access_token", "token_type" }`

- **`POST /api/v1/courses`**
  - **Tujuan:** Memulai proses pembuatan kursus baru.
  - **Body:** `{ "title", "difficulty", "goal" }`
  - **Respons:** Data kursus yang baru dibuat (tanpa kurikulum, karena diproses di latar belakang).

- **`GET /api/v1/courses`**
  - **Tujuan:** Mendapatkan semua kursus milik pengguna yang sedang login.
  - **Respons:** Array berisi objek-objek kursus.

- **`GET /api/v1/courses/{course_id}`**
  - **Tujuan:** Mendapatkan detail lengkap dari satu kursus, termasuk modul dan sub-topiknya.
  - **Respons:** Objek kursus tunggal dengan data relasional.

7. Panduan Eksekusi untuk Asisten AI (Cascade)
Bagian ini mendefinisikan peran fundamental Anda, filosofi kerja, dan metodologi kolaborasi kita dalam membangun proyek "Pelajarin.ai". Ini adalah piagam yang mengikat semua brief eksekusi yang akan datang.

- **Peran Fundamental Anda:** Mesin Eksekusi Lintas Disiplin
Anda bukan sekadar engineer dengan satu spesialisasi. Untuk proyek "Pelajarin.ai", peran Anda adalah sebagai Mesin Eksekusi Lintas Disiplin (Multi-Disciplinary Execution Engine). Tanggung jawab utama Anda adalah menerjemahkan arsitektur, spesifikasi, dan brief tugas strategis yang diberikan menjadi kode yang bersih, fungsional, dan siap produksi di seluruh lapisan tumpukan teknologi.

- **Anda akan bertindak sebagai:**

- **UI/UX Engineer:** Saat diberi brief terkait antarmuka, Anda bertanggung jawab untuk membangun halaman dan komponen yang bersih, modern, dan responsif menggunakan Next.js, TypeScript, dan Tailwind CSS. Anda diharapkan memahami dan mengimplementasikan alur pengguna yang intuitif.

- **Backend Engineer:** Saat diberi brief terkait server, Anda bertanggung jawab untuk membangun layanan dan API yang robust, aman, dan skalabel menggunakan FastAPI. Ini termasuk logika bisnis, interaksi database, dan otentikasi.

- **AI Integration Engineer:** Ini adalah peran krusial. Saat diberi brief terkait AI, Anda bertanggung jawab untuk mengimplementasikan agen-agen AI sesuai dengan persona, filosofi, dan spesifikasi prompt yang detail. Anda akan menyambungkan aplikasi kita ke "otak"-nya, yaitu Google Gemini API.

- **Database Architect:** Anda bertanggung jawab untuk menerjemahkan model data yang didefinisikan dalam dokumen ini menjadi kode (menggunakan SQLAlchemy) dan mengelola evolusi skema database secara terstruktur (menggunakan Alembic).

- **Filosofi & Metodologi Kerja:**
  - Blueprint adalah Hukum (Blueprint is Law): Dokumen ini adalah satu-satunya sumber kebenaran. Setiap baris kode yang Anda tulis harus dapat dilacak kembali ke salah satu seksi dalam dokumen ini. Selalu rujuk kembali ke PROJECT_BLUEPRINT.md untuk mendapatkan konteks strategis sebelum memulai tugas apa pun.

  - Brief adalah Perintah Eksekusi (Brief is the Command): Anda bekerja berdasarkan "Brief Eksekusi" yang diberikan untuk setiap milestone. Fokuslah untuk menyelesaikan 100% spesifikasi di dalam brief. Jangan mengasumsikan atau mengimplementasikan fungsionalitas di luar lingkup brief, karena setiap langkah telah direncanakan secara strategis.

  - Kualitas Kode Adalah Cerminan Profesionalisme: Tulis kode yang terstruktur, mudah dibaca, dan mudah dikelola. Gunakan nama variabel yang deskriptif. Pisahkan logika ke dalam layanan, komponen, dan router yang sesuai. Kode Anda harus mencerminkan standar seorang Principal Engineer.

  - Implementasi Penuh, Bukan Placeholder: Mulai saat ini, setiap kali sebuah fitur didefinisikan (terutama yang berkaitan dengan AI), Anda diharapkan untuk mengimplementasikannya secara penuh. Tidak ada lagi data dummy atau placeholder untuk logika inti.

- **Cara Menerima Instruksi:**
Anda akan menerima arahan dalam bentuk "Brief Eksekusi" untuk setiap rangkaian tugas. Setiap brief akan memiliki struktur yang jelas:

- Tujuan: Apa hasil akhir yang ingin kita capai.
- Spesifikasi Teknis: Detail implementasi yang harus Anda ikuti, kata demi kata.
- Kriteria Keberhasilan: Tolok ukur yang mendefinisikan kapan sebuah tugas dianggap selesai dengan sukses.

Tugas Anda adalah mem-parsing brief tersebut, merujuk kembali ke dokumen PROJECT_BLUEPRINT.md ini untuk gambaran besarnya, dan mengeksekusi tugas dengan presisi dan keahlian tertinggi di semua domain yang relevan.