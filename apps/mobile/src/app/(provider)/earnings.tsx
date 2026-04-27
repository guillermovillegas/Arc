import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { api } from "@/lib/api-client";
import { getStoredTokens } from "@/lib/auth";
import { colors, fonts, base } from "@/lib/theme";

interface EarningsData {
  totalEarnings: number;
  payments: {
    id: string;
    providerPayoutInCents: number;
    createdAt: string;
    booking: { startTime: string; service: { name: string } };
  }[];
}

export default function EarningsScreen() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEarnings();
  }, []);

  async function loadEarnings() {
    setLoading(true);
    setError(null);
    const { accessToken } = await getStoredTokens();
    if (!accessToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get<{ data: EarningsData }>("/payments/earnings", { token: accessToken });
      setEarnings(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load earnings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={base.screen}>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Earnings</Text>
        <Text style={styles.totalAmount}>
          ${earnings ? (earnings.totalEarnings / 100).toFixed(2) : "0.00"}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Payment History</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.brass[500]} style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={earnings?.payments || []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No payments yet</Text>
              <Text style={styles.emptyBody}>Earnings will appear here after your first service.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.paymentCard}>
              <View>
                <Text style={styles.serviceName}>{item.booking.service.name}</Text>
                <Text style={styles.date}>
                  {new Date(item.booking.startTime).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.amount}>
                +${(item.providerPayoutInCents / 100).toFixed(2)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  totalCard: {
    margin: 20,
    padding: 28,
    backgroundColor: colors.espresso[800],
    alignItems: "center",
  },
  totalLabel: {
    ...base.label,
    color: colors.brass[400],
  },
  totalAmount: {
    fontFamily: fonts.serif,
    color: colors.ivory[100],
    fontSize: 40,
    marginTop: 6,
  },
  sectionTitle: {
    ...base.label,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  list: { padding: 20 },
  paymentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.espresso[200],
  },
  serviceName: {
    fontSize: 15,
    fontFamily: fonts.serif,
    color: colors.espresso[800],
  },
  date: {
    fontSize: 13,
    color: colors.espresso[400],
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.status.confirmed,
    fontFamily: fonts.sans,
  },
  emptyContainer: { alignItems: "center", marginTop: 40 },
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
  loader: { marginTop: 40 },
  error: {
    textAlign: "center",
    color: colors.status.error,
    marginTop: 40,
    paddingHorizontal: 20,
    fontSize: 14,
  },
});
