import Link from 'next/link';
import { Button } from '../ui/Button';

const HeroSection = () => {
  return (
    <section className="relative bg-background">
      <div className="absolute inset-0 bg-gradient-abstract" />
      <div className="relative container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground max-w-4xl">
          Ubah Topik Apapun Menjadi Kurikulum Lengkap dalam Sekejap
        </h1>
        <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-2xl">
          Platform pembelajaran berbasis AI yang secara otomatis merancang silabus, materi, dan kuis yang dipersonalisasi khusus untuk Anda.
        </p>
        <Link href="/register">
          <Button className="mt-8 px-8 py-4 text-lg transform hover:scale-105">
            Coba Gratis Sekarang
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
