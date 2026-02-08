import {useRef, useCallback, useState, useEffect} from 'react';
import type {WorkerMessage, WorkerResponse, SimulationParams, SimulationResults} from './api';
import type {GraphIndex} from '@/lib/graph';
import {serializeGraphIndex} from '@/lib/graph';
import useSimulationStore from '@/store/simulation';

export function useSimulationWorker() {
    const workerRef = useRef<Worker | null>(null);
    const resolveRef = useRef<((result: SimulationResults) => void) | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const worker = new Worker(
            new URL('./simulation.worker.ts', import.meta.url),
            {type: 'module'},
        );

        worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
            const msg = e.data;
            switch (msg.type) {
                case 'ready':
                    setIsReady(true);
                    break;
                case 'progress':
                    useSimulationStore.getState().setProgress(msg.pct);
                    break;
                case 'result':
                    if (resolveRef.current) {
                        resolveRef.current(msg.data);
                        resolveRef.current = null;
                    }
                    break;
                case 'error':
                    useSimulationStore.getState().setRunning(false);
                    resolveRef.current = null;
                    console.error('[SimWorker]', msg.message);
                    break;
            }
        };

        workerRef.current = worker;
        return () => worker.terminate();
    }, []);

    const postMsg = useCallback((msg: WorkerMessage) => {
        workerRef.current?.postMessage(msg);
    }, []);

    const init = useCallback((graphIndex: GraphIndex) => {
        postMsg({type: 'init', graphIndex: serializeGraphIndex(graphIndex)});
    }, [postMsg]);

    const simulate = useCallback((params: SimulationParams): Promise<SimulationResults> => {
        return new Promise(resolve => {
            resolveRef.current = resolve;
            postMsg({type: 'simulate', params});
        });
    }, [postMsg]);

    const cancel = useCallback(() => {
        postMsg({type: 'cancel'});
        resolveRef.current = null;
    }, [postMsg]);

    return {
        isReady,
        init,
        simulate,
        cancel,
    };
}
