'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Calendar, Eye } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { Modal } from '@/components/ui/modal';

interface MailItem {
  id: number;
  subject: string;
  content: string;
  createdAt: string;
}

export default function UserMailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mails, setMails] = useState<MailItem[]>([]);
  const [selectedMail, setSelectedMail] = useState<MailItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadMails = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (!sessionResponse.ok) {
          router.push('/auth/login');
          return;
        }

        const mailsResponse = await fetch('/api/dashboard/user/mail');
        if (mailsResponse.ok) {
          const data = await mailsResponse.json();
          setMails(data.mails || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des emails:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMails();
  }, [router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMailClick = (mail: MailItem) => {
    setSelectedMail(mail);
    setModalOpen(true);
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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Mail className="w-8 h-8 text-[#d23f26]" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mes emails
            </h1>
          </div>

          {mails.length === 0 ? (
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] p-12 text-center">
              <Mail className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Aucun email pour le moment
              </p>
            </div>
          ) : (
            <div className="bg-white/70 dark:bg-[#0A0A0A] backdrop-blur-2xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-[#1A1A1A] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date d'envoi
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Objet du message
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {mails.map((mail) => (
                      <tr
                        key={mail.id}
                        className="hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                        onClick={() => handleMailClick(mail)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(mail.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {mail.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMailClick(mail);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#d23f26] hover:bg-[#d23f26]/10 dark:hover:bg-[#d23f26]/20 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Voir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal pour afficher le contenu de l'email */}
      {selectedMail && (
        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedMail(null);
          }}
          title={selectedMail.subject}
          variant="default"
        >
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 pb-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Date d'envoi : {formatDate(selectedMail.createdAt)}</span>
              </div>
            </div>
            <div>
              <div className="bg-gray-50 dark:bg-[#1A1A1A] p-5 rounded-lg border border-gray-200 dark:border-gray-800">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100 leading-relaxed overflow-x-auto max-h-[60vh] overflow-y-auto">
                  {selectedMail.content}
                </pre>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

