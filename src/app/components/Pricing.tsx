'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckIcon, X } from 'lucide-react';

const pricing = {
  tiers: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Parfait pour débuter avec Yaplyx.',
      price: '0.00 €',
      period: '/ mois',
      highlights: [
        '2 serveurs maximum',
        '4 règles par serveur',
        'Installation auto-hébergée',
        'Support par email'
      ],
      featured: false,
      cta: 'Commencer',
      popular: false
    },
    {
      id: 'boost',
      name: 'Boost',
      description: 'Pour les équipes en croissance.',
      price: '5,86 €',
      period: '/ mois',
      highlights: [
        '5 serveurs maximum',
        '6 règles par serveur',
        'Installation auto-hébergée',
        'Accès au statut des serveurs',
        'Support prioritaire'
      ],
      featured: true,
      cta: 'Commencer',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'La solution professionnelle complète.',
      price: '10 €',
      period: '/ mois',
      highlights: [
        '10 serveurs maximum',
        '15 règles par serveur',
        'Installation auto-hébergée',
        'Accès aux logs des règles',
        'Accès au statut des serveurs',
        'Support 24/7'
      ],
      featured: false,
      cta: 'Commencer',
      popular: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Pour les grandes infrastructures.',
      price: '30 €',
      period: '/ mois',
      highlights: [
        '50 serveurs maximum',
        '100 règles par serveur',
        'Installation auto-hébergée',
        'Accès aux logs des règles',
        'Accès au statut des serveurs',
        'Support dédié',
        'Formation équipe incluse'
      ],
      featured: false,
      cta: 'Nous contacter',
      popular: false
    },
    {
      id: 'ultimate',
      name: 'Lifetime Ultimate',
      description: 'La solution ultime, paiement unique.',
      price: '200 €',
      period: 'à vie',
      highlights: [
        'Serveurs illimités',
        'Règles illimitées',
        'Accès au code source',
        'Installation auto-hébergée',
        'Accès aux logs des règles',
        'Accès au statut des serveurs',
        'Support premium à vie',
        'Mises à jour gratuites'
      ],
      featured: false,
      cta: 'Acheter maintenant',
      popular: false
    }
  ],
  sections: [
    {
      name: 'Fonctionnalités de base',
      features: [
        { name: 'Nombre de serveurs', tiers: { Starter: '2', Boost: '5', Pro: '10', Enterprise: '50', Ultimate: 'Illimité' } },
        { name: 'Nombre de règles', tiers: { Starter: '4', Boost: '6', Pro: '15', Enterprise: '100', Ultimate: 'Illimité' } },
        { name: 'Installation auto-hébergée', tiers: { Starter: true, Boost: true, Pro: true, Enterprise: true, Ultimate: true } },
        { name: 'Interface web moderne', tiers: { Starter: true, Boost: true, Pro: true, Enterprise: true, Ultimate: true } },
      ],
    },
    {
      name: 'Monitoring & Logs',
      features: [
        { name: 'Accès au statut des serveurs', tiers: { Starter: false, Boost: true, Pro: true, Enterprise: true, Ultimate: true } },
        { name: 'Accès aux logs des règles', tiers: { Starter: false, Boost: false, Pro: true, Enterprise: true, Ultimate: true } },
        { name: 'Alertes en temps réel', tiers: { Starter: false, Boost: true, Pro: true, Enterprise: true, Ultimate: true } },
        { name: 'Rapports d\'activité', tiers: { Starter: false, Boost: false, Pro: true, Enterprise: true, Ultimate: true } },
      ],
    },
    {
      name: 'Support & Formation',
      features: [
        { name: 'Support par email', tiers: { Starter: true, Boost: false, Pro: false, Enterprise: false, Ultimate: false } },
        { name: 'Support prioritaire', tiers: { Starter: false, Boost: true, Pro: false, Enterprise: false, Ultimate: false } },
        { name: 'Support 24/7', tiers: { Starter: false, Boost: false, Pro: true, Enterprise: false, Ultimate: false } },
        { name: 'Support dédié', tiers: { Starter: false, Boost: false, Pro: false, Enterprise: true, Ultimate: false } },
        { name: 'Support premium à vie', tiers: { Starter: false, Boost: false, Pro: false, Enterprise: false, Ultimate: true } },
        { name: 'Formation équipe incluse', tiers: { Starter: false, Boost: false, Pro: false, Enterprise: true, Ultimate: true } },
        { name: 'Accès au code source', tiers: { Starter: false, Boost: false, Pro: false, Enterprise: false, Ultimate: true } },
      ],
    },
  ],
};

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Pricing() {
  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50/50 dark:from-gray-900/20 dark:via-black dark:to-gray-900/20 py-24 sm:py-32">
      {/* Fond avec motif subtil */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Des offres pour tous les besoins
          </h2>
          <p className="mt-6 text-lg text-slate-600 dark:text-gray-400">
            Choisissez l'offre qui correspond à votre infrastructure et faites évoluer votre sécurité firewall selon vos besoins.
          </p>
        </div>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {pricing.tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={classNames(
                tier.featured
                  ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl ring-2 ring-[#d23f26]/20'
                  : 'bg-white/80 dark:bg-gray-900/50 text-slate-900 dark:text-white backdrop-blur-sm shadow-lg border border-slate-200/50 dark:border-gray-700/50',
                tierIdx === 0 ? 'lg:rounded-l-2xl' : '',
                tierIdx === pricing.tiers.length - 1 ? 'lg:rounded-r-2xl' : '',
                'relative p-8 lg:p-10 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group',
              )}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#d23f26] to-[#b83220] px-4 py-1.5 text-xs font-semibold text-white shadow-lg border border-[#d23f26]/20">
                    Le plus populaire
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={classNames(
                    tier.featured ? 'text-white' : 'text-slate-900 dark:text-white',
                    'text-lg font-semibold leading-8',
                  )}
                >
                  {tier.name}
                </h3>
              </div>
              <p className={classNames(
                tier.featured ? 'text-gray-300' : 'text-slate-600 dark:text-gray-400',
                'mt-4 text-sm leading-6',
              )}>
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className={classNames(
                  tier.featured ? 'text-white' : 'text-slate-900 dark:text-white',
                  'text-4xl font-bold tracking-tight',
                )}>
                  {tier.price}
                </span>
                <span className={classNames(
                  tier.featured ? 'text-gray-300' : 'text-slate-600 dark:text-gray-400',
                  'text-sm font-semibold leading-6',
                )}>
                  {tier.period}
                </span>
              </p>
              <Link
                href={tier.id === 'enterprise' || tier.id === 'ultimate' ? '/contact' : '/commencer'}
                className={classNames(
                  tier.featured
                    ? 'bg-white text-slate-900 hover:bg-gray-50 shadow-md'
                    : 'bg-gradient-to-r from-[#d23f26] to-[#b83220] text-white hover:from-[#b83220] hover:to-[#a02c1c] shadow-lg hover:shadow-xl',
                  'mt-6 block w-full rounded-xl px-6 py-3.5 text-center text-sm font-semibold leading-6 transition-all duration-300 hover:scale-105 group-hover:shadow-lg',
                )}
              >
                {tier.cta}
              </Link>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
                {tier.highlights.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className={classNames(
                        tier.featured ? 'text-white' : 'text-[#d23f26]',
                        'h-6 w-5 flex-none',
                      )}
                      aria-hidden="true"
                    />
                    <span className={tier.featured ? 'text-gray-300' : 'text-slate-600 dark:text-gray-400'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant pour la comparaison des fonctionnalités
export function PricingComparison() {
  return (
    <div className="relative bg-gradient-to-br from-slate-50/80 via-white/60 to-slate-50/80 dark:from-black/60 dark:via-black dark:to-black/60 py-24 sm:py-32">
      {/* Fond avec motif subtil */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 3px 3px, currentColor 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Comparaison des fonctionnalités
          </h2>
          <p className="mt-6 text-lg text-slate-600 dark:text-gray-400">
            Découvrez ce qui est inclus dans chaque offre pour choisir celle qui vous convient.
          </p>
        </div>

        <div className="mt-16">
          {pricing.sections.map((section, sectionIdx) => (
            <div key={section.name} className="mb-16">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-8">{section.name}</h3>
              <div className="bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden">
                <div className="grid grid-cols-6 gap-0">
                  {/* Header */}
                  <div className="font-semibold text-slate-900 dark:text-white p-6 bg-slate-100/80 dark:bg-black/70"></div>
                  {pricing.tiers.map((tier) => (
                    <div key={tier.id} className="text-center p-6 bg-slate-100/80 dark:bg-black/70 border-l border-slate-200/50 dark:border-gray-700/50">
                      <span className="font-semibold text-slate-900 dark:text-white">{tier.name}</span>
                    </div>
                  ))}

                  {/* Features */}
                  {section.features.map((feature, featureIdx) => (
                    <>
                      <div className={classNames(
                        "font-medium text-slate-700 dark:text-gray-300 p-6 border-t border-slate-200/50 dark:border-gray-700/50",
                        featureIdx % 2 === 0 ? "bg-white/40 dark:bg-black/40" : "bg-slate-50/40 dark:bg-black/50"
                      )}>
                        {feature.name}
                      </div>
                      {pricing.tiers.map((tier) => (
                        <div key={tier.id} className={classNames(
                          "text-center p-6 border-t border-l border-slate-200/50 dark:border-gray-700/50 transition-colors duration-200",
                          featureIdx % 2 === 0 ? "bg-white/40 dark:bg-black/40" : "bg-slate-50/40 dark:bg-black/50"
                        )}>
                          {typeof (feature.tiers as any)[tier.name] === 'string' ? (
                            <span className="font-semibold text-[#d23f26]">{(feature.tiers as any)[tier.name]}</span>
                          ) : (
                            <>
                              {(feature.tiers as any)[tier.name] === true ? (
                                <CheckIcon className="mx-auto h-5 w-5 text-green-600" />
                              ) : (
                                <X className="mx-auto h-5 w-5 text-gray-400" />
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
