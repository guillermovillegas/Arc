import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { api } from "@/lib/api-client";
import { getStoredTokens } from "@/lib/auth";
import { colors, fonts, base } from "@/lib/theme";

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
    <View style={base.screen}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyBody}>Messages with your professionals will appear here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
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
  list: { padding: 20 },
  card: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.espresso[200],
  },
  avatar: {
    width: 44,
    height: 44,
    backgroundColor: colors.ivory[300],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: { fontFamily: fonts.serif, fontSize: 14, color: colors.espresso[700] },
  content: { flex: 1, justifyContent: "center" },
  name: { fontSize: 15, fontFamily: fonts.serif, color: colors.espresso[800] },
  preview: { fontSize: 13, color: colors.espresso[400], marginTop: 2 },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 18, color: colors.espresso[800] },
  emptyBody: { fontSize: 14, color: colors.espresso[400], marginTop: 6 },
});
