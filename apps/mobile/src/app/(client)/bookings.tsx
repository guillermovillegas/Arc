import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { api } from "@/lib/api-client";
import { getStoredTokens } from "@/lib/auth";

interface Booking {
  id: string;
  status: string;
  startTime: string;
  totalPriceInCents: number;
  service: { name: string };
  providerProfile: { user: { firstName: string; lastName: string } };
}

export default function ClientBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    const { accessToken } = await getStoredTokens();
    if (!accessToken) return;
    try {
      const res = await api.get<{ data: Booking[] }>("/bookings/client", { token: accessToken });
      setBookings(res.data);
    } catch {
      // Handle error
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: "#f59e0b",
    CONFIRMED: "#3b82f6",
    IN_PROGRESS: "#8b5cf6",
    COMPLETED: "#10b981",
    CANCELLED: "#6b7280",
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No bookings yet</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.serviceName}>{item.service.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] || "#999" }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.provider}>
              {item.providerProfile.user.firstName} {item.providerProfile.user.lastName}
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.date}>
                {new Date(item.startTime).toLocaleDateString()} at{" "}
                {new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
              <Text style={styles.price}>${(item.totalPriceInCents / 100).toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  list: { padding: 16 },
  card: { borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  serviceName: { fontSize: 16, fontWeight: "600", color: "#111" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: "600", color: "#fff" },
  provider: { fontSize: 14, color: "#666", marginTop: 4 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  date: { fontSize: 13, color: "#888" },
  price: { fontSize: 16, fontWeight: "700", color: "#111" },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
});
