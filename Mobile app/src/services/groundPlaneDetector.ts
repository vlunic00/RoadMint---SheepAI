import type { GroundMeshLine, GroundPlaneDetection } from "../types/terrain";

type DetectorInput = {
  elapsedMs: number;
  isScanning: boolean;
};

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const groundLockThreshold = 0.58 * 0.9;

const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;

const easeOut = (value: number) => 1 - Math.pow(1 - clamp(value), 3);

const planeXAt = (side: "left" | "right", yProgress: number, sway: number) => {
  const top = side === "left" ? 0.42 : 0.58;
  const bottom = side === "left" ? -0.12 : 1.12;
  const perspective = Math.pow(clamp(yProgress), 0.72);

  return lerp(top, bottom, perspective) + sway * (side === "left" ? 0.7 : -0.7);
};

export const detectGroundPlane = ({ elapsedMs, isScanning }: DetectorInput): GroundPlaneDetection => {
  const time = elapsedMs / 1000;
  const lockProgress = isScanning ? easeOut(time / 2.2) : 0;
  const settle = isScanning ? Math.sin(time * 1.8) * 0.012 * (1 - lockProgress * 0.65) : 0;
  const sway = isScanning ? Math.sin(time * 0.85) * 0.018 : 0;
  const confidence = isScanning ? clamp(0.18 + lockProgress * 0.78 + Math.sin(time * 2.1) * 0.025) : 0;
  const meshConfidence = isScanning ? Math.max(confidence, 0.48) : 0;
  const horizonY = clamp(0.34 + settle + Math.cos(time * 0.72) * 0.012, 0.28, 0.42);
  const isGrounded = confidence > groundLockThreshold;
  const status = !isScanning ? "idle" : isGrounded ? "locked" : "acquiring";
  const mesh: GroundMeshLine[] = [];
  const rowCount = 9;
  const columnCount = 9;

  for (let index = 0; index < rowCount; index += 1) {
    const rowProgress = index / (rowCount - 1);
    const yProgress = Math.pow(rowProgress, 1.58);
    const y = lerp(horizonY, 1.04, yProgress);
    const leftX = planeXAt("left", yProgress, sway);
    const rightX = planeXAt("right", yProgress, sway);

    mesh.push({
      id: `row-${index}`,
      p1: { x: leftX, y },
      p2: { x: rightX, y },
      opacity: lerp(0.34, 0.86, rowProgress) * meshConfidence,
      strokeWidth: lerp(1.2, 2.25, rowProgress)
    });
  }

  for (let index = 0; index < columnCount; index += 1) {
    const columnProgress = index / (columnCount - 1);
    const topX = lerp(0.46, 0.54, columnProgress) + sway * 0.35;
    const bottomX = lerp(0.02, 0.98, columnProgress) + sway;

    mesh.push({
      id: `column-${index}`,
      p1: { x: topX, y: horizonY },
      p2: { x: bottomX, y: 1.04 },
      opacity: lerp(0.4, 0.62, Math.abs(columnProgress - 0.5) * 2) * meshConfidence,
      strokeWidth: columnProgress === 0.5 ? 2.2 : 1.55
    });
  }

  return {
    anchors: [
      { x: planeXAt("left", 0, sway), y: horizonY },
      { x: planeXAt("right", 0, sway), y: horizonY },
      { x: planeXAt("right", 0.78, sway), y: 1 },
      { x: planeXAt("left", 0.78, sway), y: 1 }
    ],
    confidence,
    horizonY,
    isGrounded,
    mesh,
    status
  };
};
