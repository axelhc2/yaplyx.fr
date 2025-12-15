'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Shield, User, MapPin, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

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

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState({
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
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (formData.password.length < 5) {
      setError(t('auth_register_password_length'));
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth_register_password_match'));
      setLoading(false);
      return;
    }

    try {
      // Inscription avec tous les champs
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Inclure les cookies
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneCountry: formData.phoneCountry,
          phoneNumber: formData.phoneNumber,
          companyName: formData.companyName || null,
          vatNumber: formData.vatNumber || null,
          billingAddress: formData.billingAddress || null,
          billingAddress2: formData.billingAddress2 || null,
          billingCity: formData.billingCity || null,
          billingCountry: formData.billingCountry || null,
          billingProvince: formData.billingProvince || null,
          billingPostalCode: formData.billingPostalCode || null,
        }),
      });

      // Vérifier si la réponse est vide ou 404
      if (response.status === 404 || !response.ok) {
        setError(t('auth_register_error'));
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('auth_register_error'));
        setLoading(false);
        return;
      }

      // Redirection vers la page de connexion ou dashboard
      router.push('/login?registered=true');
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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* En-tête */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d23f26] to-[#b83220] mb-6 shadow-lg shadow-[#d23f26]/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text">
              {t('auth_register_title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('auth_register_subtitle')}
            </p>
          </div>

          {/* Formulaire avec glassmorphism */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Carte principale avec effet glass */}
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-[#1A1A1A] p-8 md:p-10">
              {error && (
                <div className="mb-6 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    {error}
                  </div>
                </div>
              )}

              {/* Informations personnelles */}
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('auth_register_personal')}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('auth_register_firstname')}
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('auth_register_lastname')}
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth_register_email')}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="phoneCountry" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('auth_register_phone_code')}
                    </Label>
                    <Select
                      id="phoneCountry"
                      name="phoneCountry"
                      required
                      value={formData.phoneCountry}
                      onChange={handleChange}
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
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('auth_register_phone')}
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                      placeholder="0612345678"
                    />
                  </div>
                </div>
              </div>

              {/* Adresse de facturation */}
              <div className="space-y-6 mb-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('auth_register_billing')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('auth_register_company')} <span className="text-gray-400">{t('auth_register_company_optional')}</span>
                    </Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vatNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('auth_register_vat')} <span className="text-gray-400">{t('auth_register_company_optional')}</span>
                    </Label>
                    <Input
                      id="vatNumber"
                      name="vatNumber"
                      type="text"
                      value={formData.vatNumber}
                      onChange={handleChange}
                      className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingAddress" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth_register_address')}
                  </Label>
                  <Input
                    id="billingAddress"
                    name="billingAddress"
                    type="text"
                    required
                    value={formData.billingAddress}
                    onChange={handleChange}
                    className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingAddress2" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth_register_address2')} <span className="text-gray-400">{t('auth_register_company_optional')}</span>
                  </Label>
                  <Input
                    id="billingAddress2"
                    name="billingAddress2"
                    type="text"
                    value={formData.billingAddress2}
                    onChange={handleChange}
                    className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="billingCity" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('auth_register_city')}
                    </Label>
                    <Input
                      id="billingCity"
                      name="billingCity"
                      type="text"
                      required
                      value={formData.billingCity}
                      onChange={handleChange}
                      className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billingCountry" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('auth_register_country')}
                    </Label>
                    <Select
                      id="billingCountry"
                      name="billingCountry"
                      required
                      value={formData.billingCountry}
                      onChange={handleChange}
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
                    <Label htmlFor="billingProvince" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('auth_register_province')}
                    </Label>
                    <Input
                      id="billingProvince"
                      name="billingProvince"
                      type="text"
                      value={formData.billingProvince}
                      onChange={handleChange}
                      className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                      placeholder="—"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billingPostalCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('auth_register_postal')}
                    </Label>
                    <Input
                      id="billingPostalCode"
                      name="billingPostalCode"
                      type="text"
                      required
                      value={formData.billingPostalCode}
                      onChange={handleChange}
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
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('auth_register_security')}
                  </h2>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth_register_password')}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                    minLength={5}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {t('auth_register_password_min')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth_register_confirm')}
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="h-11 bg-white/50 dark:bg-[#1A1A1A] border-gray-300/50 dark:border-gray-700/50 focus:border-[#d23f26] focus:ring-[#d23f26]/20"
                    minLength={5}
                  />
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#d23f26] to-[#b83220] hover:from-[#b83220] hover:to-[#a02a1a] text-white shadow-lg shadow-[#d23f26]/30 hover:shadow-xl hover:shadow-[#d23f26]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('auth_register_loading')}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {t('auth_register_submit')}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </div>

              {/* Lien de connexion */}
              <div className="text-center pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('auth_register_have_account')}{' '}
                  <Link href="/login" className="font-semibold text-[#d23f26] hover:text-[#b83220] transition-colors inline-flex items-center gap-1">
                    {t('auth_register_login')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
