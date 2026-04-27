import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { getStoredTokens } from "@/lib/auth";
import { colors, fonts } from "@/lib/theme";

export default function SplashScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { accessToken, user } = await getStoredTokens();

      if (!accessToken || !user) {
        router.replace("/(auth)/login");
      } else if (user.role === "PROVIDER") {
        router.replace("/(provider)/home");
      } else {
        router.replace("/(client)/home");
      }
    } catch {
      router.replace("/(auth)/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Arc</Text>
      <Text style={styles.tagline}>Exceptional beauty, anywhere.</Text>
      {loading && <ActivityIndicator color={colors.brass[500]} style={styles.loader} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.espresso[800],
  },
  logo: {
    fontSize: 56,
    fontFamily: fonts.serif,
    color: colors.ivory[100],
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    fontFamily: fonts.serif,
    fontStyle: "italic",
    color: colors.brass[500],
    marginTop: 8,
  },
  loader: { marginTop: 32 },
});
