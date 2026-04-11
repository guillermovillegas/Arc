import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { api } from "@/lib/api-client";
import { getStoredTokens } from "@/lib/auth";

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
    <View style={styles.container}>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Earnings</Text>
        <Text style={styles.totalAmount}>
          ${earnings ? (earnings.totalEarnings / 100).toFixed(2) : "0.00"}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Payment History</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#006fc9" style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={earnings?.payments || []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No payments yet</Text>}
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
  container: { flex: 1, backgroundColor: "#fff" },
  totalCard: {
    margin: 16, padding: 24, backgroundColor: "#006fc9", borderRadius: 16, alignItems: "center",
  },
  totalLabel: { color: "#b9dffe", fontSize: 14 },
  totalAmount: { color: "#fff", fontSize: 36, fontWeight: "bold", marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "600", paddingHorizontal: 16, marginTop: 8, color: "#111" },
  list: { padding: 16 },
  paymentCard: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  serviceName: { fontSize: 15, fontWeight: "500", color: "#111" },
  date: { fontSize: 13, color: "#888", marginTop: 2 },
  amount: { fontSize: 16, fontWeight: "700", color: "#10b981" },
  empty: { textAlign: "center", color: "#999", marginTop: 20 },
  loader: { marginTop: 40 },
  error: { textAlign: "center", color: "#ef4444", marginTop: 40, paddingHorizontal: 16 },
});
