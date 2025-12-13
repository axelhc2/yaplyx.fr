// app/components/Features.tsx
'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Settings, Shield, Server, Key, Plus, Download, Users, FileText, Target, Lock } from 'lucide-react';

export default function Features() {
  const [loaded, setLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    setLoaded(true);
    // Animation progressive des cartes
    steps.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, i]);
      }, i * 100);
    });
  }, []);

  const steps = [
    {
      icon: Settings,
      title: "Choix de l'offre",
      description: "Sélectionnez l'offre adaptée à vos besoins",
      color: "text-blue-600 dark:text-blue-500"
    },
    {
      icon: Shield,
      title: "Mise en place du cluster",
      description: "Configuration automatique de votre infrastructure",
      color: "text-purple-600 dark:text-purple-500"
    },
    {
      icon: Settings,
      title: "Configuration dashboard",
      description: "Interface personnalisée selon vos préférences",
      color: "text-indigo-600 dark:text-indigo-500"
    },
    {
      icon: Key,
      title: "Connexion sécurisée",
      description: "Authentification multi-facteurs et chiffrement",
      color: "text-green-600 dark:text-green-500"
    },
    {
      icon: Plus,
      title: "Ajout des serveurs",
      description: "Intégration facile de vos serveurs existants",
      color: "text-teal-600 dark:text-teal-500"
    },
    {
      icon: Download,
      title: "Installation automatique",
      description: "Déploiement des agents en un clic",
      color: "text-cyan-600 dark:text-cyan-500"
    },
    {
      icon: Users,
      title: "Création groupe sécurité",
      description: "Organisation des équipes et permissions",
      color: "text-orange-600 dark:text-orange-500"
    },
    {
      icon: FileText,
      title: "Définition des règles",
      description: "Configuration des politiques de sécurité",
      color: "text-red-600 dark:text-red-500"
    },
    {
      icon: Target,
      title: "Application ciblée",
      description: "Déploiement précis sur vos environnements",
      color: "text-pink-600 dark:text-pink-500"
    },
    {
      icon: Lock,
      title: "Sécurité maximale",
      description: "Protection avancée et monitoring continu",
      color: "text-[#d23f26]"
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
          { left: 40, top: 70, delay: 2.4, duration: 3.1 },
          { left: 85, top: 45, delay: 0.8, duration: 4.9 },
          { left: 15, top: 85, delay: 1.7, duration: 3.5 },
          { left: 60, top: 25, delay: 2.9, duration: 4.6 },
          { left: 35, top: 55, delay: 1.4, duration: 3.9 },
          { left: 75, top: 80, delay: 0.6, duration: 4.3 },
          { left: 50, top: 10, delay: 2.1, duration: 3.7 },
          { left: 90, top: 65, delay: 1.8, duration: 4.8 },
          { left: 25, top: 40, delay: 2.6, duration: 3.3 },
          { left: 65, top: 90, delay: 0.9, duration: 4.1 }
        ].map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 dark:from-indigo-300/15 dark:to-purple-300/15 rounded-full animate-ping"
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
        {/* Titre avec effets avancés */}
        <div className={`text-center mb-16 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 relative z-10">
              Installation en <span className="relative">
                <span className="text-[#d23f26]">10 étapes</span>
                {/* Soulignement ondulé animé */}
                <svg
                  className="absolute -bottom-1 left-0 w-full h-3 text-[#d23f26] animate-pulse"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 6 Q25 3 50 6 Q75 9 100 6 Q125 3 150 6 Q175 9 200 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="drop-shadow-md"
                  />
                </svg>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-[#d23f26]/10 blur-lg -z-10 animate-pulse" />
              </span>
            </h2>

          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto relative">
            Une expérience simple et fluide. Vous êtes opérationnel en moins de 30 minutes.

            {/* Ligne décorative sous le paragraphe */}
            <svg className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 text-slate-300 dark:text-gray-600" viewBox="0 0 128 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 4 Q16 2 32 4 Q48 6 64 4 Q80 2 96 4 Q112 6 128 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </p>
        </div>

        {/* Timeline horizontale avec étapes */}
        <div className="relative max-w-6xl mx-auto">
          {/* Ligne de progression */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-[#d23f26]/30 to-gray-200 dark:from-gray-800 dark:via-[#d23f26]/20 dark:to-gray-800">
            
          </div>

          {/* Étapes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, i) => {
              const isVisible = visibleCards.includes(i);
              const IconComponent = step.icon;
              const isCompleted = visibleCards.length > i;

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
                  {/* Cercle de progression */}
                  <div className="flex justify-center mb-6">
                    <div className={`relative w-16 h-16 rounded-full border-4 transition-all duration-500 ${
                      isCompleted
                        ? 'bg-[#d23f26] border-[#d23f26] shadow-lg shadow-[#d23f26]/30'
                        : 'bg-white dark:bg-[#050505] border-gray-200 dark:border-gray-800'
                    }`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isCompleted ? (
                          <CheckCircle2 className="w-8 h-8 text-white" />
                        ) : (
                          <IconComponent className={`w-6 h-6 ${step.color}`} />
                        )}
                      </div>
                      {isCompleted && (
                        <div className="absolute inset-0 rounded-full bg-[#d23f26] animate-ping opacity-20" />
                      )}
                    </div>
                  </div>

                  {/* Carte de contenu */}
                  <div className="relative bg-white/90 dark:bg-[#050505] backdrop-blur-sm border border-slate-200/60 dark:border-gray-800/50 rounded-xl p-5 text-center hover:border-slate-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/30 dark:hover:shadow-gray-900/50 group-hover:-translate-y-1">
                    <div className="flex items-center justify-center mb-3">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors duration-300 ${
                        isCompleted
                          ? 'bg-[#d23f26] text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {i + 1}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#d23f26] transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Indicateur de statut */}
                    <div className="absolute top-3 right-3">
                      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                        isCompleted
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

        {/* Message final */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-[#050505] rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-[#d23f26]" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Prêt en moins de <span className="text-[#d23f26]">30 minutes</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}