// app/invoice/page.tsx
export default function Invoice() {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-8 py-16">
  
          {/* Header */}
          <div className="flex justify-between items-start mb-20">
            <div>
              <h1 className="text-5xl font-light tracking-tight text-gray-900">Facture</h1>
              <p className="text-2xl text-gray-500 mt-2">#INV-2025-089</p>
            </div>
            <div className="text-right">
              <div className="w-32 h-32 bg-black rounded-3xl" />
              {/* ← תשים כאן את הלוגו שלך */}
            </div>
          </div>
  
          {/* Dates */}
          <div className="grid grid-cols-3 gap-8 mb-20 text-sm">
            <div>
              <p className="text-gray-500">Date de facturation</p>
              <p className="text-xl font-medium mt-1">12 décembre 2025</p>
            </div>
            <div>
              <p className="text-gray-500">Date d'échéance</p>
              <p className="text-xl font-medium mt-1">11 janvier 2026</p>
            </div>
            <div>
              <p className="text-gray-500">Montant dû</p>
              <p className="text-3xl font-bold mt-1">17 400,00 €</p>
            </div>
          </div>
  
          {/* Bill to / From */}
          <div className="grid grid-cols-2 gap-20 mb-20">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Facturé à</p>
              <p className="font-medium text-lg">LVMH Digital</p>
              <p className="text-gray-600 mt-2 leading-relaxed">
                22 avenue Montaigne<br />
                75008 Paris<br />
                France<br />
                SIRET 552 144 503 00028
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Émise par</p>
              <p className="font-medium text-lg">Atelier Studio</p>
              <p className="text-gray-600 mt-2 leading-relaxed">
                41 rue du Faubourg Saint-Honoré<br />
                75008 Paris<br />
                France<br />
                SIRET 912 345 678 00034
              </p>
            </div>
          </div>
  
          {/* Line items */}
          <div className="border-t border-gray-200 pt-8">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-gray-500 border-b border-gray-200">
                  <th className="pb-6 font-normal">Description</th>
                  <th className="pb-6 text-right font-normal">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="text-gray-900">
                  <td className="py-8 text-lg">Direction artistique & branding 2026</td>
                  <td className="py-8 text-right text-lg font-medium">9 500,00 €</td>
                </tr>
                <tr className="text-gray-900">
                  <td className="py-8 text-lg">Développement plateforme e-commerce sur-mesure</td>
                  <td className="py-8 text-right text-lg font-medium">6 000,00 €</td>
                </tr>
                <tr className="text-gray-900">
                  <td className="py-8 text-lg">Support & maintenance annuelle</td>
                  <td className="py-8 text-right text-lg font-medium">1 900,00 €</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          {/* Total */}
          <div className="mt-12 flex justify-end">
            <div className="w-96">
              <div className="flex justify-between py-4 text-lg border-b border-gray-200">
                <span>Sous-total HT</span>
                <span className="font-medium">17 400,00 €</span>
              </div>
              <div className="flex justify-between py-4 text-lg border-b border-gray-200">
                <span>TVA 20 %</span>
                <span className="font-medium">0,00 €</span> {/* Auto-entrepreneur ou export */}
              </div>
              <div className="flex justify-between py-6 text-2xl font-light">
                <span>Total</span>
                <span className="font-medium">17 400,00 €</span>
              </div>
            </div>
          </div>
  
          {/* Footer note */}
          <div className="mt-24 pt-12 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              TVA non applicable, art. 293 B du CGI • Règlement par virement sous 30 jours
            </p>
            <p className="text-sm text-gray-400 mt-4">
              IBAN FR76 1820 6000 0000 1234 5678 990 • BIC AGRIFRPP882
            </p>
          </div>
  
        </div>
      </div>
    );
  }