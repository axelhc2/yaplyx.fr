'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Server, Users, Shield, MessageCircle, Euro, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

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
  active: boolean;
  period: string;
  description: string;
  createdAt: string;
  expiresAt: string | null;
  isLifetime: boolean;
  clusters: { id: number }[];
}

export default function ServicesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);

  // Fonction pour calculer les jours restants avant expiration
  const getDaysUntilExpiration = (expiresAt: string | null): number | null => {
    if (!expiresAt) return null;
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    const loadServices = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (!sessionResponse.ok) {
          router.push('/auth/login');
          return;
        }

        const servicesResponse = await fetch('/api/dashboard/services');
        if (servicesResponse.ok) {
          const data = await servicesResponse.json();
          setServices(data.services || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des services:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mes services
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez et consultez tous vos services actifs
            </p>
          </div>

          {/* Services List */}
          {services.length === 0 ? (
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-12 text-center">
              <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucun service
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Vous n'avez pas encore de services actifs
              </p>
              <button
                onClick={() => router.push('/offres')}
                className="px-6 py-3 bg-gradient-to-r from-[#d23f26] to-[#b83220] text-white rounded-xl font-semibold hover:from-[#b83220] hover:to-[#a02a1a] transition-all shadow-lg shadow-[#d23f26]/30"
              >
                Voir les offres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {services.map((service) => {
                const hasCluster = service.clusters && service.clusters.length > 0;
                
                return (
                  <div
                    key={service.id}
                    className="relative"
                  >
                    {/* Message "Pas de cluster" au-dessus de la carte */}
                    {!hasCluster && (
                      <div className="absolute -top-3 left-0 right-0 z-10 flex justify-center">
                        <div className="bg-orange-500 dark:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold flex items-center gap-2">
                          <Server className="w-4 h-4" />
                          <span>Vous n'avez pas encore de cluster</span>
                        </div>
                      </div>
                    )}
                    
                    <div
                      onClick={() => router.push(`/dashboard/services/${service.id}`)}
                      className={`bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-4 hover:shadow-xl transition-all cursor-pointer group ${!hasCluster ? 'pt-8' : ''}`}
                    >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${service.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#d23f26] transition-colors truncate">
                            {service.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {service.period}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-white flex-shrink-0">
                        <Euro className="w-3 h-3" />
                        {Number(service.price).toFixed(2)}
                      </div>
                    </div>

                    {/* Info compact */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Server className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{service.servers} serveur{service.servers > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{service.group} groupe{service.group > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{service.rules} règle{service.rules > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300 truncate">{service.support}</span>
                      </div>
                    </div>

                    {/* Features badges compact */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {service.host && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                          Host
                        </span>
                      )}
                      {service.logs && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400">
                          Logs
                        </span>
                      )}
                      {service.stats && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                          Stats
                        </span>
                      )}
                    </div>

                    {/* Footer compact */}
                    <div className="pt-3 border-t border-gray-200/50 dark:border-[#1A1A1A]">
                      {service.isLifetime ? (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Service à vie
                        </span>
                      ) : service.expiresAt ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(service.expiresAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                          </span>
                          {(() => {
                            const daysLeft = getDaysUntilExpiration(service.expiresAt);
                            if (daysLeft === null || daysLeft > 7) return null;
                            if (daysLeft < 0) {
                              return <span className="text-xs text-red-600 dark:text-red-400 font-medium">Expiré</span>;
                            } else if (daysLeft === 0) {
                              return <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">Aujourd'hui</span>;
                            } else {
                              return <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">{daysLeft}j</span>;
                            }
                          })()}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(service.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                        </span>
                      )}
                    </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



