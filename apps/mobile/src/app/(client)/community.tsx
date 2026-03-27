import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { api } from "@/lib/api-client";

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
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No posts yet</Text>}
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
  container: { flex: 1, backgroundColor: "#fff" },
  list: { padding: 16 },
  card: { borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 16, marginBottom: 12 },
  category: { fontSize: 11, fontWeight: "600", color: "#006fc9", textTransform: "uppercase" },
  title: { fontSize: 16, fontWeight: "600", color: "#111", marginTop: 4 },
  body: { fontSize: 14, color: "#666", marginTop: 4 },
  meta: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  metaText: { fontSize: 12, color: "#999" },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
});
