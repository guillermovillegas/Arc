import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { clearTokens, getStoredTokens } from "@/lib/auth";
import { useState, useEffect } from "react";
import { colors, fonts, base } from "@/lib/theme";

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

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory[100],
    alignItems: "center",
    paddingTop: 60,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: colors.ivory[300],
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 28,
    fontFamily: fonts.serif,
    color: colors.espresso[700],
  },
  name: {
    fontSize: 22,
    fontFamily: fonts.serif,
    marginTop: 16,
    color: colors.espresso[800],
  },
  email: {
    fontSize: 14,
    color: colors.espresso[400],
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.espresso[200],
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  logoutText: {
    color: colors.espresso[500],
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
