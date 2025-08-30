import { Ionicons } from "@expo/vector-icons";
import { Tabs, useNavigation } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

export default function TabLayout() {
  const navigation = useNavigation();

  const BackButton = () => {
    if (!navigation.canGoBack()) return null;

    return (
      <Pressable onPress={() => navigation.goBack()} className="ml-4">
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerLeft: () => <BackButton />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
