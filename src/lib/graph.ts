import type {Dataset} from '@/types';

export type EdgeType = 'line' | 'link' | 'transformer' | 'converter';

export interface EdgeInfo {
    a: string;
    b: string;
    type: EdgeType;
}

export interface BusMeta {
    country: string;
    voltage: number;
}

export interface GraphIndex {
    /** busId → edgeIds that touch this bus */
    adjacency: Map<string, string[]>;
    /** edgeId → {a, b, type} */
    edges: Map<string, EdgeInfo>;
    /** busId → {country, voltage} */
    busMeta: Map<string, BusMeta>;
    /** Total number of buses */
    busCount: number;
    /** Total number of edges */
    edgeCount: number;
}

/** Serializable version for worker transfer */
export interface SerializedGraphIndex {
    adjacency: [string, string[]][];
    edges: [string, EdgeInfo][];
    busMeta: [string, BusMeta][];
    busCount: number;
    edgeCount: number;
}

export function serializeGraphIndex(g: GraphIndex): SerializedGraphIndex {
    return {
        adjacency: Array.from(g.adjacency.entries()),
        edges: Array.from(g.edges.entries()),
        busMeta: Array.from(g.busMeta.entries()),
        busCount: g.busCount,
        edgeCount: g.edgeCount,
    };
}

export function deserializeGraphIndex(s: SerializedGraphIndex): GraphIndex {
    return {
        adjacency: new Map(s.adjacency),
        edges: new Map(s.edges),
        busMeta: new Map(s.busMeta),
        busCount: s.busCount,
        edgeCount: s.edgeCount,
    };
}

function addEdge(
    adjacency: Map<string, string[]>,
    edges: Map<string, EdgeInfo>,
    edgeId: string,
    bus0: string,
    bus1: string,
    type: EdgeType,
) {
    if (!bus0 || !bus1) return;
    edges.set(edgeId, {a: bus0, b: bus1, type});
    let list = adjacency.get(bus0);
    if (!list) { list = []; adjacency.set(bus0, list); }
    list.push(edgeId);
    list = adjacency.get(bus1);
    if (!list) { list = []; adjacency.set(bus1, list); }
    list.push(edgeId);
}

export function buildGraphIndex(dataset: Dataset): GraphIndex {
    const adjacency = new Map<string, string[]>();
    const edges = new Map<string, EdgeInfo>();
    const busMeta = new Map<string, BusMeta>();

    // Index buses
    if (dataset.buses) {
        for (const f of dataset.buses.features) {
            const p = f.properties;
            busMeta.set(p.bus_id, {
                country: p.country || '',
                voltage: p.voltage || 0,
            });
            // Ensure every bus appears in adjacency even if isolated
            if (!adjacency.has(p.bus_id)) {
                adjacency.set(p.bus_id, []);
            }
        }
    }

    // Index AC lines
    if (dataset.lines) {
        for (const f of dataset.lines.features) {
            const p = f.properties;
            addEdge(adjacency, edges, `line:${p.id}`, p.bus0, p.bus1, 'line');
        }
    }

    // Index HVDC links
    if (dataset.links) {
        for (const f of dataset.links.features) {
            const p = f.properties;
            addEdge(adjacency, edges, `link:${p.id}`, p.bus0, p.bus1, 'link');
        }
    }

    // Index transformers
    if (dataset.transformers) {
        for (const f of dataset.transformers.features) {
            const p = f.properties;
            addEdge(adjacency, edges, `transformer:${p.transformer_id}`, p.bus0, p.bus1, 'transformer');
        }
    }

    // Index converters
    if (dataset.converters) {
        for (const f of dataset.converters.features) {
            const p = f.properties;
            addEdge(adjacency, edges, `converter:${p.converter_id}`, p.bus0, p.bus1, 'converter');
        }
    }

    return {
        adjacency,
        edges,
        busMeta,
        busCount: busMeta.size,
        edgeCount: edges.size,
    };
}
