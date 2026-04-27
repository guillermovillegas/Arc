import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { api } from "@/lib/api-client";
import { getStoredTokens } from "@/lib/auth";
import { colors, fonts, base } from "@/lib/theme";

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
    <View style={base.screen}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No bookings</Text>
            <Text style={styles.emptyBody}>Reservations from clients will appear here.</Text>
          </View>
        }
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
                    style={styles.confirmBtn}
                    onPress={() => updateStatus(item.id, "CONFIRMED")}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.confirmBtnText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineBtn}
                    onPress={() => updateStatus(item.id, "CANCELLED")}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.declineBtnText}>Decline</Text>
                  </TouchableOpacity>
                </>
              )}
              {item.status === "CONFIRMED" && (
                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={() => updateStatus(item.id, "IN_PROGRESS")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmBtnText}>Start</Text>
                </TouchableOpacity>
              )}
              {item.status === "IN_PROGRESS" && (
                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={() => updateStatus(item.id, "COMPLETED")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmBtnText}>Complete</Text>
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
  list: { padding: 20 },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.espresso[200],
    backgroundColor: colors.ivory[50],
    padding: 16,
    marginBottom: 12,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between" },
  serviceName: { fontSize: 16, fontFamily: fonts.serif, color: colors.espresso[800] },
  price: { fontSize: 16, fontFamily: fonts.serif, color: colors.espresso[800] },
  client: { fontSize: 14, color: colors.espresso[400], marginTop: 4 },
  date: { fontSize: 13, color: colors.espresso[300], marginTop: 4 },
  actions: { flexDirection: "row", gap: 8, marginTop: 14 },
  confirmBtn: {
    backgroundColor: colors.espresso[800],
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  confirmBtnText: { color: colors.ivory[100], fontWeight: "600", fontSize: 14 },
  declineBtn: {
    backgroundColor: colors.ivory[200],
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  declineBtnText: { color: colors.espresso[500], fontWeight: "500", fontSize: 14 },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 18, color: colors.espresso[800] },
  emptyBody: { fontSize: 14, color: colors.espresso[400], marginTop: 6 },
});
