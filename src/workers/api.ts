import type {SerializedGraphIndex} from '@/lib/graph';

// ─── Messages from main thread → worker ───────────────────────────

export interface InitMessage {
    type: 'init';
    graphIndex: SerializedGraphIndex;
}

export interface SimulateMessage {
    type: 'simulate';
    params: SimulationParams;
}

export interface CancelMessage {
    type: 'cancel';
}

export type WorkerMessage = InitMessage | SimulateMessage | CancelMessage;

// ─── Simulation parameters ────────────────────────────────────────

export interface Fault {
    id: string;
    faultType: 'bus' | 'edge';
}

export interface SimulationParams {
    faults: Fault[];
    sources: string[]; // bus IDs that are energized sources
}

// ─── Results ──────────────────────────────────────────────────────

export interface Component {
    id: number;
    buses: string[];
    edges: string[];
    energized: boolean;
}

export interface SimulationMetrics {
    totalComponents: number;
    energizedComponents: number;
    blackoutBuses: number;
    energizedBuses: number;
    totalBuses: number;
    percentAffected: number;
}

export interface SimulationResults {
    components: Component[];
    blackoutBuses: string[];
    energizedBuses: string[];
    blackoutEdges: string[];
    energizedEdges: string[];
    metrics: SimulationMetrics;
}

// ─── Messages from worker → main thread ───────────────────────────

export interface ReadyResponse {
    type: 'ready';
}

export interface ResultResponse {
    type: 'result';
    data: SimulationResults;
}

export interface ProgressResponse {
    type: 'progress';
    pct: number;
}

export interface ErrorResponse {
    type: 'error';
    message: string;
}

export type WorkerResponse = ReadyResponse | ResultResponse | ProgressResponse | ErrorResponse;
