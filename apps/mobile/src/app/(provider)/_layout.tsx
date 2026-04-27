import { Tabs } from "expo-router";
import { colors, fonts } from "@/lib/theme";

export default function ProviderTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.espresso[800],
        tabBarInactiveTintColor: colors.espresso[300],
        tabBarStyle: {
          backgroundColor: colors.ivory[100],
          borderTopColor: colors.espresso[200],
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          letterSpacing: 0.5,
          fontFamily: fonts.sans,
        },
        headerStyle: { backgroundColor: colors.ivory[100] },
        headerTitleStyle: {
          fontFamily: fonts.serif,
          fontSize: 18,
          color: colors.espresso[800],
        },
        headerShadowVisible: false,
        headerTintColor: colors.espresso[800],
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Today" }} />
      <Tabs.Screen name="bookings" options={{ title: "Bookings" }} />
      <Tabs.Screen name="messages" options={{ title: "Messages" }} />
      <Tabs.Screen name="earnings" options={{ title: "Earnings" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
