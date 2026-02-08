import type {EdgeInfo} from '@/lib/graph';
import type {Component} from '../api';

/**
 * BFS-based connected components on the grid graph.
 * Excludes removed buses and edges, then marks each component
 * as energized if it contains at least one source bus.
 *
 * Complexity: O(V + E)
 */
export function findConnectedComponents(
    adjacency: Map<string, string[]>,
    edges: Map<string, EdgeInfo>,
    removedBuses: Set<string>,
    removedEdges: Set<string>,
    sources: Set<string>,
): Component[] {
    const visited = new Set<string>();
    const components: Component[] = [];
    let componentId = 0;

    for (const busId of adjacency.keys()) {
        if (removedBuses.has(busId) || visited.has(busId)) continue;

        // BFS from this bus
        const queue: string[] = [busId];
        visited.add(busId);
        const compBuses: string[] = [];
        const compEdgesSet = new Set<string>();
        let energized = false;

        while (queue.length > 0) {
            const current = queue.shift()!;
            compBuses.push(current);
            if (sources.has(current)) energized = true;

            const edgeIds = adjacency.get(current);
            if (!edgeIds) continue;

            for (const edgeId of edgeIds) {
                if (removedEdges.has(edgeId)) continue;

                const edge = edges.get(edgeId);
                if (!edge) continue;

                const neighbor = edge.a === current ? edge.b : edge.a;
                if (removedBuses.has(neighbor) || visited.has(neighbor)) continue;

                visited.add(neighbor);
                queue.push(neighbor);

                // Track edge as part of this component
                compEdgesSet.add(edgeId);
            }
        }

        // Also add edges internal to component that weren't traversed as tree edges
        // (edges between two already-visited nodes in the same component)
        const busSet = new Set(compBuses);
        for (const bus of compBuses) {
            const edgeIds = adjacency.get(bus);
            if (!edgeIds) continue;
            for (const edgeId of edgeIds) {
                if (removedEdges.has(edgeId) || compEdgesSet.has(edgeId)) continue;
                const edge = edges.get(edgeId);
                if (!edge) continue;
                if (busSet.has(edge.a) && busSet.has(edge.b)) {
                    compEdgesSet.add(edgeId);
                }
            }
        }

        components.push({
            id: componentId++,
            buses: compBuses,
            edges: Array.from(compEdgesSet),
            energized,
        });
    }

    return components;
}
