import React from 'react';

interface Props {
    label: string;
    value: string | number | React.ReactNode;
    mono?: boolean;
    color?: string;
}

export const PropertyRow: React.FC<Props> = ({label, value, mono = true, color}) => (
    <div className="flex items-center justify-between py-1 text-xs">
        <span className="text-text-muted">{label}</span>
        <span
            className={`${mono ? 'font-mono' : ''} text-text-primary`}
            style={color ? {color} : undefined}
        >
            {value}
        </span>
    </div>
);
