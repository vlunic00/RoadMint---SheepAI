import { CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CircleStop, Play } from "lucide-react-native";

const API_URL = "http://172.20.10.2:3001";

export default function App() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const hasCameraPermission = permission?.granted;

  const requestCamera = async () => {
    await requestPermission();
  };

  const startScan = async () => {
    try {
      if (!cameraRef.current) {
        console.log("Camera not ready yet");
        return;
      }

      setIsScanning((prev) => !prev);

      console.log("Scan toggled:", !isScanning);
    } catch (err) {
      console.log("Scan error:", err);
    }
  };

  const reportPothole = async () => {
    try {
      setLoading(true);
  
      // 1. ask permission
      const { status } =
        await Location.requestForegroundPermissionsAsync();
  
      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }
  
      // 2. get real GPS
      const location = await Location.getCurrentPositionAsync({});
  
      const { latitude, longitude } = location.coords;
  
      // 3. send to backend
      const res = await fetch(`${API_URL}/potholes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude,
          longitude,
        }),
      });
  
      const data = await res.json();
  
      // 4. feedback based on merge result
      if (data.merged) {
        console.log("Merged with nearby pothole 👍", data.pothole);
      } else {
        console.log("New pothole created 🚧", data.pothole);
      }
    } catch (err) {
      console.log("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={styles.cameraLayer}>
        {hasCameraPermission ? (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
          />
        ) : (
          <View style={styles.fallback}>
            <Text style={{ color: "white" }}>No camera permission</Text>
          </View>
        )}
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Text style={styles.brand}>Pothole AI</Text>
        </View>

        {!hasCameraPermission && (
          <Pressable
            onPress={requestCamera}
            style={styles.permissionButton}
          >
            <Text style={styles.permissionText}>
              Enable Camera
            </Text>
          </Pressable>
        )}

        <View style={styles.spacer} />

        <View style={styles.controls}>
          <Pressable
            onPress={startScan}
            style={styles.primaryButton}
          >
            {isScanning ? (
              <CircleStop color="white" size={24} />
            ) : (
              <Play color="white" size={24} />
            )}

            <Text style={styles.primaryText}>
              {isScanning ? "Stop Scan" : "Start Scan"}
            </Text>
          </Pressable>

          <Pressable
            onPress={reportPothole}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryText}>
              Report Pothole
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  cameraLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  topBar: {
    padding: 16,
  },
  brand: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  spacer: {
    flex: 1,
  },
  controls: {
    padding: 16,
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#374151",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryText: {
    color: "#fff",
  },
  permissionButton: {
    backgroundColor: "#3b82f6",
    margin: 16,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  permissionText: {
    color: "#fff",
    fontWeight: "600",
  },
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
});