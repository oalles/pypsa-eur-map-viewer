import React from 'react';
import {cn} from '@/lib/utils';

interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({children, className}) => (
    <div className={cn('glass', className)}>
        {children}
    </div>
);
