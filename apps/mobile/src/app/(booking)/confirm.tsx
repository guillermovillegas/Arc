import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors, fonts, sizes, spacing } from "@/theme";
import { useBookingStore } from "@/stores/booking";

// TODO: Replace with provider profile + saved address once the booking flow is API-backed.
const STUB_PRACTITIONER = "Mireille L.";
const STUB_ADDRESS = "Your place · West Loop, Chicago";

export default function BookingConfirmScreen() {
  const router = useRouter();
  const { serviceLabel, servicePrice, day, time } = useBookingStore();

  const headlineTime = time ?? "—:—";
  const displayService = serviceLabel ?? "Hour of nothing";
  const displayPrice = servicePrice ?? "$0";
  const displayDay = day ?? "Tomorrow";

  function handleReserve() {
    router.push("/(booking)/success");
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>STEP 03 / 04 · CONFIRM</Text>
          <Text style={styles.headline}>
            Open <Text style={styles.headlineEm}>the door</Text> at {headlineTime}.
          </Text>
        </View>

        <View style={styles.summary}>
          <Row label="SERVICE" value={displayService} />
          <Row label="PRACTITIONER" value={STUB_PRACTITIONER} />
          <Row label="WHEN" value={`${displayDay} · ${headlineTime}`} />
          <Row label="ADDRESS" value={STUB_ADDRESS} />
          <Row label="PRICE" value={displayPrice} mono />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.cta} onPress={handleReserve}>
          <Text style={styles.ctaLabel}>RESERVE · {displayPrice}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, mono && styles.rowValueMono]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: 72,
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },
  header: { gap: spacing.md },
  eyebrow: {
    fontFamily: fonts.bodyMedium,
    fontSize: sizes.label,
    color: colors.taupe[300],
    letterSpacing: 3.5,
    textTransform: "uppercase",
  },
  headline: {
    fontFamily: fonts.displayBlack,
    fontSize: 36,
    color: colors.primaryFg,
    letterSpacing: -1.2,
    lineHeight: 40,
  },
  headlineEm: {
    fontFamily: fonts.editorialLight,
    color: colors.accent,
    fontStyle: "italic",
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.xs,
  },
  rowLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: sizes.label,
    color: colors.taupe[300],
    letterSpacing: 2.4,
  },
  rowValue: {
    fontFamily: fonts.displayMedium,
    fontSize: sizes.subheading,
    color: colors.primaryFg,
  },
  rowValueMono: {
    fontFamily: fonts.mono,
    letterSpacing: 1.6,
    color: colors.accent,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  cta: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md + 2,
    alignItems: "center",
  },
  ctaLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: sizes.body,
    color: colors.smoke[900],
    letterSpacing: 2.4,
  },
});
