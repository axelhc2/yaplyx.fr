'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Server, Users, Shield, MessageCircle, Euro, CheckCircle2, XCircle, HardDrive, FileText, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

interface Service {
  id: number;
  name: string;
  servers: number;
  group: number;
  rules: number;
  host: boolean;
  logs: boolean;
  stats: boolean;
  support: string;
  price: number;
  period: string;
  description: string;
  offer: {
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
  };
}

export default function RenewServicePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<Service | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);

  const durations = [
    { months: 1, label: '1 mois' },
    { months: 3, label: '3 mois' },
    { months: 6, label: '6 mois' },
    { months: 12, label: '12 mois' },
  ];

  useEffect(() => {
    const loadService = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (!sessionResponse.ok) {
          router.push('/auth/login');
          return;
        }

        const serviceId = params?.id as string;
        if (!serviceId) {
          router.push('/dashboard/services');
          return;
        }

        const serviceResponse = await fetch(`/api/dashboard/services/${serviceId}/renew`);
        if (serviceResponse.ok) {
          const data = await serviceResponse.json();
          setService(data.service);
        } else if (serviceResponse.status === 404) {
          router.push('/dashboard/services');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du service:', error);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [router, params]);

  const calculateTotalPrice = (): number => {
    if (!service) return 0;
    const monthlyPrice = Number(service.offer.price);
    return monthlyPrice * selectedDuration;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="bg-white dark:bg-black">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6 sm:p-8 lg:p-12 text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Service introuvable
              </p>
              <Link
                href="/dashboard/services"
                className="text-[#d23f26] hover:underline"
              >
                Retour aux services
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard/services"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#d23f26] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux services
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Renouveler votre service
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {service.offer.name}
            </p>
          </div>

          {/* Spécificités de l'offre */}
          <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Spécificités de l'offre
            </h2>

            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Serveurs</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {service.offer.servers}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Groupes</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {service.offer.group}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Règles</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {service.offer.rules}
                  </p>
                </div>
              </div>
            </div>

            {/* Fonctionnalités */}
            <div className="border-t border-gray-200/50 dark:border-[#1A1A1A] pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Fonctionnalités incluses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  {service.offer.host ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">Host</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {service.offer.logs ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">Logs</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {service.offer.stats ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">Stats</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    Support: {service.offer.support}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sélection de la durée */}
          <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Durée de renouvellement
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {durations.map((duration) => (
                <button
                  key={duration.months}
                  onClick={() => setSelectedDuration(duration.months)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedDuration === duration.months
                      ? 'border-[#d23f26] bg-[#d23f26]/10 dark:bg-[#d23f26]/20'
                      : 'border-gray-200 dark:border-[#1A1A1A] hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <p className={`text-lg font-bold ${
                    selectedDuration === duration.months
                      ? 'text-[#d23f26]'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {duration.label}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {(Number(service.offer.price) * duration.months).toFixed(2)} €
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Récapitulatif et bouton de paiement */}
          <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">Prix mensuel</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {Number(service.offer.price).toFixed(2)} €
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-600 dark:text-gray-400">Durée</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {selectedDuration} {selectedDuration > 1 ? 'mois' : 'mois'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-sm font-bold text-[#d23f26]">
                  {calculateTotalPrice().toFixed(2)} €
                </p>
              </div>
            </div>

            <button
              onClick={async () => {
                try {
                  const totalPrice = calculateTotalPrice();
                  
                  // Importer fetchWithCSRF
                  const { fetchWithCSRF } = await import('@/lib/csrf-client');
                  
                  // Créer la commande de renouvellement
                  const response = await fetchWithCSRF('/api/order/renew', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      serviceId: service.id,
                      duration: selectedDuration,
                      price: totalPrice,
                    }),
                  });

                  if (!response.ok) {
                    alert('Erreur lors de la création de la commande');
                    return;
                  }

                  const data = await response.json();
                  
                  // Rediriger vers la page de paiement
                  router.push(`/order/payments/${data.uuid}`);
                } catch (error) {
                  console.error('Erreur:', error);
                  alert('Une erreur est survenue');
                }
              }}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-[#d23f26] to-[#b83220] text-white rounded-lg font-semibold text-sm hover:from-[#b83220] hover:to-[#a02a1a] transition-all shadow-lg shadow-[#d23f26]/30 hover:scale-[1.02]"
            >
              Procéder au paiement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

