'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function InvoicePageContent() {
  const params = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setInvoice(data.invoice);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [params.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/invoices/${params.id}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${invoice.fullInvoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Facture introuvable
          </h1>
          <Link href="/dashboard">
            <Button>Retour au dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const service = invoice.service;
  const user = invoice.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900/20 dark:via-black dark:to-gray-900/20 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-8">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200 dark:border-[#1A1A1A]">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {invoice.invoiceName}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {invoice.fullInvoiceNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Date d'émission</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatDate(invoice.paymentDate)}
              </p>
            </div>
          </div>

          {/* Informations client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Facturé à
              </h2>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-semibold">{user.firstName} {user.lastName}</p>
                {user.companyName && (
                  <p>{user.companyName}</p>
                )}
                {user.billingAddress && (
                  <p>{user.billingAddress}</p>
                )}
                {user.billingAddress2 && (
                  <p>{user.billingAddress2}</p>
                )}
                <p>
                  {user.billingCity && `${user.billingCity}, `}
                  {user.billingPostalCode && `${user.billingPostalCode} `}
                  {user.billingCountry}
                </p>
                <p>{user.email}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Informations de paiement
              </h2>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <span className="font-semibold">Méthode :</span> {invoice.paymentMethod === 'stripe' ? 'Carte bancaire (Stripe)' : invoice.paymentMethod}
                </p>
                <p>
                  <span className="font-semibold">Date de paiement :</span> {formatDate(invoice.paymentDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Détails de la commande */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Détails de la commande
            </h2>
            <div className="border border-gray-200 dark:border-[#1A1A1A] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#1A1A1A]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      Prix
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200 dark:border-[#1A1A1A]">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {service.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {service.description}
                        </p>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                          <p>Serveurs: {service.servers === 0 ? 'Illimités' : service.servers}</p>
                          <p>Groupes: {service.group === 0 ? 'Illimités' : service.group}</p>
                          <p>Règles: {service.rules === 0 ? 'Illimitées' : service.rules}</p>
                          {service.isLifetime ? (
                            <p>Durée: À vie</p>
                          ) : (
                            <p>Durée: {service.durationMonths} mois</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-gray-900 dark:text-white">
                      {formatPrice(Number(invoice.price))}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-[#1A1A1A]">
                  <tr>
                    <td className="px-4 py-4 text-right font-semibold text-gray-900 dark:text-white">
                      Total HT
                    </td>
                    <td className="px-4 py-4 text-right text-lg font-bold text-[#d23f26]">
                      {formatPrice(Number(invoice.price))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4 pt-8 border-t border-gray-200 dark:border-[#1A1A1A]">
            <Button
              onClick={handleDownloadPDF}
              className="gap-2 bg-gradient-to-r from-[#d23f26] to-[#b83220] hover:from-[#b83220] hover:to-[#a02a1a] text-white"
            >
              <Download className="w-4 h-4" />
              Télécharger en PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <InvoicePageContent />
    </Suspense>
  );
}




