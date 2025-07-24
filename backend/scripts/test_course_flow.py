import requests
import json
from faker import Faker
import time
import os
from dotenv import load_dotenv

# --- Konfigurasi ---
# Memuat variabel dari file .env yang berada di direktori saat ini (backend/)
# load_dotenv() secara otomatis akan mencari file .env di direktori kerja saat ini.
load_dotenv()
BASE_URL = "http://localhost:8000/api/v1"
fake = Faker()

# --- Fungsi Bantuan ---
def print_step(title):
    """Mencetak header untuk setiap langkah pengujian."""
    print("\n" + "="*60)
    print(f"LANGKAH: {title}")
    print("="*60)

def print_response(response):
    """Mencetak status code dan body dari respons HTTP."""
    print(f"--> Status Code: {response.status_code}")
    try:
        print("--> Respons JSON:")
        print(json.dumps(response.json(), indent=2))
    except json.JSONDecodeError:
        print("--> Respons Teks:")
        print(response.text)

def check_api_key():
    """Memeriksa apakah GOOGLE_API_KEY sudah diatur di environment."""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key or api_key == "YOUR_GOOGLE_API_KEY":
        print("\n" + "!"*60)
        print("KESALAHAN: Variabel lingkungan GOOGLE_API_KEY belum diatur.")
        print("Harap atur kunci API Anda di dalam file .env sebelum menjalankan tes.")
        print("!"*60)
        return False
    print("--> Kunci API Google (GOOGLE_API_KEY) sudah terpasang.")
    return True

# --- Alur Pengujian Utama ---
def main():
    """Fungsi utama untuk menjalankan pengujian end-to-end."""
    
    print_step("Memeriksa Prasyarat")
    if not check_api_key():
        return # Hentikan eksekusi jika API key tidak ada

    # 1. Registrasi Pengguna Baru
    print_step("1. Registrasi Pengguna Baru")
    user_email = fake.email()
    user_password = fake.password(length=12)
    register_payload = {"email": user_email, "password": user_password}
    print(f"Mendaftarkan pengguna: {user_email}")
    try:
        register_res = requests.post(f"{BASE_URL}/auth/register", json=register_payload)
        print_response(register_res)
        if register_res.status_code != 201:
            print("\nGAGAL: Registrasi tidak berhasil. Menghentikan tes.")
            return
    except requests.exceptions.ConnectionError as e:
        print(f"\nGAGAL: Tidak dapat terhubung ke server di {BASE_URL}. Pastikan server sudah berjalan.")
        return

    # 2. Login untuk Mendapatkan Token
    print_step("2. Login untuk Mendapatkan Token Akses")
    login_payload = {"username": user_email, "password": user_password}
    login_res = requests.post(f"{BASE_URL}/auth/login", data=login_payload)
    print_response(login_res)
    if login_res.status_code != 200:
        print("\nGAGAL: Login tidak berhasil. Menghentikan tes.")
        return
    access_token = login_res.json()["access_token"]
    print(f"\n--> Berhasil mendapatkan token.")

    # 3. Membuat Kursus Baru (Memicu Alur AI)
    print_step("3. Membuat Kursus Baru (Topik: 'Dasar-dasar FastAPI untuk Pemula')")
    auth_headers = {"Authorization": f"Bearer {access_token}"}
    course_payload = {
        "topic": "Dasar-dasar FastAPI untuk Pemula",
        "difficulty": "Beginner",
        "goal": "Membangun REST API sederhana"
    }
    print("Mengirim permintaan untuk membuat kursus... Proses ini mungkin memakan waktu karena melibatkan AI.")
    
    # Proses AI bisa lama, jadi kita set timeout yang lebih panjang (misal: 5 menit)
    try:
        create_course_res = requests.post(f"{BASE_URL}/courses/", headers=auth_headers, json=course_payload, timeout=300)
        print_response(create_course_res)
    except requests.exceptions.ReadTimeout:
        print("\nPERINGATAN: Permintaan timeout. Proses AI mungkin masih berjalan di latar belakang.")
        print("Ini wajar jika model AI membutuhkan waktu lama untuk merespons.")
        print("Coba periksa endpoint GET /courses/ setelah beberapa saat.")
        return

    if create_course_res.status_code != 201:
        print("\nGAGAL: Permintaan pembuatan kursus tidak berhasil.")
        return
    
    new_course_id = create_course_res.json().get("id")
    print(f"\n--> Kursus baru sedang dibuat dengan ID: {new_course_id}")
    print("--> Status awal: 'generating'")

    # 4. Mengambil Semua Kursus Milik Pengguna
    print_step("4. Mengambil Semua Kursus untuk Memverifikasi")
    print("Menunggu 5 detik sebelum mengambil data...")
    time.sleep(5)
    get_courses_res = requests.get(f"{BASE_URL}/courses/", headers=auth_headers)
    print_response(get_courses_res)

    print("\n" + "="*60)
    print("PENGUJIAN SELESAI")
    print("="*60)

if __name__ == "__main__":
    main()
