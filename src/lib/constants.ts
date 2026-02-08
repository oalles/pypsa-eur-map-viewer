export const VOLTAGE_DOMAIN: [number, number] = [50, 750];

export const LAYER_COLORS = {
    hvdc: [0, 229, 255] as [number, number, number],
    transformer: [255, 140, 0] as [number, number, number],
    converter: [192, 132, 252] as [number, number, number],
    bus: [200, 200, 200] as [number, number, number],
    highlight: [255, 255, 255, 80] as [number, number, number, number],
};

export const COUNTRY_FLAGS: Record<string, string> = {
    AL: '🇦🇱', AT: '🇦🇹', BA: '🇧🇦', BE: '🇧🇪', BG: '🇧🇬',
    CH: '🇨🇭', CZ: '🇨🇿', DE: '🇩🇪', DK: '🇩🇰', EE: '🇪🇪',
    ES: '🇪🇸', FI: '🇫🇮', FR: '🇫🇷', GB: '🇬🇧', GR: '🇬🇷',
    HR: '🇭🇷', HU: '🇭🇺', IE: '🇮🇪', IT: '🇮🇹', LT: '🇱🇹',
    LU: '🇱🇺', LV: '🇱🇻', ME: '🇲🇪', MK: '🇲🇰', NL: '🇳🇱',
    NO: '🇳🇴', PL: '🇵🇱', PT: '🇵🇹', RO: '🇷🇴', RS: '🇷🇸',
    SE: '🇸🇪', SI: '🇸🇮', SK: '🇸🇰', TR: '🇹🇷', UA: '🇺🇦',
    XK: '🇽🇰', LI: '🇱🇮',
};

export const COUNTRY_NAMES: Record<string, string> = {
    AL: 'Albania', AT: 'Austria', BA: 'Bosnia & Herzegovina', BE: 'Belgium',
    BG: 'Bulgaria', CH: 'Switzerland', CZ: 'Czechia', DE: 'Germany',
    DK: 'Denmark', EE: 'Estonia', ES: 'Spain', FI: 'Finland',
    FR: 'France', GB: 'United Kingdom', GR: 'Greece', HR: 'Croatia',
    HU: 'Hungary', IE: 'Ireland', IT: 'Italy', LT: 'Lithuania',
    LU: 'Luxembourg', LV: 'Latvia', ME: 'Montenegro', MK: 'North Macedonia',
    NL: 'Netherlands', NO: 'Norway', PL: 'Poland', PT: 'Portugal',
    RO: 'Romania', RS: 'Serbia', SE: 'Sweden', SI: 'Slovenia',
    SK: 'Slovakia', TR: 'Turkey', UA: 'Ukraine', XK: 'Kosovo',
    LI: 'Liechtenstein',
};

export const INITIAL_VIEW_STATE = {
    longitude: 10,
    latitude: 50,
    zoom: 4.5,
    pitch: 0,
    bearing: 0,
    maxZoom: 14,
    minZoom: 3,
};
