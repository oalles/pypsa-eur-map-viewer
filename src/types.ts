export interface LineProperties {
    id: string;
    voltage_nom: number;
    length: number;
    s_nom: number;
    i_nom: number;
    circuits: number;
    r: number;
    x: number;
    b: number;
    underground: boolean;
    under_construction: boolean;
    type: string;
    tags: string;
    bus0: string;
    bus1: string;
    country?: string;
}

export interface BusProperties {
    bus_id: string;
    voltage: number;
    dc: boolean;
    symbol: string;
    under_construction: boolean;
    tags: string;
    x: number;
    y: number;
    country: string;
    geometry: string;
}

export interface LinkProperties {
    id: string;
    p_nom: number;
    efficiency: number;
    voltage: number;
    length: number;
    underground: boolean;
    under_construction: boolean;
    tags: string;
    bus0: string;
    bus1: string;
}

export interface TransformerProperties {
    transformer_id: string;
    bus0: string;
    bus1: string;
    voltage_bus0: number;
    voltage_bus1: number;
    s_nom: number;
}

export interface ConverterProperties {
    converter_id: string;
    bus0: string;
    bus1: string;
    voltage: number;
    p_nom: number;
}

export type Dataset = {
    buses?: GeoJSON.FeatureCollection<GeoJSON.Point, BusProperties>;
    lines?: GeoJSON.FeatureCollection<GeoJSON.LineString, LineProperties>;
    links?: GeoJSON.FeatureCollection<GeoJSON.LineString, LinkProperties>;
    transformers?: GeoJSON.FeatureCollection<GeoJSON.LineString, TransformerProperties>;
    converters?: GeoJSON.FeatureCollection<GeoJSON.LineString, ConverterProperties>;
};

export type LayerType = 'ac-line' | 'hvdc-link' | 'bus' | 'transformer' | 'converter';

export type ConstructionFilter = 'all' | 'operational' | 'planned';
export type LineThicknessMode = 'capacity' | 'uniform';
