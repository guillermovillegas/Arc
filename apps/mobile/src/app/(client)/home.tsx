import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/lib/api-client";

interface Provider {
  id: string;
  slug: string;
  businessName: string | null;
  bio: string | null;
  averageRating: number;
  totalReviews: number;
  distance: number | null;
  user: { firstName: string; lastName: string };
  services: { name: string; priceInCents: number }[];
}

export default function ClientHomeScreen() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  async function loadProviders() {
    setLoading(true);
    setError(null);
    try {
      const params = search ? `?q=${encodeURIComponent(search)}` : "";
      const res = await api.get<{ data: { items: Provider[] } }>(`/search/providers${params}`);
      setProviders(res.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load providers");
    } finally {
      setLoading(false);
    }
  }

  function renderProvider({ item }: { item: Provider }) {
    const name = item.businessName || `${item.user.firstName} ${item.user.lastName}`;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/provider/${item.id}`)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.user.firstName[0]}{item.user.lastName[0]}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.providerName}>{name}</Text>
          <Text style={styles.rating}>
            ★ {item.averageRating.toFixed(1)} ({item.totalReviews})
            {item.distance !== null ? ` • ${item.distance.toFixed(1)} mi` : ""}
          </Text>
          {item.bio && <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search providers..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={loadProviders}
          returnKeyType="search"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#006fc9" style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={providers}
          renderItem={renderProvider}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>No providers found</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  searchInput: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12, fontSize: 16, backgroundColor: "#fafafa",
  },
  list: { padding: 16 },
  card: { flexDirection: "row", padding: 16, borderWidth: 1, borderColor: "#eee", borderRadius: 12, marginBottom: 12 },
  avatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: "#e0effe",
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  avatarText: { fontSize: 16, fontWeight: "bold", color: "#006fc9" },
  cardContent: { flex: 1 },
  providerName: { fontSize: 16, fontWeight: "600", color: "#111" },
  rating: { fontSize: 13, color: "#666", marginTop: 2 },
  bio: { fontSize: 13, color: "#888", marginTop: 4 },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
  loader: { marginTop: 40 },
  error: { textAlign: "center", color: "#ef4444", marginTop: 40, paddingHorizontal: 16 },
});
