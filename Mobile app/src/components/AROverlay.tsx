import { useMemo } from "react";
import { StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import Svg, { Circle, Line, Polygon } from "react-native-svg";

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
        p1: { x: line.p1.x * width, y: line.p1.y * height },
        p2: { x: line.p2.x * width, y: line.p2.y * height }
      })),
    [groundPlane.mesh, height, width]
  );

  const anchorPoints = useMemo(
    () => groundPlane.anchors.map((anchor) => ({ x: anchor.x * width, y: anchor.y * height })),
    [groundPlane.anchors, height, width]
  );

  const planePoints = anchorPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const confidence = Math.round(groundPlane.confidence * 100);
  const meshOpacity = isActive ? 1 : 0.4;

  return (
    <View onLayout={onLayout} pointerEvents="none" style={styles.overlay}>
      <Svg height="100%" style={StyleSheet.absoluteFill} viewBox={`0 0 ${width} ${height}`} width="100%">
        {isActive && (
          <Polygon
            fill="#0cf5b4"
            fillOpacity={0.16 * meshOpacity}
            points={planePoints}
            stroke="#7dd3fc"
            strokeOpacity={0.36 * meshOpacity}
            strokeWidth={1.5}
          />
        )}

        {meshLines.map((line) => (
          <Line
            key={line.id}
            opacity={Math.min(1, line.opacity * meshOpacity)}
            stroke="#12ffbe"
            strokeLinecap="round"
            strokeWidth={line.strokeWidth}
            x1={line.p1.x}
            x2={line.p2.x}
            y1={line.p1.y}
            y2={line.p2.y}
          />
        ))}

        {isActive &&
          anchorPoints.map((point, index) => (
            <Circle
              cx={point.x}
              cy={point.y}
              fill="#7dd3fc"
              fillOpacity={0.95}
              key={`anchor-${index}`}
              r={4}
            />
          ))}
      </Svg>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    elevation: 3,
    zIndex: 3
  },
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