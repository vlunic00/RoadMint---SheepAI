export type DamageKind = "pothole" | "alligator-crack" | "edge-break" | "rutting";

export type DamageSeverity = "low" | "medium" | "high" | "critical";

export type NormalizedPoint = {
  x: number;
  y: number;
};

export type DamageDetection = {
  id: string;
  kind: DamageKind;
  severity: DamageSeverity;
  confidence: number;
  depthCm: number;
  areaM2: number;
  laneOffsetM: number;
  distanceM: number;
  centroid: NormalizedPoint;
  contour: NormalizedPoint[];
  capturedAt: number;
};

export type AssessmentSummary = {
  score: number;
  risk: DamageSeverity;
  damageCount: number;
  estimatedRepairM2: number;
  averageConfidence: number;
};
