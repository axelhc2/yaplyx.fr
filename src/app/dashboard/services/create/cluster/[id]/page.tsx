'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Server, CheckCircle2, XCircle, Globe, Loader2 } from 'lucide-react';
import { fetchWithCSRF } from '@/lib/csrf-client';

interface ServerInfo {
  id: number;
  ip: string;
  hostname: string;
}

export default function CreateClusterPage() {
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

  // Générer un sous-domaine aléatoire pour .yaplyx.online
  useEffect(() => {
    if (domainType === 'yaplyx' && !yaplyxDomain) {
      const randomId = Math.floor(Math.random() * 100000);
      setYaplyxDomain(`app${randomId}.yaplyx.online`);
    }
  }, [domainType, yaplyxDomain]);

  useEffect(() => {
    const loadServer = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (!sessionResponse.ok) {
          router.push('/auth/login');
          return;
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
  }, [router]);

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
          setDnsError(data.error || `Le domaine "${customDomain}" n'existe pas ou n'a pas d'enregistrement DNS. Veuillez créer l'enregistrement DNS A pointant vers ${serverInfo.ip}`);
        } else if (data.resolvedIPs && data.resolvedIPs.length > 0) {
          setDnsError(`Le domaine pointe vers ${data.resolvedIPs.join(', ')}, mais l'IP attendue est ${serverInfo.ip}`);
        } else {
          setDnsError(data.error || 'L\'enregistrement DNS ne pointe pas vers la bonne IP');
        }
      }
    } catch (error: any) {
      setDnsVerified(false);
      setDnsError('Erreur lors de la vérification DNS');
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

  if (!serverInfo) {
    return (
      <div className="bg-white dark:bg-black">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-12 text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucun serveur disponible
              </p>
              <button
                onClick={() => router.back()}
                className="mt-4 px-6 py-3 bg-gray-100 dark:bg-[#1A1A1A] text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-[#252525] transition-all"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Installer votre cluster
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configurez votre cluster pour le service #{params?.id}
            </p>
          </div>

          {/* Domain Type Selection */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Choisissez votre type de domaine
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
                    Mon propre domaine
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Utilisez votre domaine personnalisé (ex: cluster.mondomaine.com)
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
                    Domaine Yaplyx
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Obtenez un domaine .yaplyx.online automatiquement
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Custom Domain Configuration */}
          {domainType === 'custom' && (
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Configuration DNS
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Votre domaine
                </label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => {
                    setCustomDomain(e.target.value);
                    setDnsVerified(null);
                    setDnsError(null);
                  }}
                  placeholder="exemple.com"
                  className="w-full px-4 py-2 bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-[#1A1A1A] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26]"
                />
              </div>

              {customDomain && (
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-xl p-4 mb-4">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-400 mb-2">
                    Enregistrement DNS à créer :
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-800 dark:text-blue-300">Type:</span>
                      <span className="text-gray-700 dark:text-gray-300">A</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-800 dark:text-blue-300">Nom:</span>
                      <span className="text-gray-700 dark:text-gray-300">{customDomain}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-800 dark:text-blue-300">Valeur:</span>
                      <span className="text-gray-700 dark:text-gray-300 font-mono">{serverInfo.ip}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleVerifyDNS}
                disabled={!customDomain || verifying}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#d23f26] to-[#b83220] text-white rounded-xl font-semibold hover:from-[#b83220] hover:to-[#a02a1a] transition-all shadow-lg shadow-[#d23f26]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Vérification en cours...
                  </>
                ) : (
                  'Vérifier l\'enregistrement'
                )}
              </button>

              {dnsVerified === true && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-800 dark:text-green-400">
                    L'enregistrement DNS est correct !
                  </span>
                </div>
              )}

              {dnsVerified === false && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-xl flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-800 dark:text-red-400">
                    {dnsError || 'L\'enregistrement DNS ne pointe pas vers la bonne IP'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Yaplyx Domain */}
          {domainType === 'yaplyx' && (
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Votre domaine Yaplyx
              </h2>
              
              {yaplyxDomain && (
                <div className="bg-gradient-to-r from-[#d23f26]/10 to-[#d23f26]/5 dark:from-[#d23f26]/20 dark:to-[#d23f26]/10 border border-[#d23f26]/20 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Votre domaine généré :
                      </p>
                      <p className="text-lg font-bold text-[#d23f26] font-mono">
                        {yaplyxDomain}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#d23f26] flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-xl p-4">
                <p className="text-sm text-blue-900 dark:text-blue-400">
                  <strong>Note :</strong> Ce domaine sera automatiquement configuré et prêt à l'emploi. Aucune configuration DNS n'est nécessaire.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


