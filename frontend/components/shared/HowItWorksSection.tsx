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
    <section id="cara-kerja" className="py-20 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Hanya Butuh 3 Langkah Mudah</h2>
          <p className="mt-4 text-lg text-neutral-300">Mulai perjalanan belajar Anda dalam hitungan menit.</p>
        </div>
        <div className="relative">
          {/* Dotted line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2"></div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step) => (
              <div key={step.number} className="text-center bg-white/5 p-8 rounded-2xl border border-white/10 shadow-lg backdrop-blur-lg">
                <div className="flex items-center justify-center mb-6">
                   <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-3xl border-2 border-primary/30 shadow-lg">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-neutral-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
