import {useEffect} from 'react';
import useNetworkStore from '@/store/network';

export function useKeyboardShortcuts() {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const state = useNetworkStore.getState();

            // Cmd/Ctrl + K → search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                state.setSearchOpen(!state.searchOpen);
                return;
            }

            // Escape → close panels
            if (e.key === 'Escape') {
                if (state.searchOpen) {state.setSearchOpen(false); return;}
                if (state.statsOpen) {state.setStatsOpen(false); return;}
                if (state.detailPanelOpen) {state.setSelected(null); return;}
            }

            // Don't handle shortcuts if input is focused
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;

            // [ / ] → toggle sidebar
            if (e.key === '[') {state.setSidebarOpen(false); return;}
            if (e.key === ']') {state.setSidebarOpen(true); return;}

            // Number keys for layer toggles
            if (e.key === '1') state.setShowACLines(!state.showACLines);
            if (e.key === '2') state.setShowHVDC(!state.showHVDC);
            if (e.key === '3') state.setShowBuses(!state.showBuses);
            if (e.key === '4') state.setShowTransformers(!state.showTransformers);
            if (e.key === '5') state.setShowConverters(!state.showConverters);
            if (e.key === '6') state.setShowCountryBorders(!state.showCountryBorders);
            if (e.key === '7') state.setShowHeatmap(!state.showHeatmap);
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);
}
