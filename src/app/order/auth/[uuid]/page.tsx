'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Shield, User, MapPin, Lock, ArrowRight, CheckCircle2, LogIn, Mail, ArrowLeft, LogOut } from 'lucide-react';
import { getGravatarUrl } from '@/lib/gravatar';

// Liste des indicatifs téléphoniques internationaux
const countryCodes = [
  { code: '+33', country: 'France' },
  { code: '+1', country: 'États-Unis / Canada' },
  { code: '+44', country: 'Royaume-Uni' },
  { code: '+49', country: 'Allemagne' },
  { code: '+34', country: 'Espagne' },
  { code: '+39', country: 'Italie' },
  { code: '+31', country: 'Pays-Bas' },
  { code: '+32', country: 'Belgique' },
  { code: '+41', country: 'Suisse' },
  { code: '+352', country: 'Luxembourg' },
  { code: '+351', country: 'Portugal' },
  { code: '+30', country: 'Grèce' },
  { code: '+45', country: 'Danemark' },
  { code: '+46', country: 'Suède' },
  { code: '+47', country: 'Norvège' },
  { code: '+358', country: 'Finlande' },
  { code: '+353', country: 'Irlande' },
  { code: '+43', country: 'Autriche' },
  { code: '+48', country: 'Pologne' },
  { code: '+420', country: 'République tchèque' },
  { code: '+36', country: 'Hongrie' },
  { code: '+40', country: 'Roumanie' },
  { code: '+7', country: 'Russie' },
  { code: '+86', country: 'Chine' },
  { code: '+81', country: 'Japon' },
  { code: '+82', country: 'Corée du Sud' },
  { code: '+91', country: 'Inde' },
  { code: '+61', country: 'Australie' },
  { code: '+55', country: 'Brésil' },
  { code: '+52', country: 'Mexique' },
  { code: '+27', country: 'Afrique du Sud' },
];

const countries = [
  'France', 'Allemagne', 'Belgique', 'Espagne', 'Italie', 'Pays-Bas',
  'Suisse', 'Luxembourg', 'Portugal', 'Royaume-Uni', 'Autriche', 'Pologne',
  'République tchèque', 'Hongrie', 'Roumanie', 'Danemark', 'Suède', 'Norvège',
  'Finlande', 'Irlande', 'Grèce', 'États-Unis', 'Canada', 'Autre'
];

function AuthPageContent() {
  const params = useParams();
  const router = useRouter();
  const [view, setView] = useState<'choice' | 'login' | 'register'>('choice');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // État pour le formulaire de connexion
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // État pour le formulaire d'inscription
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneCountry: '+33',
    phoneNumber: '',
    companyName: '',
    vatNumber: '',
    billingAddress: '',
    billingAddress2: '',
    billingCity: '',
    billingCountry: 'France',
    billingProvince: '',
    billingPostalCode: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setLoaded(true);
    // Vérifier si l'utilisateur est déjà authentifié
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setCurrentUser(data.user);
          // Générer l'URL Gravatar
          if (data.user.email) {
            const gravatarUrl = await getGravatarUrl(data.user.email, 128, 'mp');
            setAvatarUrl(gravatarUrl);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleContinueWithAccount = () => {
    // Rediriger vers la page de paiement avec le compte actuel
    router.push(`/order/payments/${params.uuid}`);
  };

  const handleUseDifferentAccount = async () => {
    try {
      // Déconnecter l'utilisateur
      const { fetchWithCSRF } = await import('@/lib/csrf-client');
      await fetchWithCSRF('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      setAvatarUrl(null);
      setView('choice');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      // Vérifier si la réponse est vide ou 404
      if (response.status === 404 || !response.ok) {
        setError('Une erreur est survenue lors de la connexion');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue lors de la connexion');
        setLoading(false);
        return;
      }

      // Mettre à jour l'utilisateur et rediriger
      if (data.user) {
        setCurrentUser(data.user);
        if (data.user.email) {
          const gravatarUrl = await getGravatarUrl(data.user.email, 128, 'mp');
          setAvatarUrl(gravatarUrl);
        }
      }
      // Rediriger vers la page de paiement
      router.push(`/order/payments/${params.uuid}`);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (registerData.password.length < 5) {
      setError('Le mot de passe doit contenir au moins 5 caractères');
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          phoneCountry: registerData.phoneCountry,
          phoneNumber: registerData.phoneNumber,
          companyName: registerData.companyName || null,
          vatNumber: registerData.vatNumber || null,
          billingAddress: registerData.billingAddress || null,
          billingAddress2: registerData.billingAddress2 || null,
          billingCity: registerData.billingCity || null,
          billingCountry: registerData.billingCountry || null,
          billingProvince: registerData.billingProvince || null,
          billingPostalCode: registerData.billingPostalCode || null,
        }),
      });

      // Vérifier si la réponse est vide ou 404
      if (response.status === 404 || !response.ok) {
        setError('Une erreur est survenue lors de l\'inscription');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue lors de l\'inscription');
        setLoading(false);
        return;
      }

      // Mettre à jour l'utilisateur et rediriger
      if (data.user) {
        setCurrentUser(data.user);
        if (data.user.email) {
          const gravatarUrl = await getGravatarUrl(data.user.email, 128, 'mp');
          setAvatarUrl(gravatarUrl);
        }
      }
      // Rediriger vers la page de paiement
      router.push(`/order/payments/${params.uuid}`);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-white dark:bg-black overflow-hidden py-24">
      {/* Fond avec gradient sophistiqué */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900/20 dark:via-black dark:to-gray-900/20" />

      {/* Formes géométriques animées */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-gradient-to-br from-indigo-100/15 to-cyan-100/15 dark:from-indigo-900/8 dark:to-cyan-900/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-violet-100/20 to-pink-100/20 dark:from-violet-900/10 dark:to-pink-900/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Particules animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: 15, top: 25, delay: 0.5, duration: 4.2 },
          { left: 75, top: 45, delay: 1.2, duration: 5.8 },
          { left: 35, top: 80, delay: 2.1, duration: 3.9 },
          { left: 85, top: 15, delay: 3.4, duration: 6.1 },
          { left: 45, top: 65, delay: 0.8, duration: 4.7 },
          { left: 25, top: 35, delay: 1.9, duration: 5.3 },
          { left: 65, top: 70, delay: 2.7, duration: 4.4 },
          { left: 55, top: 20, delay: 3.8, duration: 3.6 },
        ].map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400/40 to-purple-400/40 dark:from-blue-300/20 dark:to-purple-300/20 rounded-full animate-ping"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      {/* Motif de fond discret */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 3px 3px, currentColor 1.5px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* En-tête */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text">
              Finaliser votre commande
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connectez-vous ou créez un compte pour continuer
            </p>
          </div>

          {/* Vue choix */}
          {view === 'choice' && (
            <>
              {checkingAuth ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : currentUser ? (
                /* Utilisateur déjà connecté */
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-[#1A1A1A] p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d23f26] to-[#b83220] shadow-lg shadow-[#d23f26]/20">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Compte connecté
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Continuez avec ce compte ou utilisez un autre compte
                        </p>
                      </div>
                    </div>

                    {/* Informations utilisateur */}
                    <div className="flex items-start gap-6 mb-8 p-6 bg-gray-50/50 dark:bg-[#1A1A1A] rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                      {/* Avatar Gravatar */}
                      <div className="flex-shrink-0">
                        <img
                          src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.name || 'User')}&size=80&background=d23f26&color=fff`}
                          alt={currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.name || 'User'}
                          className="w-20 h-20 rounded-full object-cover border-2 border-[#d23f26]/20"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.name || 'User')}&size=80&background=d23f26&color=fff`;
                          }}
                        />
                      </div>

                      {/* Informations */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {currentUser.firstName && currentUser.lastName 
                            ? `${currentUser.firstName} ${currentUser.lastName}`
                            : currentUser.name || 'Utilisateur'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {currentUser.email}
                        </p>
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="space-y-4">
                      <Button
                        onClick={handleContinueWithAccount}
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#d23f26] to-[#b83220] hover:from-[#b83220] hover:to-[#a02a1a] text-white shadow-lg shadow-[#d23f26]/30 hover:shadow-xl hover:shadow-[#d23f26]/40 transition-all duration-300"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Continuer avec ce compte
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      </Button>

                      <Button
                        onClick={handleUseDifferentAccount}
                        variant="outline"
                        className="w-full h-12 text-base font-semibold border-gray-300/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-[#1A1A1A]"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <LogOut className="w-5 h-5" />
                          Utiliser un autre compte
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Choix entre connexion et inscription */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Carte Connexion */}
                  <button
                    onClick={() => setView('login')}
                    className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-[#1A1A1A] p-8 md:p-10 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d23f26] to-[#b83220] shadow-lg shadow-[#d23f26]/20">
                        <LogIn className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          J'ai déjà un compte
                        </h2>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Connectez-vous pour finaliser votre achat rapidement et en toute sécurité.
                    </p>
                    <div className="flex items-center gap-2 text-[#d23f26] font-semibold">
                      Se connecter
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </button>

                  {/* Carte Inscription */}
                  <button
                    onClick={() => setView('register')}
                    className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-[#1A1A1A] p-8 md:p-10 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d23f26] to-[#b83220] shadow-lg shadow-[#d23f26]/20">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          S'inscrire avec un email
                        </h2>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Créez un compte pour accéder à vos commandes et gérer vos abonnements facilement.
                    </p>
                    <div className="flex items-center gap-2 text-[#d23f26] font-semibold">
                      S'inscrire
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Vue Login */}
          {view === 'login' && (
            <div className="max-w-2xl mx-auto">
              <Button
                onClick={() => setView('choice')}
                variant="ghost"
                className="mb-6 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour au choix
              </Button>

              <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-[#1A1A1A] p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d23f26] to-[#b83220] shadow-lg shadow-[#d23f26]/20">
                    <LogIn className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Connexion
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Connectez-vous à votre compte Yaplyx
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      {error}
                    </div>
                  </div>
                )}

                {success && (
                  <div className="mb-6 bg-green-50/80 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 text-green-800 dark:text-green-200 px-4 py-3 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      {success}
                    </div>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Adresse courriel *
                    </Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      required
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="h-12 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Mot de passe *
                    </Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      required
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="h-12 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                      placeholder="••••••••"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#d23f26] to-[#b83220] hover:from-[#b83220] hover:to-[#a02a1a] text-white shadow-lg shadow-[#d23f26]/30 hover:shadow-xl hover:shadow-[#d23f26]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Connexion en cours...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Se connecter
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Vue Register */}
          {view === 'register' && (
            <div className="max-w-5xl mx-auto">
              <Button
                onClick={() => setView('choice')}
                variant="ghost"
                className="mb-6 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour au choix
              </Button>

              <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-[#1A1A1A] p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d23f26] to-[#b83220] shadow-lg shadow-[#d23f26]/20">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Créer votre compte
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rejoignez Yaplyx et commencez à sécuriser votre infrastructure dès aujourd'hui
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      {error}
                    </div>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-8">
                  {/* Informations personnelles */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Informations personnelles
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="register-firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Prénom *
                        </Label>
                        <Input
                          id="register-firstName"
                          name="firstName"
                          type="text"
                          required
                          value={registerData.firstName}
                          onChange={handleRegisterChange}
                          className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nom *
                        </Label>
                        <Input
                          id="register-lastName"
                          name="lastName"
                          type="text"
                          required
                          value={registerData.lastName}
                          onChange={handleRegisterChange}
                          className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Adresse courriel *
                      </Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        required
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="register-phoneCountry" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Indicatif pays *
                        </Label>
                        <Select
                          id="register-phoneCountry"
                          name="phoneCountry"
                          required
                          value={registerData.phoneCountry}
                          onChange={handleRegisterChange}
                          className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                        >
                          {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.code} - {country.country}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="register-phoneNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Téléphone *
                        </Label>
                        <Input
                          id="register-phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          required
                          value={registerData.phoneNumber}
                          onChange={handleRegisterChange}
                          className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                          placeholder="0612345678"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Adresse de facturation */}
                  <div className="space-y-6 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                      <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                        <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Adresse de facturation
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="register-companyName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nom de l'entreprise <span className="text-gray-400">(Optionnel)</span>
                        </Label>
                        <Input
                          id="register-companyName"
                          name="companyName"
                          type="text"
                          value={registerData.companyName}
                          onChange={handleRegisterChange}
                          className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-vatNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Numéro TVA <span className="text-gray-400">(Optionnel)</span>
                        </Label>
                        <Input
                          id="register-vatNumber"
                          name="vatNumber"
                          type="text"
                          value={registerData.vatNumber}
                          onChange={handleRegisterChange}
                          className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-billingAddress" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Adresse *
                      </Label>
                      <Input
                        id="register-billingAddress"
                        name="billingAddress"
                        type="text"
                        required
                        value={registerData.billingAddress}
                        onChange={handleRegisterChange}
                        className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-billingAddress2" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Adresse 2 <span className="text-gray-400">(Optionnel)</span>
                      </Label>
                      <Input
                        id="register-billingAddress2"
                        name="billingAddress2"
                        type="text"
                        value={registerData.billingAddress2}
                        onChange={handleRegisterChange}
                        className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="register-billingCity" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Ville *
                        </Label>
                        <Input
                          id="register-billingCity"
                          name="billingCity"
                          type="text"
                          required
                          value={registerData.billingCity}
                          onChange={handleRegisterChange}
                          className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-billingCountry" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Pays *
                        </Label>
                        <Select
                          id="register-billingCountry"
                          name="billingCountry"
                          required
                          value={registerData.billingCountry}
                          onChange={handleRegisterChange}
                          className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                        >
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="register-billingProvince" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Province
                        </Label>
                        <Input
                          id="register-billingProvince"
                          name="billingProvince"
                          type="text"
                          value={registerData.billingProvince}
                          onChange={handleRegisterChange}
                          className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                          placeholder="—"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-billingPostalCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Code postal *
                        </Label>
                        <Input
                          id="register-billingPostalCode"
                          name="billingPostalCode"
                          type="text"
                          required
                          value={registerData.billingPostalCode}
                          onChange={handleRegisterChange}
                          className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sécurité du compte */}
                  <div className="space-y-6 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                      <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Sécurité du compte
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mot de passe *
                      </Label>
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        required
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                        minLength={5}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Au moins 5 caractères
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirmer le mot de passe *
                      </Label>
                      <Input
                        id="register-confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                        minLength={5}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#d23f26] to-[#b83220] hover:from-[#b83220] hover:to-[#a02a1a] text-white shadow-lg shadow-[#d23f26]/30 hover:shadow-xl hover:shadow-[#d23f26]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Inscription en cours...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Créer mon compte
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
