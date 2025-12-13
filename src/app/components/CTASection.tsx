// app/components/CTASection.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative overflow-hidden py-16 bg-white dark:bg-black">
      {/* Section CTA professionnelle - style comme l'exemple */}
      <div className="relative isolate overflow-hidden bg-black px-6 py-16 text-center shadow-2xl mx-6 rounded-3xl sm:px-16">
        {/* Fond avec effet complexe */}
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#d23f26]/10 via-[#d23f26]/5 to-slate-900/10"
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
          />
        </div>

        <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Prêt à sécuriser votre infrastructure ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300">
              Rejoignez des centaines d'entreprises qui nous font confiance pour protéger leurs données sensibles avec Yaplyx.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/offres"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-slate-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Consulter nos offres
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold text-white hover:text-gray-300 transition-colors"
              >
                Nous contacter <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
