import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { ViroARSceneNavigator } from "@reactvision/react-viro";

import { ViroTerrainScene } from "./src/components/ViroTerrainScene";
import type { ARMeshStatus } from "./src/types/ar";

export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [clipUri, setClipUri] = useState<string>();
  const [scanStartedAt, setScanStartedAt] = useState<number>();
  const [meshStatus, setMeshStatus] = useState<ARMeshStatus>({
    confidence: 0,
    isGrounded: false,
    planeCount: 0,
    status: "idle"
  });
  const recordingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startScan = async () => {
    if (isScanning) {
      setIsScanning(false);
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      return;
    }

    setClipUri(undefined);
    setScanStartedAt(Date.now());
    setIsScanning(true);
    setIsRecording(true);

    recordingTimerRef.current = setTimeout(() => {
      setClipUri(`mock-viro-ar-scan-${Date.now()}.mp4`);
      setIsRecording(false);
    }, 900);
  };

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isScanning) {
      return;
    }

    setMeshStatus((current) => ({
      ...current,
      confidence: 0,
      isGrounded: false,
      status: "idle"
    }));
  }, [isScanning]);

  const resetScan = () => {
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    setIsScanning(false);
    setIsRecording(false);
    setClipUri(undefined);
    setScanStartedAt(undefined);
  };

  const arScene = Platform.OS === "web" ? (
    <RoadFallback />
  ) : (
    <ViroARSceneNavigator
      autofocus
      depthEnabled
      initialScene={{
        scene: ViroTerrainScene as () => React.JSX.Element
      }}
      provider="none"
      viroAppProps={{
        isScanning,
        onMeshStatusChange: setMeshStatus
      }}
      worldAlignment="Gravity"
    />
  );

  useEffect(() => {
    if (!isScanning) {
      return;
    }

    const interval = setInterval(() => {
      if (scanStartedAt && Date.now() - scanStartedAt > 900) {
        setIsRecording(false);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isScanning, scanStartedAt]);

  const confidence = Math.round(meshStatus.confidence * 100);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.cameraLayer}>
        {arScene}
        <View style={styles.scanShade} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Text style={styles.brand}>SheepAI Terrain Mesh</Text>
          <View style={[styles.liveBadge, isScanning && styles.liveBadgeActive]}>
            <View style={[styles.liveDot, isScanning && styles.liveDotActive]} />
            <Text style={styles.liveText}>{isRecording ? "REC" : isScanning ? "SCAN" : "IDLE"}</Text>
          </View>
        </View>

        {isScanning && (
          <View style={styles.meshStatus}>
            <View style={[styles.meshStatusDot, meshStatus.isGrounded && styles.meshStatusDotLocked]} />
            <Text style={styles.meshStatusText}>
              {meshStatus.status.toUpperCase()} {confidence}% · {meshStatus.planeCount} planes
            </Text>
          </View>
        )}

        <View style={styles.spacer} />

        <View style={styles.controls}>
          <Pressable
            accessibilityLabel={isScanning ? "Stop scan" : "Start scan"}
            onPress={startScan}
            style={({ pressed }) => [
              styles.primaryButton,
              isScanning && styles.stopButton,
              pressed && styles.pressed
            ]}
          >
            <Text style={[styles.primaryText, !isScanning && styles.primaryTextDark]}>
              {isScanning ? "Stop" : "Scan"}
            </Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Reset"
            onPress={resetScan}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.secondaryText}>Reset</Text>
          </Pressable>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000"
  },
  cameraLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden"
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between"
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  brand: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "600"
  },
  liveBadge: {
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 20,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  liveBadgeActive: {
    backgroundColor: "#7f1d1d"
  },
  liveDot: {
    backgroundColor: "#64748b",
    borderRadius: 4,
    height: 8,
    width: 8
  },
  liveDotActive: {
    backgroundColor: "#ff3b30"
  },
  liveText: {
    color: "#e2e8f0",
    fontSize: 12,
    fontWeight: "500"
  },
  permissionButton: {
    alignSelf: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    marginVertical: 16,
    paddingHorizontal: 24,
    paddingVertical: 12
  },
  permissionText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600"
  },
  pressed: {
    opacity: 0.7
  },
  spacer: {
    flex: 1
  },
  controls: {
    alignItems: "center",
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 16
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#10b981",
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 20,
    width: "100%"
  },
  stopButton: {
    backgroundColor: "#ef4444"
  },
  primaryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600"
  },
  primaryTextDark: {
    color: "#031018"
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#4b5563",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%"
  },
  secondaryText: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "500"
  },
  scanShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    pointerEvents: "none"
  },
  meshStatus: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(3, 9, 14, 0.76)",
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  meshStatusDot: {
    backgroundColor: "#fbbf24",
    borderRadius: 4,
    height: 8,
    width: 8
  },
  meshStatusDotLocked: {
    backgroundColor: "#12ffbe"
  },
  meshStatusText: {
    color: "#e2e8f0",
    fontSize: 12,
    fontWeight: "800"
  },
  fallback: {
    backgroundColor: "#334155",
    flex: 1,
    justifyContent: "center"
  },
  horizon: {
    backgroundColor: "#64748b",
    flex: 0.5
  },
  road: {
    alignItems: "center",
    flex: 0.5,
    justifyContent: "center"
  },
  centerLine: {
    backgroundColor: "#fbbf24",
    height: 3,
    width: "100%"
  }
});
