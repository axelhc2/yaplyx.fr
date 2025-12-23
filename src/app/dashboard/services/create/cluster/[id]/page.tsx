'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Server, CheckCircle2, XCircle, Globe, Loader2 } from 'lucide-react';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { useTranslation } from '@/lib/i18n';

interface ServerInfo {
  id: number;
  ip: string;
  hostname: string;
}

export default function CreateClusterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [domainType, setDomainType] = useState<'custom' | 'yaplyx'>('custom');
  const [customDomain, setCustomDomain] = useState('');
  const [yaplyxDomain, setYaplyxDomain] = useState('');
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [dnsVerified, setDnsVerified] = useState<boolean | null>(null);
  const [dnsError, setDnsError] = useState<string | null>(null);
  const [creatingDomain, setCreatingDomain] = useState(false);
  const [domainCreated, setDomainCreated] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installationSuccess, setInstallationSuccess] = useState(false);
  const [installationError, setInstallationError] = useState<string | null>(null);
  const [hasExistingCluster, setHasExistingCluster] = useState(false);

  // Créer automatiquement le domaine .yaplyx.online quand on sélectionne cette option
  useEffect(() => {
    if (domainType === 'yaplyx' && !yaplyxDomain && serverInfo) {
      const createYaplyxDomain = async () => {
        const randomId = Math.floor(Math.random() * 100000);
        const generatedDomain = `app${randomId}.yaplyx.online`;
        
        setCreatingDomain(true);
        setDnsError(null);
        
        try {
          const response = await fetchWithCSRF('/api/dashboard/create-yaplyx-domain', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              subdomain: generatedDomain,
              serverIP: serverInfo.ip,
            }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            setYaplyxDomain(generatedDomain);
            setDomainCreated(true);
            setDnsError(null);
          } else {
            setDnsError(data.error || t('cluster_create_error_domain'));
            setDomainCreated(false);
          }
        } catch (error: any) {
          setDnsError(t('cluster_create_error_domain'));
          setDomainCreated(false);
        } finally {
          setCreatingDomain(false);
        }
      };

      createYaplyxDomain();
    }
  }, [domainType, serverInfo]);

  const handleInstallCluster = async () => {
    if (!serverInfo || !params?.id) {
      return;
    }

    const domain = domainType === 'yaplyx' ? yaplyxDomain : customDomain;
    
    if (!domain) {
      return;
    }

    // Pour domaine personnalisé, vérifier que DNS est validé
    if (domainType === 'custom' && !dnsVerified) {
      setInstallationError(t('cluster_create_verify_first'));
      return;
    }

    // Vérifier si une installation est déjà en cours
    const installationKey = `cluster_installing_${params.id}`;
    if (sessionStorage.getItem(installationKey) === 'true') {
      setInstallationError(t('cluster_create_installation_in_progress'));
      return;
    }

    setInstalling(true);
    setInstallationError(null);
    
    // Marquer l'installation comme en cours dans sessionStorage
    sessionStorage.setItem(installationKey, 'true');

    try {
      const response = await fetchWithCSRF('/api/dashboard/install-cluster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: params.id,
          domain: domain,
          serverId: serverInfo.id,
          domainType: domainType,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setInstallationSuccess(true);
        setInstallationError(null);
        // Retirer le flag d'installation en cours
        sessionStorage.removeItem(installationKey);
        // Rediriger vers la page du service après 2 secondes
        setTimeout(() => {
          router.push(`/dashboard/services/${params.id}`);
        }, 2000);
      } else {
        setInstallationSuccess(false);
        setInstallationError(data.error || t('cluster_create_error_install'));
        // Retirer le flag en cas d'erreur
        sessionStorage.removeItem(installationKey);
      }
    } catch (error: any) {
      setInstallationSuccess(false);
      setInstallationError(t('cluster_create_error_install'));
      // Retirer le flag en cas d'erreur
      sessionStorage.removeItem(installationKey);
    } finally {
      setInstalling(false);
    }
  };

  useEffect(() => {
    const loadServer = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (!sessionResponse.ok) {
          router.push('/auth/login');
          return;
        }

        // Vérifier si le service a déjà un cluster
        if (params?.id) {
          const serviceResponse = await fetch(`/api/dashboard/services/${params.id}`);
          if (serviceResponse.ok) {
            const serviceData = await serviceResponse.json();
            if (serviceData.service?.clusters && serviceData.service.clusters.length > 0) {
              setHasExistingCluster(true);
              setLoading(false);
              return;
            }
          }
        }

        // Vérifier si une installation est en cours (sessionStorage)
        const installationKey = `cluster_installing_${params?.id}`;
        const isInstalling = sessionStorage.getItem(installationKey);
        if (isInstalling === 'true') {
          setInstalling(true);
        }

        const serverResponse = await fetch('/api/dashboard/servers/available');
        if (serverResponse.ok) {
          const data = await serverResponse.json();
          setServerInfo(data.server);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du serveur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServer();
  }, [router, params]);

  const handleVerifyDNS = async () => {
    if (!customDomain || !serverInfo) {
      return;
    }

    setVerifying(true);
    setDnsVerified(null);
    setDnsError(null);

    try {
      const response = await fetchWithCSRF('/api/dashboard/verify-dns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: customDomain,
          expectedIP: serverInfo.ip,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setDnsVerified(true);
        setDnsError(null);
      } else {
        setDnsVerified(false);
        // Afficher un message plus clair selon le type d'erreur
        if (data.errorCode === 'ENOTFOUND' || data.errorCode === 'ENODATA') {
          setDnsError(data.error || t('cluster_create_dns_not_found').replace('{domain}', customDomain).replace('{ip}', serverInfo.ip));
        } else if (data.resolvedIPs && data.resolvedIPs.length > 0) {
          setDnsError(t('cluster_create_dns_wrong_ip').replace('{resolvedIPs}', data.resolvedIPs.join(', ')).replace('{expectedIP}', serverInfo.ip));
        } else {
          setDnsError(data.error || t('cluster_create_dns_invalid'));
        }
      }
    } catch (error: any) {
      setDnsVerified(false);
      setDnsError(t('cluster_create_error_dns'));
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Si le service a déjà un cluster, rediriger vers la page du service
  if (hasExistingCluster) {
    return (
      <div className="bg-white dark:bg-black">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6 sm:p-8 lg:p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Cluster déjà installé
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Ce service a déjà un cluster installé.
              </p>
              <button
                onClick={() => router.push(`/dashboard/services/${params?.id}`)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-[#d23f26] to-[#b83220] text-white rounded-xl font-semibold hover:from-[#b83220] hover:to-[#a02a1a] transition-all"
              >
                Voir le service
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!serverInfo) {
    return (
      <div className="bg-white dark:bg-black">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6 sm:p-8 lg:p-12 text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('cluster_create_no_server')}
              </p>
              <button
                onClick={() => router.back()}
                className="mt-4 px-6 py-3 bg-gray-100 dark:bg-[#1A1A1A] text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-[#252525] transition-all"
              >
                {t('cluster_create_back')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('cluster_create_title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('cluster_create_desc').replace('{id}', String(params?.id || ''))}
            </p>
            {installing && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-xl flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-800 dark:text-blue-400 font-medium">
                  Installation en cours... Veuillez ne pas quitter cette page.
                </span>
              </div>
            )}
          </div>

          {/* Domain Type Selection */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('cluster_create_choose_domain')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setDomainType('custom')}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${
                  domainType === 'custom'
                    ? 'border-[#d23f26] bg-gradient-to-br from-[#d23f26]/10 to-[#d23f26]/5 dark:from-[#d23f26]/20 dark:to-[#d23f26]/10 shadow-lg shadow-[#d23f26]/20'
                    : 'border-gray-200 dark:border-[#1A1A1A] bg-white/70 dark:bg-[#0A0A0A] hover:border-[#d23f26]/50 hover:shadow-md'
                }`}
              >
                {domainType === 'custom' && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 rounded-full bg-[#d23f26] flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                <div className="flex flex-col items-start text-left">
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors ${
                    domainType === 'custom'
                      ? 'bg-[#d23f26] text-white'
                      : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-400 group-hover:bg-[#d23f26]/10 group-hover:text-[#d23f26]'
                  }`}>
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${domainType === 'custom' ? 'text-[#d23f26]' : 'text-gray-900 dark:text-white'}`}>
                    {t('cluster_create_custom_domain_title')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('cluster_create_custom_domain_desc')}
                  </p>
                </div>
              </button>
              
              <button
                onClick={() => setDomainType('yaplyx')}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${
                  domainType === 'yaplyx'
                    ? 'border-[#d23f26] bg-gradient-to-br from-[#d23f26]/10 to-[#d23f26]/5 dark:from-[#d23f26]/20 dark:to-[#d23f26]/10 shadow-lg shadow-[#d23f26]/20'
                    : 'border-gray-200 dark:border-[#1A1A1A] bg-white/70 dark:bg-[#0A0A0A] hover:border-[#d23f26]/50 hover:shadow-md'
                }`}
              >
                {domainType === 'yaplyx' && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 rounded-full bg-[#d23f26] flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                <div className="flex flex-col items-start text-left">
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors ${
                    domainType === 'yaplyx'
                      ? 'bg-[#d23f26] text-white'
                      : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-400 group-hover:bg-[#d23f26]/10 group-hover:text-[#d23f26]'
                  }`}>
                    <Server className="w-6 h-6" />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${domainType === 'yaplyx' ? 'text-[#d23f26]' : 'text-gray-900 dark:text-white'}`}>
                    {t('cluster_create_yaplyx_domain_title')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('cluster_create_yaplyx_domain_desc')}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Custom Domain Configuration */}
          {domainType === 'custom' && (
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('cluster_create_dns_config')}
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('cluster_create_your_domain')}
                </label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => {
                    setCustomDomain(e.target.value);
                    setDnsVerified(null);
                    setDnsError(null);
                  }}
                  placeholder={t('cluster_create_domain_placeholder')}
                  className="w-full px-4 py-2 bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#1A1A1A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26]"
                />
              </div>

              {customDomain && (
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-xl p-4 mb-4">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-400 mb-2">
                    {t('cluster_create_dns_record')}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-800 dark:text-blue-300">{t('cluster_create_dns_type')}</span>
                      <span className="text-gray-700 dark:text-gray-300">A</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-800 dark:text-blue-300">{t('cluster_create_dns_name')}</span>
                      <span className="text-gray-700 dark:text-gray-300">{customDomain}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-800 dark:text-blue-300">{t('cluster_create_dns_value')}</span>
                      <span className="text-gray-700 dark:text-gray-300 font-mono">{serverInfo.ip}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleVerifyDNS}
                disabled={!customDomain || verifying}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#d23f26] to-[#b83220] text-white rounded-xl font-semibold hover:from-[#b83220] hover:to-[#a02a1a] transition-all shadow-lg shadow-[#d23f26]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('cluster_create_verifying')}
                  </>
                ) : (
                  t('cluster_create_verify')
                )}
              </button>

              {dnsVerified && (
                <button
                  onClick={handleInstallCluster}
                  disabled={installing}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {installing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('cluster_create_installing')}
                    </>
                  ) : (
                    t('cluster_create_install')
                  )}
                </button>
              )}

              {dnsVerified === true && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-800 dark:text-green-400">
                    {t('cluster_create_dns_valid')}
                  </span>
                </div>
              )}

              {dnsVerified === false && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-xl flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-800 dark:text-red-400">
                    {dnsError || t('cluster_create_dns_invalid')}
                  </span>
                </div>
              )}

              {installationError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-xl flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-800 dark:text-red-400">
                    {installationError}
                  </span>
                </div>
              )}

              {installationSuccess && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-800 dark:text-green-400">
                    {t('cluster_create_success')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Yaplyx Domain */}
          {domainType === 'yaplyx' && (
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('cluster_create_yaplyx_title')}
              </h2>
              
              {yaplyxDomain && (
                <div className="bg-gradient-to-r from-[#d23f26]/10 to-[#d23f26]/5 dark:from-[#d23f26]/20 dark:to-[#d23f26]/10 border border-[#d23f26]/20 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('cluster_create_yaplyx_generated')}
                      </p>
                      <p className="text-lg font-bold text-[#d23f26] font-mono">
                        {yaplyxDomain}
                      </p>
                      {serverInfo && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {t('cluster_create_ip')} {serverInfo.ip}
                        </p>
                      )}
                    </div>
                    {domainCreated ? (
                      <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-[#1A1A1A] flex items-center justify-center">
                        <Server className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {creatingDomain && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      {t('cluster_create_creating')}
                    </p>
                  </div>
                </div>
              )}

              {domainCreated && yaplyxDomain && (
                <>
                  <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <p className="text-sm text-green-800 dark:text-green-400">
                        {t('cluster_create_domain_success')}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleInstallCluster}
                    disabled={installing}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#d23f26] to-[#b83220] text-white rounded-xl font-semibold hover:from-[#b83220] hover:to-[#a02a1a] transition-all shadow-lg shadow-[#d23f26]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
                  >
                    {installing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('cluster_create_installing')}
                      </>
                    ) : (
                      t('cluster_create_install')
                    )}
                  </button>
                </>
              )}

              {dnsError && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm text-red-800 dark:text-red-400">
                      {dnsError}
                    </p>
                  </div>
                </div>
              )}

              {installationSuccess && (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-800 dark:text-green-400">
                      {t('cluster_create_success')}
                    </p>
                  </div>
                </div>
              )}

              {installationError && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm text-red-800 dark:text-red-400">
                      {installationError}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}










