import React from 'react';
import {PanelLeftClose, PanelLeftOpen} from 'lucide-react';
import useNetworkStore from '@/store/network';
import {LayerToggles} from '@/ui/sidebar/LayerToggles';
import {VoltageFilter} from '@/ui/sidebar/VoltageFilter';
import {CountryFilter} from '@/ui/sidebar/CountryFilter';
import {DisplaySettings} from '@/ui/sidebar/DisplaySettings';

export const Sidebar: React.FC = () => {
    const sidebarOpen = useNetworkStore(s => s.sidebarOpen);
    const setSidebarOpen = useNetworkStore(s => s.setSidebarOpen);

    return (
        <div
            className="absolute top-18 left-3 z-20 flex flex-col transition-all duration-200 ease-out"
            style={{width: sidebarOpen ? 280 : 44}}
        >
            <div className="glass flex flex-col h-full max-h-[calc(100vh-8rem)] overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-glass-border">
                    {sidebarOpen && (
                        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Controls
                        </span>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-md hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    >
                        {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                    </button>
                </div>

                {sidebarOpen && (
                    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
                        <LayerToggles />
                        <Divider />
                        <VoltageFilter />
                        <Divider />
                        <CountryFilter />
                        <Divider />
                        <DisplaySettings />
                    </div>
                )}
            </div>
        </div>
    );
};

const Divider = () => <div className="h-px bg-glass-border" />;
