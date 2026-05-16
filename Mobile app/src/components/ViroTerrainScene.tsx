import { useEffect, useMemo, useState } from "react";
import {
  ViroAmbientLight,
  ViroARPlane,
  ViroARScene,
  ViroMaterials,
  ViroPolygon,
  ViroPolyline,
  ViroQuad,
  ViroTrackingStateConstants,
  type ViroAnchor,
  type ViroTrackingReason,
  type ViroTrackingState
} from "@reactvision/react-viro";

import type { ARMeshStatus } from "../types/ar";

type TerrainSceneProps = {
  sceneNavigator?: {
    viroAppProps?: {
      isScanning?: boolean;
      onMeshStatusChange?: (status: ARMeshStatus) => void;
    };
  };
};

type PlaneAnchor = ViroAnchor & {
  height?: number;
  width?: number;
};

type MeshLine = {
  id: string;
  points: [[number, number, number], [number, number, number]];
};

const lockPlaneAreaM2 = 0.55;

const isHorizontalFloor = (anchor: ViroAnchor) =>
  anchor.type === "plane" &&
  (anchor.alignment === "Horizontal" || anchor.alignment === "HorizontalUpward" || anchor.classification === "Floor");

const planeArea = (plane: PlaneAnchor) => (plane.width ?? 0) * (plane.height ?? 0);

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const buildGridLines = (width: number, height: number): MeshLine[] => {
  const lines: MeshLine[] = [];
  const step = 0.25;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const columns = Math.max(2, Math.floor(width / step));
  const rows = Math.max(2, Math.floor(height / step));

  for (let index = 0; index <= columns; index += 1) {
    const x = -halfWidth + (width * index) / columns;

    lines.push({
      id: `x-${index}`,
      points: [
        [x, -halfHeight, 0],
        [x, halfHeight, 0]
      ]
    });
  }

  for (let index = 0; index <= rows; index += 1) {
    const y = -halfHeight + (height * index) / rows;

    lines.push({
      id: `z-${index}`,
      points: [
        [-halfWidth, y, 0],
        [halfWidth, y, 0]
      ]
    });
  }

  return lines;
};

ViroMaterials.createMaterials({
  sheepAiFloorFill: {
    blendMode: "Alpha",
    cullMode: "None",
    diffuseColor: "rgba(12, 245, 180, 0.16)",
    lightingModel: "Constant",
    writesToDepthBuffer: false
  },
  sheepAiFloorMesh: {
    blendMode: "Alpha",
    cullMode: "None",
    diffuseColor: "rgba(18, 255, 190, 0.94)",
    lightingModel: "Constant",
    writesToDepthBuffer: false
  },
  sheepAiPlaneCandidate: {
    blendMode: "Alpha",
    cullMode: "None",
    diffuseColor: "rgba(125, 211, 252, 0.24)",
    lightingModel: "Constant",
    writesToDepthBuffer: false
  }
});

export function ViroTerrainScene({ sceneNavigator }: TerrainSceneProps) {
  const isScanning = sceneNavigator?.viroAppProps?.isScanning ?? false;
  const onMeshStatusChange = sceneNavigator?.viroAppProps?.onMeshStatusChange;
  const [planes, setPlanes] = useState<Record<string, PlaneAnchor>>({});
  const [trackingNormal, setTrackingNormal] = useState(false);

  const horizontalPlanes = useMemo(
    () => Object.values(planes).filter(isHorizontalFloor),
    [planes]
  );

  const selectedPlane = useMemo(
    () => horizontalPlanes.reduce<PlaneAnchor | undefined>(
      (largest, plane) => (!largest || planeArea(plane) > planeArea(largest) ? plane : largest),
      undefined
    ),
    [horizontalPlanes]
  );

  useEffect(() => {
    if (!isScanning) {
      onMeshStatusChange?.({
        confidence: 0,
        isGrounded: false,
        planeCount: horizontalPlanes.length,
        status: "idle"
      });
      return;
    }

    const largestArea = selectedPlane ? planeArea(selectedPlane) : 0;
    const confidence = clamp(largestArea / lockPlaneAreaM2);
    const isGrounded = trackingNormal && confidence >= 0.9;

    onMeshStatusChange?.({
      confidence,
      isGrounded,
      planeCount: horizontalPlanes.length,
      status: isGrounded ? "locked" : "acquiring"
    });
  }, [horizontalPlanes.length, isScanning, onMeshStatusChange, selectedPlane, trackingNormal]);

  const upsertPlane = (anchor: ViroAnchor) => {
    if (!isHorizontalFloor(anchor)) {
      return;
    }

    setPlanes((current) => ({
      ...current,
      [anchor.anchorId]: anchor
    }));
  };

  const removePlane = (anchor?: ViroAnchor) => {
    if (!anchor?.anchorId) {
      return;
    }

    setPlanes((current) => {
      const next = { ...current };
      delete next[anchor.anchorId];
      return next;
    });
  };

  const onTrackingUpdated = (state: ViroTrackingState, _reason: ViroTrackingReason) => {
    setTrackingNormal(state === ViroTrackingStateConstants.TRACKING_NORMAL);
  };

  return (
    <ViroARScene
      anchorDetectionTypes={["PlanesHorizontal"]}
      onAnchorFound={upsertPlane}
      onAnchorRemoved={removePlane}
      onAnchorUpdated={upsertPlane}
      onTrackingUpdated={onTrackingUpdated}
    >
      <ViroAmbientLight color="#ffffff" intensity={250} />
      {isScanning && horizontalPlanes.map((plane) => (
        <DetectedFloorPlane isSelected={plane.anchorId === selectedPlane?.anchorId} key={plane.anchorId} plane={plane} />
      ))}
    </ViroARScene>
  );
}

function DetectedFloorPlane({ isSelected, plane }: { isSelected: boolean; plane: PlaneAnchor }) {
  const width = Math.max(plane.width ?? 0.5, 0.25);
  const height = Math.max(plane.height ?? 0.5, 0.25);
  const gridLines = useMemo(() => buildGridLines(width, height), [height, width]);
  const vertices = plane.vertices && plane.vertices.length >= 3
    ? plane.vertices.map(([x, _y, z]) => [x, z] as [number, number])
    : undefined;

  return (
    <ViroARPlane anchorId={plane.anchorId} minHeight={0.15} minWidth={0.15}>
      {vertices ? (
        <ViroPolygon
          holes={[]}
          materials={[isSelected ? "sheepAiFloorFill" : "sheepAiPlaneCandidate"]}
          opacity={isSelected ? 1 : 0.45}
          rotation={[-90, 0, 0]}
          vertices={vertices}
        />
      ) : (
        <ViroQuad
          height={height}
          materials={[isSelected ? "sheepAiFloorFill" : "sheepAiPlaneCandidate"]}
          opacity={isSelected ? 1 : 0.45}
          rotation={[-90, 0, 0]}
          width={width}
        />
      )}

      {isSelected && gridLines.map((line) => (
        <ViroPolyline
          key={line.id}
          materials={["sheepAiFloorMesh"]}
          opacity={0.95}
          points={line.points}
          rotation={[-90, 0, 0]}
          thickness={0.01}
        />
      ))}
    </ViroARPlane>
  );
}
