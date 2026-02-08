import React, {useEffect, useCallback, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {RotateCcw, HelpCircle, Loader, Zap, AlertTriangle} from 'lucide-react';
import useNetworkStore from '@/store/network';
import useSimulationStore from '@/store/simulation';
import {useSimulationWorker} from '@/workers/useSimulationWorker';
import type {GraphIndex} from '@/lib/graph';
import {SourceSelector} from './SourceSelector';
import {FaultList} from './FaultList';
import {MetricsDisplay} from './MetricsDisplay';
import {ExplainerModal} from './ExplainerModal';

/** Resolve source bus IDs from the current source configuration */
function getSourceBusIds(
    graphIndex: GraphIndex,
    sourceMode: 'country' | 'manual',
    sourceCountries: string[],
    manualSources: string[],
): string[] {
    if (sourceMode === 'manual') return manualSources;
    if (sourceCountries.length === 0) return [];
    const countriesSet = new Set(sourceCountries);
    const result: string[] = [];
    for (const [busId, meta] of graphIndex.busMeta) {
        if (countriesSet.has(meta.country)) result.push(busId);
    }
    return result;
}

export const SimulatePanel: React.FC = () => {
    const {t} = useTranslation();
    const graphIndex = useNetworkStore(s => s.graphIndex);

    const faults = useSimulationStore(s => s.faults);
    const sourceMode = useSimulationStore(s => s.sourceMode);
    const sourceCountries = useSimulationStore(s => s.sourceCountries);
    const manualSources = useSimulationStore(s => s.manualSources);
    const clickMode = useSimulationStore(s => s.clickMode);
    const setClickMode = useSimulationStore(s => s.setClickMode);
    const isRunning = useSimulationStore(s => s.isRunning);
    const setResults = useSimulationStore(s => s.setResults);
    const setRunning = useSimulationStore(s => s.setRunning);
    const reset = useSimulationStore(s => s.reset);

    const {isReady, init, simulate} = useSimulationWorker();
    const initedRef = useRef(false);

    const [showExplainer, setShowExplainer] = useState(() => {
        return !localStorage.getItem('simulate-explainer-seen');
    });

    // Initialize worker with graph
    useEffect(() => {
        if (graphIndex && !initedRef.current) {
            init(graphIndex);
            initedRef.current = true;
        }
    }, [graphIndex, init]);

    // Auto-run simulation when faults or sources change
    const runSimulation = useCallback(async () => {
        if (!graphIndex || !isReady) return;

        const sources = getSourceBusIds(graphIndex, sourceMode, sourceCountries, manualSources);
        if (sources.length === 0 && faults.length === 0) {
            setResults(null);
            return;
        }
        if (faults.length === 0) {
            setResults(null);
            return;
        }

        setRunning(true);
        const results = await simulate({
            faults: faults.map(f => ({id: f.id, faultType: f.faultType})),
            sources,
        });
        setResults(results);
    }, [graphIndex, isReady, simulate, sourceMode, sourceCountries, manualSources, faults, setResults, setRunning]);

    useEffect(() => {
        runSimulation();
    }, [runSimulation]);

    const handleReset = useCallback(() => {
        reset();
    }, [reset]);

    const handleDismissExplainer = useCallback(() => {
        localStorage.setItem('simulate-explainer-seen', '1');
        setShowExplainer(false);
    }, []);

    return (
        <>
            <div className="absolute top-18 right-3 z-20 w-72 glass max-h-[calc(100vh-8rem)] flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-glass-border">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <h2 className="text-xs font-semibold text-text-primary flex-1">
                        {t('simulate.title')}
                    </h2>
                    <button
                        onClick={() => setShowExplainer(true)}
                        className="p-1 rounded-md hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                        title={t('simulate.aboutTitle')}
                    >
                        <HelpCircle size={14} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
                    <SourceSelector />

                    <div className="border-t border-glass-border" />

                    {/* Click mode toggle — only in manual source mode */}
                    {sourceMode === 'manual' && (
                        <div>
                            <p className="text-[10px] text-text-muted mb-1.5">{t('simulate.clickAdding')}</p>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setClickMode('sources')}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                                        clickMode === 'sources'
                                            ? 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30'
                                            : 'text-text-muted hover:text-text-secondary glass-subtle'
                                    }`}
                                >
                                    <Zap size={11} />
                                    {t('simulate.clickSources')}
                                </button>
                                <button
                                    onClick={() => setClickMode('faults')}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                                        clickMode === 'faults'
                                            ? 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30'
                                            : 'text-text-muted hover:text-text-secondary glass-subtle'
                                    }`}
                                >
                                    <AlertTriangle size={11} />
                                    {t('simulate.clickFaults')}
                                </button>
                            </div>
                        </div>
                    )}

                    <FaultList />

                    {isRunning && (
                        <div className="flex items-center gap-2 text-[11px] text-accent">
                            <Loader size={12} className="animate-spin" />
                            {t('simulate.running')}
                        </div>
                    )}

                    <MetricsDisplay />
                </div>

                {/* Footer */}
                <div className="px-3 py-2.5 border-t border-glass-border">
                    <button
                        onClick={handleReset}
                        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md glass-subtle text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    >
                        <RotateCcw size={12} />
                        {t('common.reset')}
                    </button>
                </div>
            </div>

            {showExplainer && <ExplainerModal onClose={handleDismissExplainer} />}
        </>
    );
};
