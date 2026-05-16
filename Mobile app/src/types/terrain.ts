import type { NormalizedPoint } from "./damage";

export type GroundMeshLine = {
  id: string;
  p1: NormalizedPoint;
  p2: NormalizedPoint;
  opacity: number;
  strokeWidth: number;
};

export type GroundPlaneDetection = {
  anchors: NormalizedPoint[];
  confidence: number;
  horizonY: number;
  isGrounded: boolean;
  mesh: GroundMeshLine[];
  status: "idle" | "acquiring" | "locked";
};
