import type {
  AssessmentSummary,
  DamageDetection,
  DamageKind,
  DamageSeverity,
  NormalizedPoint
} from "../types/damage";

type DetectorInput = {
  elapsedMs: number;
  speedKmh: number;
  scanAggression: number;
};

const kinds: DamageKind[] = ["pothole", "alligator-crack", "edge-break", "rutting"];

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const severityFromScore = (score: number): DamageSeverity => {
  if (score > 0.82) {
    return "critical";
  }

  if (score > 0.62) {
    return "high";
  }

  if (score > 0.4) {
    return "medium";
  }

  return "low";
};

const contourAround = (
  centroid: NormalizedPoint,
  radiusX: number,
  radiusY: number,
  wobble: number
): NormalizedPoint[] => {
  const points = 8;

  return Array.from({ length: points }, (_, index) => {
    const theta = (Math.PI * 2 * index) / points;
    const local = 1 + Math.sin(theta * 3 + wobble) * 0.18;

    return {
      x: clamp(centroid.x + Math.cos(theta) * radiusX * local, 0.04, 0.96),
      y: clamp(centroid.y + Math.sin(theta) * radiusY * local, 0.08, 0.96)
    };
  });
};

const makeDetection = (input: DetectorInput, index: number): DamageDetection => {
  const time = input.elapsedMs / 1000;
  const drift = Math.sin(time * 0.82 + index * 1.73);
  const pulse = Math.cos(time * 1.21 + index * 0.91);
  const severityScore = clamp(0.35 + Math.abs(drift) * 0.5 + input.scanAggression * 0.18);
  const centroid = {
    x: clamp(0.2 + index * 0.2 + drift * 0.075, 0.12, 0.88),
    y: clamp(0.45 + Math.abs(pulse) * 0.37, 0.26, 0.92)
  };
  const kind = kinds[(index + Math.floor(time / 5)) % kinds.length] ?? "pothole";
  const size = 0.035 + severityScore * 0.05;

  return {
    id: `${Math.floor(input.elapsedMs / 1400)}-${index}-${kind}`,
    kind,
    severity: severityFromScore(severityScore),
    confidence: clamp(0.56 + severityScore * 0.36 + Math.sin(time + index) * 0.04),
    depthCm: Number((2 + severityScore * 10 + index * 0.7).toFixed(1)),
    areaM2: Number((0.12 + severityScore * 0.86 + index * 0.04).toFixed(2)),
    laneOffsetM: Number(((centroid.x - 0.5) * 3.4).toFixed(1)),
    distanceM: Number((6 + (1 - centroid.y) * 32 + input.speedKmh * 0.05).toFixed(1)),
    centroid,
    contour: contourAround(centroid, size * 0.82, size * 0.58, time + index),
    capturedAt: Date.now()
  };
};

export const detectRoadDamage = (input: DetectorInput): DamageDetection[] => {
  const time = input.elapsedMs / 1000;
  const density = 1 + Math.floor((Math.sin(time * 0.48) + 1) * 1.4 + input.scanAggression * 1.3);

  return Array.from({ length: density }, (_, index) => makeDetection(input, index));
};

export const summarizeAssessment = (detections: DamageDetection[]): AssessmentSummary => {
  if (detections.length === 0) {
    return {
      score: 100,
      risk: "low",
      damageCount: 0,
      estimatedRepairM2: 0,
      averageConfidence: 0
    };
  }

  const severityWeight = detections.reduce((total, detection) => {
    const weight = {
      low: 0.12,
      medium: 0.28,
      high: 0.52,
      critical: 0.82
    }[detection.severity];

    return total + weight * detection.confidence;
  }, 0);

  const repairArea = detections.reduce((total, detection) => total + detection.areaM2, 0);
  const averageConfidence =
    detections.reduce((total, detection) => total + detection.confidence, 0) / detections.length;
  const riskScore = clamp(severityWeight / Math.max(detections.length, 1) + repairArea / 14);

  return {
    score: Math.round(100 - riskScore * 72),
    risk: severityFromScore(riskScore),
    damageCount: detections.length,
    estimatedRepairM2: Number(repairArea.toFixed(1)),
    averageConfidence: Number(averageConfidence.toFixed(2))
  };
};
