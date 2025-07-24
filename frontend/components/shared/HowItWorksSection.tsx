const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Masukkan Ide Anda',
      description: 'Cukup ketik topik yang ingin Anda pelajari, pilih tingkat kesulitan, dan tentukan tujuan Anda.'
    },
    {
      number: '02',
      title: 'AI Merancang Semuanya',
      description: 'Sistem cerdas kami akan menganalisis input Anda dan secara instan menghasilkan kurikulum yang lengkap dan terstruktur.'
    },
    {
      number: '03',
      title: 'Mulai Belajar',
      description: 'Nikmati materi pembelajaran yang kaya, kerjakan kuis interaktif, dan lacak kemajuan Anda di dasbor pribadi.'
    }
  ];

  return (
    <section id="cara-kerja" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Hanya Butuh 3 Langkah Mudah</h2>
          <p className="mt-4 text-lg text-foreground/80">Mulai perjalanan belajar Anda dalam hitungan menit.</p>
        </div>
        <div className="relative">
          {/* Dotted line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-border border-t-2 border-dashed -translate-y-1/2"></div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step) => (
              <div key={step.number} className="text-center bg-white p-4">
                <div className="flex items-center justify-center mb-4">
                   <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary font-bold text-2xl border-2 border-primary/20">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-foreground/80">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
