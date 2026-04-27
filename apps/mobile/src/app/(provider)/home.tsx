import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { api } from "@/lib/api-client";
import { getStoredTokens } from "@/lib/auth";
import { colors, fonts, base } from "@/lib/theme";

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
      const today = new Date().toDateString();
      setTodayBookings(res.data.filter((b) => new Date(b.startTime).toDateString() === today));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load today's bookings");
    } finally {
      setLoading(false);
    }
  }

  function statusColor(status: string) {
    switch (status) {
      case "CONFIRMED": return colors.status.confirmed;
      case "IN_PROGRESS": return colors.status.active;
      case "COMPLETED": return colors.status.completed;
      case "CANCELLED": return colors.status.cancelled;
      default: return colors.status.pending;
    }
  }

  return (
    <View style={base.screen}>
      <Text style={styles.header}>Today&apos;s Schedule</Text>
      {loading ? (
        <ActivityIndicator size="large" color={colors.brass[500]} style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={todayBookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No bookings today</Text>
              <Text style={styles.emptyBody}>Your schedule is clear.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.timeCol}>
                <Text style={styles.time}>
                  {new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
              <View style={styles.dividerVert} />
              <View style={styles.details}>
                <Text style={styles.serviceName}>{item.service.name}</Text>
                <Text style={styles.clientName}>
                  {item.client.firstName} {item.client.lastName}
                </Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: statusColor(item.status) }]} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.espresso[800],
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  list: { paddingHorizontal: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.espresso[200],
  },
  timeCol: { width: 56 },
  time: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.brass[600],
    fontFamily: fonts.sans,
  },
  dividerVert: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: colors.espresso[200],
    marginRight: 14,
  },
  details: { flex: 1 },
  serviceName: {
    fontSize: 15,
    fontFamily: fonts.serif,
    color: colors.espresso[800],
  },
  clientName: {
    fontSize: 13,
    color: colors.espresso[400],
    marginTop: 2,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.espresso[800],
  },
  emptyBody: {
    fontSize: 14,
    color: colors.espresso[400],
    marginTop: 6,
  },
  loader: { marginTop: 60 },
  error: {
    textAlign: "center",
    color: colors.status.error,
    marginTop: 40,
    paddingHorizontal: 20,
    fontSize: 14,
  },
});
