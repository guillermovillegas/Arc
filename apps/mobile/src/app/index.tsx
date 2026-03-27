import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getStoredTokens } from "@/lib/auth";

export default function SplashScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { accessToken, user } = await getStoredTokens();

    if (!accessToken || !user) {
      router.replace("/(auth)/login");
    } else if (user.role === "PROVIDER") {
      router.replace("/(provider)/home");
    } else {
      router.replace("/(client)/home");
    }

    setLoading(false);
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#006fc9" }}>
      <Text style={{ fontSize: 48, fontWeight: "bold", color: "white" }}>ARC</Text>
      {loading && <ActivityIndicator color="white" style={{ marginTop: 20 }} />}
    </View>
  );
}
