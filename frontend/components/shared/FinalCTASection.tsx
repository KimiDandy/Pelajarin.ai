import Link from 'next/link';
import { Button } from '../ui/Button';

const FinalCTASection = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground max-w-2xl mx-auto">
          Siap Merevolusi Cara Anda Belajar?
        </h2>
        <Link href="/register">
          <Button className="mt-8 px-8 py-4 text-lg transform hover:scale-105">
            Daftar Gratis Sekarang
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FinalCTASection;
