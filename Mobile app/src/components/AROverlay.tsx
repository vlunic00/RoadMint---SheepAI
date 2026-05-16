import { Canvas, Group, Line, vec } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";

type Props = {
  isActive: boolean;
  width: number;
  height: number;
  onLayout: (event: LayoutChangeEvent) => void;
};

export function AROverlay({ height, isActive, onLayout, width }: Props) {
  const meshLines = useMemo(() => {
    const lines: Array<{ p1: ReturnType<typeof vec>; p2: ReturnType<typeof vec> }> = [];
    const vanishingPointX = width * 0.5;
    const vanishingPointY = height * 0.28;
    const horizonY = height * 0.36;

    // Horizontal lines (parallel to road)
    const horizontalSpacing = height * 0.08;
    for (let i = 0; i < 7; i++) {
      const y = horizonY + i * horizontalSpacing;
      const progress = Math.min(1, i / 6);
      const leftX = width * (0.5 - 0.35 * progress);
      const rightX = width * (0.5 + 0.35 * progress);
      
      lines.push({
        p1: vec(leftX, y),
        p2: vec(rightX, y)
      });
    }

    // Vertical/perspective lines (converging to vanishing point)
    const verticalCount = 5;
    for (let i = 0; i < verticalCount; i++) {
      const progress = (i - (verticalCount - 1) / 2) / ((verticalCount - 1) / 2);
      const startX = width * (0.5 + progress * 0.35);
      
      lines.push({
        p1: vec(startX, horizonY),
        p2: vec(vanishingPointX + (startX - vanishingPointX) * 0.3, vanishingPointY)
      });
    }

    return lines;
  }, [width, height]);

  return (
    <View onLayout={onLayout} pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Group opacity={isActive ? 0.75 : 0.35}>
          {meshLines.map((line, index) => (
            <Line
              color="rgba(16,185,129,0.6)"
              key={`mesh-${index}`}
              p1={line.p1}
              p2={line.p2}
              strokeWidth={1.5}
            />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}

