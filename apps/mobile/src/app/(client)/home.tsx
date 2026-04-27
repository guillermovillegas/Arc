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
import { colors, fonts, base } from "@/lib/theme";

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
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.user.firstName[0]}{item.user.lastName[0]}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.providerName}>{name}</Text>
          <Text style={styles.rating}>
            {"\u2605"} {item.averageRating.toFixed(1)} ({item.totalReviews})
            {item.distance !== null ? ` \u00B7 ${item.distance.toFixed(1)} mi` : ""}
          </Text>
          {item.bio && <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={base.screen}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, craft, or location\u2026"
          placeholderTextColor={colors.espresso[300]}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={loadProviders}
          returnKeyType="search"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.brass[500]} style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={providers}
          renderItem={renderProvider}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No professionals found</Text>
              <Text style={styles.emptyBody}>Try a different search or check back later.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.espresso[200],
  },
  searchInput: {
    ...base.input,
  },
  list: { padding: 20 },
  card: {
    flexDirection: "row",
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.espresso[200],
    backgroundColor: colors.ivory[50],
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: colors.ivory[300],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 15,
    fontFamily: fonts.serif,
    color: colors.espresso[700],
  },
  cardContent: { flex: 1 },
  providerName: {
    fontSize: 16,
    fontFamily: fonts.serif,
    color: colors.espresso[800],
  },
  rating: {
    fontSize: 13,
    color: colors.brass[600],
    marginTop: 2,
  },
  bio: {
    fontSize: 13,
    color: colors.espresso[400],
    marginTop: 4,
    lineHeight: 18,
  },
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
