import { BeakerIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: <SparklesIcon className="h-6 w-6" />,
    title: 'Struktur Otomatis',
    description: 'Dapatkan peta jalan belajar yang logis dan terstruktur secara otomatis, dari dasar hingga mahir.',
  },
  {
    icon: <BeakerIcon className="h-6 w-6" />,
    title: 'Personalisasi Mendalam',
    description: 'Kurikulum dibuat khusus untuk Anda, menyesuaikan dengan tingkat keahlian dan tujuan belajar Anda.',
  },
  {
    icon: <BookOpenIcon className="h-6 w-6" />,
    title: 'Pembelajaran Interaktif',
    description: 'Materi yang kaya visual dan kuis interaktif untuk menjaga Anda tetap terlibat dan termotivasi.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="fitur" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Mengapa Memilih Pelajarin.ai?</h2>
          <p className="mt-4 text-lg text-foreground/80">Platform kami dirancang untuk membuat belajar menjadi lebih efisien dan menyenangkan.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
