// app/components/Hero.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Lock, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-start bg-white dark:bg-black overflow-hidden">
      {/* Fond avec gradient sophistiqué */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900/20 dark:via-black dark:to-gray-900/20" />

      {/* Formes géométriques sophistiquées */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-gradient-to-br from-indigo-100/15 to-cyan-100/15 dark:from-indigo-900/8 dark:to-cyan-900/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-violet-100/20 to-pink-100/20 dark:from-violet-900/10 dark:to-pink-900/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

      </div>

      {/* Particules animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: 15, top: 25, delay: 0.5, duration: 4.2 },
          { left: 75, top: 45, delay: 1.2, duration: 5.8 },
          { left: 35, top: 80, delay: 2.1, duration: 3.9 },
          { left: 85, top: 15, delay: 3.4, duration: 6.1 },
          { left: 45, top: 65, delay: 0.8, duration: 4.7 },
          { left: 25, top: 35, delay: 1.9, duration: 5.3 },
          { left: 65, top: 70, delay: 2.7, duration: 4.4 },
          { left: 55, top: 20, delay: 3.8, duration: 3.6 },
          { left: 90, top: 55, delay: 1.4, duration: 5.9 },
          { left: 10, top: 75, delay: 2.5, duration: 4.8 },
          { left: 70, top: 30, delay: 0.3, duration: 6.2 },
          { left: 40, top: 85, delay: 1.7, duration: 4.1 },
          { left: 80, top: 40, delay: 2.9, duration: 5.5 },
          { left: 20, top: 60, delay: 3.1, duration: 3.8 },
          { left: 60, top: 10, delay: 0.9, duration: 5.7 },
          { left: 95, top: 50, delay: 1.6, duration: 4.3 },
          { left: 5, top: 90, delay: 2.3, duration: 6.0 },
          { left: 50, top: 5, delay: 3.6, duration: 4.9 },
          { left: 30, top: 95, delay: 0.7, duration: 5.1 },
          { left: 72, top: 22, delay: 2.8, duration: 4.6 }
        ].map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400/40 to-purple-400/40 dark:from-blue-300/20 dark:to-purple-300/20 rounded-full animate-ping"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
        {[
          { left: 12, top: 18, delay: 0.2, duration: 5.5 },
          { left: 88, top: 32, delay: 1.1, duration: 6.2 },
          { left: 42, top: 67, delay: 2.4, duration: 4.8 },
          { left: 78, top: 12, delay: 3.3, duration: 5.9 },
          { left: 23, top: 78, delay: 0.8, duration: 6.7 },
          { left: 67, top: 45, delay: 1.9, duration: 4.3 },
          { left: 34, top: 89, delay: 2.6, duration: 5.4 },
          { left: 91, top: 23, delay: 3.7, duration: 6.1 },
          { left: 56, top: 34, delay: 1.5, duration: 4.9 },
          { left: 8, top: 56, delay: 2.8, duration: 5.6 },
          { left: 74, top: 81, delay: 0.4, duration: 6.3 },
          { left: 29, top: 14, delay: 3.2, duration: 4.7 },
          { left: 63, top: 47, delay: 1.3, duration: 5.8 },
          { left: 19, top: 69, delay: 2.7, duration: 6.4 },
          { left: 84, top: 8, delay: 3.9, duration: 4.2 }
        ].map((particle, i) => (
          <div
            key={`large-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-indigo-300/30 to-cyan-300/30 dark:from-indigo-200/15 dark:to-cyan-200/15 rounded-full animate-pulse"
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

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 lg:pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Section gauche - Contenu principal */}
          <div className={`space-y-6 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-slate-200/60 dark:border-gray-800/50 shadow-sm backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5 text-[#d23f26]" />
              <span className="text-xs font-semibold text-slate-700 dark:text-gray-300">Cluster firewall nouvelle génération</span>
            </div>

            {/* Titre principal avec effets avancés */}
            <div className="relative">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight relative z-10">
                Gérez tous vos
                <br />
                <span className="relative">
                  <span className="bg-gradient-to-r from-[#d23f26] to-[#b83220] bg-clip-text text-transparent">
                    firewalls en un clic
                  </span>
                  {/* Soulignement zig-zag animé */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-4 text-[#d23f26] animate-pulse"
                    viewBox="0 0 400 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 10 Q25 5 50 10 Q75 15 100 10 Q125 5 150 10 Q175 15 200 10 Q225 5 250 10 Q275 15 300 10 Q325 5 350 10 Q375 15 400 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="drop-shadow-lg"
                    />
                  </svg>
                  {/* Effet de glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d23f26]/20 to-[#b83220]/20 blur-xl -z-10 animate-pulse" />
                </span>
              </h1>

            </div>

            {/* Description */}
            <p className="text-base text-slate-600 dark:text-gray-400 max-w-xl leading-relaxed">
              Synchronisation automatique des règles sur tous vos serveurs.
              Ajout, modification, déploiement — tout est centralisé et instantané.
            </p>

            {/* Points clés */}
            <div className="space-y-3">
              {[
                'Déploiement en moins de 3 secondes',
                'Synchronisation automatique multi-serveurs',
                'Interface intuitive et sécurisée'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-[#d23f26] to-[#b83220] shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-white flex-shrink-0" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Boutons d'action avec effets avancés */}
            <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
              <div className="relative group">
                {/* Particules autour du bouton */}
                <div className="absolute inset-0 -m-2">
                  {[
                    { top: 25, left: 30 },
                    { top: 70, left: 75 },
                    { top: 45, left: 20 },
                    { top: 80, left: 55 },
                    { top: 30, left: 80 },
                    { top: 60, left: 40 }
                  ].map((particle, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-[#d23f26] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"
                      style={{
                        top: `${particle.top}%`,
                        left: `${particle.left}%`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '2s'
                      }}
                    />
                  ))}
                </div>

                <Link
                  href="/commencer"
                  className="relative inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-[#d23f26] to-[#b83220] hover:from-[#b83220] hover:to-[#a02a1a] rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#d23f26]/40 hover:scale-105 overflow-hidden group"
                >
                  {/* Effet de shimmer */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d23f26] to-[#b83220] blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />

                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />

                </Link>
              </div>

              <Link
                href="/demo"
                className="relative inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-[#d23f26] dark:hover:text-[#d23f26] transition-all duration-300 border border-slate-200 dark:border-gray-800 rounded-xl hover:border-slate-300 dark:hover:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800/50 backdrop-blur-sm group overflow-hidden"
              >
                {/* Effet de ripple au hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 dark:via-slate-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                Voir la démo

                {/* Flèche animée */}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Section droite - Dashboard preview */}
          <div className={`relative transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {/* Effet de glow sophistiqué */}
            <div className="absolute -inset-6 bg-gradient-to-r from-[#d23f26]/8 via-[#d23f26]/4 to-blue-500/4 dark:from-[#d23f26]/10 dark:via-[#d23f26]/5 dark:to-transparent rounded-3xl blur-3xl" />

            <div className="relative bg-white/90 dark:bg-[#050505] backdrop-blur-xl border border-slate-200/60 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden shadow-slate-200/20 dark:shadow-black/20">
              {/* Header du dashboard */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60 dark:border-gray-800 bg-gradient-to-r from-slate-50/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d23f26] to-[#b83220] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">Yaplyx Dashboard</div>
                    <div className="text-xs text-slate-500 dark:text-gray-400">Tous les serveurs</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50" />
                  <span className="text-xs text-slate-600 dark:text-gray-400 font-medium">En ligne</span>
                </div>
              </div>

              {/* Contenu du dashboard */}
              <div className="p-5 space-y-4">
                {/* Statistiques */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-slate-200/60 dark:border-gray-800/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">127</div>
                    <div className="text-xs font-medium text-slate-600 dark:text-gray-400">Serveurs</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-800/30 rounded-xl p-4 border border-green-200/60 dark:border-gray-800/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400 mb-1">99.9%</div>
                    <div className="text-xs font-medium text-green-600 dark:text-gray-400">Synchronisé</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-800/30 rounded-xl p-4 border border-red-200/60 dark:border-gray-800/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="text-2xl font-bold text-[#d23f26] mb-1">42</div>
                    <div className="text-xs font-medium text-red-600 dark:text-gray-400">Règles actives</div>
                  </div>
                </div>

                {/* Graphique */}
                <div className="bg-slate-50 dark:bg-gray-800/50 rounded-lg p-4 border border-slate-200/60 dark:border-gray-800/50">
                  <div className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-3">Activité des déploiements</div>
                  <div className="flex items-end justify-between h-20 gap-1.5">
                    {[45, 68, 52, 82, 65, 92, 78].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-[#d23f26] to-[#d23f26]/60 rounded-t transition-all duration-1000 hover:opacity-80"
                        style={{
                          height: loaded ? `${h}%` : '0%',
                          transitionDelay: `${i * 80}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Actions récentes */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700 dark:text-gray-300">Activité récente</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-slate-200/60 dark:border-gray-800/50">
                      <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-900 dark:text-white truncate">Règle #42 déployée</div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">Il y a 2 minutes</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-slate-200/60 dark:border-gray-800/50">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-900 dark:text-white truncate">Serveur fr1.yaplyx.net ajouté</div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">Il y a 8 minutes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section statistiques en bas */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {[
              { value: '300+', label: 'Équipes actives' },
              { value: '8 400+', label: 'Serveurs protégés' },
              { value: '99.99%', label: 'Uptime mensuel' },
              { value: '< 3s', label: 'Déploiement moyen' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}