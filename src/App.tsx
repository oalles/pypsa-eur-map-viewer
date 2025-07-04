import React from 'react';
import {Legend} from './ui/Legend';
import {MapView} from './map/MapView';
import {useDataset} from './hooks/useDataset';
import useNetworkStore from "./store/network";

export const App: React.FC = () => {
    useDataset();
    const ready = useNetworkStore(s => s.ready);
    return (
        <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <div style={{flex: 1, position: 'relative'}}>
                <MapView/>
                {!ready && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.5)',
                        zIndex: 100
                    }}>
                        <div className="custom-spinner" style={{fontSize: 32}}>Cargando...</div>
                    </div>
                )}
            </div>
            <Legend/>
        </div>
    );
};