import { Tabs } from "expo-router";

export default function ProviderTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#006fc9",
        headerShown: true,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Today", tabBarLabel: "Today" }} />
      <Tabs.Screen name="bookings" options={{ title: "Bookings", tabBarLabel: "Bookings" }} />
      <Tabs.Screen name="messages" options={{ title: "Messages", tabBarLabel: "Messages" }} />
      <Tabs.Screen name="earnings" options={{ title: "Earnings", tabBarLabel: "Earnings" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarLabel: "Profile" }} />
    </Tabs>
  );
}
