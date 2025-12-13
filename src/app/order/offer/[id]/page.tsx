'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, ChevronDown, Shield, Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

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

interface CartItem {
  offerId: number;
  duration: number; // en mois
  price: number;
}

function OrderPageContent() {
  const params = useParams();
  const router = useRouter();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers');
        if (response.ok) {
          const data = await response.json();
          setAllOffers(data.offers);
          
          // Trouver l'offre sélectionnée
          const offerId = parseInt(params.id as string);
          const offer = data.offers.find((o: Offer) => o.id === offerId);
          if (offer) {
            setSelectedOffer(offer);
            // Si c'est une offre lifetime, pas de sélection de durée
            if (offer.period === 'lifetime') {
              setSelectedDuration(0);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des offres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [params.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    }).format(price);
  };

  const calculatePrice = () => {
    if (!selectedOffer) return 0;
    if (selectedOffer.period === 'lifetime') {
      return selectedOffer.price;
    }
    return selectedOffer.price * selectedDuration;
  };


  const handleDurationSelect = (months: number) => {
    setSelectedDuration(months);
    // Sauvegarder dans les cookies
    saveToCart();
  };

  const handleOfferChange = (offer: Offer) => {
    setSelectedOffer(offer);
    if (offer.period === 'lifetime') {
      setSelectedDuration(0);
    } else {
      setSelectedDuration(1);
    }
    // Rediriger vers la nouvelle URL
    router.push(`/order/offer/${offer.id}`);
    saveToCart();
  };

  const saveToCart = () => {
    if (!selectedOffer) return;
    
    const cartItem: CartItem = {
      offerId: selectedOffer.id,
      duration: selectedOffer.period === 'lifetime' ? 0 : selectedDuration,
      price: calculatePrice(),
    };

    // Sauvegarder dans les cookies
    document.cookie = `cart=${JSON.stringify(cartItem)}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 jours
  };

  useEffect(() => {
    if (selectedOffer) {
      saveToCart();
    }
  }, [selectedOffer, selectedDuration]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!selectedOffer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Offre introuvable
          </h1>
          <Button onClick={() => router.push('/offres')}>
            Retour aux offres
          </Button>
        </div>
      </div>
    );
  }

  const totalHT = calculatePrice();
  const isLifetime = selectedOffer.period === 'lifetime';
  const renewalPrice = selectedOffer.price;

  const durations = [
    { months: 1, label: '1 mois' },
    { months: 3, label: '3 mois' },
    { months: 6, label: '6 mois' },
    { months: 12, label: '12 mois' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900/20 dark:via-black dark:to-gray-900/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Configuration */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1 : Configuration de l'offre */}
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                1 - Configuration de votre offre
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Le nom de l'offre :
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="bg-white/50 dark:bg-[#1A1A1A] border border-gray-200/50 dark:border-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {selectedOffer.name}
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2">
                                Modifier
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-96 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-2xl border border-gray-200/50 dark:border-[#1A1A1A] max-h-[500px] overflow-y-auto">
                              {allOffers.map((offer) => (
                                <DropdownMenuItem
                                  key={offer.id}
                                  onClick={() => handleOfferChange(offer)}
                                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1A1A1A]"
                                >
                                  <div className="w-full">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {offer.name}
                                      </h4>
                                      <span className="text-sm font-bold text-[#d23f26]">
                                        {formatPrice(offer.price)}
                                        {offer.period === 'month' ? '/mois' : ' à vie'}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                                      <div>
                                        <span className="font-medium">Serveurs:</span> {offer.servers === 0 ? 'Illimités' : offer.servers}
                                      </div>
                                      <div>
                                        <span className="font-medium">Règles:</span> {offer.rules === 0 ? 'Illimitées' : offer.rules}
                                      </div>
                                      <div>
                                        <span className="font-medium">Groupes:</span> {offer.group === 0 ? 'Illimités' : offer.group}
                                      </div>
                                      <div>
                                        <span className="font-medium">Sécurité:</span> {offer.host ? 'Oui' : 'Non'}
                                      </div>
                                      {offer.stats && (
                                        <div className="col-span-2">
                                          <span className="font-medium">Stats:</span> Oui
                                        </div>
                                      )}
                                      {offer.logs && (
                                        <div className="col-span-2">
                                          <span className="font-medium">Logs:</span> Oui
                                        </div>
                                      )}
                                      <div className="col-span-2">
                                        <span className="font-medium">Support:</span> {offer.support}
                                      </div>
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Serveurs:</span>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {selectedOffer.servers === 0 ? 'Illimités' : selectedOffer.servers}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Règles:</span>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {selectedOffer.rules === 0 ? 'Illimitées' : selectedOffer.rules}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Groupes:</span>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {selectedOffer.group === 0 ? 'Illimités' : selectedOffer.group}
                            </p>
                          </div>
                        </div>
                        {selectedOffer.stats && (
                          <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-[#1A1A1A]">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Stats:</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Accès au statistique des serveurs</p>
                          </div>
                        )}
                        {selectedOffer.logs && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Logs:</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Accès aux logs des règles</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 : Durée du contrat */}
            {!isLifetime && (
              <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  2 - Durée du contrat
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {durations.map((duration) => {
                    const price = renewalPrice * duration.months;
                    const isSelected = selectedDuration === duration.months;
                    
                    return (
                      <button
                        key={duration.months}
                        onClick={() => handleDurationSelect(duration.months)}
                        className={cn(
                          'relative p-6 rounded-xl border-2 transition-all text-left',
                          isSelected
                            ? 'border-[#d23f26] bg-gradient-to-br from-[#d23f26]/10 to-[#b83220]/10 dark:from-[#d23f26]/20 dark:to-[#b83220]/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white/50 dark:bg-[#1A1A1A]'
                        )}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="w-5 h-5 text-[#d23f26]" />
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {duration.label}
                          </span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-[#d23f26] to-[#b83220] bg-clip-text text-transparent">
                            {formatPrice(price)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Prix renouvellement : {formatPrice(renewalPrice)}/{selectedOffer.period === 'month' ? 'mois' : 'période'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {isLifetime && (
              <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  2 - Durée du contrat
                </h2>
                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 dark:from-green-500/20 dark:to-green-600/20 border-2 border-green-500/30 rounded-xl p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      Offre à vie
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Aucun renouvellement nécessaire
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite - Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Récapitulatif
              </h2>

              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Produit</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedOffer.name}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatPrice(totalHT)}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-[#1A1A1A]">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Total HT</span>
                  <span className="text-xl font-bold text-[#d23f26]">
                    {formatPrice(totalHT)}
                  </span>
                </div>
              </div>

              {/* Garanties */}
              <div className="space-y-2 pt-4 border-t border-gray-200/50 dark:border-[#1A1A1A]">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Satisfait ou remboursé 30 jours
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Support client français 7j/7
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Paiement 100% sécurisé SSL
                  </p>
                </div>
              </div>

              {/* Bouton de paiement */}
              <Button
                className="w-full mt-5 h-10 text-sm font-semibold bg-gradient-to-r from-[#d23f26] to-[#b83220] hover:from-[#b83220] hover:to-[#a02a1a] text-white shadow-lg shadow-[#d23f26]/30"
                onClick={async () => {
                  saveToCart();
                  // Générer un UUID et rediriger vers l'authentification
                  const { fetchWithCSRF } = await import('@/lib/csrf-client');
                  const response = await fetchWithCSRF('/api/order/create', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      offerId: selectedOffer.id,
                      duration: selectedDuration,
                      price: totalHT,
                    }),
                  });
                  // Vérifier si la réponse est vide ou 404
                  if (response.status === 404 || !response.ok) {
                    console.error('Erreur lors de la création de la commande');
                    return;
                  }

                  const data = await response.json();
                  if (data.uuid) {
                    router.push(`/order/auth/${data.uuid}`);
                  }
                }}
              >
                Procéder au paiement
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderPageContent />
    </Suspense>
  );
}

