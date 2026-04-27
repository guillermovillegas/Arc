import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { api } from "@/lib/api-client";
import { colors, fonts, base } from "@/lib/theme";

interface Post {
  id: string;
  title: string;
  body: string;
  category: string;
  commentsCount: number;
  createdAt: string;
  author: { firstName: string; lastName: string };
}

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const res = await api.get<{ data: { items: Post[] } }>("/posts");
      setPosts(res.data.items);
    } catch {
      // Handle error
    }
  }

  return (
    <View style={base.screen}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyBody}>The journal is waiting for its first entry.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body} numberOfLines={3}>{item.body}</Text>
            <View style={styles.meta}>
              <Text style={styles.metaText}>
                {item.author.firstName} {item.author.lastName}
              </Text>
              <Text style={styles.metaText}>{item.commentsCount} comments</Text>
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
  category: {
    ...base.label,
    color: colors.brass[600],
  },
  title: { fontSize: 16, fontFamily: fonts.serif, color: colors.espresso[800], marginTop: 4 },
  body: { fontSize: 14, color: colors.espresso[500], marginTop: 4, lineHeight: 20 },
  meta: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  metaText: { fontSize: 12, color: colors.espresso[300] },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 18, color: colors.espresso[800] },
  emptyBody: { fontSize: 14, color: colors.espresso[400], marginTop: 6 },
});
