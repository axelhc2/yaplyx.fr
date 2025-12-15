'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardIcon from '@/components/icons/DashboardIcon';
import InvoicesIcon from '@/components/icons/InvoicesIcon';
import SupportIcon from '@/components/icons/SupportIcon';
import { Server, Users, Shield, HardDrive, FileText, BarChart3, MessageCircle, Euro } from 'lucide-react';
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
  active: boolean;
  expiresAt: string | null;
  isLifetime: boolean;
}

// Fonction pour calculer les jours restants avant expiration
function getDaysUntilExpiration(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const expirationDate = new Date(expiresAt);
  const now = new Date();
  const diffTime = expirationDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState({
    activeServices: 0,
    unpaidInvoices: 0,
    paidInvoices: 0,
  });

  useEffect(() => {
    // Vérifier l'authentification et récupérer les stats
    const checkAuthAndLoadStats = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (!sessionResponse.ok) {
          router.push('/auth/login');
          return;
        }
        const sessionData = await sessionResponse.json();
        setUser(sessionData.user);

        // Récupérer les statistiques
        const statsResponse = await fetch('/api/dashboard/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Récupérer les services
        const servicesResponse = await fetch('/api/dashboard/services');
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData.services || []);
        }
      } catch (error) {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadStats();
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
      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard_stats_active')}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.activeServices}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <DashboardIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard_stats_unpaid')}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.unpaidInvoices}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <InvoicesIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard_stats_paid')}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats.paidInvoices}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <InvoicesIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Card */}
          <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('dashboard_welcome')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('dashboard_welcome_desc')}
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-[#d23f26] to-[#b83220] text-white rounded-xl font-semibold hover:from-[#b83220] hover:to-[#a02a1a] transition-all shadow-lg shadow-[#d23f26]/30">
                {t('dashboard_create_service')}
              </button>
              <button className="px-6 py-3 bg-white/50 dark:bg-[#1A1A1A] text-gray-900 dark:text-white rounded-xl font-semibold border border-gray-200/50 dark:border-[#1A1A1A] hover:bg-gray-50/50 dark:hover:bg-[#252525] transition-all">
                {t('dashboard_view_docs')}
              </button>
            </div>
          </div>

          {/* Services Table */}
          <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] overflow-hidden">
            <div className="p-6 border-b border-gray-200/50 dark:border-[#1A1A1A]">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('dashboard_services')}
              </h3>
            </div>
            
            {services.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {t('dashboard_no_services')}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 dark:bg-[#0F0F0F] border-b border-gray-200/50 dark:border-[#1A1A1A]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_table_offer')}
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_table_servers')}
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_table_groups')}
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_table_rules')}
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_table_host')}
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_table_logs')}
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_table_stats')}
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_table_support')}
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_table_price')}
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_table_expiration')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50 dark:divide-[#1A1A1A]">
                    {services.map((service) => (
                        <tr
                          key={service.id}
                          onClick={() => router.push(`/dashboard/services/${service.id}`)}
                          className="hover:bg-gray-50/50 dark:hover:bg-[#0F0F0F] transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-2 h-2 rounded-full mr-3 bg-green-500"></div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {service.name}
                                </div>
                                {!service.active && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('dashboard_table_inactive')}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Server className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {service.servers}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {service.group}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Shield className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {service.rules}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {service.host ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                                {t('dashboard_table_yes')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400">
                                {t('dashboard_table_no')}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {service.logs ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                                Oui
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400">
                                Non
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {service.stats ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                                Oui
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400">
                                Non
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1">
                              <MessageCircle className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {service.support}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Euro className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {Number(service.price).toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {service.isLifetime ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                                {t('dashboard_table_lifetime')}
                              </span>
                            ) : service.expiresAt ? (
                              (() => {
                                const daysLeft = getDaysUntilExpiration(service.expiresAt);
                                if (daysLeft === null) {
                                  return (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      -
                                    </span>
                                  );
                                }
                                if (daysLeft < 0) {
                                  return (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                                      {t('dashboard_table_expired')}
                                    </span>
                                  );
                                } else if (daysLeft === 0) {
                                  return (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400">
                                      {t('dashboard_table_today')}
                                    </span>
                                  );
                                } else if (daysLeft <= 7) {
                                  return (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400">
                                      {daysLeft}j
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      {daysLeft} {t('dashboard_table_days')}
                                    </span>
                                  );
                                }
                              })()
                            ) : (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                -
                              </span>
                            )}
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

