import {useSyncExternalStore, useCallback} from 'react';

export type AppMode = 'explore' | 'simulate' | 'scenarios' | 'analytics' | 'game';

const VALID_MODES: AppMode[] = ['explore', 'simulate', 'scenarios', 'analytics', 'game'];

function parseHash(): AppMode {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (VALID_MODES.includes(hash as AppMode)) return hash as AppMode;
    return 'explore';
}

let listeners: Set<() => void> = new Set();

function subscribe(cb: () => void) {
    listeners.add(cb);
    window.addEventListener('hashchange', cb);
    return () => {
        listeners.delete(cb);
        window.removeEventListener('hashchange', cb);
    };
}

function getSnapshot(): AppMode {
    return parseHash();
}

export function useMode() {
    const mode = useSyncExternalStore(subscribe, getSnapshot, () => 'explore' as AppMode);

    const setMode = useCallback((next: AppMode) => {
        window.history.pushState(null, '', `#/${next}`);
        // Notify all listeners since pushState doesn't trigger hashchange
        listeners.forEach(cb => cb());
    }, []);

    return {mode, setMode};
}
