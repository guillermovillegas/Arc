import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { api } from "@/lib/api-client";
import { storeTokens } from "@/lib/auth";
import { colors, fonts, base } from "@/lib/theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const router = useRouter();
  const [role, setRole] = useState<"CLIENT" | "PROVIDER">("CLIENT");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    if (!form.firstName.trim()) {
      Alert.alert("Validation Error", "Please enter your first name.");
      return false;
    }
    if (!form.lastName.trim()) {
      Alert.alert("Validation Error", "Please enter your last name.");
      return false;
    }
    const trimmedEmail = form.email.trim();
    if (!trimmedEmail) {
      Alert.alert("Validation Error", "Please enter your email address.");
      return false;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return false;
    }
    if (form.password.length < 8) {
      Alert.alert("Validation Error", "Password must be at least 8 characters.");
      return false;
    }
    return true;
  }

  async function handleRegister() {
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        role,
      };
      const res = await api.post<{
        data: {
          user: { id: string; email: string; firstName: string; lastName: string; role: string };
          accessToken: string;
          refreshToken: string;
        };
      }>("/auth/register", payload);

      await storeTokens(res.data.accessToken, res.data.refreshToken, res.data.user);

      if (res.data.user.role === "PROVIDER") {
        router.replace("/(provider)/home");
      } else {
        router.replace("/(client)/home");
      }
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>Arc</Text>
      <Text style={styles.subtitle}>Begin your journey</Text>

      <View style={styles.divider} />

      <Text style={styles.label}>I am a</Text>
      <View style={styles.roleToggle}>
        {(["CLIENT", "PROVIDER"] as const).map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.roleButton, role === r && styles.roleButtonActive]}
            onPress={() => setRole(r)}
            activeOpacity={0.8}
          >
            <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
              {r === "CLIENT" ? "Client" : "Professional"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="First name"
        placeholderTextColor={colors.espresso[300]}
        value={form.firstName}
        onChangeText={(v) => setForm((f) => ({ ...f, firstName: v }))}
      />
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last name"
        placeholderTextColor={colors.espresso[300]}
        value={form.lastName}
        onChangeText={(v) => setForm((f) => ({ ...f, lastName: v }))}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        placeholderTextColor={colors.espresso[300]}
        value={form.email}
        onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="8+ characters"
        placeholderTextColor={colors.espresso[300]}
        value={form.password}
        onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={base.buttonPrimaryText}>
          {loading ? "Creating\u2026" : "Create Account"}
        </Text>
      </TouchableOpacity>

      <Link href="/(auth)/login" style={styles.link}>
        <Text style={styles.linkText}>
          Already on Arc?{" "}
          <Text style={styles.linkAccent}>Sign in</Text>
        </Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
    backgroundColor: colors.ivory[100],
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
    marginVertical: 28,
    marginHorizontal: 40,
  },
  label: {
    ...base.label,
    marginBottom: 6,
    marginTop: 12,
  },
  roleToggle: {
    flexDirection: "row",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.espresso[200],
    overflow: "hidden",
    marginBottom: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: colors.ivory[50],
  },
  roleButtonActive: {
    backgroundColor: colors.espresso[800],
  },
  roleText: {
    fontSize: 14,
    color: colors.espresso[400],
    fontWeight: "500",
  },
  roleTextActive: {
    color: colors.ivory[100],
    fontWeight: "600",
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
