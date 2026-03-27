import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { clearTokens, getStoredTokens } from "@/lib/auth";
import { useState, useEffect } from "react";

export default function ClientProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  useEffect(() => {
    getStoredTokens().then(({ user: u }) => setUser(u));
  }, []);

  async function handleLogout() {
    await clearTokens();
    router.replace("/(auth)/login");
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user ? `${user.firstName[0]}${user.lastName[0]}` : "?"}
        </Text>
      </View>
      <Text style={styles.name}>{user ? `${user.firstName} ${user.lastName}` : ""}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", paddingTop: 60 },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: "#e0effe",
    justifyContent: "center", alignItems: "center",
  },
  avatarText: { fontSize: 28, fontWeight: "bold", color: "#006fc9" },
  name: { fontSize: 20, fontWeight: "600", marginTop: 16, color: "#111" },
  email: { fontSize: 14, color: "#666", marginTop: 4 },
  logoutButton: {
    marginTop: 40, borderWidth: 1, borderColor: "#ddd", borderRadius: 12,
    paddingHorizontal: 32, paddingVertical: 12,
  },
  logoutText: { color: "#666", fontSize: 16 },
});
