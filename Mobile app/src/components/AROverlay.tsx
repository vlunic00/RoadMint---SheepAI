import { Canvas, Circle, Group, Line, Path, Skia, vec } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";

import type { DamageDetection, DamageSeverity } from "../types/damage";

type Props = {
  detections: DamageDetection[];
  isActive: boolean;
  width: number;
  height: number;
  onLayout: (event: LayoutChangeEvent) => void;
};

const severityColor = (severity: DamageSeverity) => {
  switch (severity) {
    case "critical":
      return "#ff3b30";
    case "high":
      return "#ff9f0a";
    case "medium":
      return "#ffd60a";
    case "low":
      return "#30d158";
  }
};

export function AROverlay({ detections, height, isActive, onLayout, width }: Props) {
  const laneLines = useMemo(
    () => [
      { p1: vec(width * 0.5, height * 0.36), p2: vec(width * 0.28, height) },
      { p1: vec(width * 0.5, height * 0.36), p2: vec(width * 0.72, height) },
      { p1: vec(width * 0.36, height * 0.46), p2: vec(width * 0.13, height) },
      { p1: vec(width * 0.64, height * 0.46), p2: vec(width * 0.87, height) }
    ],
    [height, width]
  );

  const damagePaths = useMemo(
    () =>
      detections.map((detection) => {
        const path = Skia.Path.Make();
        const [firstPoint, ...rest] = detection.contour;

        if (firstPoint) {
          path.moveTo(firstPoint.x * width, firstPoint.y * height);
          rest.forEach((point) => path.lineTo(point.x * width, point.y * height));
          path.close();
        }

        return { detection, path };
      }),
    [detections, height, width]
  );

  return (
    <View onLayout={onLayout} pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Group opacity={isActive ? 0.82 : 0.32}>
          {laneLines.map((line, index) => (
            <Line
              color={index < 2 ? "rgba(255,255,255,0.68)" : "rgba(20,184,166,0.45)"}
              key={`lane-${index}`}
              p1={line.p1}
              p2={line.p2}
              strokeWidth={index < 2 ? 2 : 1}
            />
          ))}
          {damagePaths.map(({ detection, path }) => {
            const color = severityColor(detection.severity);
            const x = detection.centroid.x * width;
            const y = detection.centroid.y * height;
            const radius = Math.max(16, width * 0.035 + detection.depthCm * 1.2);

            return (
              <Group key={detection.id}>
                <Circle color={color} cx={x} cy={y} opacity={0.14} r={radius * 1.7} />
                <Path color={color} opacity={0.24} path={path} />
                <Path color={color} path={path} style="stroke" strokeWidth={2.5} />
                <Circle color="#ffffff" cx={x} cy={y} opacity={0.9} r={3.5} />
              </Group>
            );
          })}
        </Group>
      </Canvas>
    </View>
  );
}
