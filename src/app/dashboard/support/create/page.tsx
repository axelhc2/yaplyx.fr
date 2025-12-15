'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, FileText, MessageSquare, Upload, Plus, X, Send, Bold, Italic, Underline, AlignLeft, AlignCenter, Code } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { fetchWithCSRF } from '@/lib/csrf-client';

interface Service {
  id: number;
  name: string;
  createdAt: string;
  offer: {
    name: string;
  };
  clusters: Array<{
    id: number;
    url: string;
  }>;
}

export default function CreateSupportTicketPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; firstName: string; lastName: string } | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('none');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (!sessionResponse.ok) {
          router.push('/auth/login');
          return;
        }
        const sessionData = await sessionResponse.json();
        setUser({
          name: sessionData.user.name || `${sessionData.user.firstName} ${sessionData.user.lastName}`,
          email: sessionData.user.email,
          firstName: sessionData.user.firstName,
          lastName: sessionData.user.lastName,
        });

        const servicesResponse = await fetch('/api/dashboard/services');
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData.services || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Vérifier les extensions et la taille
      const allowedExtensions = ['.jpg', '.jpeg', '.gif', '.png', '.txt', '.pdf'];
      const maxSize = 100 * 1024 * 1024; // 100MB
      
      const validFiles = newFiles.filter(file => {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!allowedExtensions.includes(extension)) {
          alert(`${t('dashboard_support_create_file_invalid_extension')}: ${file.name}`);
          return false;
        }
        if (file.size > maxSize) {
          alert(`${t('dashboard_support_create_file_too_large')}: ${file.name}`);
          return false;
        }
        return true;
      });
      
      setFiles(prev => [...prev, ...validFiles]);
    }
    // Réinitialiser l'input pour permettre de sélectionner le même fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      alert(t('dashboard_support_create_required_fields'));
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('message', message);
      formData.append('serviceId', selectedService);
      
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetchWithCSRF('/api/dashboard/support/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = t('dashboard_support_create_error');
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Si la réponse n'est pas du JSON, utiliser le texte de la réponse
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        alert(errorMessage);
        return;
      }

      // Si la réponse est OK, rediriger
      try {
        const data = await response.json();
        if (data.success) {
          router.push('/dashboard/support');
        }
      } catch (e) {
        // Même si le JSON ne peut pas être parsé, rediriger si le statut est OK
        router.push('/dashboard/support');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert(t('dashboard_support_create_error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
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
              {t('dashboard_support_create_title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('dashboard_support_create_desc')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card 1: Informations de la demande */}
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('dashboard_support_create_info_title')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard_support_create_name')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={user?.name || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#1A1A1A] text-gray-900 dark:text-white cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('dashboard_support_create_email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#1A1A1A] text-gray-900 dark:text-white cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('dashboard_support_create_service')}
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26] focus:border-transparent"
                >
                  <option value="none">{t('dashboard_support_create_service_none')}</option>
                  {services.map((service) => {
                    const cluster = service.clusters[0];
                    const serviceLabel = cluster
                      ? `${service.offer.name} - ${cluster.url}`
                      : `${service.offer.name} (${new Date(service.createdAt).toLocaleDateString('fr-FR')})`;
                    return (
                      <option key={service.id} value={service.id.toString()}>
                        {serviceLabel}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Card 2: Message */}
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('dashboard_support_create_message_title')}
              </h2>

              {/* Sujet */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('dashboard_support_create_subject')}
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t('dashboard_support_create_subject_placeholder')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Message avec éditeur riche */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('dashboard_support_create_message')}
                </label>
                
                {/* Barre d'outils */}
                <div className="flex gap-2 p-2 border border-gray-300 dark:border-gray-700 rounded-t-lg bg-gray-50 dark:bg-[#1A1A1A]">
                  <button
                    type="button"
                    onClick={() => formatText('bold')}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded transition-colors"
                    title={t('dashboard_support_create_format_bold')}
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('italic')}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded transition-colors"
                    title={t('dashboard_support_create_format_italic')}
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('underline')}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded transition-colors"
                    title={t('dashboard_support_create_format_underline')}
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                  <div className="w-px bg-gray-300 dark:bg-gray-700 mx-1" />
                  <button
                    type="button"
                    onClick={() => formatText('justifyLeft')}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded transition-colors"
                    title={t('dashboard_support_create_format_left')}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('justifyCenter')}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded transition-colors"
                    title={t('dashboard_support_create_format_center')}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => formatText('formatBlock', '<pre>')}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded transition-colors"
                    title={t('dashboard_support_create_format_code')}
                  >
                    <Code className="w-4 h-4" />
                  </button>
                </div>

                {/* Éditeur */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={(e) => {
                    const html = e.currentTarget.innerHTML;
                    setMessage(html);
                  }}
                  className="min-h-[200px] p-4 border-x border-b border-gray-300 dark:border-gray-700 rounded-b-lg bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26]"
                  style={{ whiteSpace: 'pre-wrap' }}
                  suppressContentEditableWarning
                />
              </div>
            </div>

            {/* Card 3: Pièces jointes */}
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('dashboard_support_create_attachments_title')}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept=".jpg,.jpeg,.gif,.png,.txt,.pdf"
                    className="hidden"
                    id="file-input"
                    multiple
                  />
                  <label
                    htmlFor="file-input"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-[#2A2A2A] text-gray-900 dark:text-white rounded-lg cursor-pointer transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    {t('dashboard_support_create_add_file')}
                  </label>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('dashboard_support_create_file_info')}
                </p>

                {/* Liste des fichiers */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">{file.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bouton Envoyer */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-[#d23f26] hover:bg-[#b83220] text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('dashboard_support_create_submitting')}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t('dashboard_support_create_send')}
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

