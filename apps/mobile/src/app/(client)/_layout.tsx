import { Tabs } from "expo-router";
import { colors, fonts } from "@/theme";

export default function ClientTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.smoke[950],
          borderTopColor: colors.smoke[700],
          borderTopWidth: 1,
          height: 64,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.taupe[400],
        tabBarLabelStyle: {
          fontFamily: fonts.bodyMedium,
          fontSize: 9,
          letterSpacing: 2.4,
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Today" }} />
      <Tabs.Screen name="bookings" options={{ title: "Visits" }} />
      <Tabs.Screen name="messages" options={{ title: "Messages" }} />
      <Tabs.Screen name="community" options={{ title: "Voices" }} />
      <Tabs.Screen name="profile" options={{ title: "Account" }} />
    </Tabs>
  );
}
