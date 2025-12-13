// app/components/WhyChooseUs.tsx
'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Shield, Zap, Users, Award, Star } from 'lucide-react';

export default function WhyChooseUs() {
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
      icon: Clock,
      title: "Déploiement ultra-rapide",
      description: "De 0 à opérationnel en moins de 30 minutes. Pas de configuration complexe, tout est automatisé.",
      metric: "< 30 min",
      color: "text-blue-600 dark:text-blue-500"
    },
    {
      icon: Shield,
      title: "Sécurité de niveau entreprise",
      description: "Chiffrement bcrypt, authentification 2FA, et conformité RGPD. Vos données sont en sécurité.",
      metric: "99.9%",
      color: "text-green-600 dark:text-green-500"
    },
    {
      icon: Zap,
      title: "Performance optimale",
      description: "Architecture scalable qui s'adapte à votre croissance. Temps de réponse inférieur à 3 secondes.",
      metric: "< 3 sec",
      color: "text-purple-600 dark:text-purple-500"
    },
    {
      icon: Users,
      title: "Support expert 24/7",
      description: "Équipe technique disponible en permanence. Résolution moyenne des tickets en moins de 2h.",
      metric: "24/7",
      color: "text-orange-600 dark:text-orange-500"
    },
    {
      icon: Award,
      title: "Certification reconnue",
      description: "Certifié ISO 27001 et conforme aux standards de sécurité les plus exigeants du marché.",
      metric: "ISO 27001",
      color: "text-red-600 dark:text-red-500"
    },
    {
      icon: Star,
      title: "Interface intuitive",
      description: "Dashboard moderne et facile à prendre en main. Formation non requise pour vos équipes.",
      metric: "5/5 UX",
      color: "text-indigo-600 dark:text-indigo-500"
    }
  ];

  const stats = [
    { value: "300+", label: "Équipes satisfaites" },
    { value: "99.99%", label: "Uptime garanti" },
    { value: "8 400+", label: "Serveurs sécurisés" },
    { value: "< 3s", label: "Déploiement moyen" }
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
          { left: 41, top: 9, delay: 2.7, duration: 6.0 },
          { left: 67, top: 75, delay: 0.6, duration: 4.4 },
          { left: 31, top: 48, delay: 3.2, duration: 5.5 }
        ].map((particle, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-violet-400/40 to-cyan-400/40 dark:from-violet-300/20 dark:to-cyan-300/20 rounded-full animate-ping"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
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
        {/* Titre avec effets spectaculaires */}
        <div className={`text-center mb-16 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 relative z-10">
              Pourquoi nous <span className="relative">
                <span className="text-[#d23f26]">choisir</span>
                {/* Soulignement en forme de vague */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-5 text-[#d23f26] animate-pulse"
                  viewBox="0 0 300 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 10 Q37.5 5 75 10 Q112.5 15 150 10 Q187.5 5 225 10 Q262.5 15 300 10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="drop-shadow-lg"
                  />
                </svg>
                {/* Glow intense */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#d23f26]/15 to-[#d23f26]/15 blur-2xl -z-10 animate-pulse" />
              </span>
            </h2>

          </div>

          <div className="relative">
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              La solution firewall moderne qui combine simplicité d'usage et sécurité de niveau entreprise
            </p>

            {/* Ligne décorative avec motif */}
            <svg className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-40 h-3 text-slate-400 dark:text-gray-500" viewBox="0 0 160 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 6 Q20 3 40 6 Q60 9 80 6 Q100 3 120 6 Q140 9 160 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2,2"/>
            </svg>
          </div>
        </div>

        {/* Avantages principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {advantages.map((advantage, i) => {
            const isVisible = visibleItems.includes(i);
            const IconComponent = advantage.icon;

            return (
              <div
                key={i}
                className={`group relative transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative bg-white/90 dark:bg-[#050505] backdrop-blur-sm border border-slate-200/60 dark:border-gray-800/50 rounded-xl p-6 h-full hover:border-slate-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/30 dark:hover:shadow-gray-900/50 group-hover:-translate-y-1">
                  {/* Métrique en badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 bg-gray-50 dark:bg-[#111111] border border-gray-200/50 dark:border-gray-800/50 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300`}>
                      {advantage.metric}
                    </div>
                    <div className={`p-2 rounded-lg bg-gray-50 dark:bg-[#111111] border border-gray-200/50 dark:border-gray-800/50 ${advantage.color} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Contenu */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-[#d23f26] transition-colors duration-300">
                      {advantage.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>

                  {/* Indicateur de validation */}
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className={`w-4 h-4 transition-all duration-500 ${
                      isVisible
                        ? 'text-green-500 opacity-100'
                        : 'text-gray-300 dark:text-gray-700 opacity-0'
                    }`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistiques */}
        <div className={`transition-all duration-1000 delay-800 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white dark:bg-[#050505] border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-8 lg:p-12 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Chiffres qui parlent
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Notre engagement envers la qualité et la sécurité
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
