export type ARMeshStatus = {
  confidence: number;
  isGrounded: boolean;
  planeCount: number;
  status: "idle" | "acquiring" | "locked";
};
