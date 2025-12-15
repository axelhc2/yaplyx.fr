'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, FileText, Download, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [serviceCreated, setServiceCreated] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [offer, setOffer] = useState<any>(null);

  useEffect(() => {
    const createServiceAndInvoice = async () => {
      // Vérifier si le service a déjà été créé (éviter les doublons)
      const alreadyCreated = sessionStorage.getItem(`service_created_${params.uuid}`);
      if (alreadyCreated === 'true') {
        // Récupérer les données depuis les cookies pour afficher le récapitulatif
        const cookies = document.cookie.split(';');
        const orderCookie = cookies.find(c => c.trim().startsWith(`order_${params.uuid}=`));
        
        if (orderCookie) {
          const orderData = JSON.parse(decodeURIComponent(orderCookie.split('=')[1]));
          setOrder(orderData);
          
          // Récupérer l'offre selon le type de commande
          if (orderData.type === 'renew' && orderData.serviceId) {
            // Pour un renouvellement, récupérer l'offre depuis le service
            const serviceResponse = await fetch(`/api/dashboard/services/${orderData.serviceId}/renew`);
            if (serviceResponse.ok) {
              const serviceData = await serviceResponse.json();
              setOffer(serviceData.service.offer);
            }
          } else {
            // Pour une nouvelle commande, récupérer depuis les offres
            const offerResponse = await fetch('/api/offers');
            if (offerResponse.ok) {
              const offersData = await offerResponse.json();
              const foundOffer = offersData.offers.find((o: any) => o.id === orderData.offerId);
              setOffer(foundOffer);
            }
          }
          
          // Récupérer la session pour obtenir l'utilisateur
          const sessionResponse = await fetch('/api/auth/session');
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            setUser(sessionData.user);
          }
        }
        
        setServiceCreated(true);
        setLoading(false);
        return;
      }

      try {
        // Récupérer les données de commande depuis les cookies
        const cookies = document.cookie.split(';');
        const orderCookie = cookies.find(c => c.trim().startsWith(`order_${params.uuid}=`));
        
        if (!orderCookie) {
          setLoading(false);
          return;
        }

        const orderData = JSON.parse(decodeURIComponent(orderCookie.split('=')[1]));

        // Récupérer les informations utilisateur
        const sessionResponse = await fetch('/api/auth/session');
        if (!sessionResponse.ok) {
          setLoading(false);
          return;
        }

        const sessionData = await sessionResponse.json();
        const user = sessionData.user;

        const { fetchWithCSRF } = await import('@/lib/csrf-client');
        let createData: any;

        // Vérifier si c'est un renouvellement ou une nouvelle commande
        if (orderData.type === 'renew' && orderData.serviceId) {
          // Renouvellement de service
          const renewResponse = await fetchWithCSRF('/api/services/renew', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              serviceId: orderData.serviceId,
              pricePaid: orderData.price,
              durationMonths: orderData.duration || null,
              paymentMethod: 'stripe',
              orderId: params.uuid,
            }),
          });

          if (renewResponse.status === 404 || !renewResponse.ok) {
            console.error('Erreur lors du renouvellement du service');
            setLoading(false);
            return;
          }

          createData = await renewResponse.json();
          
          // Récupérer l'offre depuis le service renouvelé
          const serviceResponse = await fetch(`/api/dashboard/services/${orderData.serviceId}/renew`);
          if (serviceResponse.ok) {
            const serviceData = await serviceResponse.json();
            setOffer(serviceData.service.offer);
          }
        } else {
          // Création d'un nouveau service
          const createResponse = await fetchWithCSRF('/api/services/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              offerId: orderData.offerId,
              pricePaid: orderData.price,
              durationMonths: orderData.duration || null,
              paymentMethod: 'stripe',
              orderId: params.uuid,
            }),
          });

          if (createResponse.status === 404 || !createResponse.ok) {
            console.error('Erreur lors de la création du service');
            setLoading(false);
            return;
          }

          createData = await createResponse.json();
          
          // Récupérer l'offre pour le récapitulatif
          const offerResponse = await fetch('/api/offers');
          if (offerResponse.ok) {
            const offersData = await offerResponse.json();
            const foundOffer = offersData.offers.find((o: any) => o.id === orderData.offerId);
            setOffer(foundOffer);
          }
        }

        setServiceCreated(true);
        setInvoice(createData.invoice);
        setOrder(orderData);
        setUser(user);
          
        // Marquer comme créé pour éviter les doublons
        sessionStorage.setItem(`service_created_${params.uuid}`, 'true');
      } catch (error) {
        console.error('Erreur lors de la création du service:', error);
      } finally {
        setLoading(false);
      }
    };

    createServiceAndInvoice();
  }, [params.uuid]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    }).format(price);
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/pdf`);
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

  return (
    <div className="bg-white dark:bg-black">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Message de succès */}
              <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Paiement validé
              </h1>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Votre paiement a été traité avec succès.
              </p>

              {loading && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {order && order.type === 'renew' ? 'Renouvellement de votre service en cours...' : 'Création de votre service en cours...'}
                  </p>
                </div>
              )}

              {serviceCreated && invoice && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    {order?.type === 'renew' 
                      ? '✓ Votre service a été renouvelé et votre facture a été générée.'
                      : '✓ Votre service a été créé et votre facture a été générée.'}
                  </p>
                </div>
              )}

              {sessionId && (
                <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    ID de transaction : <span className="font-mono text-gray-900 dark:text-white">{sessionId}</span>
                  </p>
                </div>
              )}
              </div>

              {/* Récapitulatif de la commande */}
              {order && offer && (
                <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {order.type === 'renew' ? 'Récapitulatif de votre renouvellement' : 'Récapitulatif de votre commande'}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200/50 dark:border-[#1A1A1A]">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {offer.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {offer.description}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {formatPrice(order.price)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Serveurs</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {offer.servers === 0 ? 'Illimités' : offer.servers}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Groupes</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {offer.group === 0 ? 'Illimités' : offer.group}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Règles</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {offer.rules === 0 ? 'Illimitées' : offer.rules}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Durée</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {offer.period === 'lifetime' ? 'À vie' : `${order.duration || 1} mois`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-[#1A1A1A]">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total HT</span>
                    <span className="text-xl font-bold text-[#d23f26]">
                      {formatPrice(order.price)}
                    </span>
                  </div>
                </div>
                </div>
              )}

              {/* Actions facture */}
              {invoice && (
                <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Votre facture
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Facture n° {invoice.fullInvoiceNumber}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`/invoices/${invoice.id}`}>
                    <Button variant="outline" className="w-full sm:w-auto gap-2">
                      <Eye className="w-4 h-4" />
                      Voir la facture
                    </Button>
                  </Link>
                  <Button
                    onClick={handleDownloadPDF}
                    className="w-full sm:w-auto gap-2 bg-gradient-to-r from-[#d23f26] to-[#b83220] hover:from-[#b83220] hover:to-[#a02a1a] text-white"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger en PDF
                  </Button>
                </div>
                </div>
              )}
            </div>

            {/* Colonne droite - Actions rapides */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Prochaines étapes
              </h2>

              <div className="space-y-3">
                <Link href="/dashboard">
                  <Button className="w-full h-11 text-sm font-semibold bg-gradient-to-r from-[#d23f26] to-[#b83220] hover:from-[#b83220] hover:to-[#a02a1a] text-white">
                    Accéder au dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/offres">
                  <Button variant="outline" className="mt-2 w-full h-11 text-sm font-semibold">
                    Voir les offres
                  </Button>
                </Link>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}

