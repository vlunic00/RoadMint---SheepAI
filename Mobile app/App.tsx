import { CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent
} from "react-native";
import { CircleStop, Play } from "lucide-react-native";

import { AROverlay } from "./src/components/AROverlay";

export default function App() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [clipUri, setClipUri] = useState<string>();
  const [overlaySize, setOverlaySize] = useState({ width: 1, height: 1 });
  const hasCameraPermission = permission?.granted;

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
    setClipUri(undefined);
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
          <View style={styles.fallback} />
        )}
        <View style={styles.scanShade} />
        <AROverlay
          isActive={isRecording}
          onLayout={onOverlayLayout}
          height={overlaySize.height}
          width={overlaySize.width}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Text style={styles.brand}>SheepAI Terrain Mesh</Text>
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

        <View style={styles.controls}>
          <Pressable
            accessibilityLabel={isRecording ? "Stop recording" : "Start recording"}
            onPress={startScan}
            style={({ pressed }) => [
              styles.primaryButton,
              isRecording && styles.stopButton,
              pressed && styles.pressed
            ]}
          >
            {isRecording ? <CircleStop color="#ffffff" size={24} /> : <Play color="#031018" fill="#031018" size={24} />}
            <Text style={[styles.primaryText, !isRecording && styles.primaryTextDark]}>
              {isRecording ? "Stop" : "Scan"}
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

