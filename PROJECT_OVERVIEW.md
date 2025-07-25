# Dokumentasi Teknis Proyek Pelajarin.ai

**Tanggal Dokumen:** 25 Juli 2025

## 1. Ringkasan Proyek

Pelajarin.ai adalah sebuah platform pembelajaran online berbasis AI yang dirancang untuk menghasilkan kursus secara dinamis. Proyek ini terdiri dari dua komponen utama: **backend** yang dibangun dengan FastAPI untuk mengelola data dan logika bisnis, dan **frontend** yang dibangun dengan Next.js untuk menyajikan antarmuka pengguna yang interaktif.

Dokumen ini berfungsi sebagai sumber kebenaran tunggal (`single source of truth`) untuk semua aspek teknis proyek per tanggal yang disebutkan di atas.

---

## 2. Tumpukan Teknologi (Technology Stack)

### 2.1. Backend

- **Bahasa:** Python 3.11+
- **Framework:** FastAPI `~0.116.1`
- **Server:** Uvicorn
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy `~2.0.41`
- **Migrasi Database:** Alembic `~1.16.4`
- **Validasi Data:** Pydantic `~2.11.7`
- **Autentikasi:** `python-jose` (JWT), `passlib`, `bcrypt`
- **Manajemen Dependensi:** Poetry
- **AI/LLM:** `google-generativeai`

### 2.2. Frontend

- **Framework:** Next.js `15.4.3`
- **Library UI:** React `19.1.0`
- **Bahasa:** TypeScript `~5`
- **Styling:** Tailwind CSS `v4` dengan PostCSS
- **Komponen UI:**
  - `class-variance-authority`: Untuk varian komponen.
  - `@radix-ui/react-slot`: Untuk komposisi komponen fleksibel (`asChild`).
  - `tailwind-merge` & `clsx`: Untuk penggabungan kelas utilitas.
- **HTTP Client:** Axios
- **Notifikasi:** `react-hot-toast`
- **Render Markdown:** `react-markdown`
- **Styling Tipografi:** `@tailwindcss/typography`
- **Manajemen Dependensi:** npm

---

## 3. Struktur Proyek

### 3.1. Backend (`/backend`)

```
backend/
├── alembic/                # Skrip migrasi database Alembic
├── belajaryuk_api/         # Direktori utama aplikasi FastAPI
│   ├── core/               # Konfigurasi inti aplikasi
│   │   ├── config.py       # Pengaturan aplikasi dari environment variables (Pydantic)
│   │   ├── model_config.py # Konfigurasi model AI (Google Gemini)
│   │   └── security.py     # Fungsi terkait keamanan (hashing password, JWT)
│   ├── db/
│   │   ├── base.py         # Base class untuk semua model SQLAlchemy
│   │   └── session.py      # Engine database dan factory untuk sesi DB
│   ├── models/
│   │   ├── course.py       # Model SQLAlchemy: Course, Module, SubTopic, Assessment
│   │   └── user.py         # Model SQLAlchemy: User
│   ├── prompts/
│   │   ├── architect_prompt.py # Template prompt untuk AI Architect
│   │   └── gatekeeper_prompt.py# Template prompt untuk AI Gatekeeper
│   ├── routers/
│   │   ├── auth_router.py  # Endpoint untuk registrasi dan login
│   │   └── course_router.py# Endpoint untuk CRUD kursus
│   ├── schemas/
│   │   ├── course_schema.py# Skema Pydantic untuk validasi data kursus
│   │   ├── token_schema.py # Skema Pydantic untuk token JWT
│   │   └── user_schema.py  # Skema Pydantic untuk validasi data pengguna
│   ├── services/
│   │   ├── ai_service.py   # Logika orkestrasi AI (Gatekeeper & Architect)
│   │   ├── course_service.py # Logika bisnis terkait kursus (transaksi DB)
│   │   └── user_service.py   # Logika bisnis terkait pengguna
│   └── main.py             # Titik masuk utama aplikasi, inisialisasi FastAPI & routers
├── .env                    # Variabel lingkungan (lokal, JANGAN di-commit)
├── pyproject.toml          # Definisi proyek dan dependensi (Poetry)
└── alembic.ini             # Konfigurasi Alembic
```

### 3.2. Frontend (`/frontend`)

```
frontend/
├── app/
│   ├── (auth)/             # Grup rute untuk halaman autentikasi
│   │   ├── login/page.tsx  # Komponen halaman Login
│   │   └── register/page.tsx # Komponen halaman Register
│   ├── (protected)/        # Grup rute yang memerlukan login (misal: dashboard)
│   ├── layout.tsx          # Layout root, menerapkan font, provider, dan style global
│   ├── page.tsx            # Komponen halaman landing
│   └── globals.css         # File CSS global, @tailwind layers, dan variabel tema
├── components/
│   ├── shared/             # Komponen kompleks yang digunakan di banyak halaman
│   │   └── Navbar.tsx      # Komponen navigasi utama
│   └── ui/                 # Komponen UI dasar dan atomik
│       └── Button.tsx      # Komponen tombol reusable dengan CVA
├── lib/
│   └── utils.ts            # Fungsi utilitas, terutama 'cn' untuk classnames
├── public/                 # Aset statis (gambar, ikon)
├── services/
│   └── api.ts              # Konfigurasi instance Axios untuk komunikasi backend
├── tailwind.config.ts      # Konfigurasi Tailwind CSS (tema, plugin, dll)
├── tsconfig.json           # Konfigurasi TypeScript untuk proyek
└── package.json            # Daftar dependensi npm dan skrip proyek
```

---

## 4. Rincian Backend

### 4.1. Skema Database

Database menggunakan PostgreSQL dan dikelola oleh SQLAlchemy & Alembic. Berikut adalah skema tabel utama:

1.  **`users`**
    - `id` (UUID, PK): ID unik pengguna.
    - `email` (String, Unik): Alamat email pengguna.
    - `hashed_password` (String): Kata sandi yang sudah di-hash.
    - `full_name` (String, Opsional): Nama lengkap pengguna.
    - `is_active` (Boolean): Status keaktifan akun.
    - `created_at`, `updated_at` (TIMESTAMP): Stempel waktu.

2.  **`courses`**
    - `id` (UUID, PK): ID unik kursus.
    - `user_id` (FK ke `users.id`): Pembuat kursus.
    - `title` (String): Judul kursus.
    - `description` (Text): Deskripsi kursus.
    - `status` (String): Status pembuatan kursus (misal: 'generating', 'completed').
    - `full_blueprint` (JSONB): Struktur lengkap kursus yang dihasilkan AI.

3.  **`modules`**
    - `id` (UUID, PK): ID unik modul.
    - `course_id` (FK ke `courses.id`): Kursus induk.
    - `title` (String): Judul modul.
    - `module_order` (Integer): Urutan modul dalam kursus.

4.  **`sub_topics`**
    - `id` (UUID, PK): ID unik sub-topik.
    - `module_id` (FK ke `modules.id`): Modul induk.
    - `title` (String): Judul sub-topik.
    - `content_markdown` (Text): Konten pembelajaran dalam format Markdown.
    - `sub_topic_order` (Integer): Urutan sub-topik dalam modul.

5.  **`assessments`**
    - `id` (UUID, PK): ID unik penilaian.
    - `course_id` (FK ke `courses.id`): Penilaian tingkat kursus.
    - `module_id` (FK ke `modules.id`, Opsional): Penilaian tingkat modul.
    - `title` (String): Judul penilaian.
    - `type` (String): Jenis penilaian (misal: 'quiz', 'project').
    - `questions_json` (JSONB): Daftar pertanyaan dalam format JSON.

### 4.2. API Endpoints

Endpoint API dikelompokkan berdasarkan fungsionalitasnya di bawah prefix `/api/v1`.

#### 4.2.1. Autentikasi (`/auth`)

-   `POST /register`: Mendaftarkan pengguna baru. Menerima `email`, `password`, dan `full_name` (opsional).
-   `POST /login`: Mengautentikasi pengguna. Menerima `username` (email) dan `password`. Mengembalikan `access_token` (JWT).

#### 4.2.2. Kursus (`/courses`)

Endpoint ini dilindungi dan memerlukan token autentikasi (JWT).

-   `POST /`: Memulai proses pembuatan kursus baru. Menerima `topic`, `difficulty`, dan `goal`. Memicu alur orkestrasi AI dan mengembalikan data awal kursus dengan status `generating`.
-   `GET /`: Mengambil daftar semua kursus yang dimiliki oleh pengguna yang terautentikasi.
-   `GET /{course_id}`: Mengambil detail lengkap (termasuk blueprint) dari satu kursus spesifik.

### 4.3. Alur Orkestrasi AI

Fitur inti dari Pelajarin.ai adalah sistem pembuatan kurikulum berbasis AI yang menggunakan dua agen sekuensial untuk memastikan kualitas dan struktur pedagogis.

**1. Agent Gatekeeper (Penjaga Gerbang):**
-   **Peran:** Bertindak sebagai filter kualitas pertama. Agent ini mengevaluasi kelayakan topik yang diajukan pengguna berdasarkan substansi, cakupan, dan nilai pendidikannya.
-   **Proses:** Jika topik dianggap layak, Gatekeeper akan menyempurnakannya menjadi judul kursus yang premium, spesifik, dan menarik.
-   **Output:** Sebuah objek JSON yang berisi keputusan kelayakan (`is_viable`), judul yang disempurnakan (`refined_topic`), dan alasan di balik keputusan tersebut.

**2. Agent Architect (Arsitek Kurikulum):**
-   **Peran:** Menerima judul yang telah disetujui oleh Gatekeeper dan merancang keseluruhan blueprint kurikulum.
-   **Proses:** Agent ini memecah topik menjadi modul-modul yang logis, mendefinisikan sub-topik untuk setiap modul, menetapkan hasil pembelajaran (`learning_outcomes`), dan mengintegrasikan poin-poin penilaian (`assessment_point`) di setiap akhir modul serta ujian akhir (`final_assessment`).
-   **Output:** Sebuah struktur JSON komprehensif yang berisi seluruh blueprint kursus, siap untuk disimpan ke database.

**3. Persistensi Data:**
-   Setelah Architect menghasilkan blueprint, `course_service` akan mem-parsing JSON tersebut dan menyimpannya ke dalam beberapa tabel database (`courses`, `modules`, `sub_topics`, `assessments`) dalam satu transaksi atomik untuk menjaga integritas data.

---

## 5. Keputusan Arsitektural & Deviasi Penting

Selama pengembangan, beberapa keputusan teknis diambil yang sedikit berbeda dari rencana awal. Keputusan ini krusial untuk mengatasi tantangan teknis, memastikan stabilitas, dan meningkatkan kualitas produk.

### 5.1. Backend: Logika Serialisasi Data (ORM ke Pydantic)

-   **Masalah Awal:** Terjadi `ValidationError` yang persisten dan sulit di-debug saat mencoba mengonversi objek SQLAlchemy (yang memiliki relasi bertingkat seperti `course -> modules -> sub_topics`) menjadi skema Pydantic (`CourseDetail`). Penggunaan `__dict__` pada objek ORM dan dekorator `@field_validator` atau `@computed_field` di Pydantic terbukti tidak stabil dan rawan error karena menyertakan atribut internal SQLAlchemy (`_sa_instance_state`).
-   **Solusi & Deviasi:** Logika transformasi data dipindahkan sepenuhnya dari level skema Pydantic ke level *router endpoint* (`/routers/course_router.py`). Di dalam endpoint `GET /{course_id}`, data dibangun secara manual menjadi struktur `dict` sebelum dikembalikan. Pendekatan ini, meskipun lebih verbose, memberikan kontrol penuh atas data yang diekspos oleh API, menghilangkan semua `ValidationError`, dan memastikan respons yang konsisten dan dapat diandalkan.

### 5.2. Frontend: Refactor UI/UX Halaman Detail Kurikulum

-   **Masalah Awal:** Tampilan awal halaman detail kurikulum terlalu lebar, deskripsi kursus tidak terformat dengan baik, dan daftar sub-topik bersifat statis, sehingga pengalaman pengguna terasa kurang optimal.
-   **Solusi & Deviasi:** Dilakukan perombakan UI/UX yang signifikan:
    1.  **Rendering Deskripsi dengan Markdown:** Implementasi `react-markdown` dengan plugin `@tailwindcss/typography` (`prose`). Ini memungkinkan deskripsi yang dihasilkan AI (yang seringkali mengandung format Markdown) untuk di-render dengan benar, lengkap dengan paragraf, daftar, dan penekanan teks yang estetis.
    2.  **Layout Proporsional:** Lebar kontainer utama dibatasi dengan `max-w-5xl` agar lebih fokus dan nyaman dibaca di layar besar.
    3.  **Navigasi Sub-Topik Interaktif:** Setiap item sub-topik diubah dari teks statis menjadi komponen `<Link>` interaktif dengan *hover effects* dan ikon yang jelas. Ini memberikan *affordance* (petunjuk visual) yang kuat bahwa setiap sub-topik adalah materi yang dapat dieksplorasi.
    4.  **Konsistensi Tombol Aksi:** Semua tombol *call-to-action* (Mulai Kuis, Mulai Ujian) distandarisasi menggunakan gradien warna primer (`bg-gradient-primary`) dan ikonografi interaktif untuk menciptakan pengalaman visual yang kohesif dan profesional.

---

## 6. Rincian Frontend

### 5.1. Arsitektur & Styling

-   **Routing:** Menggunakan App Router dari Next.js 15. Rute dikelompokkan berdasarkan status autentikasi (`(auth)` dan `(protected)`).
-   **Theming:** Menggunakan sistem berbasis CSS Variables yang didefinisikan di `app/globals.css`. Variabel ini kemudian dipetakan ke dalam `tailwind.config.ts` untuk memungkinkan penggunaan *semantic colors* seperti `bg-background`, `text-primary`, dll.
-   **Custom Utilities:**
    - `.bg-gradient-primary`: Sebuah kelas utilitas kustom yang didefinisikan di `app/globals.css` di dalam `@layer utilities` untuk membuat latar belakang gradien pada tombol utama.

### 5.2. Komponen Kunci

-   **`components/ui/Button.tsx`**: Komponen tombol yang sangat dapat digunakan kembali. Dibangun dengan CVA untuk mendukung berbagai `variant` (default, outline, destructive, dll.) dan `size`. Menggunakan `@radix-ui/react-slot` dan prop `asChild` untuk mengintegrasikan fungsionalitas tombol dengan komponen lain seperti `Link` dari Next.js tanpa merusak SEO atau fungsionalitas.
-   **`lib/utils.ts`**: Berisi fungsi `cn` yang menggabungkan `clsx` dan `tailwind-merge` untuk menangani penggabungan dan penggantian kelas Tailwind CSS secara cerdas, mencegah konflik *styling*.

---

## 6. Alur Kerja & Setup

### 6.1. Menjalankan Backend

1.  Navigasi ke direktori `/backend`.
2.  Instal dependensi: `poetry install`.
3.  Buat file `.env` dari `.env.example` dan isi konfigurasinya.
4.  Jalankan server: `poetry run uvicorn belajaryuk_api.main:app --reload`.

### 6.2. Menjalankan Frontend

1.  Navigasi ke direktori `/frontend`.
2.  Instal dependensi: `npm install`.
3.  Jalankan server pengembangan: `npm run dev`.
4.  Aplikasi akan tersedia di `http://localhost:3000`.

