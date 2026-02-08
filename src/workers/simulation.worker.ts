import {deserializeGraphIndex, type GraphIndex} from '@/lib/graph';
import {findConnectedComponents} from './algorithms/connectedComponents';
import type {WorkerMessage, WorkerResponse, SimulationParams, SimulationResults} from './api';

let graphIndex: GraphIndex | null = null;

function post(msg: WorkerResponse) {
    self.postMessage(msg);
}

function handleInit(msg: Extract<WorkerMessage, {type: 'init'}>) {
    graphIndex = deserializeGraphIndex(msg.graphIndex);
    post({type: 'ready'});
}

function handleSimulate(params: SimulationParams) {
    if (!graphIndex) {
        post({type: 'error', message: 'Graph not initialized'});
        return;
    }

    post({type: 'progress', pct: 10});

    const removedBuses = new Set<string>();
    const removedEdges = new Set<string>();

    for (const fault of params.faults) {
        if (fault.faultType === 'bus') {
            removedBuses.add(fault.id);
        } else {
            removedEdges.add(fault.id);
        }
    }

    post({type: 'progress', pct: 30});

    const sourcesSet = new Set(params.sources);

    const components = findConnectedComponents(
        graphIndex.adjacency,
        graphIndex.edges,
        removedBuses,
        removedEdges,
        sourcesSet,
    );

    post({type: 'progress', pct: 80});

    // Collect results
    const blackoutBuses: string[] = [];
    const energizedBuses: string[] = [];
    const blackoutEdges: string[] = [];
    const energizedEdges: string[] = [];
    let energizedComponents = 0;

    for (const comp of components) {
        if (comp.energized) {
            energizedComponents++;
            energizedBuses.push(...comp.buses);
            energizedEdges.push(...comp.edges);
        } else {
            blackoutBuses.push(...comp.buses);
            blackoutEdges.push(...comp.edges);
        }
    }

    const totalBuses = graphIndex.busCount - removedBuses.size;

    const results: SimulationResults = {
        components,
        blackoutBuses,
        energizedBuses,
        blackoutEdges,
        energizedEdges,
        metrics: {
            totalComponents: components.length,
            energizedComponents,
            blackoutBuses: blackoutBuses.length,
            energizedBuses: energizedBuses.length,
            totalBuses,
            percentAffected: totalBuses > 0
                ? Math.round((blackoutBuses.length / totalBuses) * 1000) / 10
                : 0,
        },
    };

    post({type: 'progress', pct: 100});
    post({type: 'result', data: results});
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
    const msg = e.data;
    switch (msg.type) {
        case 'init':
            handleInit(msg);
            break;
        case 'simulate':
            handleSimulate(msg.params);
            break;
        case 'cancel':
            // For BFS this is near-instant, but future cascade may need cancellation
            break;
    }
};
