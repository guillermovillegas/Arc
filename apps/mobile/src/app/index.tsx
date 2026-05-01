import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
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
    <View style={styles.container} testID="splash-root">
      <Image
        source={require("../../assets/brand/faineant-wordmark-white.png")}
        style={styles.wordmark}
        resizeMode="contain"
        accessibilityLabel="FAINEANT"
      />
      <Text style={styles.tagline}>House calls for the slow-living.</Text>
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
  wordmark: {
    width: 240,
    height: 56,
  },
  tagline: {
    fontSize: 14,
    fontFamily: fonts.serif,
    fontStyle: "italic",
    color: colors.brass[500],
    marginTop: 12,
  },
  loader: { marginTop: 32 },
});
