import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {Dataset, ConstructionFilter, LineThicknessMode} from '../types';
import type {GraphIndex} from '@/lib/graph';

interface State {
    ready: boolean;
    dataset: Dataset;
    graphIndex: GraphIndex | null;

    // Visibility toggles
    showBuses: boolean;
    showACLines: boolean;
    showHVDC: boolean;
    showTransformers: boolean;
    showConverters: boolean;
    showCountryBorders: boolean;
    showHeatmap: boolean;

    // Filters
    voltage: [number, number];
    selectedCountries: string[];
    underConstructionFilter: ConstructionFilter;

    // Display settings
    lineThicknessMode: LineThicknessMode;
    layerOpacity: number;

    // UI state
    sidebarOpen: boolean;
    detailPanelOpen: boolean;
    statsOpen: boolean;
    searchOpen: boolean;
    selected: GeoJSON.Feature | null;
    selectedLayerType: string | null;

    // View state (for fly-to)
    viewState: {
        longitude: number;
        latitude: number;
        zoom: number;
        pitch: number;
        bearing: number;
    };
    viewStateVersion: number;

    // Actions
    setDataset: (d: Dataset) => void;
    setGraphIndex: (g: GraphIndex) => void;
    setVoltage: (v: [number, number]) => void;
    setShowBuses: (v: boolean) => void;
    setShowACLines: (v: boolean) => void;
    setShowHVDC: (v: boolean) => void;
    setShowTransformers: (v: boolean) => void;
    setShowConverters: (v: boolean) => void;
    setShowCountryBorders: (v: boolean) => void;
    setShowHeatmap: (v: boolean) => void;
    setSelectedCountries: (v: string[]) => void;
    setUnderConstructionFilter: (v: ConstructionFilter) => void;
    setLineThicknessMode: (v: LineThicknessMode) => void;
    setLayerOpacity: (v: number) => void;
    setSidebarOpen: (v: boolean) => void;
    setDetailPanelOpen: (v: boolean) => void;
    setStatsOpen: (v: boolean) => void;
    setSearchOpen: (v: boolean) => void;
    setSelected: (f: GeoJSON.Feature | null, layerType?: string | null) => void;
    flyTo: (longitude: number, latitude: number, zoom?: number) => void;
}

const useNetworkStore = create<State>()(
    devtools(
        (set) => ({
            ready: false,
            dataset: {},
            graphIndex: null,

            showBuses: true,
            showACLines: true,
            showHVDC: true,
            showTransformers: true,
            showConverters: true,
            showCountryBorders: false,
            showHeatmap: false,

            voltage: [50, 750],
            selectedCountries: [],
            underConstructionFilter: 'all',

            lineThicknessMode: 'capacity',
            layerOpacity: 0.85,

            sidebarOpen: true,
            detailPanelOpen: false,
            statsOpen: false,
            searchOpen: false,
            selected: null,
            selectedLayerType: null,

            viewState: {
                longitude: 10,
                latitude: 50,
                zoom: 4.5,
                pitch: 0,
                bearing: 0,
            },
            viewStateVersion: 0,

            setDataset: (d) => set({dataset: d, ready: true}),
            setGraphIndex: (g) => set({graphIndex: g}),
            setVoltage: (v) => set({voltage: v}),
            setShowBuses: (v) => set({showBuses: v}),
            setShowACLines: (v) => set({showACLines: v}),
            setShowHVDC: (v) => set({showHVDC: v}),
            setShowTransformers: (v) => set({showTransformers: v}),
            setShowConverters: (v) => set({showConverters: v}),
            setShowCountryBorders: (v) => set({showCountryBorders: v}),
            setShowHeatmap: (v) => set({showHeatmap: v}),
            setSelectedCountries: (v) => set({selectedCountries: v}),
            setUnderConstructionFilter: (v) => set({underConstructionFilter: v}),
            setLineThicknessMode: (v) => set({lineThicknessMode: v}),
            setLayerOpacity: (v) => set({layerOpacity: v}),
            setSidebarOpen: (v) => set({sidebarOpen: v}),
            setDetailPanelOpen: (v) => set({detailPanelOpen: v}),
            setStatsOpen: (v) => set({statsOpen: v}),
            setSearchOpen: (v) => set({searchOpen: v}),
            setSelected: (f, layerType) => set({
                selected: f,
                selectedLayerType: layerType ?? null,
                detailPanelOpen: f !== null,
            }),
            flyTo: (longitude, latitude, zoom) =>
                set((s) => ({
                    viewState: {...s.viewState, longitude, latitude, zoom: zoom ?? s.viewState.zoom},
                    viewStateVersion: s.viewStateVersion + 1,
                })),
        }),
        {name: 'Network Store'}
    )
);

export default useNetworkStore;
