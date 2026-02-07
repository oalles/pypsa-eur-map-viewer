import React from 'react';
import {useTranslation} from 'react-i18next';
import {X} from 'lucide-react';
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell} from 'recharts';
import chroma from 'chroma-js';
import useNetworkStore from '@/store/network';
import {useFilteredData} from '@/hooks/useFilteredData';
import {useNetworkStats} from '@/hooks/useNetworkStats';
import {StatCard} from './StatCard';
import {formatNumber} from '@/lib/utils';
import {COUNTRY_FLAGS} from '@/lib/constants';

export const StatsOverlay: React.FC = () => {
    const {t} = useTranslation();
    const statsOpen = useNetworkStore(s => s.statsOpen);
    const setStatsOpen = useNetworkStore(s => s.setStatsOpen);
    const colorScheme = useNetworkStore(s => s.colorScheme);

    const filtered = useFilteredData();
    const dataset = useNetworkStore(s => s.dataset);
    const stats = useNetworkStats(filtered);
    const totalStats = useNetworkStats(dataset);

    if (!statsOpen) return null;

    const scale = chroma.scale(colorScheme as any).domain([50, 750]);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setStatsOpen(false)}>
            <div className="glass w-[680px] max-w-[90vw] max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border">
                    <h2 className="text-sm font-semibold">{t('stats.title')}</h2>
                    <button
                        onClick={() => setStatsOpen(false)}
                        className="p-1 rounded-md hover:bg-white/5 text-text-muted cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        <StatCard label={t('stats.buses')} value={formatNumber(stats.busCount)} color="#38bdf8" />
                        <StatCard label={t('stats.lines')} value={formatNumber(stats.lineCount)} />
                        <StatCard label={t('stats.links')} value={formatNumber(stats.linkCount)} color="#00e5ff" />
                        <StatCard label={t('stats.transformers')} value={formatNumber(stats.transformerCount)} color="#ff8c00" />
                        <StatCard label={t('stats.converters')} value={formatNumber(stats.converterCount)} color="#c084fc" />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <StatCard label={t('stats.totalLength')} value={`${formatNumber(stats.totalLineLengthKm)} km`} />
                        <StatCard label={t('stats.totalACCapacity')} value={`${formatNumber(stats.totalACCapacityMVA)} MVA`} />
                        <StatCard label={t('stats.totalHVDCCapacity')} value={`${formatNumber(stats.totalHVDCCapacityMW)} MW`} />
                    </div>

                    {stats.busCount < totalStats.busCount && (
                        <p className="text-[11px] text-text-muted text-center">
                            {t('stats.showing', {shown: formatNumber(stats.busCount), total: formatNumber(totalStats.busCount)})}
                        </p>
                    )}

                    <div>
                        <h3 className="text-xs font-medium text-text-secondary mb-2">{t('stats.voltageDistribution')}</h3>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.voltageDistribution}>
                                    <XAxis dataKey="voltage" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                    <YAxis tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} width={40} />
                                    <Tooltip
                                        contentStyle={{background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12}}
                                        labelStyle={{color: '#e2e8f0'}}
                                        itemStyle={{color: '#94a3b8'}}
                                        labelFormatter={v => `${v} kV`}
                                    />
                                    <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                                        {stats.voltageDistribution.map(entry => (
                                            <Cell key={entry.voltage} fill={scale(entry.voltage).hex()} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-medium text-text-secondary mb-2">{t('stats.busesByCountry')}</h3>
                        <div style={{height: Math.max(200, stats.busesByCountry.length * 22)}}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.busesByCountry.slice(0, 20)} layout="vertical">
                                    <XAxis type="number" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                    <YAxis
                                        type="category"
                                        dataKey="country"
                                        tick={{fontSize: 10, fill: '#94a3b8'}}
                                        tickLine={false}
                                        axisLine={false}
                                        width={40}
                                        tickFormatter={c => `${COUNTRY_FLAGS[c] || ''} ${c}`}
                                    />
                                    <Tooltip
                                        contentStyle={{background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12}}
                                        labelStyle={{color: '#e2e8f0'}}
                                    />
                                    <Bar dataKey="count" fill="#38bdf8" radius={[0, 3, 3, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
