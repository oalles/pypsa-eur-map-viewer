import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {Dataset} from '../types';

interface State {
    ready: boolean;
    dataset: Dataset;
    voltage: [number, number];
    showHVDC: boolean;
    selected?: GeoJSON.Feature;

    setDataset: (d: Dataset) => void;
    setVoltage: (v: [number, number]) => void;
    setShowHVDC: (v: boolean) => void;
    setSelected: (f?: GeoJSON.Feature) => void;
}

const useNetworkStore = create<State>()(
    devtools(
        (set) => ({
            ready: false,
            dataset: {},
            voltage: [50, 750],
            showHVDC: true,
            setDataset: (d) => set({dataset: d, ready: true}),
            setVoltage: (v) => set({voltage: v}),
            setShowHVDC: (v) => set({showHVDC: v}),
            setSelected: (f) => set({selected: f}),
        }),
        {name: 'Network Store'}
    )
);

export default useNetworkStore;
