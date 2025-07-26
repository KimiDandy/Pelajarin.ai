# Dokumentasi Teknis Proyek Pelajarin.ai

**Tanggal Dokumen:** 27 Juli 2025 (Last Updated: 00:25 WIB)

## 1. Ringkasan Proyek

Pelajarin.ai adalah sebuah platform pembelajaran online berbasis AI yang dirancang untuk menghasilkan kursus secara dinamis. Proyek ini terdiri dari dua komponen utama: **backend** yang dibangun dengan FastAPI untuk mengelola data dan logika bisnis, dan **frontend** yang dibangun dengan Next.js untuk menyajikan antarmuka pengguna yang interaktif.

### 🎯 **Milestone Terbaru: "Nebula Cerdas" - Dashboard Cleanup & Documentation Update**
Proyek telah menyelesaikan transformasi besar pada dashboard dengan konsep "Nebula Cerdas", menggantikan semua background legacy dengan desain nebula animasi menggunakan Framer Motion, dan melakukan cleanup komprehensif seluruh komponen frontend.

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

### 2.2. Frontend (`/frontend`)

```
frontend/
├── app/
│   ├── (auth)/             # Grup rute untuk halaman autentikasi
│   │   ├── login/page.tsx  # Halaman login dengan AuthFlow
│   │   └── register/page.tsx # Halaman register dengan AuthFlow
│   ├── dashboard/          # Grup rute dashboard yang dilindungi
│   │   ├── page.tsx        # Dashboard utama dengan nebula background
│   │   ├── layout.tsx      # Layout dashboard dengan SentientNebulaBackground
│   │   ├── dashboard.css   # CSS khusus dashboard dengan glowing glass styling
│   │   └── course/[id]/    # Detail kursus dengan Promise params
│   ├── layout.tsx          # Layout root dengan blueprint grid background
│   ├── page.tsx            # Landing page dengan "Luminous Mind" theme
│   └── globals.css         # CSS global dengan Luminous Mind variables & animations
├── components/
│   ├── auth/               # Komponen autentikasi baru
│   │   ├── AuthFlow.tsx    # Komponen utama login/register terpadu
│   │   ├── AuthInfographic.tsx # Panel keunggulan platform
│   │   ├── LoginForm.tsx   # Form login dengan validasi
│   │   └── RegisterForm.tsx # Form register dengan auto-login
│   ├── shared/             # Komponen kompleks yang digunakan di banyak halaman
│   │   ├── Navbar.tsx      # Navigasi utama
│   │   ├── FloatingParticles.tsx # Efek partikel mengambang
│   │   └── StatsSection.tsx # Statistik landing page
│   ├── dashboard/          # Komponen dashboard dengan nebula theme
│   │   ├── SentientNebulaBackground.tsx # Background nebula animasi utama
│   │   ├── DotGridBackground.tsx       # Background fallback dot grid
│   │   ├── CourseCard.tsx              # Card kursus dengan glowing glass styling
│   │   ├── CourseCreationForm.tsx      # Form pembuatan kursus dengan modal overlay
│   │   └── DashboardLayout.tsx         # Layout dashboard dengan background management
│   └── ui/                 # Komponen UI dasar dan atomik
│       ├── Button.tsx      # Komponen tombol reusable dengan CVA
│       ├── Card.tsx        # Card komponen dengan glass styling
│       └── Modal.tsx       # Modal overlay untuk notifikasi
├── lib/
│   ├── auth.ts             # Utilitas manajemen token JWT
│   ├── authValidation.ts   # Validasi form autentikasi
│   └── utils.ts            # Fungsi utilitas umum
├── services/
│   ├── api.ts              # Instance Axios dengan interceptor
│   ├── authService.ts      # Service autentikasi
│   └── courseService.ts    # Service kursus
├── public/                 # Aset statis
├── styles/                 # File CSS tambahan
│   └── dashboard/          # CSS khusus untuk dashboard
├── tailwind.config.ts      # Konfigurasi Tailwind CSS v4
├── next.config.js          # Konfigurasi Next.js
├── tsconfig.json           # Konfigurasi TypeScript
└── package.json            # Dependensi dan skrip
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

### 5.1. **Major Update: Sistem Autentikasi "Architect's Canvas"**

#### **Transformasi Total UI/UX**
- **Tema Sebelumnya:** Dark particle theme dengan warna gelap dan efek partikel
- **Tema Baru:** "Architect's Canvas" - desain terang, profesional, dengan konsep "belajar sebagai pencahayaan"

#### **Komponen Baru & Refaktor**
- **AuthFlow.tsx**: Komponen unifikasi login/register dalam satu halaman
- **AuthInfographic.tsx**: Panel keunggulan platform dengan animasi holografik
- **Sistem Notifikasi Modal**: Menggantikan react-hot-toast dengan modal overlay elegan
- **Background Animasi**: Aurora gradient dengan blueprint grid pattern

#### **Perubahan Teknis**
- Penyimpanan token JWT di localStorage dengan key `access_token`
- Auto-login setelah registrasi berhasil
- Navigasi internal tanpa perubahan URL
- Error handling terpusat di komponen AuthFlow

### 5.2. Backend: Logika Serialisasi Data (ORM ke Pydantic)

### 5.1. Backend: Logika Serialisasi Data (ORM ke Pydantic)

-   **Masalah Awal:** Terjadi `ValidationError` yang persisten dan sulit di-debug saat mencoba mengonversi objek SQLAlchemy (yang memiliki relasi bertingkat seperti `course -> modules -> sub_topics`) menjadi skema Pydantic (`CourseDetail`). Penggunaan `__dict__` pada objek ORM dan dekorator `@field_validator` atau `@computed_field` di Pydantic terbukti tidak stabil dan rawan error karena menyertakan atribut internal SQLAlchemy (`_sa_instance_state`).
-   **Solusi & Deviasi:** Logika transformasi data dipindahkan sepenuhnya dari level skema Pydantic ke level *router endpoint* (`/routers/course_router.py`). Di dalam endpoint `GET /{course_id}`, data dibangun secara manual menjadi struktur `dict` sebelum dikembalikan. Pendekatan ini, meskipun lebih verbose, memberikan kontrol penuh atas data yang diekspos oleh API, menghilangkan semua `ValidationError`, dan memastikan respons yang konsisten dan dapat diandalkan.

### 5.3. Frontend: Refactor UI/UX Halaman Detail Kurikulum

-   **Masalah Awal:** Tampilan awal halaman detail kurikulum terlalu lebar, deskripsi kursus tidak terformat dengan baik, dan daftar sub-topik bersifat statis.
-   **Solusi & Deviasi:** Perombakan UI/UX signifikan dengan react-markdown, layout proporsional, dan navigasi interaktif.

### 5.4. **Next.js 15 Compatibility Updates**

-   **Masalah:** Error TypeScript dengan Promise params di dynamic routes
-   **Solusi:** Update semua halaman dengan params untuk menggunakan Promise resolution pattern
-   **File yang diperbarui:** `app/dashboard/course/[id]/page.tsx`

### 5.5. **Code Quality & Linting**

-   **Perubahan:** Penghapusan semua import dan variabel tidak terpakai
-   **Fix:** Error typing dari `any` ke `Error | unknown`
-   **Optimasi:** Dependency array React hooks untuk menghilangkan warning ESLint

### 5.6. **Dashboard Background Cleanup**

-   **Masalah:** Background legacy (Aurora & Dot Grid) masih ada di dashboard
-   **Solusi:** Implementasi `SentientNebulaBackground` dengan Framer Motion
-   **Fix:** Hydration mismatch dengan deterministic SSR particles
-   **Hasil:** Background nebula smooth tanpa jank atau visual legacy

---

## 6. Rincian Frontend

### 6.1. **Arsitektur & Styling Terbaru**

#### **Design System: "Architect's Canvas"**
- **Konsep:** Learning as illumination - dark canvas with glowing elements
- **Warna Utama:**
  - Background: `#02040A` (dark blue-black)
  - Primary: `#4361EE` (electric blue)
  - Secondary: `#7209B7` (violet/purple)
  - Text Primary: `#F0F2F5` (cream white)
  - Text Secondary: `#A0AEC0` (blue-gray)

#### **Animasi & Interaktivitas**
- **Framer Motion**: Untuk semua transisi dan animasi
- **React Spring**: Untuk efek partikel mengambang
- **CSS Animations**: Aurora gradient dan blueprint grid background

### 6.2. **Komponen Kunci Baru**

#### **Authentication Components**
- **`AuthFlow.tsx`**: Komponen unifikasi login/register dengan state management
- **`AuthInfographic.tsx`**: Panel 6 keunggulan platform dengan animasi holografik
- **`LoginForm.tsx`**: Form login dengan validasi real-time
- **`RegisterForm.tsx`**: Form register dengan auto-login setelah registrasi

#### **Dashboard Components**
- **`SentientNebulaBackground.tsx`**: Background nebula animasi dengan Framer Motion
- **`DotGridBackground.tsx`**: Background dot grid sebagai fallback
- **`CourseCard.tsx`**: Card kursus dengan glowing glass styling
- **`CourseCreationForm.tsx`**: Form pembuatan kursus dengan modal overlay

#### **Sistem Notifikasi**
- **Modal Overlay**: Menggantikan react-hot-toast dengan modal sentral
- **Status Support**: Sukses (auto-dismiss) dan Error (manual close)
- **Animasi**: Fade-in/out dengan framer-motion

#### **Landing Page Components**
- **`FloatingParticles.tsx`**: Partikel mengambang dengan motion values
- **`InteractiveBackground.tsx`**: Background aurora dengan blueprint grid
- **`StatsSection.tsx`**: Statistik platform dengan animasi counter

#### **Dashboard Background System**
- **`SentientNebulaBackground`**: Background utama dashboard dengan animasi gradient nebula
- **`DotGridBackground`**: Background alternatif dengan pattern dot grid
- **CSS Variables**: Luminous Mind color palette dengan teal (#00F5D4) dan violet (#9D4EDD) accents

### 6.3. **Dependencies Terbaru**

#### **Core Dependencies**
- **Next.js**: `15.4.3` dengan App Router
- **React**: `19.1.0` dengan TypeScript `~5`
- **Tailwind CSS**: `v4.0` dengan PostCSS integration

#### **Animation & UI**
- **Framer Motion**: `^12.0.0` untuk animasi halus
- **React Spring**: Untuk efek partikel
- **Lucide React**: Ikon modern dan konsisten
- **CSS Custom Properties**: Luminous Mind theme variables

#### **State Management & Auth**
- **JWT Token Storage**: localStorage dengan key `access_token`
- **Axios Interceptors**: Untuk Authorization header otomatis
- **React Hooks**: useState, useEffect untuk state management lokal

---

## 7. **Technical Specifications & Setup**

### 7.1. **Environment Variables**

#### **Backend (.env)**
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost/pelajarin_db

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Service
GOOGLE_API_KEY=your-gemini-api-key
```

#### **Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 7.2. **Running the Application**

#### **Backend Setup**
```bash
cd backend
poetry install
poetry run alembic upgrade head
poetry run uvicorn belajaryuk_api.main:app --reload --host 0.0.0.0 --port 8000
```

#### **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### 7.3. **Build & Deployment**

#### **Frontend Build**
```bash
npm run build
npm start
```

#### **Backend Production**
```bash
poetry run uvicorn belajaryuk_api.main:app --host 0.0.0.0 --port 8000
```

---

## 8. **API Documentation**

### 8.1. **Authentication Endpoints**

#### **Register User**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

#### **Login User**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "access_token": "jwt-token-here",
  "token_type": "bearer"
}
```

### 8.2. **Course Management**

#### **Create New Course**
```http
POST /api/v1/courses/
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "topic": "Machine Learning Fundamentals",
  "difficulty": "beginner",
  "goal": "Build ML models from scratch"
}
```

#### **Get User Courses**
```http
GET /api/v1/courses/
Authorization: Bearer {jwt-token}
```

#### **Get Course Details**
```http
GET /api/v1/courses/{course_id}
Authorization: Bearer {jwt-token}
```

---

## 9. **Recent Bug Fixes & Improvements**

### 9.1. **Authentication System**
- ✅ Fixed JWT token storage and retrieval
- ✅ Added auto-login after registration
- ✅ Implemented central error handling
- ✅ Removed toast notifications in favor of modal system

### 9.2. **Code Quality**
- ✅ Fixed all TypeScript errors with Next.js 15 Promise params
- ✅ Removed unused imports and variables
- ✅ Updated error handling from `any` to proper types
- ✅ Fixed ESLint warnings for React hooks

### 9.3. **UI/UX Enhancements**
- ✅ Implemented "Architect's Canvas" design system
- ✅ Added smooth animations with framer-motion
- ✅ Created unified login/register flow
- ✅ Enhanced visual feedback for user actions

---

## 9. **Recent Updates & Changes**

### 9.1. **"Nebula Cerdas" Dashboard Transformation**
**Completed: 27 Juli 2025**

#### **Background System Overhaul**
- ✅ **SentientNebulaBackground.tsx**: New Framer Motion nebula background
- ✅ **DotGridBackground.tsx**: Clean fallback background system
- ✅ **Hydration Fix**: Resolved SSR/client mismatch with deterministic particles
- ✅ **Performance**: Smooth 60fps animations without jank

#### **CSS Architecture Update**
- ✅ **dashboard.css**: Dedicated dashboard styling with glowing glass theme
- ✅ **globals.css**: Updated with Luminous Mind color variables
- ✅ **Utility Classes**: Added glow effects, glass cards, and animations
- ✅ **Legacy Cleanup**: Removed all Aurora and dot grid legacy styles

#### **Component Structure**
- ✅ **CourseCard.tsx**: Glowing glass card design with teal/violet accents
- ✅ **Modal System**: Overlay notifications replacing react-hot-toast
- ✅ **Responsive Design**: Mobile-first approach for dashboard

### 9.2. **Authentication System "Architect's Canvas"**
**Completed: 26 Juli 2025**

#### **UI/UX Transformation**
- ✅ **Unified AuthFlow**: Single component for login/register
- ✅ **Bright Theme**: Professional "Architect's Canvas" design
- ✅ **Auto-login**: Seamless transition after registration
- ✅ **Error Handling**: Centralized modal notifications

## 10. **Future Roadmap**

### 10.1. **Short-term Goals**
- [ ] Add comprehensive unit tests for all components
- [ ] Implement user profile management system
- [ ] Add course progress tracking with visual indicators
- [ ] Enhance mobile responsiveness for dashboard
- [ ] Fix Tailwind CSS @apply warnings in globals.css
- [ ] Add loading states for async operations

### 10.2. **Medium-term Goals**
- [ ] Implement course search and filtering
- [ ] Add course sharing functionality
- [ ] Create user dashboard analytics
- [ ] Add course completion certificates
- [ ] Implement course ratings and reviews

### 10.3. **Long-term Vision**
- [ ] Implement real-time collaboration features
- [ ] Add AI-powered content recommendations
- [ ] Create mobile applications (React Native)
- [ ] Implement advanced analytics dashboard
- [ ] Add voice narration for courses
- [ ] Implement offline mode capabilities

---

## 11. **Contributing Guidelines**

### 11.1. **Code Style**
- **TypeScript**: Strict mode enabled with noImplicitAny
- **ESLint**: Use provided configuration with React hooks rules
- **Error Boundaries**: Implement React ErrorBoundary for all major components
- **JSDoc**: Add comprehensive comments for complex functions and hooks
- **Naming**: Use descriptive variable names (camelCase for variables, PascalCase for components)
- **File Structure**: One component per file, co-locate related utilities
- **CSS**: Use Tailwind utility classes, avoid inline styles
- **Performance**: Use React.memo for expensive components, optimize re-renders

### 11.2. **Git Workflow**
- **Conventional Commits**: Follow format `type(scope): description`
- **Branch Naming**: `feature/nebula-cerdas`, `fix/hydration-issue`
- **PR Requirements**: 
  - Descriptive title and detailed description
  - Screenshots/GIFs for UI changes
  - Link to related issues
  - Test coverage for new features
- **Code Review**: Require 1 approval before merge
- **Main Branch Protection**: No direct pushes, PR-only workflow

### 11.3. **Development Best Practices**
- **Component Design**: Atomic design principles (atoms, molecules, organisms)
- **State Management**: Local state first, lift state up when necessary
- **Testing**: Write tests for utilities and critical user flows
- **Accessibility**: ARIA labels, keyboard navigation, color contrast
- **Performance**: Lazy loading, code splitting, image optimization
- **Security**: Input validation, XSS prevention, secure token storage

---

**Last Updated:** 27 Juli 2025, 00:27 WIB  
**Document Version:** 2.0 - Post Architect's Canvas Update  