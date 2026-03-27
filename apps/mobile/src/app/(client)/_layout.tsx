import { Tabs } from "expo-router";

export default function ClientTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#006fc9",
        headerShown: true,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Explore", tabBarLabel: "Explore" }} />
      <Tabs.Screen name="bookings" options={{ title: "Bookings", tabBarLabel: "Bookings" }} />
      <Tabs.Screen name="messages" options={{ title: "Messages", tabBarLabel: "Messages" }} />
      <Tabs.Screen name="community" options={{ title: "Community", tabBarLabel: "Community" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarLabel: "Profile" }} />
    </Tabs>
  );
}
