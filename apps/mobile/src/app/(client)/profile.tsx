import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { clearTokens, getStoredTokens } from "@/lib/auth";
import { colors, fonts, sizes, spacing } from "@/theme";

export default function ClientProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(
    null,
  );

  useEffect(() => {
    getStoredTokens().then(({ user: u }) => setUser(u));
  }, []);

  async function handleLogout() {
    await clearTokens();
    router.replace("/(auth)/login");
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl, paddingBottom: spacing.xxxl }}
    >
      <View style={{ paddingTop: 64 }}>
        <Text style={styles.eyebrow}>ACCOUNT</Text>
        <Text style={styles.headline}>
          You and <Text style={styles.headlineEm}>your address.</Text>
        </Text>
      </View>

      <View style={{ gap: spacing.lg }}>
        <Field
          label="Name"
          value={user ? `${user.firstName} ${user.lastName}` : "—"}
        />
        <Field label="Email" value={user?.email ?? "—"} />
        <Field label="Address" value="On file" />
        <Field label="Card on file" value="•••• 4242" />
      </View>

      <Pressable style={styles.signOut} onPress={handleLogout}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
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
  field: {
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: spacing.xs,
  },
  fieldLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: sizes.label,
    color: colors.taupe[300],
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  fieldValue: {
    fontFamily: fonts.displayMedium,
    fontSize: sizes.bodyLg,
    color: colors.primaryFg,
  },
  signOut: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  signOutText: {
    fontFamily: fonts.bodyMedium,
    fontSize: sizes.label,
    color: colors.secondaryFg,
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
});
