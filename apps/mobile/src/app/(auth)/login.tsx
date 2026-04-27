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
import { colors, fonts, base } from "@/lib/theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert("Validation Error", "Please enter your email address.");
      return false;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return false;
    }
    if (!password) {
      Alert.alert("Validation Error", "Please enter your password.");
      return false;
    }
    return true;
  }

  async function handleLogin() {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post<{
        data: {
          user: { id: string; email: string; firstName: string; lastName: string; role: string };
          accessToken: string;
          refreshToken: string;
        };
      }>("/auth/login", { email: email.trim(), password });

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
      style={base.screen}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>Arc</Text>
        <Text style={styles.subtitle}>Welcome back</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor={colors.espresso[300]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor={colors.espresso[300]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={base.buttonPrimaryText}>
            {loading ? "Signing in\u2026" : "Sign In"}
          </Text>
        </TouchableOpacity>

        <Link href="/(auth)/register" style={styles.link}>
          <Text style={styles.linkText}>
            New to Arc?{" "}
            <Text style={styles.linkAccent}>Create an account</Text>
          </Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  logo: {
    fontSize: 48,
    fontFamily: fonts.serif,
    color: colors.espresso[800],
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.serif,
    fontStyle: "italic",
    color: colors.brass[500],
    textAlign: "center",
    marginTop: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.espresso[200],
    marginVertical: 32,
    marginHorizontal: 40,
  },
  label: {
    ...base.label,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    ...base.input,
    marginBottom: 4,
  },
  button: {
    ...base.buttonPrimary,
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.5 },
  link: { marginTop: 28, alignItems: "center" },
  linkText: {
    color: colors.espresso[400],
    fontSize: 14,
    textAlign: "center",
  },
  linkAccent: {
    color: colors.brass[600],
    fontWeight: "600",
  },
});
