import Link from 'next/link';
import { Button } from '../ui/Button';

const HeroSection = () => {
  return (
    <section className="relative bg-transparent">
      <div className="relative container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-6 z-10">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-300 max-w-4xl leading-tight md:leading-snug">
          Ubah Topik Apapun Menjadi Kurikulum Lengkap dalam Sekejap
        </h1>
        <p className="mt-6 text-lg md:text-xl text-neutral-300 max-w-2xl">
          Platform pembelajaran berbasis AI yang secara otomatis merancang silabus, materi, dan kuis yang dipersonalisasi khusus untuk Anda.
        </p>
        <Link href="/register" className="mt-8">
          <Button 
            variant="default"
            size="lg"
            className="transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary))]"
          >
            Coba Gratis Sekarang
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
