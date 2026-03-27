import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { api } from "@/lib/api-client";
import { getStoredTokens } from "@/lib/auth";

interface Conversation {
  id: string;
  otherParticipant: { id: string; firstName: string; lastName: string };
  lastMessage: { text: string; createdAt: string } | null;
}

export default function MessagesScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    const { accessToken } = await getStoredTokens();
    if (!accessToken) return;
    try {
      const res = await api.get<{ data: Conversation[] }>("/messages/conversations", { token: accessToken });
      setConversations(res.data);
    } catch {
      // Handle error
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No conversations yet</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.otherParticipant.firstName[0]}{item.otherParticipant.lastName[0]}
              </Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.name}>
                {item.otherParticipant.firstName} {item.otherParticipant.lastName}
              </Text>
              {item.lastMessage && (
                <Text style={styles.preview} numberOfLines={1}>{item.lastMessage.text}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  list: { padding: 16 },
  card: { flexDirection: "row", padding: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: "#e0effe",
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  avatarText: { fontWeight: "bold", color: "#006fc9" },
  content: { flex: 1, justifyContent: "center" },
  name: { fontSize: 15, fontWeight: "600", color: "#111" },
  preview: { fontSize: 13, color: "#888", marginTop: 2 },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
});
