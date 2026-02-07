import React, {useMemo, useState, useCallback, useEffect, useRef} from 'react';
import DeckGL from '@deck.gl/react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import useNetworkStore from '@/store/network';
import {useFilteredData} from '@/hooks/useFilteredData';
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

    const showACLines = useNetworkStore(s => s.showACLines);
    const showHVDC = useNetworkStore(s => s.showHVDC);
    const showBuses = useNetworkStore(s => s.showBuses);
    const showTransformers = useNetworkStore(s => s.showTransformers);
    const showConverters = useNetworkStore(s => s.showConverters);
    const showHeatmap = useNetworkStore(s => s.showHeatmap);
    const colorScheme = useNetworkStore(s => s.colorScheme);
    const lineThicknessMode = useNetworkStore(s => s.lineThicknessMode);
    const layerOpacity = useNetworkStore(s => s.layerOpacity);
    const setSelected = useNetworkStore(s => s.setSelected);
    const storeViewState = useNetworkStore(s => s.viewState);
    const viewStateVersion = useNetworkStore(s => s.viewStateVersion);

    const [viewState, setViewState] = useState(INITIAL_VIEW);
    const prevVersionRef = useRef(0);

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
            showConverters, showHeatmap, colorScheme,
            lineThicknessMode, layerOpacity,
        }),
        [filteredData, showACLines, showHVDC, showBuses, showTransformers,
         showConverters, showHeatmap, colorScheme, lineThicknessMode, layerOpacity]
    );

    const handleClick = useCallback((info: any) => {
        if (info?.object?.properties) {
            setSelected(info.object, info.layer?.id || null);
        } else {
            setSelected(null);
        }
    }, [setSelected]);

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
