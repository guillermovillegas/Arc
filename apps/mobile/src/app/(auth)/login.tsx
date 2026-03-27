import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { api } from "@/lib/api-client";
import { storeTokens } from "@/lib/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      const res = await api.post<{
        data: {
          user: { id: string; email: string; firstName: string; lastName: string; role: string };
          accessToken: string;
          refreshToken: string;
        };
      }>("/auth/login", { email, password });

      await storeTokens(res.data.accessToken, res.data.refreshToken, res.data.user);

      if (res.data.user.role === "PROVIDER") {
        router.replace("/(provider)/home");
      } else {
        router.replace("/(client)/home");
      }
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>ARC</Text>
        <Text style={styles.title}>Welcome back</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Signing in..." : "Sign In"}</Text>
        </TouchableOpacity>

        <Link href="/(auth)/register" style={styles.link}>
          <Text style={styles.linkText}>
            Don&apos;t have an account? <Text style={styles.linkBold}>Sign up</Text>
          </Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, justifyContent: "center", padding: 24 },
  logo: { fontSize: 36, fontWeight: "bold", color: "#006fc9", textAlign: "center" },
  title: { fontSize: 20, fontWeight: "600", textAlign: "center", marginTop: 8, marginBottom: 32, color: "#111" },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 14, fontSize: 16,
    marginBottom: 12, backgroundColor: "#fafafa",
  },
  button: { backgroundColor: "#006fc9", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { marginTop: 24, alignItems: "center" },
  linkText: { color: "#666", fontSize: 14 },
  linkBold: { color: "#006fc9", fontWeight: "600" },
});
