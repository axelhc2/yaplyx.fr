'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, User, Mail, Phone, Building2, MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { fetchWithCSRF } from '@/lib/csrf-client';

interface UserSettings {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneCountry: string | null;
  phoneNumber: string | null;
  companyName: string | null;
  vatNumber: string | null;
  billingAddress: string | null;
  billingAddress2: string | null;
  billingCity: string | null;
  billingCountry: string | null;
  billingProvince: string | null;
  billingPostalCode: string | null;
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserSettings | null>(null);
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
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (!sessionResponse.ok) {
          router.push('/auth/login');
          return;
        }

        const settingsResponse = await fetch('/api/dashboard/settings');
        if (settingsResponse.ok) {
          const data = await settingsResponse.json();
          setUser(data.user);
          setFormData({
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            email: data.user.email || '',
            phoneCountry: data.user.phoneCountry || '+33',
            phoneNumber: data.user.phoneNumber || '',
            companyName: data.user.companyName || '',
            vatNumber: data.user.vatNumber || '',
            billingAddress: data.user.billingAddress || '',
            billingAddress2: data.user.billingAddress2 || '',
            billingCity: data.user.billingCity || '',
            billingCountry: data.user.billingCountry || 'France',
            billingProvince: data.user.billingProvince || '',
            billingPostalCode: data.user.billingPostalCode || '',
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetchWithCSRF('/api/dashboard/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        alert(t('dashboard_settings_success'));
      } else {
        const errorData = await response.json();
        alert(errorData.error || t('dashboard_settings_error'));
      }
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert(t('dashboard_settings_error'));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-black">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {t('dashboard_settings_title')}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informations personnelles */}
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-[#d23f26]" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('dashboard_settings_personal_info_title')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prénom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard_settings_personal_info_firstname')}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26]"
                    required
                  />
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard_settings_personal_info_lastname')}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26]"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard_settings_personal_info_email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#1A1A1A] text-gray-900 dark:text-white cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard_settings_personal_info_phone')}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-shrink-0">
                      <input
                        type="text"
                        name="phoneCountry"
                        value={formData.phoneCountry}
                        onChange={handleChange}
                        placeholder="+33"
                        className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26] text-sm"
                      />
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="6 40 90 50 49"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Adresse de facturation */}
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-5 h-5 text-[#d23f26]" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('dashboard_settings_billing_title')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom d'entreprise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard_settings_billing_company')}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26]"
                    />
                  </div>
                </div>

                {/* Numéro TVA */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard_settings_billing_vat')}
                  </label>
                  <input
                    type="text"
                    name="vatNumber"
                    value={formData.vatNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26]"
                  />
                </div>

                {/* Adresse 1 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard_settings_billing_address1')}
                  </label>
                  <input
                    type="text"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26]"
                  />
                </div>

                {/* Adresse 2 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard_settings_billing_address2')}
                  </label>
                  <input
                    type="text"
                    name="billingAddress2"
                    value={formData.billingAddress2}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26]"
                  />
                </div>

                {/* Ville */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard_settings_billing_city')}
                  </label>
                  <input
                    type="text"
                    name="billingCity"
                    value={formData.billingCity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26]"
                  />
                </div>

                {/* Pays */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard_settings_billing_country')}
                  </label>
                  <select
                    name="billingCountry"
                    value={formData.billingCountry}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26]"
                  >
                    <option value="France">France</option>
                    <option value="Belgium">Belgique</option>
                    <option value="Switzerland">Suisse</option>
                    <option value="Canada">Canada</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Monaco">Monaco</option>
                  </select>
                </div>

                {/* Département */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard_settings_billing_province')}
                  </label>
                  <input
                    type="text"
                    name="billingProvince"
                    value={formData.billingProvince}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26]"
                  />
                </div>

                {/* Code Postal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard_settings_billing_postal')}
                  </label>
                  <input
                    type="text"
                    name="billingPostalCode"
                    value={formData.billingPostalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26]"
                  />
                </div>
              </div>
            </div>

            {/* Bouton Enregistrer */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-[#d23f26] hover:bg-[#b8351e] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('dashboard_settings_saving')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {t('dashboard_settings_save')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


