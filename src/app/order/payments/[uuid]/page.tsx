'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, MapPin, Mail, FileText, Shield, CheckCircle2, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

function PaymentsPageContent() {
  const { t, language } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedExecution, setAcceptedExecution] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'oxapay' | 'stripe' | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Vérifier la session
        const sessionResponse = await fetch('/api/auth/session');
        if (!sessionResponse.ok) {
          // Pas de session, rediriger vers les offres
          router.push('/offres');
          return;
        }

        const sessionData = await sessionResponse.json();
        setUser(sessionData.user);

        // Récupérer les données de commande depuis les cookies
        const cookies = document.cookie.split(';');
        const orderCookie = cookies.find(c => c.trim().startsWith(`order_${params.uuid}=`));
        if (orderCookie) {
          const orderData = JSON.parse(decodeURIComponent(orderCookie.split('=')[1]));
          setOrder(orderData);
        } else {
          // Essayer via l'API
          const orderResponse = await fetch(`/api/order/get?uuid=${params.uuid}`);
          if (orderResponse.ok) {
            const orderData = await orderResponse.json();
            setOrder(orderData.order);
          }
        }
      } catch (error) {
        console.error('Erreur:', error);
        router.push('/offres');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.uuid, router]);

  const formatPrice = (price: number) => {
    const locale = language === 'EN' ? 'en-US' : 'fr-FR';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    }).format(price);
  };

  const handlePaymentMethodChange = (method: 'oxapay' | 'stripe') => {
    setPaymentMethod(method);
  };

  const handleStripePayment = async () => {
    if (!acceptedTerms || !acceptedExecution || !order || !user) {
      return;
    }

    setProcessingPayment(true);

    try {
      const { fetchWithCSRF } = await import('@/lib/csrf-client');
      const response = await fetchWithCSRF('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: order.price,
          orderId: params.uuid,
          userId: user.id,
          userEmail: user.email,
          successUrl: `${window.location.origin}/order/payments/${params.uuid}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/order/payments/${params.uuid}/cancel`,
        }),
      });

      // Vérifier si la réponse est vide ou 404
      if (response.status === 404 || !response.ok) {
        router.push(`/order/payments/${params.uuid}/cancel?error=${encodeURIComponent(t('payment_error_creation'))}`);
        return;
      }

      const data = await response.json();
      if (data.url) {
        // Rediriger vers la page de paiement Stripe
        window.location.href = data.url;
      } else {
        router.push(`/order/payments/${params.uuid}/cancel?error=${encodeURIComponent(data.error || t('payment_error_creation'))}`);
      }
    } catch (error: any) {
      console.error('Erreur lors de la création de la session Stripe:', error);
      router.push(`/order/payments/${params.uuid}/cancel?error=${encodeURIComponent(error.message || t('payment_error_occurred'))}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !order) {
    return null;
  }

  const totalHT = order.price || 0;
  const hasCompany = user.companyName && user.vatNumber;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900/20 dark:via-black dark:to-gray-900/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche */}
          <div className="lg:col-span-2 space-y-6">
            {/* Adresse de facturation */}
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-5 h-5 text-[#d23f26]" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('payment_billing_address_title')}
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('payment_billing_address_check')}
              </p>

              <div className="space-y-3">
                {hasCompany && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('payment_billing_organization')}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.companyName}
                      {user.vatNumber && ` (${user.vatNumber})`}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('payment_billing_name')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('payment_billing_address')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.billingAddress || t('payment_billing_not_provided')}
                    {user.billingAddress2 && `, ${user.billingAddress2}`}
                    {user.billingCity && `, ${user.billingCity}`}
                    {user.billingPostalCode && ` ${user.billingPostalCode}`}
                    {user.billingCountry && ` (${user.billingCountry})`}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('payment_billing_email')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-[#d23f26]" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('payment_accept_terms_title')}
                </h2>
              </div>

              <div className="space-y-3 mb-6">
                <Link
                  href="/cgv"
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-[#d23f26] hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  {t('payment_cgv_link')}
                </Link>
                <Link
                  href="/cgv-cluster-firewall"
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-[#d23f26] hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  {t('payment_cgv_cluster_link')}
                </Link>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    {t('payment_accept_terms_checkbox')}
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="execution"
                    checked={acceptedExecution}
                    onCheckedChange={(checked) => setAcceptedExecution(checked === true)}
                    className="mt-1"
                  />
                  <label htmlFor="execution" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    {t('payment_accept_execution_checkbox')}
                  </label>
                </div>
              </div>
            </div>

            {/* Méthode de paiement */}
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-[#d23f26]" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('payment_method_title')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* OxaPay */}
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('oxapay')}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === 'oxapay'
                      ? 'border-[#d23f26] bg-gradient-to-br from-[#d23f26]/10 to-[#b83220]/10 dark:from-[#d23f26]/20 dark:to-[#b83220]/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white/50 dark:bg-[#1A1A1A]'
                  }`}
                >
                  {paymentMethod === 'oxapay' && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-5 h-5 text-[#d23f26]" />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 bg-white dark:bg-[#0A0A0A] rounded-lg p-2 flex items-center justify-center">
                      <img
                        src="https://oxapay.com/_next/static/media/logo.b1a318fa.svg"
                        alt="OxaPay"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {t('payment_crypto')}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {t('payment_via_oxapay')}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Stripe */}
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('stripe')}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === 'stripe'
                      ? 'border-[#d23f26] bg-gradient-to-br from-[#d23f26]/10 to-[#b83220]/10 dark:from-[#d23f26]/20 dark:to-[#b83220]/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white/50 dark:bg-[#1A1A1A]'
                  }`}
                >
                  {paymentMethod === 'stripe' && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-5 h-5 text-[#d23f26]" />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 bg-white dark:bg-[#0A0A0A] rounded-lg p-2 flex items-center justify-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png"
                        alt="Stripe"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {t('payment_card')}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {t('payment_via_stripe')}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Message OxaPay */}
              {paymentMethod === 'oxapay' && (
                <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-[#1A1A1A]">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {t('payment_oxapay_coming_soon')}
                  </p>
                </div>
              )}
            </div>

            {/* Annonce droit de rétractation */}
            <div className="bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-4">
              <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                <strong>{t('payment_withdrawal_reminder_title')}</strong> {t('payment_withdrawal_reminder_text')}
              </p>
            </div>

            {/* Bouton de paiement */}
            {paymentMethod && (
              <Button
                onClick={paymentMethod === 'stripe' ? handleStripePayment : undefined}
                disabled={!acceptedTerms || !acceptedExecution || !paymentMethod || processingPayment}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#d23f26] to-[#b83220] hover:from-[#b83220] hover:to-[#a02a1a] text-white shadow-lg shadow-[#d23f26]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingPayment ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('payment_redirecting_to_stripe')}
                  </span>
                ) : (
                  t('payment_proceed_to_payment')
                )}
              </Button>
            )}
          </div>

          {/* Colonne droite - Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('payment_summary_title')}
              </h2>

              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('payment_summary_product')}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('payment_summary_order')}{params.uuid?.toString().substring(0, 8)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatPrice(totalHT)}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-[#1A1A1A]">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('payment_summary_total_ht')}</span>
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
                    {t('payment_guarantee_satisfaction')}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {t('payment_guarantee_support')}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {t('payment_guarantee_secure')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentsPageContent />
    </Suspense>
  );
}

