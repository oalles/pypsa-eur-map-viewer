export interface LineProperties {
    id: string;
    voltage_nom: number;
    length: number;
    s_nom: number;
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
    efficiency?: number;
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