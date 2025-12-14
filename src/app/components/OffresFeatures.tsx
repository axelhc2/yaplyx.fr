// app/components/OffresFeatures.tsx
'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Server, Shield, Zap, Users, Star, Crown, Rocket, Infinity } from 'lucide-react';

export default function OffresFeatures() {
  const [loaded, setLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    setLoaded(true);
    // Animation progressive des cartes
    features.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, i]);
      }, i * 100);
    });
  }, []);

  const features = [
    {
      icon: Server,
      title: "Serveurs illimités",
      description: "Gérez autant de serveurs que nécessaire avec notre offre entreprise",
      color: "text-blue-600 dark:text-blue-500",
      highlight: "Entreprise"
    },
    {
      icon: Shield,
      title: "Sécurité renforcée",
      description: "Chiffrement avancé et monitoring 24/7 inclus dans toutes nos offres",
      color: "text-purple-600 dark:text-purple-500",
      highlight: "Toutes les offres"
    },
    {
      icon: Zap,
      title: "Déploiement instantané",
      description: "Vos règles de firewall sont appliquées en moins de 3 secondes",
      color: "text-indigo-600 dark:text-indigo-500",
      highlight: "Toutes les offres"
    },
    {
      icon: Users,
      title: "Support prioritaire",
      description: "Assistance technique dédiée et réponse garantie sous 2h",
      color: "text-green-600 dark:text-green-500",
      highlight: "Boost & Pro"
    },
    {
      icon: Star,
      title: "Fonctionnalités avancées",
      description: "Logs détaillés, alertes personnalisées et rapports d'activité",
      color: "text-teal-600 dark:text-teal-500",
      highlight: "Pro & Entreprise"
    },
    {
      icon: Crown,
      title: "API complète",
      description: "Intégrez Yaplyx dans vos workflows existants via notre API REST",
      color: "text-cyan-600 dark:text-cyan-500",
      highlight: "Pro & Entreprise"
    },
    {
      icon: Rocket,
      title: "Migration gratuite",
      description: "Transfert de vos données et configurations sans interruption",
      color: "text-orange-600 dark:text-orange-500",
      highlight: "Nouvelle offre"
    },
    {
      icon: Infinity,
      title: "Évolutivité garantie",
      description: "Montez en puissance à tout moment sans reconfiguration",
      color: "text-[#d23f26]",
      highlight: "Toutes les offres"
    }
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-white dark:bg-black overflow-hidden">
      {/* Fond avec gradient sophistiqué */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 dark:from-gray-900/20 dark:via-black dark:to-gray-900/20" />

      {/* Formes géométriques sophistiquées */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -right-32 w-64 h-64 bg-gradient-to-br from-indigo-100/15 to-purple-100/15 dark:from-indigo-900/8 dark:to-purple-900/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 -left-24 w-48 h-48 bg-gradient-to-br from-cyan-100/20 to-blue-100/20 dark:from-cyan-900/10 dark:to-blue-900/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

      </div>

      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: 20, top: 30, delay: 0.3, duration: 3.8 },
          { left: 70, top: 15, delay: 1.1, duration: 4.2 },
          { left: 85, top: 70, delay: 0.8, duration: 4.7 },
          { left: 35, top: 85, delay: 1.5, duration: 3.9 },
          { left: 15, top: 65, delay: 2.2, duration: 5.1 },
          { left: 90, top: 40, delay: 0.6, duration: 4.3 },
          { left: 45, top: 20, delay: 1.8, duration: 3.6 },
          { left: 75, top: 90, delay: 2.7, duration: 4.9 },
          { left: 5, top: 45, delay: 1.3, duration: 5.3 },
          { left: 60, top: 5, delay: 0.9, duration: 4.1 },
          { left: 95, top: 80, delay: 2.4, duration: 3.8 },
          { left: 25, top: 10, delay: 1.7, duration: 4.6 }
        ].map((particle, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 dark:from-indigo-300/15 dark:to-purple-300/15 rounded-full animate-pulse"
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
            Fonctionnalités incluses dans nos
            <span className="bg-gradient-to-r from-[#d23f26] to-[#b83220] bg-clip-text text-transparent"> offres</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
            Découvrez les avantages et fonctionnalités offertes par chaque plan Yaplyx,
            conçues pour répondre aux besoins de sécurité de votre infrastructure.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 ${
                visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Badge highlight */}
              <div className="absolute -top-3 left-4 bg-gradient-to-r from-slate-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-slate-200/60 dark:border-gray-700/50 px-3 py-1 rounded-full text-xs font-medium text-slate-700 dark:text-gray-300 shadow-sm">
                {feature.highlight}
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/50 dark:to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon */}
              <div className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 mb-4 shadow-sm group-hover:shadow-md transition-all duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color} transition-colors duration-300`} />
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-[#d23f26] dark:group-hover:text-[#d23f26] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover arrow */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-4 h-4 text-[#d23f26]" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-slate-200/60 dark:border-gray-700/50 rounded-xl shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
              Toutes les offres incluent une période d'essai gratuite de 30 jours
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}




