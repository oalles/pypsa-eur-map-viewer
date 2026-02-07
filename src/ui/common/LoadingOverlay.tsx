import React from 'react';
import {useTranslation} from 'react-i18next';

export const LoadingOverlay: React.FC = () => {
    const {t} = useTranslation();
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface">
            <div className="flex flex-col items-center gap-4">
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-2 border-glass-border" />
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent" />
                </div>
                <p className="text-sm text-text-secondary font-medium">{t('app.loading')}</p>
            </div>
        </div>
    );
};
