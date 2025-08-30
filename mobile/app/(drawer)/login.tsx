import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    if (email && password) {
      router.push("/(drawer)/(tabs)/home");
    }
  }

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold text-center text-blue-700 mb-8">
        Welcome Back Admin
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6 text-base"
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-600 py-3 rounded-xl"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Login
        </Text>
      </TouchableOpacity>

    </View>
  );
}
