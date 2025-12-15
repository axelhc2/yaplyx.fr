'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, User, Mail, Send, Upload, Plus, X, Bold, Italic, Underline, AlignLeft, AlignCenter, Code, Lock, Unlock } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { fetchWithCSRF } from '@/lib/csrf-client';
import Image from 'next/image';

interface SupportReply {
  id: number;
  author: string;
  text: string;
  img: string[] | null;
  createdAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Ticket {
  id: number;
  subject: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  replies: SupportReply[];
  serviceInfo: {
    offerName: string;
    clusterName: string | null;
    clusterUrl: string | null;
    createdAt: string;
    hasCluster: boolean;
  } | null;
}

export default function SupportTicketDetailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: number; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger la session utilisateur
        const sessionResponse = await fetch('/api/auth/session');
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          setCurrentUser({
            id: sessionData.user.id,
            email: sessionData.user.email,
          });
          // Vérifier si l'utilisateur est admin (email se terminant par @yaplyx.fr ou similaire)
          const userEmail = sessionData.user.email.toLowerCase();
          setIsAdmin(userEmail.includes('@yaplyx') || userEmail.includes('admin@') || userEmail.includes('support@'));
        }

        // Charger le ticket
        const ticketResponse = await fetch(`/api/dashboard/support/${ticketId}`);
        if (ticketResponse.ok) {
          const ticketData = await ticketResponse.json();
          setTicket(ticketData.ticket);
        } else {
          router.push('/dashboard/support');
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        router.push('/dashboard/support');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      loadData();
    }
  }, [ticketId, router]);

  useEffect(() => {
    // Scroll vers le bas quand de nouveaux messages arrivent
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket?.replies]);

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && files.length === 0) {
      return;
    }

    if (!message.trim()) {
      setMessage('<p></p>');
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('message', message || '<p></p>');
      
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetchWithCSRF(`/api/dashboard/support/${ticketId}/reply`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Recharger le ticket pour avoir les nouveaux messages
        const ticketResponse = await fetch(`/api/dashboard/support/${ticketId}`);
        if (ticketResponse.ok) {
          const data = await ticketResponse.json();
          setTicket(data.ticket);
        }
        setMessage('');
        setFiles([]);
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
      } else {
        const error = await response.json();
        alert(error.error || t('dashboard_support_detail_send_error'));
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert(t('dashboard_support_detail_send_error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const response = await fetchWithCSRF(`/api/dashboard/support/${ticketId}/toggle-status`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        if (ticket) {
          setTicket({ ...ticket, status: data.status });
        }
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#d23f26] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return null;
  }


  return (
    <div className="bg-white dark:bg-black">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header avec bouton retour */}
          <div className="mb-5">
            <button
              onClick={() => router.push('/dashboard/support')}
              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-3 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('dashboard_support_detail_back')}
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {ticket.subject}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Colonne de gauche : Informations */}
            <div className="lg:col-span-1">
              <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-5 sticky top-6">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  {t('dashboard_support_detail_info_title')}
                </h2>

                {/* Nom */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('dashboard_support_detail_name')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={`${ticket.user.firstName} ${ticket.user.lastName}`}
                      disabled
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#1A1A1A] text-gray-900 dark:text-white cursor-not-allowed text-xs"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('dashboard_support_detail_email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={ticket.user.email}
                      disabled
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#1A1A1A] text-gray-900 dark:text-white cursor-not-allowed text-xs"
                    />
                  </div>
                </div>

                {/* Statut */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t('dashboard_support_detail_status')}
                  </label>
                  {ticket.status === 'pending' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
                      {t('dashboard_support_status_pending')}
                    </span>
                  )}
                  {ticket.status === 'answered' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                      {t('dashboard_support_status_answered')}
                    </span>
                  )}
                  {ticket.status === 'closed' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                      {t('dashboard_support_status_closed')}
                    </span>
                  )}
                </div>

                {/* Bouton fermer/rouvrir */}
                <button
                  onClick={handleToggleStatus}
                  className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${
                    ticket.status === 'closed'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {ticket.status === 'closed' ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      {t('dashboard_support_detail_reopen')}
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      {t('dashboard_support_detail_close')}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Colonne de droite : Discussion */}
            <div className="lg:col-span-3 space-y-6">
              {/* Card des messages */}
              <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A]">
                <div
                  ref={messagesContainerRef}
                  className="overflow-y-auto p-6 space-y-4 max-h-[calc(100vh-450px)]"
                >
                  {ticket.replies.map((reply) => {
                    const replyImages = reply.img && Array.isArray(reply.img) ? reply.img.filter(img => /\.(jpg|jpeg|gif|png)$/i.test(img)) : [];
                    // Vérifier si l'auteur est admin en regardant si "admin" est dans le champ author
                    const isAuthorAdmin = reply.author.toLowerCase().includes('admin');
                    
                    // Si admin, afficher à gauche avec "Équipe Yaplyx", sinon afficher à droite avec le nom
                    const displayAuthor = isAuthorAdmin ? t('dashboard_support_detail_team_yaplyx') : reply.author;
                    const alignLeft = isAuthorAdmin;
                    
                    return (
                      <div
                        key={reply.id}
                        className={`flex ${alignLeft ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[75%] rounded-xl p-4 ${
                          alignLeft
                            ? 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-900 dark:text-white'
                            : 'bg-[#d23f26] text-white'
                        }`}>
                          {/* En-tête du message */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-sm">{displayAuthor}</span>
                            <span className={`text-xs opacity-80 ${alignLeft ? 'text-gray-600 dark:text-gray-400' : 'text-white/80'}`}>
                              {new Date(reply.createdAt).toLocaleString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          {/* Images du message (au-dessus du texte) */}
                          {replyImages.length > 0 && (
                            <div className="mb-3 grid grid-cols-2 gap-2">
                              {replyImages.map((imagePath, imgIndex) => (
                                <div
                                  key={imgIndex}
                                  className="relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 border-white/20 hover:border-white/40 transition-colors"
                                  onClick={() => setZoomedImage(`/${imagePath}`)}
                                >
                                  <Image
                                    src={`/${imagePath}`}
                                    alt={`Image ${imgIndex + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Texte du message */}
                          <div
                            className={`prose prose-sm dark:prose-invert max-w-none ${
                              alignLeft
                                ? ''
                                : 'prose-invert'
                            }`}
                            style={{
                              color: alignLeft ? 'inherit' : 'white',
                            }}
                            dangerouslySetInnerHTML={{ __html: reply.text }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Card pour répondre (si pas fermé) */}
              {ticket.status !== 'closed' && (
                <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-5">
                    <form onSubmit={handleSendMessage} className="space-y-3">
                      {/* Barre d'outils */}
                      <div className="flex gap-1.5 p-1.5 border border-gray-300 dark:border-gray-700 rounded-t-lg bg-white dark:bg-[#0A0A0A]">
                        <button
                          type="button"
                          onClick={() => formatText('bold')}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded transition-colors"
                          title={t('dashboard_support_create_format_bold')}
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('italic')}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded transition-colors"
                          title={t('dashboard_support_create_format_italic')}
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('underline')}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded transition-colors"
                          title={t('dashboard_support_create_format_underline')}
                        >
                          <Underline className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-px bg-gray-300 dark:bg-gray-700 mx-1" />
                        <button
                          type="button"
                          onClick={() => formatText('justifyLeft')}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded transition-colors"
                          title={t('dashboard_support_create_format_left')}
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('justifyCenter')}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded transition-colors"
                          title={t('dashboard_support_create_format_center')}
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('formatBlock', '<pre>')}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded transition-colors"
                          title={t('dashboard_support_create_format_code')}
                        >
                          <Code className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Éditeur */}
                      <div
                        ref={editorRef}
                        contentEditable
                        onInput={(e) => setMessage(e.currentTarget.innerHTML)}
                        className="min-h-[120px] p-3 border-x border-b border-gray-300 dark:border-gray-700 rounded-b-lg bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d23f26] text-xs"
                        style={{ whiteSpace: 'pre-wrap' }}
                        suppressContentEditableWarning
                      />

                      {/* Fichiers */}
                      <div className="flex items-center gap-3">
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
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-[#2A2A2A] text-gray-900 dark:text-white rounded-lg cursor-pointer transition-colors text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {t('dashboard_support_create_add_file')}
                        </label>

                        {files.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {files.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-[#1A1A1A] rounded text-xs"
                              >
                                <span className="text-gray-900 dark:text-white">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="p-0.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                >
                                  <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bouton envoyer */}
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={submitting || (!message.trim() && files.length === 0)}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#d23f26] hover:bg-[#b83220] text-white rounded-lg transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              {t('dashboard_support_detail_sending')}
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              {t('dashboard_support_detail_send')}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de zoom pour les images */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <Image
              src={zoomedImage}
              alt="Zoomed"
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

