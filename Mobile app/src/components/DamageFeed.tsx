import { ScrollView, StyleSheet, Text, View } from "react-native";

import type { DamageDetection, DamageSeverity } from "../types/damage";

type Props = {
  detections: DamageDetection[];
};

const severityColor = (severity: DamageSeverity) => {
  switch (severity) {
    case "critical":
      return "#ff453a";
    case "high":
      return "#ff9f0a";
    case "medium":
      return "#ffd60a";
    case "low":
      return "#32d74b";
  }
};

export function DamageFeed({ detections }: Props) {
  return (
    <View style={styles.feed}>
      <View style={styles.header}>
        <Text style={styles.title}>Damage feed</Text>
        <Text style={styles.count}>{detections.length}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {detections.slice(0, 8).map((detection) => (
          <FeedRow detection={detection} key={detection.id} />
        ))}
      </ScrollView>
    </View>
  );
}

function FeedRow({ detection }: { detection: DamageDetection }) {
  const tone = severityColor(detection.severity);

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: tone }]} />
      <View style={styles.rowText}>
        <Text numberOfLines={1} style={styles.kind}>
          {detection.kind.replace("-", " ")}
        </Text>
        <Text numberOfLines={1} style={styles.detail}>
          {detection.depthCm} cm depth · {detection.distanceM} m ahead · {Math.round(detection.confidence * 100)}%
        </Text>
      </View>
      <Text style={[styles.severity, { color: tone }]}>{detection.severity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  count: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0
  },
  detail: {
    color: "rgba(255,255,255,0.54)",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0
  },
  dot: {
    borderRadius: 5,
    height: 10,
    marginTop: 3,
    width: 10
  },
  feed: {
    backgroundColor: "rgba(4,12,18,0.76)",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 8,
    borderWidth: 1,
    height: 190,
    padding: 12
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },
  kind: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "capitalize"
  },
  row: {
    alignItems: "flex-start",
    borderTopColor: "rgba(255,255,255,0.08)",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 9,
    minHeight: 48,
    paddingVertical: 9
  },
  rowText: {
    flex: 1,
    minWidth: 0
  },
  severity: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  title: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0
  }
});
