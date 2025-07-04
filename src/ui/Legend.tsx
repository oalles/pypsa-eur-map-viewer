import React from 'react';
import chroma from 'chroma-js';

export const Legend: React.FC = () => {
    const stops = [50, 150, 300, 450, 600, 750];
    const scale = chroma.scale('viridis' as any).domain([50, 750]);
    return <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        background: 'rgba(255,255,255,0.9)',
        padding: 8,
        borderRadius: 4
    }}>
        <b>Voltage (kV)</b>
        <div style={{display: 'flex'}}>
            {stops.map(s => <div key={s} style={{margin: '0 4px', textAlign: 'center'}}>
                <div style={{width: 20, height: 8, background: scale(s).hex()}}/>
                <span style={{fontSize: 10}}>{s}</span>
            </div>)}
        </div>
    </div>;
};