import { CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent
} from "react-native";

import { AROverlay } from "./src/components/AROverlay";
import { AssessmentPanel } from "./src/components/AssessmentPanel";
import { ControlDock } from "./src/components/ControlDock";
import { DamageFeed } from "./src/components/DamageFeed";
import { detectRoadDamage, summarizeAssessment } from "./src/services/damageDetector";
import type { DamageDetection } from "./src/types/damage";

const MAX_DETECTIONS = 24;

export default function App() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [clipUri, setClipUri] = useState<string>();
  const [detections, setDetections] = useState<DamageDetection[]>([]);
  const [scanStartedAt, setScanStartedAt] = useState<number>();
  const [overlaySize, setOverlaySize] = useState({ width: 1, height: 1 });
  const [scanAggression, setScanAggression] = useState(0.36);
  const hasCameraPermission = permission?.granted;

  const summary = useMemo(() => summarizeAssessment(detections), [detections]);
  const elapsedMs = scanStartedAt ? Date.now() - scanStartedAt : 0;
  const speedKmh = 34 + Math.sin(elapsedMs / 3100) * 7;

  useEffect(() => {
    if (!isRecording || !scanStartedAt) {
      return undefined;
    }

    const interval = setInterval(() => {
      const next = detectRoadDamage({
        elapsedMs: Date.now() - scanStartedAt,
        scanAggression,
        speedKmh
      });

      setDetections((current) => {
        const merged = [...next, ...current];
        const unique = new Map<string, DamageDetection>();
        merged.forEach((detection) => unique.set(detection.id, detection));
        return Array.from(unique.values()).slice(0, MAX_DETECTIONS);
      });
    }, 950);

    return () => clearInterval(interval);
  }, [isRecording, scanAggression, scanStartedAt, speedKmh]);

  const onOverlayLayout = (event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setOverlaySize({ height: Math.max(1, height), width: Math.max(1, width) });
  };

  const startScan = async () => {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
      return;
    }

    setClipUri(undefined);
    setDetections([]);
    setScanStartedAt(Date.now());
    setIsRecording(true);

    if (hasCameraPermission && Platform.OS !== "web") {
      try {
        const recording = await cameraRef.current?.recordAsync({
          maxDuration: 900
        });

        if (recording?.uri) {
          setClipUri(recording.uri);
        }
      } catch (error) {
        console.warn("Recording failed", error);
      } finally {
        setIsRecording(false);
      }
    }
  };

  const resetScan = () => {
    if (isRecording) {
      cameraRef.current?.stopRecording();
    }

    setIsRecording(false);
    setDetections([]);
    setClipUri(undefined);
    setScanStartedAt(undefined);
    setScanAggression(0.36);
  };

  const requestCamera = async () => {
    await requestPermission();
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.cameraLayer}>
        {hasCameraPermission ? (
          <CameraView
            active
            facing="back"
            mode="video"
            mute
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            videoStabilizationMode="auto"
          />
        ) : (
          <RoadFallback />
        )}
        <View style={styles.scanShade} />
        <AROverlay
          detections={detections}
          height={overlaySize.height}
          isActive={isRecording}
          onLayout={onOverlayLayout}
          width={overlaySize.width}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>SheepAI</Text>
            <Text style={styles.subtitle}>road surface assessment</Text>
          </View>
          <View style={[styles.liveBadge, isRecording && styles.liveBadgeActive]}>
            <View style={[styles.liveDot, isRecording && styles.liveDotActive]} />
            <Text style={styles.liveText}>{isRecording ? "REC" : "IDLE"}</Text>
          </View>
        </View>

        {!hasCameraPermission && (
          <Pressable onPress={requestCamera} style={({ pressed }) => [styles.permissionButton, pressed && styles.pressed]}>
            <Text style={styles.permissionText}>Enable camera</Text>
          </Pressable>
        )}

        <View style={styles.spacer} />

        <View style={styles.bottomStack}>
          <AssessmentPanel speedKmh={speedKmh} summary={summary} />
          <DamageFeed detections={detections} />
          <View style={styles.tuningRow}>
            {[0.2, 0.36, 0.56, 0.74].map((value) => (
              <Pressable
                accessibilityLabel={`Set sensitivity ${value}`}
                key={value}
                onPress={() => setScanAggression(value)}
                style={[styles.tuningPill, scanAggression === value && styles.tuningPillActive]}
              >
                <Text style={[styles.tuningText, scanAggression === value && styles.tuningTextActive]}>
                  {Math.round(value * 100)}
                </Text>
              </Pressable>
            ))}
          </View>
          <ControlDock clipUri={clipUri} isRecording={isRecording} onPrimaryPress={startScan} onReset={resetScan} />
        </View>
      </SafeAreaView>
    </View>
  );
}

function RoadFallback() {
  return (
    <View style={styles.fallback}>
      <View style={styles.horizon} />
      <View style={styles.road}>
        <View style={styles.centerLine} />
        <View style={[styles.centerLine, styles.centerLineSecond]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomStack: {
    gap: 10
  },
  brand: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 32
  },
  cameraLayer: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#07131a"
  },
  centerLine: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.58)",
    height: "22%",
    marginTop: "38%",
    width: 5
  },
  centerLineSecond: {
    marginTop: "18%"
  },
  fallback: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#0e7490"
  },
  horizon: {
    backgroundColor: "#7dd3fc",
    height: "42%",
    opacity: 0.62
  },
  liveBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  liveBadgeActive: {
    backgroundColor: "rgba(239,68,68,0.22)",
    borderColor: "rgba(248,113,113,0.42)"
  },
  liveDot: {
    backgroundColor: "#94a3b8",
    borderRadius: 4,
    height: 8,
    width: 8
  },
  liveDotActive: {
    backgroundColor: "#f87171"
  },
  liveText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0
  },
  permissionButton: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  permissionText: {
    color: "#07131a",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }]
  },
  road: {
    alignSelf: "center",
    backgroundColor: "#1f2937",
    borderLeftColor: "rgba(255,255,255,0.34)",
    borderLeftWidth: 2,
    borderRightColor: "rgba(255,255,255,0.34)",
    borderRightWidth: 2,
    bottom: 0,
    height: "72%",
    position: "absolute",
    transform: [{ perspective: 220 }, { rotateX: "16deg" }],
    width: "62%"
  },
  root: {
    backgroundColor: "#020617",
    flex: 1
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 8
  },
  scanShade: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "rgba(0,0,0,0.24)"
  },
  spacer: {
    flex: 1
  },
  subtitle: {
    color: "rgba(255,255,255,0.66)",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
    marginTop: 2,
    textTransform: "uppercase"
  },
  topBar: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  tuningPill: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    height: 34,
    justifyContent: "center"
  },
  tuningPillActive: {
    backgroundColor: "rgba(103,232,249,0.18)",
    borderColor: "#67e8f9"
  },
  tuningRow: {
    flexDirection: "row",
    gap: 8
  },
  tuningText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0
  },
  tuningTextActive: {
    color: "#cffafe"
  }
});
