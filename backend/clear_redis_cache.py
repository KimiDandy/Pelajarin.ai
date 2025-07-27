import redis
import os

# --- Konfigurasi --- #
# Ambil konfigurasi dari environment variables, dengan default value jika tidak ada.
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))
# ------------------- #

def clear_redis_cache():
    """
    Menghubungkan ke server Redis dan menghapus semua key dari database yang aktif.
    """
    try:
        # Membuat koneksi ke Redis
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB, decode_responses=True)
        
        # Memeriksa koneksi
        r.ping()
        print(f"Berhasil terhubung ke Redis di {REDIS_HOST}:{REDIS_PORT}, database {REDIS_DB}.")
        
        # Menjalankan perintah FLUSHDB
        print("Menghapus semua cache dari database saat ini...")
        keys_deleted = r.flushdb()
        
        print(f"Cache berhasil dibersihkan. Perintah FLUSHDB dieksekusi.")
        
    except redis.exceptions.ConnectionError as e:
        print(f"Gagal terhubung ke Redis: {e}")
        print("Pastikan Redis server sedang berjalan dan konfigurasi (host, port) sudah benar.")
    except Exception as e:
        print(f"Terjadi error: {e}")

if __name__ == "__main__":
    clear_redis_cache()
