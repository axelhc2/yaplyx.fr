'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Shield, Mail, Lock, ArrowRight, LogIn, CheckCircle2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    setLoaded(true);
    // Vérifier si l'utilisateur vient de s'inscrire
    if (searchParams.get('registered') === 'true') {
      setSuccess('Votre compte a été créé avec succès ! Connectez-vous maintenant.');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        credentials: 'include', // Inclure les cookies
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
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

      // Redirection vers le dashboard ou la page d'accueil
      router.push('/dashboard');
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

      <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* En-tête */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d23f26] to-[#b83220] mb-6 shadow-lg shadow-[#d23f26]/20">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text">
              Connexion
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Connectez-vous à votre compte Yaplyx
            </p>
          </div>

          {/* Formulaire avec glassmorphism */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Carte principale avec effet glass */}
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-[#1A1A1A] p-8 md:p-10">
              {success && (
                <div className="mb-6 bg-green-50/80 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 text-green-800 dark:text-green-200 px-4 py-3 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {success}
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    {error}
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2 mb-6">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Adresse courriel *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-2 mb-6">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mot de passe *
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                  placeholder="••••••••"
                />
              </div>

              {/* Options */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-[#d23f26] focus:ring-[#d23f26]"
                  />
                  <span>Se souvenir de moi</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-[#d23f26] hover:text-[#b83220] transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Bouton de soumission */}
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

              {/* Diviseur */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200/50 dark:border-gray-700/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/70 dark:bg-[#0A0A0A] text-gray-500 dark:text-gray-400">
                    Nouveau sur Yaplyx ?
                  </span>
                </div>
              </div>

              {/* Lien d'inscription */}
              <div className="text-center">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 w-full h-12 text-base font-semibold text-gray-900 dark:text-white bg-white/50 dark:bg-[#1A1A1A] border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-gray-50/50 dark:hover:bg-[#252525] transition-all duration-300"
                >
                  <Shield className="w-5 h-5" />
                  Créer un compte
                </Link>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En vous connectant, vous acceptez nos{' '}
                <Link href="/terms" className="text-[#d23f26] hover:underline">
                  conditions d'utilisation
                </Link>
                {' '}et notre{' '}
                <Link href="/privacy" className="text-[#d23f26] hover:underline">
                  politique de confidentialité
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

