'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Server, Users, Shield, MessageCircle, Euro, ArrowLeft, CheckCircle2, XCircle, HardDrive, FileText, BarChart3, Play, Square, RotateCw, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { useTranslation } from '@/lib/i18n';

interface Cluster {
  id: number;
  url: string;
  token: string;
  username: string;
  password: string;
  createdAt: string;
  server: {
    id: number;
    ip: string;
    hostname: string;
  };
}

interface ClusterStatus {
  name: string;
  status: 'online' | 'stopped';
  uptime: number;
  restarts: number;
  memory: number;
  cpu: number;
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
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<Service | null>(null);
  const [clusterStatuses, setClusterStatuses] = useState<Record<number, ClusterStatus | null>>({});
  const [loadingStatuses, setLoadingStatuses] = useState<Record<number, boolean>>({});
  const [actionLoading, setActionLoading] = useState<Record<number, string | null>>({});
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  const [screenshots, setScreenshots] = useState<Record<number, string | null>>({});
  const [loadingScreenshots, setLoadingScreenshots] = useState<Record<number, boolean>>({});

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
          
          // Charger les statuts des clusters
          if (data.service.clusters && data.service.clusters.length > 0) {
            loadClusterStatuses(data.service.clusters);
            // Charger les screenshots
            loadScreenshots(data.service.clusters);
          }
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

  // Nettoyer les URLs d'objet lors du démontage
  useEffect(() => {
    return () => {
      Object.values(screenshots).forEach(url => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [screenshots]);

  const loadClusterStatuses = async (clusters: Cluster[]) => {
    const statuses: Record<number, ClusterStatus | null> = {};
    const loading: Record<number, boolean> = {};
    
    clusters.forEach(cluster => {
      loading[cluster.id] = true;
    });
    
    setLoadingStatuses(loading);

    for (const cluster of clusters) {
      try {
        const response = await fetch(`/api/dashboard/cluster/${cluster.id}/status`);
        if (response.ok) {
          const data = await response.json();
          statuses[cluster.id] = data.status;
        } else {
          statuses[cluster.id] = null;
        }
      } catch (error) {
        console.error(`Erreur lors du chargement du statut du cluster ${cluster.id}:`, error);
        statuses[cluster.id] = null;
      } finally {
        loading[cluster.id] = false;
        setLoadingStatuses({ ...loading });
      }
    }
    
    setClusterStatuses(statuses);
  };

  const loadScreenshots = async (clusters: Cluster[]) => {
    const loading: Record<number, boolean> = {};
    
    clusters.forEach(cluster => {
      loading[cluster.id] = true;
    });
    
    setLoadingScreenshots(loading);

    for (const cluster of clusters) {
      try {
        const response = await fetch(`/api/dashboard/cluster/screenshot?clusterId=${cluster.id}&url=${encodeURIComponent(cluster.url)}`);
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setScreenshots(prev => ({ ...prev, [cluster.id]: imageUrl }));
        } else {
          setScreenshots(prev => ({ ...prev, [cluster.id]: null }));
        }
      } catch (error) {
        console.error(`Erreur lors du chargement du screenshot du cluster ${cluster.id}:`, error);
        setScreenshots(prev => ({ ...prev, [cluster.id]: null }));
      } finally {
        loading[cluster.id] = false;
        setLoadingScreenshots({ ...loading });
      }
    }
  };

  const handleClusterAction = async (clusterId: number, action: 'start' | 'stop' | 'restart') => {
    setActionLoading(prev => ({ ...prev, [clusterId]: action }));

    try {
      let response;
      
      if (action === 'restart') {
        // Restart = stop puis start
        // On fait juste start (comme demandé)
        response = await fetchWithCSRF(`/api/dashboard/cluster/${clusterId}/start`, {
          method: 'POST',
        });
      } else {
        response = await fetchWithCSRF(`/api/dashboard/cluster/${clusterId}/${action}`, {
          method: 'POST',
        });
      }

      const data = await response.json();

      if (response.ok && data.success) {
        // Recharger le statut après l'action
        setTimeout(() => {
          if (service?.clusters) {
            loadClusterStatuses(service.clusters);
          }
        }, 1000);
      } else {
        alert(data.error || 'Une erreur est survenue');
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'action:', error);
      alert('Une erreur est survenue');
    } finally {
      setActionLoading(prev => ({ ...prev, [clusterId]: null }));
    }
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
                {t('dashboard_service_detail_back_list')}
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
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard/services"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#d23f26] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('dashboard_service_detail_back')}
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
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard_service_detail_servers')}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {service.servers}
              </p>
            </div>

            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard_service_detail_groups')}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {service.group}
              </p>
            </div>

            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard_service_detail_rules')}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {service.rules}
              </p>
            </div>

            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center gap-3 mb-2">
                <Euro className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard_service_detail_price')}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Number(service.price).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('dashboard_service_detail_features')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                {service.host ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm text-gray-900 dark:text-white">{t('dashboard_service_detail_host')}</span>
              </div>
              <div className="flex items-center gap-3">
                {service.logs ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm text-gray-900 dark:text-white">{t('dashboard_service_detail_logs')}</span>
              </div>
              <div className="flex items-center gap-3">
                {service.stats ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm text-gray-900 dark:text-white">{t('dashboard_service_detail_stats')}</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-900 dark:text-white">{t('dashboard_service_detail_support')} {service.support}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${service.active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {service.active ? t('dashboard_service_detail_active') : t('dashboard_service_detail_inactive')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('dashboard_service_detail_period')} {service.period}
                </span>
              </div>
            </div>
          </div>

          {/* Cluster Status */}
          <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('dashboard_service_detail_cluster_status')}
            </h2>
            
            {!hasCluster ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <Server className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('dashboard_service_detail_no_cluster_title')}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('dashboard_service_detail_no_cluster_desc')}
                </p>
                <button
                  onClick={() => router.push(`/dashboard/services/create/cluster/${service.id}`)}
                  className="px-6 py-3 bg-gradient-to-r from-[#d23f26] to-[#b83220] text-white rounded-xl font-semibold hover:from-[#b83220] hover:to-[#a02a1a] transition-all shadow-lg shadow-[#d23f26]/30"
                >
                  {t('dashboard_service_detail_install')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {service.clusters.map((cluster) => {
                  const status = clusterStatuses[cluster.id];
                  const isLoadingStatus = loadingStatuses[cluster.id];
                  const isActionLoading = actionLoading[cluster.id];
                  const isOnline = status?.status === 'online';
                  const isStopped = status?.status === 'stopped';
                  const showPassword = showPasswords[cluster.id] || false;

                  return (
                    <>
                      {/* Carte principale du cluster */}
                      <div
                        key={cluster.id}
                        className="bg-gray-50/50 dark:bg-[#0F0F0F] rounded-xl p-6 border border-gray-200/50 dark:border-[#1A1A1A]"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 dark:text-gray-400">URL:</span>
                                <a
                                  href={`http://${cluster.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#d23f26] hover:underline font-mono"
                                >
                                  {cluster.url}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 dark:text-gray-400">{t('dashboard_service_detail_created')}</span>
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
                          <div className="flex flex-col items-end gap-2">
                            {isLoadingStatus ? (
                              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-900/20">
                                <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                  {t('dashboard_service_detail_loading')}
                                </span>
                              </div>
                            ) : (
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                                isOnline 
                                  ? 'bg-green-100 dark:bg-green-900/20' 
                                  : 'bg-red-100 dark:bg-red-900/20'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  isOnline ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                                <span className={`text-xs font-medium ${
                                  isOnline 
                                    ? 'text-green-800 dark:text-green-400' 
                                    : 'text-red-800 dark:text-red-400'
                                }`}>
                                  {isOnline ? t('dashboard_service_detail_online') : t('dashboard_service_detail_stopped')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200/50 dark:border-[#1A1A1A]">
                          {isOnline ? (
                            <>
                              <button
                                onClick={() => handleClusterAction(cluster.id, 'stop')}
                                disabled={!!isActionLoading}
                                className="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                              >
                                {isActionLoading === 'stop' ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    {t('dashboard_service_detail_stopping')}
                                  </>
                                ) : (
                                  <>
                                    <Square className="w-3.5 h-3.5" />
                                    {t('dashboard_service_detail_stop')}
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleClusterAction(cluster.id, 'restart')}
                                disabled={!!isActionLoading}
                                className="flex-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                              >
                                {isActionLoading === 'restart' ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    {t('dashboard_service_detail_restarting')}
                                  </>
                                ) : (
                                  <>
                                    <RotateCw className="w-3.5 h-3.5" />
                                    {t('dashboard_service_detail_restart')}
                                  </>
                                )}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleClusterAction(cluster.id, 'start')}
                              disabled={!!isActionLoading}
                              className="w-full px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                            >
                              {isActionLoading === 'start' ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  {t('dashboard_service_detail_starting')}
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5" />
                                  {t('dashboard_service_detail_start')}
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Carte des informations de connexion */}
                      <div className="bg-gray-50/50 dark:bg-[#0F0F0F] rounded-xl p-6 border border-gray-200/50 dark:border-[#1A1A1A]">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          {t('dashboard_service_detail_connection')}
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              {t('dashboard_service_detail_username')}
                            </label>
                            <div className="px-3 py-2 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1A1A1A] rounded-lg">
                              <span className="text-sm text-gray-900 dark:text-white font-mono">
                                {cluster.username || 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              {t('dashboard_service_detail_password')}
                            </label>
                            <div className="relative">
                              <div 
                                onClick={() => setShowPasswords(prev => ({ ...prev, [cluster.id]: !prev[cluster.id] }))}
                                className="px-3 py-2 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#1A1A1A] rounded-lg cursor-pointer flex items-center justify-between group"
                              >
                                <span 
                                  className={`text-sm font-mono ${
                                    showPassword 
                                      ? 'text-gray-900 dark:text-white' 
                                      : 'text-gray-900 dark:text-white blur-sm select-none'
                                  }`}
                                >
                                  {cluster.password || 'N/A'}
                                </span>
                                <button
                                  type="button"
                                  className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                  {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Screenshot du site */}
                      <div className="lg:col-span-2 mt-4">
                        <div className="bg-gray-50/50 dark:bg-[#0F0F0F] rounded-xl p-6 border border-gray-200/50 dark:border-[#1A1A1A]">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t('dashboard_service_detail_preview')}
                          </h3>
                          {loadingScreenshots[cluster.id] ? (
                            <div className="flex items-center justify-center py-12">
                              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                {t('dashboard_service_detail_capturing')}
                              </span>
                            </div>
                          ) : screenshots[cluster.id] ? (
                            <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A]">
                              <img
                                src={screenshots[cluster.id]!}
                                alt={`Aperçu de ${cluster.url}`}
                                className="w-full h-auto"
                                onError={() => {
                                  setScreenshots(prev => ({ ...prev, [cluster.id]: null }));
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                              <span className="text-sm">
                                {t('dashboard_service_detail_preview_error')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}








