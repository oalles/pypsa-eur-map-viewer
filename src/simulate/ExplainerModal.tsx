import React from 'react';
import {useTranslation} from 'react-i18next';
import {X, Info, AlertTriangle, Lightbulb, Network, Zap, MousePointer, Globe} from 'lucide-react';

interface ExplainerModalProps {
    onClose: () => void;
}

export const ExplainerModal: React.FC<ExplainerModalProps> = ({onClose}) => {
    const {t} = useTranslation();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative glass max-w-md w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-glass-border">
                    <Info size={16} className="text-accent shrink-0" />
                    <h2 className="text-sm font-semibold text-text-primary flex-1">
                        {t('simulate.aboutTitle')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    >
                        <X size={14} />
                    </button>
                </div>

                <div className="px-4 py-4 space-y-4">
                    {/* What it is */}
                    <div className="flex gap-3">
                        <Network size={16} className="text-accent shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-xs font-semibold text-text-primary mb-1">
                                {t('simulate.whatIsTitle')}
                            </h3>
                            <p className="text-[11px] text-text-secondary leading-relaxed">
                                {t('simulate.whatIsDesc')}
                            </p>
                        </div>
                    </div>

                    {/* How to use — step by step */}
                    <div className="glass-subtle rounded-lg p-3 space-y-3">
                        <h3 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider">
                            {t('simulate.howToTitle')}
                        </h3>

                        <div className="flex gap-2.5">
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/15 text-accent text-[10px] font-bold shrink-0">1</div>
                            <div>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <Globe size={11} className="text-green-400" />
                                    <span className="text-[11px] font-medium text-text-primary">{t('simulate.howToStep1Title')}</span>
                                </div>
                                <p className="text-[10px] text-text-secondary leading-relaxed">
                                    {t('simulate.howToStep1Desc')}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2.5">
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/15 text-accent text-[10px] font-bold shrink-0">2</div>
                            <div>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <MousePointer size={11} className="text-red-400" />
                                    <span className="text-[11px] font-medium text-text-primary">{t('simulate.howToStep2Title')}</span>
                                </div>
                                <p className="text-[10px] text-text-secondary leading-relaxed">
                                    {t('simulate.howToStep2Desc')}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2.5">
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/15 text-accent text-[10px] font-bold shrink-0">3</div>
                            <div>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <Zap size={11} className="text-yellow-400" />
                                    <span className="text-[11px] font-medium text-text-primary">{t('simulate.howToStep3Title')}</span>
                                </div>
                                <p className="text-[10px] text-text-secondary leading-relaxed">
                                    {t('simulate.howToStep3Desc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What it is NOT */}
                    <div className="flex gap-3">
                        <AlertTriangle size={16} className="text-orange-400 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-xs font-semibold text-text-primary mb-1">
                                {t('simulate.whatIsNotTitle')}
                            </h3>
                            <p className="text-[11px] text-text-secondary leading-relaxed">
                                {t('simulate.whatIsNotDesc')}
                            </p>
                        </div>
                    </div>

                    {/* Simplifications */}
                    <div className="glass-subtle rounded-lg p-3">
                        <h3 className="text-[11px] font-semibold text-text-primary mb-2 uppercase tracking-wider">
                            {t('simulate.simplificationsTitle')}
                        </h3>
                        <ul className="space-y-1 text-[11px] text-text-secondary">
                            <li className="flex gap-2">
                                <span className="text-text-muted">-</span>
                                {t('simulate.simplification1')}
                            </li>
                            <li className="flex gap-2">
                                <span className="text-text-muted">-</span>
                                {t('simulate.simplification2')}
                            </li>
                            <li className="flex gap-2">
                                <span className="text-text-muted">-</span>
                                {t('simulate.simplification3')}
                            </li>
                        </ul>
                    </div>

                    {/* Why useful */}
                    <div className="flex gap-3">
                        <Lightbulb size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-xs font-semibold text-text-primary mb-1">
                                {t('simulate.whyUsefulTitle')}
                            </h3>
                            <p className="text-[11px] text-text-secondary leading-relaxed">
                                {t('simulate.whyUsefulDesc')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-3 border-t border-glass-border">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 rounded-lg bg-accent/15 text-accent text-xs font-medium hover:bg-accent/25 transition-colors cursor-pointer"
                    >
                        {t('simulate.gotIt')}
                    </button>
                </div>
            </div>
        </div>
    );
};
