import React, {useMemo, useState, useCallback, useEffect, useRef} from 'react';
import DeckGL from '@deck.gl/react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import useNetworkStore from '@/store/network';
import useSimulationStore from '@/store/simulation';
import {useFilteredData} from '@/hooks/useFilteredData';
import {useMode} from '@/router';
import {buildLayers} from './layers/index';
import {getTooltip} from './tooltips/MapTooltip';

const INITIAL_VIEW = {
    longitude: 10,
    latitude: 50,
    zoom: 4.5,
    pitch: 0,
    bearing: 0,
    maxZoom: 14,
    minZoom: 3,
};

export const MapView: React.FC = () => {
    const filteredData = useFilteredData();
    const {mode} = useMode();

    const showACLines = useNetworkStore(s => s.showACLines);
    const showHVDC = useNetworkStore(s => s.showHVDC);
    const showBuses = useNetworkStore(s => s.showBuses);
    const showTransformers = useNetworkStore(s => s.showTransformers);
    const showConverters = useNetworkStore(s => s.showConverters);
    const showHeatmap = useNetworkStore(s => s.showHeatmap);
    const lineThicknessMode = useNetworkStore(s => s.lineThicknessMode);
    const layerOpacity = useNetworkStore(s => s.layerOpacity);
    const setSelected = useNetworkStore(s => s.setSelected);
    const storeViewState = useNetworkStore(s => s.viewState);
    const viewStateVersion = useNetworkStore(s => s.viewStateVersion);

    // Simulation state
    const simulationResults = useSimulationStore(s => s.results);
    const faults = useSimulationStore(s => s.faults);
    const toggleFault = useSimulationStore(s => s.toggleFault);
    const clickMode = useSimulationStore(s => s.clickMode);
    const manualSources = useSimulationStore(s => s.manualSources);
    const addManualSource = useSimulationStore(s => s.addManualSource);
    const removeManualSource = useSimulationStore(s => s.removeManualSource);

    const [viewState, setViewState] = useState(INITIAL_VIEW);
    const prevVersionRef = useRef(0);

    // Animation time for pulsing effects
    const [time, setTime] = useState(0);
    const animFrameRef = useRef<number>(0);

    useEffect(() => {
        if (mode !== 'simulate' || faults.length === 0) {
            setTime(0);
            return;
        }
        let running = true;
        const animate = () => {
            if (!running) return;
            setTime(Date.now() / 1000);
            animFrameRef.current = requestAnimationFrame(animate);
        };
        animate();
        return () => {
            running = false;
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [mode, faults.length]);

    useEffect(() => {
        if (viewStateVersion > prevVersionRef.current) {
            prevVersionRef.current = viewStateVersion;
            setViewState(vs => ({
                ...vs,
                longitude: storeViewState.longitude,
                latitude: storeViewState.latitude,
                zoom: storeViewState.zoom,
                pitch: storeViewState.pitch,
                bearing: storeViewState.bearing,
                transitionDuration: 1500,
            }));
        }
    }, [viewStateVersion, storeViewState]);

    const layers = useMemo(() =>
        buildLayers(filteredData, {
            showACLines, showHVDC, showBuses, showTransformers,
            showConverters, showHeatmap,
            lineThicknessMode, layerOpacity,
            mode,
            simulationResults,
            faults,
            time,
        }),
        [filteredData, showACLines, showHVDC, showBuses, showTransformers,
         showConverters, showHeatmap, lineThicknessMode, layerOpacity,
         mode, simulationResults, faults, time]
    );

    const handleClick = useCallback((info: any) => {
        if (mode === 'simulate' && info?.object?.properties) {
            const props = info.object.properties;
            const layerId = info.layer?.id || '';

            // In sources click mode, clicking a bus toggles it as a manual source
            if (layerId === 'buses' && clickMode === 'sources') {
                const busId = props.bus_id;
                if (manualSources.includes(busId)) {
                    removeManualSource(busId);
                } else {
                    addManualSource(busId);
                }
                return;
            }

            // Faults mode (or lines/links which are always faults)
            if (layerId === 'buses') {
                toggleFault(props.bus_id, 'bus', props.bus_id);
            } else if (layerId === 'ac-lines') {
                toggleFault(`line:${props.id}`, 'edge', props.id);
            } else if (layerId === 'hvdc-links') {
                toggleFault(`link:${props.id}`, 'edge', props.id);
            }
            return;
        }

        if (info?.object?.properties) {
            setSelected(info.object, info.layer?.id || null);
        } else {
            setSelected(null);
        }
    }, [setSelected, toggleFault, mode, clickMode, manualSources, addManualSource, removeManualSource]);

    const onViewStateChange = useCallback(({viewState: vs}: any) => {
        setViewState(vs);
    }, []);

    return (
        <DeckGL
            viewState={viewState}
            controller={true}
            layers={layers}
            onViewStateChange={onViewStateChange}
            onClick={handleClick}
            getTooltip={getTooltip}
            style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%'}}
        >
            <Map
                mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                reuseMaps
                renderWorldCopies={false}
            />
        </DeckGL>
    );
};
