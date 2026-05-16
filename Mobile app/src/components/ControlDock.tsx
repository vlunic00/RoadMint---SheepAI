import { Camera, CircleStop, Play, RotateCcw, Video } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  isRecording: boolean;
  onPrimaryPress: () => void;
  onReset: () => void;
  clipUri?: string;
};

export function ControlDock({ clipUri, isRecording, onPrimaryPress, onReset }: Props) {
  return (
    <View style={styles.dock}>
      <Pressable
        accessibilityLabel={isRecording ? "Stop recording" : "Start recording"}
        onPress={onPrimaryPress}
        style={({ pressed }) => [
          styles.primaryButton,
          isRecording && styles.stopButton,
          pressed && styles.pressed
        ]}
      >
        {isRecording ? <CircleStop color="#ffffff" size={22} /> : <Play color="#031018" fill="#031018" size={22} />}
        <Text style={[styles.primaryText, !isRecording && styles.primaryTextDark]}>
          {isRecording ? "Stop" : "Scan"}
        </Text>
      </Pressable>

      <Pressable accessibilityLabel="Reset assessment" onPress={onReset} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <RotateCcw color="#ffffff" size={21} />
      </Pressable>

      <View style={styles.clipState}>
        {clipUri ? <Video color="#7dd3fc" size={18} /> : <Camera color="#94a3b8" size={18} />}
        <Text numberOfLines={1} style={styles.clipText}>
          {clipUri ? "clip saved" : "ready"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  clipState: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 8,
    minWidth: 0,
    paddingLeft: 4
  },
  clipText: {
    color: "rgba(255,255,255,0.72)",
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0
  },
  dock: {
    alignItems: "center",
    backgroundColor: "rgba(3,9,14,0.82)",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 10
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }]
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#67e8f9",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    height: 48,
    justifyContent: "center",
    minWidth: 120,
    paddingHorizontal: 18
  },
  primaryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0
  },
  primaryTextDark: {
    color: "#031018"
  },
  stopButton: {
    backgroundColor: "#ef4444"
  }
});
