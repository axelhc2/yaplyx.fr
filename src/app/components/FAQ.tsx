'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: "Comment fonctionne l'installation auto-hébergée ?",
    answer:
      "Notre système d'installation auto-hébergée vous permet de déployer Yaplyx sur votre propre infrastructure. Il suffit de quelques clics pour que tout soit opérationnel, sans dépendre de nos serveurs.",
  },
  {
    id: 2,
    question: 'Puis-je changer d\'offre à tout moment ?',
    answer:
      'Oui, vous pouvez upgrader ou downgrader votre offre à tout moment. Les changements prennent effet immédiatement et la facturation est ajustée prorata.',
  },
  {
    id: 3,
    question: 'Qu\'est-ce que l\'accès au code source ?',
    answer:
      'L\'offre Lifetime Ultimate inclut l\'accès complet au code source de Yaplyx, vous permettant de l\'héberger où vous voulez et de le personnaliser selon vos besoins.',
  },
  {
    id: 4,
    question: 'Le support est-il inclus dans toutes les offres ?',
    answer:
      'Oui, toutes nos offres incluent un support adapté à vos besoins. Du support email basique au support dédié 24/7 selon l\'offre choisie.',
  },
  {
    id: 5,
    question: 'Puis-je essayer Yaplyx gratuitement ?',
    answer:
      'Oui, nous proposons une période d\'essai gratuite de 14 jours pour toutes nos offres. Aucune carte de crédit requise pour commencer.',
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl text-center mb-12">
          Questions fréquentes
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openItems.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-black border border-slate-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-black/50 rounded-xl transition-colors duration-200"
                >
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0 ml-4">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500 dark:text-gray-400" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-4">
                    <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
                      <p className="text-base leading-7 text-slate-600 dark:text-gray-400">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
