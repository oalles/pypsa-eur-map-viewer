import {formatNumber} from '@/lib/utils';

const TOOLTIP_STYLE = `
    background: rgba(15, 15, 25, 0.9);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 8px 12px;
    color: #e2e8f0;
    font-family: "Inter", system-ui, sans-serif;
    font-size: 12px;
    line-height: 1.4;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    max-width: 280px;
    pointer-events: none;
`;

function row(label: string, value: string, color?: string): string {
    const colorStyle = color ? `color: ${color};` : 'color: #94a3b8;';
    return `<div style="display:flex;justify-content:space-between;gap:12px;">
        <span style="${colorStyle}">${label}</span>
        <span style="font-family:'JetBrains Mono',monospace;color:#e2e8f0;font-weight:500;">${value}</span>
    </div>`;
}

export function getTooltip(info: any): {html: string; style: Record<string, string>} | null {
    if (!info?.object) return null;
    const layerId = info.layer?.id || '';
    const props = info.object.properties;
    if (!props) return null;

    let html = '';

    if (layerId === 'ac-lines') {
        const title = props.id || 'AC Line';
        html = `<div style="font-weight:600;margin-bottom:4px;color:#38bdf8;">${title}</div>`;
        html += row('Voltage', `${formatNumber(props.voltage_nom)} kV`);
        if (props.s_nom) html += row('Capacity', `${formatNumber(props.s_nom)} MVA`);
        if (props.length) html += row('Length', `${formatNumber(props.length / 1000, 1)} km`);
        if (props.underground) html += row('Type', 'Underground', '#a78bfa');
    } else if (layerId === 'hvdc-links') {
        const title = props.id || 'HVDC Link';
        html = `<div style="font-weight:600;margin-bottom:4px;color:#00e5ff;">${title}</div>`;
        if (props.voltage) html += row('Voltage', `${formatNumber(props.voltage)} kV DC`);
        if (props.p_nom) html += row('Power', `${formatNumber(props.p_nom)} MW`);
        if (props.length) html += row('Length', `${formatNumber(props.length / 1000, 1)} km`);
    } else if (layerId === 'buses') {
        const title = props.bus_id || 'Bus';
        html = `<div style="font-weight:600;margin-bottom:4px;color:#38bdf8;">${title}</div>`;
        html += row('Voltage', `${formatNumber(props.voltage)} kV`);
        if (props.country) html += row('Country', props.country);
        if (props.symbol) html += row('Type', props.symbol);
    } else if (layerId === 'transformers') {
        const title = props.transformer_id || 'Transformer';
        html = `<div style="font-weight:600;margin-bottom:4px;color:#ff8c00;">${title}</div>`;
        html += row('HV Side', `${formatNumber(props.voltage_bus1)} kV`);
        html += row('LV Side', `${formatNumber(props.voltage_bus0)} kV`);
        if (props.s_nom) html += row('Capacity', `${formatNumber(props.s_nom)} MVA`);
    } else if (layerId === 'converters') {
        const title = props.converter_id || 'Converter';
        html = `<div style="font-weight:600;margin-bottom:4px;color:#c084fc;">${title}</div>`;
        if (props.voltage) html += row('Voltage', `${formatNumber(props.voltage)} kV`);
        if (props.p_nom) html += row('Power', `${formatNumber(props.p_nom)} MW`);
    } else {
        return null;
    }

    return {html: `<div style="${TOOLTIP_STYLE}">${html}</div>`, style: {background: 'none', border: 'none', padding: '0'}};
}
