import { CheckIcon } from 'lucide-react';

export default function InstallationSteps() {
  return (
    <div className="relative py-16 lg:py-24 bg-white dark:bg-black overflow-hidden">
      {/* Fond avec gradient subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white to-slate-50/30 dark:from-gray-900/20 dark:via-black dark:to-gray-900/20" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Installation en <span className="text-[#d23f26]">10 étapes</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Une expérience simple et fluide. Vous êtes opérationnel en moins de 30 minutes.
          </p>
        </div>

        {/* Timeline horizontale avec étapes */}
        <div className="relative max-w-6xl mx-auto">
          {/* Ligne de progression */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-[#d23f26]/30 to-gray-200 dark:from-gray-800 dark:via-[#d23f26]/20 dark:to-gray-800">
            <div
              className="h-full bg-gradient-to-r from-[#d23f26] to-[#d23f26]/80 transition-all duration-1000 ease-out"
              style={{
                width: '100%',
              }}
            />
          </div>

          {/* Étapes */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-4">
            {[
              { title: "Choix de l'offre", color: "text-blue-600 dark:text-blue-500" },
              { title: "Mise en place du cluster", color: "text-purple-600 dark:text-purple-500" },
              { title: "Configuration dashboard", color: "text-indigo-600 dark:text-indigo-500" },
              { title: "Connexion sécurisée", color: "text-green-600 dark:text-green-500" },
              { title: "Ajout des serveurs", color: "text-teal-600 dark:text-teal-500" },
              { title: "Installation automatique", color: "text-cyan-600 dark:text-cyan-500" },
              { title: "Création groupe sécurité", color: "text-orange-600 dark:text-orange-500" },
              { title: "Définition des règles", color: "text-red-600 dark:text-red-500" },
              { title: "Application ciblée", color: "text-pink-600 dark:text-pink-500" },
              { title: "Sécurité maximale", color: "text-[#d23f26]" }
            ].map((step, i) => (
              <div key={i} className="group relative">
                {/* Cercle de progression */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 border-4 border-[#d23f26] flex items-center justify-center shadow-lg">
                    <CheckIcon className="w-8 h-8 text-[#d23f26]" />
                  </div>
                </div>

                {/* Carte de contenu */}
                <div className="relative bg-white dark:bg-gray-800 border border-slate-200/60 dark:border-gray-700 rounded-xl p-4 text-center hover:border-slate-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-gray-900/50">
                  <div className="flex items-center justify-center mb-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-[#d23f26] text-white">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#d23f26] transition-colors duration-300">
                    {step.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message final */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-slate-100 dark:bg-gray-800 rounded-full border border-slate-200 dark:border-gray-700">
            <CheckIcon className="w-4 h-4 text-[#d23f26]" />
            <p className="text-xs font-medium text-slate-700 dark:text-gray-300">
              Prêt en moins de <span className="text-[#d23f26] font-semibold">30 minutes</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



