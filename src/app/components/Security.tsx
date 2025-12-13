// app/components/Security.tsx
'use client';

import { useEffect, useState } from 'react';
import { Shield, Lock, Eye, Key, Fingerprint, Activity, AlertTriangle } from 'lucide-react';

export default function Security() {
  const [loaded, setLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    setLoaded(true);
    // Animation progressive des cartes
    features.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, i]);
      }, i * 80);
    });
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Chiffrement bcrypt",
      description: "Protection avancée de vos données sensibles",
      color: "text-red-600 dark:text-red-500"
    },
    {
      icon: Lock,
      title: "2FA obligatoire",
      description: "Double authentification activée par défaut",
      color: "text-orange-600 dark:text-orange-500"
    },
    {
      icon: Eye,
      title: "Surveillance 24/7",
      description: "Monitoring continu et détection d'anomalies",
      color: "text-blue-600 dark:text-blue-500"
    },
    {
      icon: Key,
      title: "Gestion des clés",
      description: "Rotation automatique et sécurisée des clés",
      color: "text-green-600 dark:text-green-500"
    },
    {
      icon: Fingerprint,
      title: "Conformité RGPD",
      description: "Respect total de la réglementation européenne",
      color: "text-purple-600 dark:text-purple-500"
    },
    {
      icon: Activity,
      title: "Audit continu",
      description: "Vérifications régulières et rapports détaillés",
      color: "text-indigo-600 dark:text-indigo-500"
    }
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-white dark:bg-black overflow-hidden">
      {/* Fond avec gradient sophistiqué */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-white to-orange-50/30 dark:from-gray-900/20 dark:via-black dark:to-gray-900/20" />

      {/* Formes géométriques dramatiques */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-rose-100/20 to-pink-100/20 dark:from-rose-900/10 dark:to-pink-900/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/2 left-1/4 w-48 h-48 bg-gradient-to-br from-orange-100/15 to-red-100/15 dark:from-orange-900/8 dark:to-red-900/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

      </div>

      {/* Particules de sécurité */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: 14, top: 28, delay: 0.5, duration: 5.2 },
          { left: 68, top: 12, delay: 1.8, duration: 6.1 },
          { left: 42, top: 74, delay: 2.3, duration: 4.7 },
          { left: 86, top: 35, delay: 0.9, duration: 5.8 },
          { left: 23, top: 61, delay: 3.1, duration: 4.3 },
          { left: 77, top: 48, delay: 1.4, duration: 6.4 },
          { left: 31, top: 19, delay: 2.7, duration: 5.0 },
          { left: 59, top: 82, delay: 0.2, duration: 4.9 },
          { left: 91, top: 53, delay: 3.4, duration: 5.6 },
          { left: 7, top: 39, delay: 1.6, duration: 6.2 },
          { left: 54, top: 8, delay: 2.9, duration: 4.8 },
          { left: 38, top: 67, delay: 0.7, duration: 5.7 },
          { left: 82, top: 24, delay: 3.6, duration: 4.4 },
          { left: 16, top: 89, delay: 1.1, duration: 6.0 },
          { left: 73, top: 41, delay: 2.5, duration: 5.3 },
          { left: 49, top: 76, delay: 0.4, duration: 4.6 },
          { left: 25, top: 57, delay: 3.2, duration: 5.9 },
          { left: 67, top: 93, delay: 1.9, duration: 4.1 }
        ].map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-rose-400/50 to-orange-400/50 dark:from-rose-300/25 dark:to-orange-300/25 rounded-full animate-ping"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
        {[
          { left: 22, top: 33, delay: 0.3 },
          { left: 74, top: 18, delay: 1.2 },
          { left: 46, top: 69, delay: 2.1 },
          { left: 88, top: 44, delay: 0.8 },
          { left: 15, top: 77, delay: 1.7 },
          { left: 62, top: 26, delay: 2.5 },
          { left: 34, top: 52, delay: 1.4 },
          { left: 79, top: 61, delay: 2.8 }
        ].map((particle, i) => (
          <div
            key={`shield-${i}`}
            className="absolute w-2 h-2 text-rose-300/40 dark:text-rose-200/20 animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Motif de fond discret avec plus de sophistication */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 3px 3px, currentColor 1.5px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Titre avec effets de sécurité */}
        <div className={`text-center mb-16 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 relative z-10">
              Sécurité <span className="relative">
                <span className="text-[#d23f26]">maximale</span>
                {/* Soulignement en dents de scie */}
                <svg
                  className="absolute -bottom-1 left-0 w-full h-4 text-[#d23f26] animate-pulse"
                  viewBox="0 0 250 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 8 L25 4 L50 12 L75 4 L100 12 L125 4 L150 12 L175 4 L200 12 L225 4 L250 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="drop-shadow-lg"
                  />
                </svg>
                {/* Glow de sécurité */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#d23f26]/20 to-[#d23f26]/20 blur-xl -z-10 animate-pulse" />
              </span>
            </h2>

          </div>

          <div className="relative">
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Vos données sont protégées par les meilleures technologies de sécurité au monde
            </p>

            {/* Ligne de protection stylisée */}
            <svg className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-48 h-4 text-slate-500 dark:text-gray-400" viewBox="0 0 192 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 8 Q24 4 48 8 Q72 12 96 8 Q120 4 144 8 Q168 12 192 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="3,2"/>
            </svg>
          </div>
        </div>

        {/* Dashboard de sécurité */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Métriques principales */}
          <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="bg-white/90 dark:bg-[#050505] backdrop-blur-xl border border-slate-200/60 dark:border-gray-800/50 rounded-2xl p-8 shadow-xl shadow-slate-200/20 dark:shadow-black/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Niveau de sécurité</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Évaluation en temps réel</p>
                </div>
              </div>

              {/* Métriques */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Chiffrement</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-500">bcrypt</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Authentification</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
                    </div>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-500">2FA</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Conformité</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"></div>
                    </div>
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-500">RGPD</span>
                  </div>
                </div>
              </div>

              {/* Badge de certification */}
              <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
                <div className="flex items-center justify-center gap-2">
                  <div className="px-3 py-1 bg-[#d23f26]/10 border border-[#d23f26]/20 rounded-full">
                    <span className="text-xs font-semibold text-[#d23f26]">Certifié ISO 27001</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fonctionnalités détaillées */}
          <div className={`space-y-4 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {features.map((feature, i) => {
              const isVisible = visibleCards.includes(i);
              const IconComponent = feature.icon;

              return (
                <div
                  key={i}
                  className={`group transition-all duration-700 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start gap-4 p-4 bg-white/90 dark:bg-[#050505] backdrop-blur-sm border border-slate-200/60 dark:border-gray-800/50 rounded-xl hover:border-slate-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/30 dark:hover:shadow-gray-900/50">
                    <div className={`p-2 rounded-lg bg-slate-50 dark:bg-[#111111] border border-slate-200/60 dark:border-gray-800/50 ${feature.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-[#d23f26] transition-colors duration-300">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                        isVisible
                          ? 'bg-green-500 shadow-sm shadow-green-500/50'
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section de confiance */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-white/90 dark:bg-[#050505] backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-gray-800/50 shadow-xl shadow-slate-200/20 dark:shadow-black/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#d23f26]" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Zéro compromission depuis 2020
              </span>
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              99.999% uptime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

