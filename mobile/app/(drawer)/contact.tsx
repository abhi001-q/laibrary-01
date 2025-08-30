import { Text, View } from "react-native";

export default function Contact() {
  return (
   <View className="flex-1 bg-gradient-to-b from-green-50 to-white px-6 py-10">
  <Text className="text-2xl font-extrabold text-green-600 mb-6 text-center">
    📞 Contact Me
  </Text>

  <View className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
    <Text className="text-lg font-semibold text-gray-800 mb-2">Role:</Text>
    <Text className="text-gray-600 mb-4">Frontend Developer</Text>

    <Text className="text-lg font-semibold text-gray-800 mb-2">Phone:</Text>
    <Text className="text-gray-600 mb-4">+977-9709444864</Text>

    <Text className="text-lg font-semibold text-gray-800 mb-2">Location:</Text>
    <Text className="text-gray-600 mb-4">Ithari, Nepal</Text>

    <Text className="text-lg font-semibold text-gray-800 mb-2">Email:</Text>
    <Text className="text-gray-600">abhishek987ff@gmail.com</Text>
  </View>
</View>

  );
}
