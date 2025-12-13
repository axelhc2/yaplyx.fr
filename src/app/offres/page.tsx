'use client';

import Link from 'next/link';
import { CheckCircle2, Star, ArrowRight, Monitor, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import CTASection from '@/app/components/CTASection';
import Footer from '@/app/components/Footer';

interface Offer {
  id: number;
  name: string;
  price: number;
  period: string;
  description: string;
  servers: number;
  group: number;
  rules: number;
  host: boolean;
  logs: boolean;
  stats: boolean;
  support: string;
  popular: boolean;
}

export default function OffresPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers');
        if (response.ok) {
          const data = await response.json();
          setOffers(data.offers);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des offres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    }).format(price);
  };

  const formatPeriod = (period: string) => {
    if (period === 'month') return '/mois';
    if (period === 'lifetime') return 'à vie';
    return period;
  };

  const buildFeatures = (offer: Offer): string[] => {
    const features: string[] = [];

    // Serveurs
    if (offer.servers === 0) {
      features.push('Serveurs illimités');
    } else {
      features.push(`${offer.servers} serveur${offer.servers > 1 ? 's' : ''}`);
    }

    // Groupes de règles
    if (offer.group === 0) {
      features.push('Groupes de règles illimités');
    } else {
      features.push(`${offer.group} groupe${offer.group > 1 ? 's' : ''} de règles`);
    }

    // Règles
    if (offer.rules === 0) {
      features.push('Règles illimitées');
    } else {
      features.push(`${offer.rules} règle${offer.rules > 1 ? 's' : ''}`);
    }

    // Auto-hébergé
    if (offer.host) {
      features.push('Auto-hébergé');
    }

    // Logs
    if (offer.logs) {
      features.push('Accès aux logs des règles');
    }

    // Stats
    if (offer.stats) {
      features.push('Accès au statistique des serveurs');
    }

    // Support
    if (offer.support) {
      features.push(`Support ${offer.support}`);
    }

    return features;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-black dark:to-black">
        {/* Header */}
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Tarification transparente
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Choisissez votre
              <span className="text-orange-500"> plan</span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Auto-hébergé · Aucune donnée externe · Contrôle total · Déploiement instantané
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
            {offers.map((offer) => {
              const features = buildFeatures(offer);
              const isLifetime = offer.period === 'lifetime';
              const periodText = formatPeriod(offer.period);

              return (
                <div
                  key={offer.id}
                  className={`
                    relative group bg-white dark:bg-[#0A0A0A] rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 min-h-[500px] flex flex-col
                    ${offer.popular
                      ? 'border-orange-200 dark:border-orange-800 shadow-lg shadow-orange-100 dark:shadow-orange-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }
                  `}
                >
                  {/* Popular Badge */}
                  {offer.popular && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
                      <div className="bg-orange-500 text-white py-2 px-4 rounded-full text-sm font-medium shadow-lg">
                        Populaire
                      </div>
                    </div>
                  )}

                  {/* Lifetime Badge */}
                  {isLifetime && (
                    <div className="absolute -top-4 right-4 z-10">
                      <div className="bg-green-500 text-white px-3 py-2 rounded-full text-xs font-medium shadow-lg">
                        À vie
                      </div>
                    </div>
                  )}

                  <div className="flex-grow p-8" style={{paddingTop: offer.popular || isLifetime ? '3rem' : '2rem'}}>
                    {/* Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {offer.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {offer.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {formatPrice(offer.price)}
                        </span>
                        <span className="text-base text-gray-600 dark:text-gray-400">
                          {periodText}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="p-8 pt-0">
                    <Link
                      href={`/order/offer/${offer.id}`}
                      className={`
                        w-full py-3 px-4 rounded-lg font-medium text-center transition-all duration-200 flex items-center justify-center gap-2 text-sm
                        ${offer.popular || isLifetime
                          ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
                          : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-[#0A0A0A] dark:hover:bg-gray-100'
                        }
                      `}
                    >
                      {offer.price === 0 ? 'Commencer' : isLifetime ? 'Acheter' : `Choisir ${offer.name}`}
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Questions fréquentes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Tout ce que vous devez savoir
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {[
                {
                  question: "Quels sont les systèmes d'exploitation compatibles ?",
                  answer: (
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        Notre solution est compatible avec les distributions Linux suivantes :
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { name: "Debian", logo: "🟡", version: "9+" },
                          { name: "Ubuntu", logo: "🟠", version: "18.04+" },
                          { name: "CentOS", logo: "🔴", version: "7+" },
                          { name: "AlmaLinux", logo: "🟣", version: "8+" },
                          { name: "Kali Linux", logo: "🔵", version: "2021+" },
                          { name: "Fedora", logo: "🔵", version: "33+" },
                          { name: "Rocky Linux", logo: "🟢", version: "8+" },
                          { name: "Proxmox", logo: "⚡", version: "6+" }
                        ].map((distro) => (
                          <div key={distro.name} className="bg-gray-50 dark:bg-[#0A0A0A] rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                            <div className="text-2xl mb-1">{distro.logo}</div>
                            <div className="text-xs font-semibold text-gray-900 dark:text-white">{distro.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{distro.version}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                },
                {
                  question: "Est-ce vraiment auto-hébergé ?",
                  answer: "Oui, 100% auto-hébergé. Aucune donnée n'est envoyée à nos serveurs. Vous gardez le contrôle total de vos données et de votre infrastructure. L'application fonctionne entièrement sur votre serveur."
                },
                {
                  question: "Comment installer la solution ?",
                  answer: "L'installation est simple : téléchargez le package, exécutez le script d'installation automatique, configurez votre base de données, et c'est prêt ! La documentation complète est fournie avec des guides détaillés."
                },
                {
                  question: "Quelles sont les fonctionnalités incluses ?",
                  answer: "Selon votre plan : gestion de serveurs, création de groupes de règles, monitoring en temps réel, logs détaillés, interface d'administration web, API REST, et bien plus. Chaque plan offre des capacités croissantes."
                },
                {
                  question: "Support technique inclus ?",
                  answer: "Le support technique prioritaire par email/chat est inclus dans les plans Pro et Enterprise. Le plan Starter bénéficie d'une communauté Discord active et de la documentation complète."
                },
                {
                  question: "Puis-je migrer depuis un autre système ?",
                  answer: "Oui, nous proposons des outils de migration pour faciliter la transition depuis d'autres solutions similaires. Contactez-nous pour évaluer vos besoins spécifiques."
                },
                {
                  question: "Quelle est la fréquence des mises à jour ?",
                  answer: "Les mises à jour sont publiées régulièrement avec de nouvelles fonctionnalités, améliorations de sécurité, corrections de bugs et optimisations de performance."
                },
                {
                  question: "Puis-je tester avant d'acheter ?",
                  answer: "Bien sûr ! Le plan Starter est gratuit et sans limitation de temps. Il vous permet de découvrir toutes les fonctionnalités essentielles et de valider que la solution correspond à vos besoins."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white dark:bg-[#0A0A0A] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#0A0A0B] transition-colors"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white pr-4">
                      {faq.question}
                    </h4>
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {openFAQ === index && (
                    <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="pt-4">
                        {typeof faq.answer === 'string' ? (
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        ) : (
                          faq.answer
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Vous avez des questions ? Contactez-nous
            </p>
            <Link
              href="/commencer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg text-sm"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-3">
              Aucune carte requise · Installation en 5 minutes
            </p>
          </div>
        </div>
      </div>
      <CTASection />
      <Footer />
    </>
  );
}
