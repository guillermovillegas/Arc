import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { clearTokens, getStoredTokens } from "@/lib/auth";
import { colors, fonts, sizes, spacing } from "@/theme";

export default function ProviderProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    getStoredTokens().then(({ user: u }) => setUser(u));
  }, []);

  async function handleLogout() {
    await clearTokens();
    router.replace("/(auth)/login");
  }

  const fullName = user ? `${user.firstName} ${user.lastName}` : "—";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl }}
    >
      <View style={{ paddingTop: 64 }}>
        <Text style={styles.eyebrow}>PROFILE</Text>
        <Text style={styles.headline}>
          How clients <Text style={styles.headlineEm}>see you.</Text>
        </Text>
      </View>

      <View style={{ gap: spacing.lg }}>
        <Field label="NAME" value={fullName} />
        <Field label="EMAIL" value={user?.email ?? "—"} />
        <Field
          label="BIO"
          value="Add a short note about your work and what clients can expect."
        />
        <Field
          label="SERVICES"
          value="Manage your offerings on the web dashboard."
        />
        <Field
          label="ADDRESS VISIBILITY"
          value="Shown to clients only after a booking is confirmed."
        />
      </View>

      <TouchableOpacity
        style={styles.signOut}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
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
  },
  headline: {
    fontFamily: fonts.displayBlack,
    fontSize: 40,
    color: colors.primaryFg,
    letterSpacing: -1.2,
    marginTop: spacing.sm,
    lineHeight: 44,
  },
  headlineEm: {
    fontFamily: fonts.editorialLight,
    color: colors.accent,
    fontStyle: "italic",
  },
  field: {
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.smoke[700],
    gap: spacing.xs,
  },
  fieldLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: sizes.label,
    color: colors.taupe[400],
    letterSpacing: 3,
  },
  fieldValue: {
    fontFamily: fonts.body,
    fontSize: sizes.body,
    color: colors.primaryFg,
    lineHeight: 22,
  },
  signOut: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.taupe[500],
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  signOutText: {
    fontFamily: fonts.bodyMedium,
    fontSize: sizes.bodySm,
    color: colors.taupe[300],
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});
