import React from 'react';
import {useTranslation} from 'react-i18next';
import {Search, BarChart3, Globe} from 'lucide-react';
import useNetworkStore from '@/store/network';
import {useFilteredData} from '@/hooks/useFilteredData';
import {useNetworkStats} from '@/hooks/useNetworkStats';
import {formatNumber} from '@/lib/utils';
import {ModeSelector} from './ModeSelector';

const LANGUAGES = [
    {code: 'en', label: 'EN'},
    {code: 'es', label: 'ES'},
    {code: 'fr', label: 'FR'},
    {code: 'de', label: 'DE'},
];

export const Header: React.FC = () => {
    const {t, i18n} = useTranslation();
    const setSearchOpen = useNetworkStore(s => s.setSearchOpen);
    const setStatsOpen = useNetworkStore(s => s.setStatsOpen);
    const filtered = useFilteredData();
    const stats = useNetworkStats(filtered);

    return (
        <header className="glass absolute top-3 left-3 right-3 z-30 flex items-center h-12 px-4 gap-4">
            <div className="flex items-center gap-2 shrink-0">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <h1 className="text-sm font-semibold text-text-primary tracking-tight">
                    {t('app.title')}
                </h1>
            </div>

            <div className="hidden xl:flex items-center gap-3 ml-4 text-[11px] font-mono text-text-muted">
                <span>{formatNumber(stats.busCount)} {t('stats.buses')}</span>
                <span className="text-glass-border">|</span>
                <span>{formatNumber(stats.lineCount)} {t('stats.lines')}</span>
                <span className="text-glass-border">|</span>
                <span className="text-hvdc">{formatNumber(stats.linkCount)} HVDC</span>
                <span className="text-glass-border">|</span>
                <span className="text-transformer">{formatNumber(stats.transformerCount)} Xfmrs</span>
                <span className="text-glass-border">|</span>
                <span>{stats.countries.length} {t('stats.countries')}</span>
            </div>

            <div className="flex-1" />

            <ModeSelector />

            <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-subtle text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
                <Search size={14} />
                <span className="hidden sm:inline">{t('app.search')}</span>
                <kbd className="hidden md:inline ml-1 px-1.5 py-0.5 text-[10px] rounded bg-white/5 text-text-muted">
                    ⌘K
                </kbd>
            </button>

            <button
                onClick={() => setStatsOpen(true)}
                className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                title={t('common.stats')}
            >
                <BarChart3 size={16} />
            </button>

            <div className="flex items-center gap-1">
                <Globe size={14} className="text-text-muted" />
                {LANGUAGES.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className={`px-1.5 py-0.5 text-[10px] rounded transition-colors cursor-pointer ${
                            i18n.language?.startsWith(lang.code)
                                ? 'bg-accent/20 text-accent font-medium'
                                : 'text-text-muted hover:text-text-secondary'
                        }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </header>
    );
};
