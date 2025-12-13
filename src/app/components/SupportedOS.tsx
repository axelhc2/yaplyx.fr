import { CheckCircle2 } from 'lucide-react';

const supportedOS = [
  {
    name: 'Ubuntu',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <circle cx="12" cy="12" r="12" fill="#E95420"/>
        <circle cx="12" cy="12" r="8" fill="#DD4814"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
    ),
    versions: ['18.04 LTS', '20.04 LTS', '22.04 LTS', '24.04 LTS'],
    color: 'text-orange-600'
  },
  {
    name: 'Debian',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2z"/>
        <path d="M8 6c-.552 0-1 .448-1 1v10c0 .552.448 1 1 1s1-.448 1-1V7c0-.552-.448-1-1-1zm4 2c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1s1-.448 1-1V9c0-.552-.448-1-1-1zm4 2c-.552 0-1 .448-1 1v2c0 .552.448 1 1 1s1-.448 1-1v-2c0-.552-.448-1-1-1z" fill="#A81D33"/>
      </svg>
    ),
    versions: ['10 Buster', '11 Bullseye', '12 Bookworm'],
    color: 'text-red-600'
  },
  {
    name: 'CentOS',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2z"/>
        <path d="M8 8c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1s1-.448 1-1V9c0-.552-.448-1-1-1zm4-2c-.552 0-1 .448-1 1v10c0 .552.448 1 1 1s1-.448 1-1V7c0-.552-.448-1-1-1zm4 2c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1s1-.448 1-1V9c0-.552-.448-1-1-1z" fill="#262577"/>
      </svg>
    ),
    versions: ['7.x', '8.x Stream'],
    color: 'text-slate-600'
  },
  {
    name: 'Rocky Linux',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2z"/>
        <path d="M7 7c-.552 0-1 .448-1 1v8c0 .552.448 1 1 1s1-.448 1-1V8c0-.552-.448-1-1-1zm5-2c-.552 0-1 .448-1 1v12c0 .552.448 1 1 1s1-.448 1-1V6c0-.552-.448-1-1-1zm5 2c-.552 0-1 .448-1 1v8c0 .552.448 1 1 1s1-.448 1-1V8c0-.552-.448-1-1-1z" fill="#10B981"/>
      </svg>
    ),
    versions: ['8.x', '9.x'],
    color: 'text-emerald-600'
  },
  {
    name: 'AlmaLinux',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2z"/>
        <path d="M6 9c-.552 0-1 .448-1 1v4c0 .552.448 1 1 1s1-.448 1-1v-4c0-.552-.448-1-1-1zm6-3c-.552 0-1 .448-1 1v10c0 .552.448 1 1 1s1-.448 1-1V7c0-.552-.448-1-1-1zm6 3c-.552 0-1 .448-1 1v4c0 .552.448 1 1 1s1-.448 1-1v-4c0-.552-.448-1-1-1z" fill="#00ADD8"/>
      </svg>
    ),
    versions: ['8.x', '9.x'],
    color: 'text-cyan-600'
  },
  {
    name: 'Fedora',
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2z"/>
        <path d="M8 8c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1s1-.448 1-1V9c0-.552-.448-1-1-1zm4-2c-.552 0-1 .448-1 1v10c0 .552.448 1 1 1s1-.448 1-1V7c0-.552-.448-1-1-1zm4 2c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1s1-.448 1-1V9c0-.552-.448-1-1-1z" fill="#294172"/>
      </svg>
    ),
    versions: ['36', '37', '38', '39', '40'],
    color: 'text-slate-700'
  }
];

export default function SupportedOS() {
  return (
    <div className="bg-slate-50 dark:bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Systèmes d'exploitation supportés
          </h2>
          <p className="mt-6 text-lg text-slate-600 dark:text-gray-400">
            Yaplyx fonctionne sur les distributions Linux les plus populaires. Installation simple et sécurisée sur votre infrastructure existante.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {supportedOS.map((os, index) => (
            <div
              key={index}
              className="bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-slate-300 dark:hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-2 rounded-lg bg-slate-100 dark:bg-black ${os.color}`}>
                  {os.logo}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {os.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-slate-600 dark:text-gray-400">
                      Versions supportées
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {os.versions.map((version, vIndex) => (
                  <div
                    key={vIndex}
                    className="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-black/50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                      {version}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              Support technique disponible pour tous ces systèmes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
