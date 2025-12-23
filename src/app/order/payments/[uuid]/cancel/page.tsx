'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';

function CancelPageContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900/20 dark:via-black dark:to-gray-900/20 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-[#1A1A1A] p-8 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('payment_cancel_title')}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {error 
              ? `${t('payment_cancel_error')} ${error}`
              : t('payment_cancel_message')
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/offres">
              <Button className="w-full sm:w-auto h-12 text-base font-semibold bg-gradient-to-r from-[#d23f26] to-[#b83220] hover:from-[#b83220] hover:to-[#a02a1a] text-white shadow-lg shadow-[#d23f26]/30">
                {t('payment_cancel_retry')}
                <RefreshCw className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full sm:w-auto h-12 text-base font-semibold">
                {t('payment_cancel_back_dashboard')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CancelPageContent />
    </Suspense>
  );
}













