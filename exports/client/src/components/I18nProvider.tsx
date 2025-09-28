import { useState, useEffect, ReactNode } from 'react';
import { I18nContext, type I18nContextType } from '@/hooks/useI18n';

// Language catalogs
const translations: Record<string, Record<string, string>> = {
  en: {
    'review.queue.title': 'Review Queue',
    'review.queue.description': 'Manage approval workflows and content reviews',
    'review.detail.approve': 'Approve',
    'review.detail.reject': 'Reject',
    'review.detail.comment': 'Add Comment',
    'review.status.pending': 'Pending',
    'review.status.in_progress': 'In Progress',
    'review.status.approved': 'Approved',
    'review.status.rejected': 'Rejected',
    'review.priority.low': 'Low',
    'review.priority.medium': 'Medium',
    'review.priority.high': 'High',
    'review.priority.urgent': 'Urgent',
    'nav.reviews': 'Reviews',
    'nav.retention': 'Retention',
    'nav.scim': 'User Provisioning',
    'retention.policies': 'Retention Policies',
    'retention.legal_holds': 'Legal Holds',
    'scim.users': 'SCIM Users',
    'scim.groups': 'SCIM Groups',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.view': 'View',
    'settings.language': 'Language',
    'settings.locale': 'Locale',
  },
  es: {
    'review.queue.title': 'Cola de Revisión',
    'review.queue.description': 'Gestionar flujos de trabajo de aprobación y revisiones de contenido',
    'review.detail.approve': 'Aprobar',
    'review.detail.reject': 'Rechazar',
    'review.detail.comment': 'Agregar Comentario',
    'review.status.pending': 'Pendiente',
    'review.status.in_progress': 'En Progreso',
    'review.status.approved': 'Aprobado',
    'review.status.rejected': 'Rechazado',
    'review.priority.low': 'Bajo',
    'review.priority.medium': 'Medio',
    'review.priority.high': 'Alto',
    'review.priority.urgent': 'Urgente',
    'nav.reviews': 'Revisiones',
    'nav.retention': 'Retención',
    'nav.scim': 'Aprovisionamiento de Usuarios',
    'retention.policies': 'Políticas de Retención',
    'retention.legal_holds': 'Retenciones Legales',
    'scim.users': 'Usuarios SCIM',
    'scim.groups': 'Grupos SCIM',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.create': 'Crear',
    'common.view': 'Ver',
    'settings.language': 'Idioma',
    'settings.locale': 'Configuración regional',
  },
  fr: {
    'review.queue.title': 'File d\'Examen',
    'review.queue.description': 'Gérer les flux d\'approbation et les examens de contenu',
    'review.detail.approve': 'Approuver',
    'review.detail.reject': 'Rejeter',
    'review.detail.comment': 'Ajouter un Commentaire',
    'review.status.pending': 'En Attente',
    'review.status.in_progress': 'En Cours',
    'review.status.approved': 'Approuvé',
    'review.status.rejected': 'Rejeté',
    'review.priority.low': 'Faible',
    'review.priority.medium': 'Moyen',
    'review.priority.high': 'Élevé',
    'review.priority.urgent': 'Urgent',
    'nav.reviews': 'Examens',
    'nav.retention': 'Rétention',
    'nav.scim': 'Provisionnement d\'Utilisateurs',
    'retention.policies': 'Politiques de Rétention',
    'retention.legal_holds': 'Retenues Légales',
    'scim.users': 'Utilisateurs SCIM',
    'scim.groups': 'Groupes SCIM',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.create': 'Créer',
    'common.view': 'Voir',
    'settings.language': 'Langue',
    'settings.locale': 'Paramètres régionaux',
  }
};

const STORAGE_KEY = 'i18n_locale';
const DEFAULT_LOCALE = 'en';

interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: string;
}

export function I18nProvider({ children, defaultLocale = DEFAULT_LOCALE }: I18nProviderProps) {
  // Initialize locale from localStorage or default
  const [locale, setLocaleState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored in translations) {
        return stored;
      }
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang in translations) {
        return browserLang;
      }
    }
    return defaultLocale;
  });

  // Available locales from translations
  const availableLocales = Object.keys(translations);

  // Translation function with parameter substitution
  const t = (key: string, params?: Record<string, any>): string => {
    const catalog = translations[locale] || translations[DEFAULT_LOCALE];
    let translation = catalog[key] || key;

    // Handle parameter substitution
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), String(value));
      });
    }

    return translation;
  };

  // Set locale with persistence
  const setLocale = (newLocale: string) => {
    if (availableLocales.includes(newLocale)) {
      setLocaleState(newLocale);
      localStorage.setItem(STORAGE_KEY, newLocale);
    } else {
      console.warn(`Locale ${newLocale} not available. Available locales: ${availableLocales.join(', ')}`);
    }
  };

  // Update document language attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const contextValue: I18nContextType = {
    locale,
    t,
    setLocale,
    availableLocales,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}