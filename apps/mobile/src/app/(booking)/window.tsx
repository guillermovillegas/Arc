import { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors, fonts, sizes, spacing } from "@/theme";
import { useBookingStore } from "@/stores/booking";

type SlotState = "open" | "taken";

type DayBlock = {
  day: string;
  date: string;
  slots: { time: string; state: SlotState }[];
};

// TODO: Wire to GET /providers/:id/availability once mobile booking is API-backed.
const STUB_DAYS: DayBlock[] = [
  {
    day: "Tomorrow",
    date: "Apr 29",
    slots: [
      { time: "10:00", state: "open" },
      { time: "11:30", state: "taken" },
      { time: "13:00", state: "open" },
      { time: "15:30", state: "open" },
      { time: "17:00", state: "taken" },
    ],
  },
  {
    day: "Thursday",
    date: "Apr 30",
    slots: [
      { time: "09:30", state: "open" },
      { time: "11:00", state: "open" },
      { time: "13:30", state: "open" },
      { time: "16:00", state: "taken" },
      { time: "18:30", state: "open" },
    ],
  },
  {
    day: "Friday",
    date: "May 01",
    slots: [
      { time: "10:30", state: "taken" },
      { time: "12:00", state: "open" },
      { time: "14:30", state: "open" },
      { time: "16:30", state: "open" },
      { time: "19:00", state: "open" },
    ],
  },
];

export default function BookingWindowScreen() {
  const router = useRouter();
  const setWindow = useBookingStore((s) => s.setWindow);
  const [picked, setPicked] = useState<{ day: string; time: string } | null>(null);

  function handleContinue() {
    if (!picked) return;
    setWindow(picked.day, picked.time);
    router.push("/(booking)/confirm");
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>STEP 02 / 04 · WHEN</Text>
          <Text style={styles.headline}>
            When does <Text style={styles.headlineEm}>she arrive?</Text>
          </Text>
        </View>

        <View style={styles.days}>
          {STUB_DAYS.map((block) => (
            <View key={block.day} style={styles.dayBlock}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>{block.day}</Text>
                <Text style={styles.dayDate}>{block.date}</Text>
              </View>
              <View style={styles.pills}>
                {block.slots.map((slot) => {
                  const isPicked =
                    picked?.day === block.day && picked.time === slot.time;
                  const isTaken = slot.state === "taken";
                  return (
                    <Pressable
                      key={`${block.day}-${slot.time}`}
                      style={[
                        styles.pill,
                        isTaken && styles.pillTaken,
                        isPicked && styles.pillSelected,
                      ]}
                      disabled={isTaken}
                      onPress={() => setPicked({ day: block.day, time: slot.time })}
                    >
                      <Text
                        style={[
                          styles.pillLabel,
                          isTaken && styles.pillLabelTaken,
                          isPicked && styles.pillLabelSelected,
                        ]}
                      >
                        {slot.time}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.cta, !picked && styles.ctaDisabled]}
          onPress={handleContinue}
          disabled={!picked}
        >
          <Text style={styles.ctaLabel}>CONTINUE →</Text>
        </Pressable>
      </View>
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
    fontSize: 40,
    color: colors.primaryFg,
    letterSpacing: -1.2,
    lineHeight: 44,
  },
  headlineEm: {
    fontFamily: fonts.editorialLight,
    color: colors.accent,
    fontStyle: "italic",
  },
  days: { gap: spacing.lg },
  dayBlock: { gap: spacing.sm },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  dayName: {
    fontFamily: fonts.displayMedium,
    fontSize: sizes.subheading,
    color: colors.primaryFg,
  },
  dayDate: {
    fontFamily: fonts.mono,
    fontSize: sizes.mono,
    color: colors.taupe[300],
    letterSpacing: 1.6,
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  pill: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
  },
  pillTaken: {
    backgroundColor: "transparent",
    borderColor: colors.smoke[700],
    opacity: 0.4,
  },
  pillSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pillLabel: {
    fontFamily: fonts.mono,
    fontSize: sizes.mono,
    color: colors.primaryFg,
    letterSpacing: 1.6,
  },
  pillLabelTaken: {
    color: colors.taupe[300],
    textDecorationLine: "line-through",
  },
  pillLabelSelected: { color: colors.smoke[900] },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  cta: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  ctaDisabled: { opacity: 0.35 },
  ctaLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: sizes.bodySm,
    color: colors.smoke[900],
    letterSpacing: 3,
  },
});
