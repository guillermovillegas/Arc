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
      <Text style={styles.logo}>ARC</Text>
      <Text style={styles.title}>Create your account</Text>

      {/* Role toggle */}
      <View style={styles.roleToggle}>
        {(["CLIENT", "PROVIDER"] as const).map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.roleButton, role === r && styles.roleButtonActive]}
            onPress={() => setRole(r)}
          >
            <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
              {r === "CLIENT" ? "I need services" : "I offer services"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={form.firstName}
        onChangeText={(v) => setForm((f) => ({ ...f, firstName: v }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={form.lastName}
        onChangeText={(v) => setForm((f) => ({ ...f, lastName: v }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password (8+ characters)"
        value={form.password}
        onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Create Account"}</Text>
      </TouchableOpacity>

      <Link href="/(auth)/login" style={styles.link}>
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.linkBold}>Sign in</Text>
        </Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  logo: { fontSize: 36, fontWeight: "bold", color: "#006fc9", textAlign: "center" },
  title: { fontSize: 20, fontWeight: "600", textAlign: "center", marginTop: 8, marginBottom: 24, color: "#111" },
  roleToggle: { flexDirection: "row", borderWidth: 1, borderColor: "#ddd", borderRadius: 12, marginBottom: 16, overflow: "hidden" },
  roleButton: { flex: 1, padding: 12, alignItems: "center" },
  roleButtonActive: { backgroundColor: "#006fc9" },
  roleText: { fontSize: 14, color: "#666" },
  roleTextActive: { color: "#fff", fontWeight: "600" },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 14, fontSize: 16,
    marginBottom: 12, backgroundColor: "#fafafa",
  },
  button: { backgroundColor: "#006fc9", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { marginTop: 24, alignItems: "center" },
  linkText: { color: "#666", fontSize: 14, textAlign: "center" },
  linkBold: { color: "#006fc9", fontWeight: "600" },
});
