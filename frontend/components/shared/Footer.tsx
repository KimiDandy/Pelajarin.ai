import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-border">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-lg font-bold text-foreground">Pelajarin.ai</p>
            <p className="text-sm text-foreground/70">Tutor Pribadi Cerdas Anda</p>
          </div>
          <div className="flex space-x-6">
            <Link href="#fitur" className="text-foreground/80 hover:text-primary transition-colors">Fitur</Link>
            <Link href="#cara-kerja" className="text-foreground/80 hover:text-primary transition-colors">Cara Kerja</Link>
            <Link href="/login" className="text-foreground/80 hover:text-primary transition-colors">Masuk</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-foreground/60 border-t border-border pt-6">
          <p>&copy; {new Date().getFullYear()} Pelajarin.ai. Semua Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
