import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import type {SimulationResults} from '@/workers/api';

export interface FaultEntry {
    id: string;
    faultType: 'bus' | 'edge';
    label: string;
}

interface SimulationState {
    // Source definition
    sourceMode: 'country' | 'manual';
    sourceCountries: string[];
    manualSources: string[];

    // Click interaction
    clickMode: 'sources' | 'faults';

    // Faults
    faults: FaultEntry[];

    // Results
    results: SimulationResults | null;
    isRunning: boolean;
    progress: number;

    // Actions — sources
    setSourceMode: (mode: 'country' | 'manual') => void;
    setClickMode: (mode: 'sources' | 'faults') => void;
    toggleSourceCountry: (country: string) => void;
    setSourceCountries: (countries: string[]) => void;
    addManualSource: (busId: string) => void;
    removeManualSource: (busId: string) => void;
    clearSources: () => void;

    // Actions — faults
    addFault: (id: string, faultType: 'bus' | 'edge', label: string) => void;
    removeFault: (id: string) => void;
    toggleFault: (id: string, faultType: 'bus' | 'edge', label: string) => void;
    clearFaults: () => void;

    // Actions — results
    setResults: (r: SimulationResults | null) => void;
    setRunning: (v: boolean) => void;
    setProgress: (v: number) => void;
    reset: () => void;
}

const useSimulationStore = create<SimulationState>()(
    devtools(
        (set) => ({
            sourceMode: 'country',
            sourceCountries: [],
            manualSources: [],
            clickMode: 'faults' as const,
            faults: [],
            results: null,
            isRunning: false,
            progress: 0,

            setSourceMode: (mode) => set({
                sourceMode: mode,
                // Force faults click mode when switching to country (no manual bus picking)
                clickMode: mode === 'country' ? 'faults' : 'sources',
            }),
            setClickMode: (mode) => set({clickMode: mode}),
            toggleSourceCountry: (country) =>
                set((s) => ({
                    sourceCountries: s.sourceCountries.includes(country)
                        ? s.sourceCountries.filter(c => c !== country)
                        : [...s.sourceCountries, country],
                })),
            setSourceCountries: (countries) => set({sourceCountries: countries}),
            addManualSource: (busId) =>
                set((s) => ({
                    manualSources: s.manualSources.includes(busId)
                        ? s.manualSources
                        : [...s.manualSources, busId],
                })),
            removeManualSource: (busId) =>
                set((s) => ({manualSources: s.manualSources.filter(id => id !== busId)})),
            clearSources: () => set({sourceCountries: [], manualSources: []}),

            addFault: (id, faultType, label) =>
                set((s) => ({
                    faults: s.faults.some(f => f.id === id)
                        ? s.faults
                        : [...s.faults, {id, faultType, label}],
                })),
            removeFault: (id) =>
                set((s) => ({faults: s.faults.filter(f => f.id !== id)})),
            toggleFault: (id, faultType, label) =>
                set((s) => ({
                    faults: s.faults.some(f => f.id === id)
                        ? s.faults.filter(f => f.id !== id)
                        : [...s.faults, {id, faultType, label}],
                })),
            clearFaults: () => set({faults: [], results: null}),

            setResults: (r) => set({results: r, isRunning: false}),
            setRunning: (v) => set({isRunning: v}),
            setProgress: (v) => set({progress: v}),
            reset: () => set({
                faults: [],
                results: null,
                isRunning: false,
                progress: 0,
            }),
        }),
        {name: 'Simulation Store'},
    ),
);

export default useSimulationStore;
