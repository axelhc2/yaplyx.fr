// app/components/OffresWhyChooseUs.tsx
'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Shield, Zap, Users, Award, Star, Euro, TrendingUp, Heart } from 'lucide-react';

export default function OffresWhyChooseUs() {
  const [loaded, setLoaded] = useState(false);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    setLoaded(true);
    // Animation progressive des éléments
    advantages.forEach((_, i) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, i]);
      }, i * 100);
    });
  }, []);

  const advantages = [
    {
      icon: Euro,
      title: "Tarifs transparents",
      description: "Prix fixes sans frais cachés. Payez uniquement ce dont vous avez besoin, quand vous en avez besoin.",
      metric: "€0/minimum",
      color: "text-blue-600 dark:text-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Évolutivité flexible",
      description: "Montez ou descendez en puissance à tout moment. Changement d'offre en un clic, sans interruption.",
      metric: "Illimitée",
      color: "text-green-600 dark:text-green-500"
    },
    {
      icon: Clock,
      title: "Paiement mensuel",
      description: "Facturation mensuelle souple. Pas d'engagement long terme, résiliez quand vous voulez.",
      metric: "30 jours",
      color: "text-purple-600 dark:text-purple-500"
    },
    {
      icon: Heart,
      title: "Satisfaction garantie",
      description: "Si vous n'êtes pas satisfait dans les 30 premiers jours, nous vous remboursons intégralement.",
      metric: "100%",
      color: "text-orange-600 dark:text-orange-500"
    },
    {
      icon: Shield,
      title: "Sécurité incluse",
      description: "Tous les niveaux de sécurité sont inclus dans chaque offre, pas de surcoût pour la protection.",
      metric: "Gratuite",
      color: "text-red-600 dark:text-red-500"
    },
    {
      icon: Star,
      title: "Support premium",
      description: "Assistance technique prioritaire avec temps de réponse garanti selon votre offre choisie.",
      metric: "24/7",
      color: "text-indigo-600 dark:text-indigo-500"
    }
  ];

  const stats = [
    { value: "30 jours", label: "Essai gratuit" },
    { value: "€0", label: "Frais de setup" },
    { value: "99.9%", label: "Garantie satisfaction" },
    { value: "24/7", label: "Support offert" }
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-white dark:bg-black overflow-hidden">
      {/* Fond avec gradient sophistiqué */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-white to-cyan-50/30 dark:from-gray-900/20 dark:via-black dark:to-gray-900/20" />

      {/* Formes géométriques sophistiquées */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-gradient-to-br from-violet-100/20 to-purple-100/20 dark:from-violet-900/10 dark:to-purple-900/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-gradient-to-br from-cyan-100/15 to-blue-100/15 dark:from-cyan-900/8 dark:to-blue-900/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      </div>

      {/* Particules colorées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: 18, top: 22, delay: 0.4, duration: 5.2 },
          { left: 72, top: 38, delay: 1.3, duration: 4.7 },
          { left: 45, top: 12, delay: 2.6, duration: 6.1 },
          { left: 89, top: 67, delay: 0.9, duration: 4.3 },
          { left: 28, top: 84, delay: 1.8, duration: 5.8 },
          { left: 63, top: 29, delay: 3.1, duration: 4.9 },
          { left: 12, top: 56, delay: 0.7, duration: 6.4 },
          { left: 81, top: 41, delay: 2.2, duration: 5.0 },
          { left: 37, top: 73, delay: 1.5, duration: 4.6 },
          { left: 94, top: 18, delay: 2.9, duration: 5.7 },
          { left: 56, top: 87, delay: 0.2, duration: 6.2 },
          { left: 23, top: 34, delay: 3.4, duration: 4.8 },
          { left: 78, top: 62, delay: 1.1, duration: 5.3 },
          { left: 41, top: 91, delay: 2.7, duration: 4.4 },
          { left: 67, top: 7, delay: 0.8, duration: 6.0 },
          { left: 8, top: 78, delay: 1.9, duration: 5.5 }
        ].map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-violet-400/20 to-cyan-400/20 dark:from-violet-300/10 dark:to-cyan-300/10 rounded-full animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Pourquoi choisir nos
            <span className="bg-gradient-to-r from-[#d23f26] to-[#b83220] bg-clip-text text-transparent"> offres ?</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
            Des tarifs compétitifs, une flexibilité maximale et une qualité de service irréprochable.
            Découvrez pourquoi des milliers d'équipes nous font confiance.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className={`group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
                visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/50 dark:to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon avec métrique */}
              <div className="relative flex items-center justify-between mb-6">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:shadow-md transition-all duration-300`}>
                  <advantage.icon className={`w-7 h-7 ${advantage.color} transition-colors duration-300`} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{advantage.metric}</div>
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-[#d23f26] dark:group-hover:text-[#d23f26] transition-colors duration-300">
                  {advantage.title}
                </h3>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                  {advantage.description}
                </p>
              </div>

              {/* Check icon */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d23f26]/10 to-[#b83220]/10 dark:from-[#d23f26]/20 dark:to-[#b83220]/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className="text-2xl font-bold text-[#d23f26]">{stat.value}</div>
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-800/30 border border-green-200/60 dark:border-green-800/50 rounded-xl shadow-sm">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              Garantie de remboursement sous 30 jours • Aucun risque
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}




