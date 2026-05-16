import { AlertTriangle, Gauge, MapPinned, ShieldCheck } from "lucide-react-native";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import type { AssessmentSummary } from "../types/damage";

type Props = {
  summary: AssessmentSummary;
  speedKmh: number;
};

const riskTone = {
  critical: "#ff453a",
  high: "#ff9f0a",
  medium: "#ffd60a",
  low: "#32d74b"
};

export function AssessmentPanel({ speedKmh, summary }: Props) {
  const tone = riskTone[summary.risk];

  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>Road score</Text>
          <Text style={styles.score}>{summary.score}</Text>
        </View>
        <View style={[styles.riskBadge, { borderColor: tone }]}>
          <AlertTriangle color={tone} size={18} strokeWidth={2.2} />
          <Text style={[styles.riskText, { color: tone }]}>{summary.risk.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.metricGrid}>
        <Metric icon={<ShieldCheck color="#d9f99d" size={18} />} label="confidence" value={`${Math.round(summary.averageConfidence * 100)}%`} />
        <Metric icon={<MapPinned color="#bae6fd" size={18} />} label="repair area" value={`${summary.estimatedRepairM2} m2`} />
        <Metric icon={<Gauge color="#fecdd3" size={18} />} label="speed" value={`${Math.round(speedKmh)} km/h`} />
      </View>
    </View>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <View style={styles.metric}>
      {icon}
      <View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  metric: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minWidth: 96
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 16
  },
  metricLabel: {
    color: "rgba(255,255,255,0.54)",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0
  },
  metricValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0
  },
  panel: {
    backgroundColor: "rgba(4,12,18,0.76)",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16
  },
  riskBadge: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  riskText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0
  },
  score: {
    color: "#ffffff",
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 52
  }
});
