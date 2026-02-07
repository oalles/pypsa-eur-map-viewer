import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(n: number, decimals = 0): string {
    return n.toLocaleString('en-US', {maximumFractionDigits: decimals});
}

export function formatKV(voltage: number): string {
    return `${formatNumber(voltage)} kV`;
}

export function formatMW(power: number): string {
    if (power >= 1000) return `${formatNumber(power / 1000, 1)} GW`;
    return `${formatNumber(power)} MW`;
}

export function formatMVA(power: number): string {
    if (power >= 1000) return `${formatNumber(power / 1000, 1)} GVA`;
    return `${formatNumber(power)} MVA`;
}

export function formatKm(length: number): string {
    if (length >= 1000) return `${formatNumber(length / 1000, 1)} km`;
    return `${formatNumber(length, 1)} m`;
}

export function formatLength(meters: number): string {
    const km = meters / 1000;
    if (km >= 1) return `${formatNumber(km, 1)} km`;
    return `${formatNumber(meters, 0)} m`;
}
