import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { api } from "@/lib/api-client";
import { getStoredTokens } from "@/lib/auth";
import { colors, fonts, base } from "@/lib/theme";

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
    PENDING: colors.status.pending,
    CONFIRMED: colors.status.confirmed,
    IN_PROGRESS: colors.status.active,
    COMPLETED: colors.status.completed,
    CANCELLED: colors.status.cancelled,
  };

  return (
    <View style={base.screen}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptyBody}>Your reservations will appear here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.serviceName}>{item.service.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] || colors.espresso[400] }]}>
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
  list: { padding: 20 },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.espresso[200],
    backgroundColor: colors.ivory[50],
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  serviceName: { fontSize: 16, fontFamily: fonts.serif, color: colors.espresso[800] },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 10, fontWeight: "600", color: colors.ivory[100], letterSpacing: 0.5 },
  provider: { fontSize: 14, color: colors.espresso[400], marginTop: 4 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  date: { fontSize: 13, color: colors.espresso[300] },
  price: { fontSize: 16, fontFamily: fonts.serif, color: colors.espresso[800] },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 18, color: colors.espresso[800] },
  emptyBody: { fontSize: 14, color: colors.espresso[400], marginTop: 6 },
});
