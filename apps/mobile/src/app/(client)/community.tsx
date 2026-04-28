import { View, Text, ScrollView, StyleSheet } from "react-native";
import { colors, fonts, sizes, spacing } from "@/theme";

interface PullQuote {
  quote: string;
  attribution: string;
}

const QUOTES: PullQuote[] = [
  {
    quote: "I haven't left my apartment for a haircut in seven months. I don't intend to.",
    attribution: "Maeve, Logan Square",
  },
  {
    quote: "It used to be an errand. Now it's the part of the week I look forward to.",
    attribution: "Jules, West Loop",
  },
  {
    quote: "The provider arrived three minutes early and asked if she could take her shoes off. We have been friends since.",
    attribution: "Theo, Lincoln Park",
  },
];

export default function CommunityScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl, paddingBottom: spacing.xxxl }}
    >
      <View style={{ paddingTop: 64 }}>
        <Text style={styles.eyebrow}>COMMUNITY</Text>
        <Text style={styles.headline}>
          What others <Text style={styles.headlineEm}>say.</Text>
        </Text>
      </View>

      <View style={{ gap: spacing.xl }}>
        {QUOTES.map((q, i) => (
          <View key={i} style={styles.quoteBlock}>
            <Text style={styles.quoteMark}>&ldquo;</Text>
            <Text style={styles.quoteText}>{q.quote}</Text>
            <Text style={styles.attribution}>— {q.attribution}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: fonts.bodyMedium,
    fontSize: sizes.label,
    color: colors.taupe[300],
    letterSpacing: 3.5,
    textTransform: "uppercase",
    marginBottom: spacing.md,
  },
  headline: {
    fontFamily: fonts.displayBlack,
    fontSize: 40,
    color: colors.primaryFg,
    letterSpacing: -1.2,
    lineHeight: 40,
  },
  headlineEm: {
    fontFamily: fonts.editorialLight,
    color: colors.accent,
    fontStyle: "italic",
  },
  quoteBlock: {
    paddingLeft: spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: colors.accent,
  },
  quoteMark: {
    fontFamily: fonts.editorialLight,
    fontSize: 56,
    color: colors.accent,
    lineHeight: 56,
    height: 32,
  },
  quoteText: {
    fontFamily: fonts.editorialLight,
    fontSize: sizes.heading,
    color: colors.primaryFg,
    lineHeight: 34,
    fontStyle: "italic",
    marginTop: spacing.sm,
  },
  attribution: {
    fontFamily: fonts.bodyMedium,
    fontSize: sizes.label,
    color: colors.taupe[300],
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginTop: spacing.md,
  },
});
