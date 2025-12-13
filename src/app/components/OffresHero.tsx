// app/components/OffresHero.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Star } from 'lucide-react';

export default function OffresHero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-black overflow-hidden">
      {/* Fond subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900/20" />

      {/* Ligne décorative subtile */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-8">

          {/* Badge simple */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/50 border border-gray-800 backdrop-blur-sm transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Star className="w-4 h-4 text-[#d23f26]" />
            <span className="text-sm font-medium text-gray-300">Offres Yaplyx</span>
          </div>

          {/* Titre minimaliste */}
          <div className={`space-y-4 transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Choisissez votre
              <span className="block bg-gradient-to-r from-[#d23f26] to-[#b83220] bg-clip-text text-transparent">
                plan idéal
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              De la solution gratuite aux fonctionnalités enterprise.
              Toutes nos offres incluent la sécurité et la simplicité d'utilisation.
            </p>
          </div>

          {/* Statistiques importantes */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 transition-all duration-1000 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {[
              { value: '10k+', label: 'Utilisateurs actifs' },
              { value: '€0', label: 'Coût de départ' },
              { value: '99.9%', label: 'Uptime garanti' },
              { value: '24/7', label: 'Support technique' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Boutons d'action simples */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 transition-all duration-1000 delay-600 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href="#pricing"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#d23f26] to-[#b83220] text-white font-semibold rounded-xl hover:from-[#b83220] hover:to-[#a02a1a] transition-all duration-300 hover:shadow-2xl hover:shadow-[#d23f26]/25 hover:scale-105"
            >
              Voir les offres
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/demo"
              className="inline-flex items-center gap-3 px-8 py-4 text-gray-300 hover:text-white border border-gray-800 rounded-xl hover:border-gray-600 transition-all duration-300 hover:bg-gray-900/50"
            >
              Tester gratuitement
            </Link>
          </div>

          {/* Avantages clés */}
          <div className={`flex flex-wrap items-center justify-center gap-6 pt-12 text-sm text-gray-400 transition-all duration-1000 delay-800 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Paiement mensuel</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Essai gratuit 30 jours</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Résiliation flexible</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}