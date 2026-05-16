import { Canvas, Circle, Group, Line, Path, Skia, vec } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";

import type { GroundPlaneDetection } from "../types/terrain";

type Props = {
  groundPlane: GroundPlaneDetection;
  isActive: boolean;
  width: number;
  height: number;
  onLayout: (event: LayoutChangeEvent) => void;
};

export function AROverlay({ groundPlane, height, isActive, onLayout, width }: Props) {
  const meshLines = useMemo(
    () =>
      groundPlane.mesh.map((line) => ({
        ...line,
        p1: vec(line.p1.x * width, line.p1.y * height),
        p2: vec(line.p2.x * width, line.p2.y * height)
      })),
    [groundPlane.mesh, height, width]
  );

  const anchorPoints = useMemo(
    () => groundPlane.anchors.map((anchor) => vec(anchor.x * width, anchor.y * height)),
    [groundPlane.anchors, height, width]
  );

  const planePath = useMemo(() => {
    const path = Skia.Path.Make();
    const first = anchorPoints[0];

    if (!first) {
      return path;
    }

    path.moveTo(first.x, first.y);
    anchorPoints.slice(1).forEach((point) => path.lineTo(point.x, point.y));
    path.close();

    return path;
  }, [anchorPoints]);

  const confidence = Math.round(groundPlane.confidence * 100);
  const meshOpacity = isActive ? 1 : 0.4;

  return (
    <View onLayout={onLayout} pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Group opacity={meshOpacity}>
          <Path color="rgba(12, 245, 180, 0.12)" path={planePath} style="fill" />
          {meshLines.map((line, index) => (
            <Line
              color={`rgba(18, 255, 190, ${line.opacity.toFixed(3)})`}
              key={`mesh-${index}`}
              p1={line.p1}
              p2={line.p2}
              strokeWidth={line.strokeWidth}
            />
          ))}
          {anchorPoints.map((point, index) => (
            <Circle color="rgba(125, 211, 252, 0.9)" cx={point.x} cy={point.y} key={`anchor-${index}`} r={3.5} />
          ))}
        </Group>
      </Canvas>
      {isActive && (
        <View style={styles.statusPill}>
          <View style={[styles.statusDot, groundPlane.isGrounded && styles.statusDotLocked]} />
          <Text style={styles.statusText}>{groundPlane.status.toUpperCase()} {confidence}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statusDot: {
    backgroundColor: "#fbbf24",
    borderRadius: 4,
    height: 8,
    width: 8
  },
  statusDotLocked: {
    backgroundColor: "#12ffbe"
  },
  statusPill: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(3, 9, 14, 0.76)",
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginTop: 86,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  statusText: {
    color: "#e2e8f0",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0
  }
});
