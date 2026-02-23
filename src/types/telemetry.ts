export interface TelemetryPayload {
    timestamp: number;
    coordinates: {
        x: number;
        y: number;
        z: number;
        depth: number;
    };
    orientation: {
        pitch: number;
        yaw: number;
        roll: number;
    };
    vitals: {
        heartRate: number;
        spO2: number;
        temperature: number;
    };
    biomarkers: {
        pH: number;
        h2s: number;
        ch4: number;
        serotonin: number;
        dopamine: number;
        bioimpedance: number[];
    };
    power: {
        battery: number;
        harvestingRate: number;
    };
}

export interface AIAnomaly {
    id: string;
    type: string;
    confidence: number;
    color: string;
}

export interface AIProScanData {
    status: 'active' | 'idle';
    detections: AIAnomaly[];
    log: string[];
}
