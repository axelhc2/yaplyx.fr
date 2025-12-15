'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Euro, Calendar, CheckCircle2, XCircle, Download, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface Invoice {
  id: number;
  invoiceName: string;
  fullInvoiceNumber: string;
  price: number;
  paymentDate: string;
  status: number; // 1 = payé, 0 = non payé
  paymentMethod: string;
  createdAt: string;
  service: {
    id: number;
    name: string;
  };
}

export default function InvoicesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [generatingPDF, setGeneratingPDF] = useState<number | null>(null);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (!sessionResponse.ok) {
          router.push('/auth/login');
          return;
        }

        const invoicesResponse = await fetch('/api/dashboard/invoices');
        if (invoicesResponse.ok) {
          const data = await invoicesResponse.json();
          setInvoices(data.invoices || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des factures:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [router]);

  const handleDownloadPDF = async (invoiceId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Afficher le popup de génération
    setGeneratingPDF(invoiceId);
    
    try {
      // Faire une requête fetch vers l'API
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(t('dashboard_invoices_error_pdf'));
      }
      
      // Récupérer le blob du PDF
      const blob = await response.blob();
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Récupérer le nom du fichier depuis les headers
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `facture-${invoiceId}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF:', error);
      alert(t('dashboard_invoices_error_pdf'));
    } finally {
      // Fermer le popup
      setGeneratingPDF(null);
    }
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
              {t('dashboard_invoices_title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('dashboard_invoices_desc')}
            </p>
          </div>

          {/* Invoices Table */}
          {invoices.length === 0 ? (
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('dashboard_invoices_empty_title')}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {t('dashboard_invoices_empty_desc')}
              </p>
            </div>
          ) : (
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 dark:bg-[#0F0F0F] border-b border-gray-200/50 dark:border-[#1A1A1A]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_invoices_table_number')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_invoices_table_service')}
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_invoices_table_payment_date')}
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_invoices_table_method')}
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_invoices_table_amount')}
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_invoices_table_status')}
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard_invoices_table_actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50 dark:divide-[#1A1A1A]">
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        onClick={() => router.push(`/invoices/${invoice.id}`)}
                        className="hover:bg-gray-50/50 dark:hover:bg-[#0F0F0F] transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {invoice.fullInvoiceNumber}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {invoice.invoiceName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {invoice.service.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {new Date(invoice.paymentDate).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 capitalize">
                            {invoice.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Euro className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {Number(invoice.price).toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {invoice.status === 1 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {t('dashboard_invoices_status_paid')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                              <XCircle className="w-3 h-3 mr-1" />
                              {t('dashboard_invoices_status_unpaid')}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => handleDownloadPDF(invoice.id, e)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#d23f26] dark:hover:text-[#d23f26] transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A]"
                              title={t('dashboard_invoices_download_pdf')}
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/invoices/${invoice.id}`);
                              }}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#d23f26] dark:hover:text-[#d23f26] transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A]"
                              title={t('dashboard_invoices_view_details')}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
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

      {/* Popup de génération */}
      {generatingPDF !== null && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-2xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-[#1A1A1A] p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('dashboard_invoices_generating')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('dashboard_invoices_generating_desc')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}








