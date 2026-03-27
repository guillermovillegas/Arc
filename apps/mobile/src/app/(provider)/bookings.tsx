// Provider bookings screen - reuses similar pattern to client bookings
import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { api } from "@/lib/api-client";
import { getStoredTokens } from "@/lib/auth";

interface Booking {
  id: string;
  status: string;
  startTime: string;
  totalPriceInCents: number;
  notes: string | null;
  service: { name: string };
  client: { firstName: string; lastName: string };
}

export default function ProviderBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    const { accessToken } = await getStoredTokens();
    if (!accessToken) return;
    try {
      const res = await api.get<{ data: Booking[] }>("/bookings/provider", { token: accessToken });
      setBookings(res.data);
    } catch {
      // Handle error
    }
  }

  async function updateStatus(bookingId: string, status: string) {
    const { accessToken } = await getStoredTokens();
    if (!accessToken) return;
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status }, { token: accessToken });
      loadBookings();
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Failed to update");
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No bookings</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.serviceName}>{item.service.name}</Text>
              <Text style={styles.price}>${(item.totalPriceInCents / 100).toFixed(2)}</Text>
            </View>
            <Text style={styles.client}>
              {item.client.firstName} {item.client.lastName}
            </Text>
            <Text style={styles.date}>
              {new Date(item.startTime).toLocaleDateString()} at{" "}
              {new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>

            <View style={styles.actions}>
              {item.status === "PENDING" && (
                <>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.confirmBtn]}
                    onPress={() => updateStatus(item.id, "CONFIRMED")}
                  >
                    <Text style={styles.actionBtnText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.declineBtn]}
                    onPress={() => updateStatus(item.id, "CANCELLED")}
                  >
                    <Text style={[styles.actionBtnText, { color: "#666" }]}>Decline</Text>
                  </TouchableOpacity>
                </>
              )}
              {item.status === "CONFIRMED" && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.confirmBtn]}
                  onPress={() => updateStatus(item.id, "IN_PROGRESS")}
                >
                  <Text style={styles.actionBtnText}>Start</Text>
                </TouchableOpacity>
              )}
              {item.status === "IN_PROGRESS" && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.confirmBtn]}
                  onPress={() => updateStatus(item.id, "COMPLETED")}
                >
                  <Text style={styles.actionBtnText}>Complete</Text>
                </TouchableOpacity>
              )}
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
  cardTop: { flexDirection: "row", justifyContent: "space-between" },
  serviceName: { fontSize: 16, fontWeight: "600", color: "#111" },
  price: { fontSize: 16, fontWeight: "700", color: "#111" },
  client: { fontSize: 14, color: "#666", marginTop: 4 },
  date: { fontSize: 13, color: "#888", marginTop: 4 },
  actions: { flexDirection: "row", gap: 8, marginTop: 12 },
  actionBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  confirmBtn: { backgroundColor: "#006fc9" },
  declineBtn: { backgroundColor: "#f3f4f6" },
  actionBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
});
