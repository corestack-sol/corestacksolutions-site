import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Language } from '../types'

const PolicyQRResidence = () => {
  const [language, setLanguage] = useState<Language>('ES')

  const t = {
    title: language === 'EN' ? 'Privacy Policy' : 'Política de Privacidad',
    lastUpdate: language === 'EN' ? 'Last updated:' : 'Última actualización:',
    intro:
      language === 'EN'
        ? 'At QR Residential Access Control we respect and protect the privacy of our users. This Privacy Policy describes how we collect, use and protect personal information within the app.'
        : 'En QR Residential Access Control respetamos y protegemos la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos la información personal dentro de la aplicación.',
    s1Title: language === 'EN' ? '1. Information We Collect' : '1. Información que recopilamos',
    s2Title: language === 'EN' ? '2. Use of Information' : '2. Uso de la información',
    s3Title: language === 'EN' ? '3. Information Sharing' : '3. Compartición de la información',
    s4Title: language === 'EN' ? '4. Data Security' : '4. Seguridad de los datos',
    s5Title: language === 'EN' ? '5. Data Retention' : '5. Retención de datos',
    s6Title: language === 'EN' ? '6. User Rights' : '6. Derechos del usuario',
    s7Title: language === 'EN' ? '7. Changes to this Policy' : '7. Cambios a esta política',
    s8Title: language === 'EN' ? '8. Contact' : '8. Contacto',
    back: language === 'EN' ? '← Back to Home' : '← Volver al Inicio',
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <Link
            to="/"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            {t.back}
          </Link>
          <button
            onClick={() => setLanguage(l => (l === 'EN' ? 'ES' : 'EN'))}
            className="text-xs font-bold text-blue-600 border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition-all"
          >
            {language === 'EN' ? 'ES' : 'EN'}
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-400 text-sm mb-6">
          <strong>{t.lastUpdate}</strong> 13/09/2025
        </p>
        <p className="text-gray-600 leading-relaxed mb-8">{t.intro}</p>

        <div className="flex flex-col gap-6 text-gray-600 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.s1Title}</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Datos de registro: nombre, correo electrónico, teléfono.</li>
              <li>Datos de acceso: identificadores de residencia, invitaciones QR, registros de accesos.</li>
              <li>Datos técnicos: IP, dispositivo, sistema operativo, versión de la app.</li>
              <li>Datos opcionales: información adicional proporcionada por el usuario.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.s2Title}</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Permitir el control de acceso por códigos QR.</li>
              <li>Enviar notificaciones de accesos o alertas de seguridad.</li>
              <li>Mejorar el funcionamiento y seguridad de la aplicación.</li>
              <li>Cumplir con obligaciones legales.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.s3Title}</h2>
            <p className="text-sm">
              No compartimos información personal con terceros salvo: autorización del usuario,
              requerimiento legal o proveedores de servicios tecnológicos (ej. hosting,
              notificaciones push).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.s4Title}</h2>
            <p className="text-sm">
              Implementamos medidas de seguridad administrativas, técnicas y físicas para
              proteger los datos. Sin embargo, ningún sistema es completamente seguro.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.s5Title}</h2>
            <p className="text-sm">
              Conservamos la información mientras la cuenta esté activa o según lo exija la
              ley. El usuario puede solicitar su eliminación en cualquier momento.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.s6Title}</h2>
            <p className="text-sm">
              El usuario tiene derecho a acceder, corregir, eliminar su información y retirar
              su consentimiento. Para ejercer estos derechos, puede contactarnos en:
            </p>
            <p className="text-sm mt-2">
              📧{' '}
              <a
                href="mailto:corestack.sol@gmail.com"
                className="text-blue-600 hover:underline font-medium"
              >
                corestack.sol@gmail.com
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.s7Title}</h2>
            <p className="text-sm">
              Nos reservamos el derecho de modificar esta política en cualquier momento. Los
              cambios serán notificados en la aplicación o por otros medios adecuados.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.s8Title}</h2>
            <p className="text-sm">
              Si tienes dudas sobre esta Política de Privacidad, contáctanos en:{' '}
              <a
                href="mailto:corestack.sol@gmail.com"
                className="text-blue-600 hover:underline font-medium"
              >
                corestack.sol@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PolicyQRResidence
