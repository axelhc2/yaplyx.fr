'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Server, Users, Shield, MessageCircle, Euro, ArrowLeft, CheckCircle2, XCircle, HardDrive, FileText, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface Cluster {
  id: number;
  url: string;
  token: string;
  createdAt: string;
  server: {
    id: number;
    ip: string;
    hostname: string;
  };
}

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
  clusters: Cluster[];
}

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<Service | null>(null);

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

        const serviceResponse = await fetch(`/api/dashboard/services/${serviceId}`);
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
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-12 text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Service introuvable
              </p>
              <Link
                href="/dashboard/services"
                className="text-[#d23f26] hover:underline"
              >
                Retour à la liste des services
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasCluster = service.clusters && service.clusters.length > 0;

  return (
    <div className="bg-white dark:bg-black">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
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
              {service.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {service.description}
            </p>
          </div>

          {/* Service Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center gap-3 mb-2">
                <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Serveurs</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {service.servers}
              </p>
            </div>

            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Groupes</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {service.group}
              </p>
            </div>

            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Règles</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {service.rules}
              </p>
            </div>

            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center gap-3 mb-2">
                <Euro className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Prix</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Number(service.price).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Fonctionnalités
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                {service.host ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm text-gray-900 dark:text-white">Host</span>
              </div>
              <div className="flex items-center gap-3">
                {service.logs ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm text-gray-900 dark:text-white">Logs</span>
              </div>
              <div className="flex items-center gap-3">
                {service.stats ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm text-gray-900 dark:text-white">Stats</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-900 dark:text-white">Support: {service.support}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${service.active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {service.active ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Période: {service.period}
                </span>
              </div>
            </div>
          </div>

          {/* Cluster Status */}
          <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              État du cluster
            </h2>
            
            {!hasCluster ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <Server className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Vous devez installer votre cluster
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Aucun cluster n'est actuellement associé à ce service
                </p>
                <button
                  onClick={() => router.push(`/dashboard/services/create/cluster/${service.id}`)}
                  className="px-6 py-3 bg-gradient-to-r from-[#d23f26] to-[#b83220] text-white rounded-xl font-semibold hover:from-[#b83220] hover:to-[#a02a1a] transition-all shadow-lg shadow-[#d23f26]/30"
                >
                  Installer votre cluster
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {service.clusters.map((cluster) => (
                  <div
                    key={cluster.id}
                    className="bg-gray-50/50 dark:bg-[#0F0F0F] rounded-xl p-6 border border-gray-200/50 dark:border-[#1A1A1A]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Cluster #{cluster.id}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">URL:</span>
                            <span className="text-gray-900 dark:text-white font-mono">{cluster.url}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">Serveur:</span>
                            <span className="text-gray-900 dark:text-white">{cluster.server.hostname} ({cluster.server.ip})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">Créé le:</span>
                            <span className="text-gray-900 dark:text-white">
                              {new Date(cluster.createdAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/20">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs font-medium text-green-800 dark:text-green-400">
                          Actif
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


