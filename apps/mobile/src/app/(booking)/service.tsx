import { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SERVICE_CATEGORIES, type ServiceCategorySlug } from "@arc/shared";
import { colors, fonts, sizes, spacing } from "@/theme";
import { useBookingStore } from "@/stores/booking";

// TODO: Replace with API-driven pricing once provider service catalog is wired.
const STUB_PRICES: Record<ServiceCategorySlug, string> = {
  hair: "$240",
  nails: "$120",
  face: "$180",
  lash: "$150",
  barber: "$95",
  makeup: "$220",
};

export default function BookingServiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ slug?: string }>();
  const setService = useBookingStore((s) => s.setService);

  const initialSlug = (() => {
    const candidate = SERVICE_CATEGORIES.find((c) => c.slug === params.slug);
    return candidate ? candidate.slug : null;
  })();

  const [selected, setSelected] = useState<ServiceCategorySlug | null>(initialSlug);

  function handleContinue() {
    if (!selected) return;
    const cat = SERVICE_CATEGORIES.find((c) => c.slug === selected);
    if (!cat) return;
    setService(cat.slug, cat.label, STUB_PRICES[cat.slug]);
    router.push("/(booking)/window");
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>STEP 01 / 04 · CHOOSE</Text>
          <Text style={styles.headline}>
            What <Text style={styles.headlineEm}>nothing</Text> are we doing?
          </Text>
        </View>

        <View style={styles.tiles}>
          {SERVICE_CATEGORIES.map((cat) => {
            const isSelected = selected === cat.slug;
            return (
              <Pressable
                key={cat.slug}
                style={[styles.tile, isSelected && styles.tileSelected]}
                onPress={() => setSelected(cat.slug)}
              >
                <Text
                  style={[styles.tileNumber, isSelected && styles.tileNumberSelected]}
                >
                  {cat.numberLabel}
                </Text>
                <Text style={[styles.tileLabel, isSelected && styles.tileLabelSelected]}>
                  {cat.label}
                </Text>
                <Text style={[styles.tilePrice, isSelected && styles.tilePriceSelected]}>
                  from {STUB_PRICES[cat.slug]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.cta, !selected && styles.ctaDisabled]}
          onPress={handleContinue}
          disabled={!selected}
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
  tiles: { gap: spacing.sm },
  tile: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  tileSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  tileNumber: {
    fontFamily: fonts.bodyMedium,
    fontSize: sizes.label,
    color: colors.taupe[300],
    letterSpacing: 2.4,
    width: 56,
  },
  tileNumberSelected: { color: colors.smoke[900] },
  tileLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: sizes.subheading,
    color: colors.primaryFg,
    flex: 1,
  },
  tileLabelSelected: { color: colors.smoke[900] },
  tilePrice: {
    fontFamily: fonts.mono,
    fontSize: sizes.mono,
    color: colors.taupe[300],
    letterSpacing: 1.2,
  },
  tilePriceSelected: { color: colors.smoke[900] },
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
