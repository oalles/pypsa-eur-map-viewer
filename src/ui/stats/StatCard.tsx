import React from 'react';

interface Props {
    label: string;
    value: string | number;
    color?: string;
}

export const StatCard: React.FC<Props> = ({label, value, color}) => (
    <div className="glass-subtle px-3 py-2.5 rounded-lg">
        <div className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-lg font-semibold font-mono" style={color ? {color} : {color: '#e2e8f0'}}>
            {value}
        </div>
    </div>
);
