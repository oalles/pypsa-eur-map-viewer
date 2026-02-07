import React from 'react';
import {useTranslation} from 'react-i18next';
import {X, Cable, Zap, CircleDot, ArrowUpDown, Repeat} from 'lucide-react';
import useNetworkStore from '@/store/network';
import {BusDetail} from '@/ui/detail/BusDetail';
import {LineDetail} from '@/ui/detail/LineDetail';
import {LinkDetail} from '@/ui/detail/LinkDetail';
import {TransformerDetail} from '@/ui/detail/TransformerDetail';
import {ConverterDetail} from '@/ui/detail/ConverterDetail';

const LAYER_CONFIG: Record<string, {icon: React.ReactNode; color: string; label: string}> = {
    'ac-lines': {icon: <Cable size={14} />, color: 'text-accent', label: 'AC Line'},
    'hvdc-links': {icon: <Zap size={14} />, color: 'text-hvdc', label: 'HVDC Link'},
    'buses': {icon: <CircleDot size={14} />, color: 'text-accent', label: 'Bus'},
    'transformers': {icon: <ArrowUpDown size={14} />, color: 'text-transformer', label: 'Transformer'},
    'converters': {icon: <Repeat size={14} />, color: 'text-converter', label: 'Converter'},
};

export const DetailPanel: React.FC = () => {
    const {t} = useTranslation();
    const selected = useNetworkStore(s => s.selected);
    const selectedLayerType = useNetworkStore(s => s.selectedLayerType);
    const detailPanelOpen = useNetworkStore(s => s.detailPanelOpen);
    const setSelected = useNetworkStore(s => s.setSelected);

    if (!detailPanelOpen || !selected) return null;

    const config = LAYER_CONFIG[selectedLayerType || ''] || {icon: null, color: 'text-text-primary', label: 'Element'};
    const props = selected.properties as any;
    const title = props?.id || props?.bus_id || props?.transformer_id || props?.converter_id || props?.link_id || config.label;

    return (
        <div className="absolute top-18 right-3 z-20 w-72 glass max-h-[calc(100vh-8rem)] flex flex-col animate-slide-in-right">
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-glass-border">
                <span className={config.color}>{config.icon}</span>
                <div className="flex-1 min-w-0">
                    <span className={`text-[10px] uppercase tracking-wider ${config.color}`}>
                        {config.label}
                    </span>
                    <h3 className="text-xs font-mono text-text-primary truncate">{title}</h3>
                </div>
                <button
                    onClick={() => setSelected(null)}
                    className="p-1 rounded-md hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                    <X size={14} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2">
                {selectedLayerType === 'buses' && <BusDetail properties={props} />}
                {selectedLayerType === 'ac-lines' && <LineDetail properties={props} />}
                {selectedLayerType === 'hvdc-links' && <LinkDetail properties={props} />}
                {selectedLayerType === 'transformers' && <TransformerDetail properties={props} />}
                {selectedLayerType === 'converters' && <ConverterDetail properties={props} />}
            </div>
        </div>
    );
};
