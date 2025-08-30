import React from "react";
import { View, Text, ScrollView } from "react-native";

const Home = () => {
  const statsCards = [
    { title: "Total User", value: "10" },
    { title: "Total Books", value: "3" },
    { title: "Manage Book", value: "8" },
    { title: "Pending Requests", value: "2" },
  ];

  return (
   <ScrollView className="flex-1 bg-gradient-to-b from-blue-50 to-white p-5">
  {/* Header */}
  <Text className="text-3xl font-extrabold text-blue-600 mb-6 text-center">
    📊 Admin Dashboard
  </Text>

  {/* Stats Cards */}
  <View className="flex-row flex-wrap justify-between mb-8">
    {statsCards.map((card, index) => (
      <View
        key={index}
        className="w-[48%] bg-white rounded-3xl p-6 mb-5 shadow-lg border border-gray-100"
      >
        <Text className="text-2xl font-extrabold text-center text-gray-800">
          {card.value}
        </Text>
        <Text className="text-gray-500 text-sm mt-2 text-center">
          {card.title}
        </Text>
      </View>
    ))}
  </View>

  {/* Recent Activity */}
  <View className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
    <Text className="text-xl font-semibold mb-4 text-gray-700">
      🕒 Recent Activity
    </Text>

    <View className="flex-row justify-between py-3 border-b border-gray-200">
      <Text className="text-gray-700">Ram Lal Yadev borrowed a book</Text>
      <Text className="text-gray-500 text-xs">9:15 AM</Text>
    </View>

    <View className="flex-row justify-between py-3 border-b border-gray-200">
      <Text className="text-gray-700">Mukesh Kumar Sah returned a book</Text>
      <Text className="text-gray-500 text-xs">8:45 AM</Text>
    </View>

    <View className="flex-row justify-between py-3">
      <Text className="text-gray-700">Champa Devi returned a book</Text>
      <Text className="text-gray-500 text-xs">Yesterday</Text>
    </View>
  </View>
</ScrollView>

  );
};

export default Home;
