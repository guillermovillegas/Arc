import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { api } from "@/lib/api-client";
import { getStoredTokens } from "@/lib/auth";

interface Booking {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  service: { name: string };
  client: { firstName: string; lastName: string };
}

export default function ProviderHomeScreen() {
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadToday();
  }, []);

  async function loadToday() {
    setLoading(true);
    setError(null);
    const { accessToken } = await getStoredTokens();
    if (!accessToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get<{ data: Booking[] }>("/bookings/provider", { token: accessToken });
      // Filter to today's bookings
      const today = new Date().toDateString();
      setTodayBookings(res.data.filter((b) => new Date(b.startTime).toDateString() === today));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load today's bookings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today&apos;s Schedule</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#006fc9" style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={todayBookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No bookings today</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.time}>
                {new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
              <View style={styles.details}>
                <Text style={styles.serviceName}>{item.service.name}</Text>
                <Text style={styles.clientName}>
                  {item.client.firstName} {item.client.lastName}
                </Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: item.status === "CONFIRMED" ? "#10b981" : "#f59e0b" }]} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { fontSize: 18, fontWeight: "600", padding: 16, color: "#111" },
  list: { paddingHorizontal: 16 },
  card: { flexDirection: "row", alignItems: "center", padding: 14, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  time: { fontSize: 14, fontWeight: "600", color: "#006fc9", width: 60 },
  details: { flex: 1 },
  serviceName: { fontSize: 15, fontWeight: "600", color: "#111" },
  clientName: { fontSize: 13, color: "#666", marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
  loader: { marginTop: 40 },
  error: { textAlign: "center", color: "#ef4444", marginTop: 40, paddingHorizontal: 16 },
});
