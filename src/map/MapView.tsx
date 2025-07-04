import React, {useEffect, useState} from 'react';
import DeckGL from '@deck.gl/react';
import Map from 'react-map-gl/maplibre';
import {layers as getLayers} from './layers';
import 'maplibre-gl/dist/maplibre-gl.css';
import useNetworkStore from "../store/network";

export const MapView: React.FC = () => {
    const {dataset, ready, voltage, showHVDC, selected, setSelected} = useNetworkStore();

    const [viewState, setViewState] = useState({
        longitude: 10,
        latitude: 50,
        zoom: 6,
        pitch: 53,
        bearing: 22,
        maxZoom: 9,
        minZoom: 3.5,
    });

    const [deckLayers, setDeckLayers] = useState<any[]>([]);

    useEffect(() => {
        if (ready) {
            setDeckLayers(getLayers(dataset, voltage, showHVDC));
        }
    }, [dataset, voltage, showHVDC, ready]);

    const handleViewStateChange = ({viewState}: any) => {
        // console.log('ViewState changed:', viewState);
        setViewState(viewState);
    };

    const handleClick = (info: any) => {
        if (info && info.object && info.layer) {
            setSelected(info.object);
        }
    };

    return (
        <div style={{height: '100%', width: '100%'}}>
            <DeckGL
                initialViewState={viewState}
                controller={true}
                layers={deckLayers}
                onViewStateChange={handleViewStateChange}
                onClick={handleClick}
                style={{width: '100%', height: '100%'}}
            >
                <Map
                    mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                    reuseMaps
                    renderWorldCopies={false}
                    interactive={true}
                    initialViewState={viewState}
                />
            </DeckGL>
        </div>
    );
};