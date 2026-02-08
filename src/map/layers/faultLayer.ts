import {ScatterplotLayer, PathLayer} from '@deck.gl/layers';
import type {Dataset} from '@/types';
import type {FaultEntry} from '@/store/simulation';

interface FaultLayerOptions {
    dataset: Dataset;
    faults: FaultEntry[];
    time: number;
}

export function createFaultLayers({dataset, faults, time}: FaultLayerOptions) {
    const layers: any[] = [];

    const busFaults = new Set(
        faults.filter(f => f.faultType === 'bus').map(f => f.id)
    );
    const edgeFaults = new Set(
        faults.filter(f => f.faultType === 'edge').map(f => f.id)
    );

    // Animated pulse: oscillate between 1.0 and 1.8
    const pulse = 1.0 + 0.8 * (0.5 + 0.5 * Math.sin(time * 4));

    // Fault buses — red pulsing circles
    if (dataset.buses && busFaults.size > 0) {
        const faultBuses = dataset.buses.features.filter(
            f => busFaults.has(f.properties.bus_id)
        );
        if (faultBuses.length > 0) {
            layers.push(new ScatterplotLayer({
                id: 'fault-buses',
                data: faultBuses,
                getPosition: (d: any) => d.geometry.coordinates,
                getRadius: 6000 * pulse,
                getFillColor: [239, 68, 68, 180],
                getLineColor: [255, 100, 100, 255],
                lineWidthMinPixels: 2,
                stroked: true,
                radiusMinPixels: 6,
                radiusMaxPixels: 20,
                parameters: {depthWriteEnabled: false},
                pickable: false,
            }));
        }
    }

    // Fault edges — red highlighted lines
    if (edgeFaults.size > 0) {
        const allEdgeFeatures = [
            ...(dataset.lines?.features || []).map(f => ({feature: f, edgeId: `line:${f.properties.id}`})),
            ...(dataset.links?.features || []).map(f => ({feature: f, edgeId: `link:${f.properties.id}`})),
        ];

        const faultEdgeFeatures = allEdgeFeatures.filter(e => edgeFaults.has(e.edgeId));

        if (faultEdgeFeatures.length > 0) {
            layers.push(new PathLayer({
                id: 'fault-lines',
                data: faultEdgeFeatures,
                getPath: (d: any) => d.feature.geometry.coordinates,
                getColor: [239, 68, 68, Math.round(180 * (0.6 + 0.4 * Math.sin(time * 4)))],
                getWidth: 2500 * pulse,
                widthMinPixels: 3,
                widthMaxPixels: 10,
                capRounded: true,
                jointRounded: true,
                parameters: {depthWriteEnabled: false},
                pickable: false,
            }));
        }
    }

    return layers;
}
