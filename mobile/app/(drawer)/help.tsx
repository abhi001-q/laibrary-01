import { Text, View } from "react-native";

export default function Help() {
  return (
   <View className="flex-1 bg-gradient-to-b from-purple-50 to-white px-6 py-10">
  <Text className="text-2xl font-extrabold text-purple-600 mb-6 text-center">
    🛠 Help & Support
  </Text>

  <View className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
    <Text className="text-gray-700 mb-4">
      If you have any issues, queries, or need assistance regarding my projects, feel free to reach out through any of the following channels:
    </Text>

    <Text className="text-lg font-semibold text-gray-800 mb-2">Support Email:</Text>
    <Text className="text-gray-600 mb-4">support@abhishek.com</Text>

    <Text className="text-lg font-semibold text-gray-800 mb-2">Phone:</Text>
    <Text className="text-gray-600 mb-4">+977-9709444864</Text>

    <Text className="text-lg font-semibold text-gray-800 mb-2">Location:</Text>
    <Text className="text-gray-600 mb-4">Ithari, Nepal</Text>

    <Text className="text-gray-700 mt-4">
      Our team is available Monday to Friday, 9:00 AM – 6:00 PM. We will get back to you as soon as possible.
    </Text>
  </View>
</View>

  );
}
