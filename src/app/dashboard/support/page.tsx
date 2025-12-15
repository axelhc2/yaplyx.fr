'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Search, Plus, Clock } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface SupportTicket {
  id: number;
  subject: string;
  services: string | null;
  status: string;
  updatedAt: string;
  createdAt: string;
  serviceInfo: {
    offerName: string;
    clusterName: string | null;
    clusterUrl: string | null;
    createdAt: string;
    hasCluster: boolean;
  } | null;
}

export default function SupportPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (!sessionResponse.ok) {
          router.push('/auth/login');
          return;
        }

        const url = searchTerm 
          ? `/api/dashboard/support?search=${encodeURIComponent(searchTerm)}`
          : '/api/dashboard/support';
        
        const ticketsResponse = await fetch(url);
        if (ticketsResponse.ok) {
          const data = await ticketsResponse.json();
          setTickets(data.tickets || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [router, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Le useEffect se déclenchera automatiquement quand searchTerm change
  };

  const handleCreateTicket = () => {
    router.push('/dashboard/support/create');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('dashboard_support_title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('dashboard_support_desc')}
            </p>
          </div>

          {/* Search and Create Button */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-end">
            <form onSubmit={handleSearch} className="flex-1 sm:flex-initial sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('dashboard_support_search_placeholder')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d23f26] focus:border-transparent"
                />
              </div>
            </form>
            <button
              onClick={handleCreateTicket}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#d23f26] hover:bg-[#b83220] text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              {t('dashboard_support_create_ticket')}
            </button>
          </div>

          {/* Tickets Table */}
          {tickets.length === 0 ? (
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('dashboard_support_empty_title')}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {t('dashboard_support_empty_desc')}
              </p>
            </div>
          ) : (
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 dark:bg-[#0F0F0F] border-b border-gray-200/50 dark:border-[#1A1A1A]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_support_table_subject')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_support_table_services')}
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_support_table_status')}
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_support_table_last_update')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50 dark:divide-[#1A1A1A]">
                    {tickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        onClick={() => router.push(`/dashboard/support/${ticket.id}`)}
                        className="hover:bg-gray-50/50 dark:hover:bg-[#0F0F0F] transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                            <div className="text-xs font-medium text-gray-900 dark:text-white">
                              {ticket.subject}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="text-xs text-gray-900 dark:text-white">
                            {ticket.serviceInfo ? (
                              ticket.serviceInfo.hasCluster ? (
                                `${ticket.serviceInfo.offerName} - ${ticket.serviceInfo.clusterName || ticket.serviceInfo.clusterUrl || 'Cluster'}`
                              ) : (
                                `${ticket.serviceInfo.offerName} (${new Date(ticket.serviceInfo.createdAt).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })})`
                              )
                            ) : (
                              '-'
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-center">
                          {ticket.status === 'pending' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
                              {t('dashboard_support_status_pending')}
                            </span>
                          )}
                          {ticket.status === 'answered' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                              {t('dashboard_support_status_answered')}
                            </span>
                          )}
                          {ticket.status === 'closed' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                              {t('dashboard_support_status_closed')}
                            </span>
                          )}
                          {!['pending', 'answered', 'closed'].includes(ticket.status) && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400 capitalize">
                              {ticket.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-900 dark:text-white">
                              {new Date(ticket.updatedAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

