import { StyleSheet, Text, View } from "react-native";
import React from "react";

const settings = () => {
  return (
 <View className="flex-1 bg-gray-50 px-6 py-10">
  <Text className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
    ⚙️ Settings
  </Text>

  {/* Account Settings Card */}
  <View className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-5">
    <Text className="text-lg font-semibold text-gray-700 mb-3">Account</Text>
    <Text className="text-gray-600 mb-1">• Change Password</Text>
    <Text className="text-gray-600 mb-1">• Update Profile</Text>
    <Text className="text-gray-600">• Manage Subscriptions</Text>
  </View>

  {/* Notifications Card */}
  <View className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-5">
    <Text className="text-lg font-semibold text-gray-700 mb-3">Notifications</Text>
    <Text className="text-gray-600 mb-1">• Email Notifications</Text>
    <Text className="text-gray-600 mb-1">• Push Notifications</Text>
    <Text className="text-gray-600">• SMS Alerts</Text>
  </View>

  {/* App Settings Card */}
  <View className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
    <Text className="text-lg font-semibold text-gray-700 mb-3">App Settings</Text>
    <Text className="text-gray-600 mb-1">• Language</Text>
    <Text className="text-gray-600 mb-1">• Theme</Text>
    <Text className="text-gray-600">• Privacy & Security</Text>
  </View>
</View>

  );
};

export default settings;

 const styles = StyleSheet.create({
  
 });
