import { Text, View } from "react-native";

export default function About() {
  return (
   <View className="flex-1 bg-gradient-to-b from-blue-50 to-white px-6 py-10">
  <Text className="text-2xl font-extrabold text-blue-600 mb-6 text-center">
    👤 About Me
  </Text>

  <View className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
    <Text className="text-lg font-semibold text-gray-800 mb-2">Name:</Text>
    <Text className="text-gray-600 mb-4">Abhishek Goswami</Text>

    <Text className="text-lg font-semibold text-gray-800 mb-2">Education:</Text>
    <Text className="text-gray-600 mb-4">
      Bachelor of Information Technology (BIT)
    </Text>

    <Text className="text-lg font-semibold text-gray-800 mb-2">Skills:</Text>
    <Text className="text-gray-600 mb-4">
      • Web Development (ReactJS, TypeScript, TailwindCSS) {"\n"}
      • Mobile Development (React Native) {"\n"}
      • UI/UX Design (Figma) {"\n"}
      • Backend Development (Basics) {"\n"}
      • Programming: Java, Python, SQL
    </Text>

    <Text className="text-lg font-semibold text-gray-800 mb-2">Languages:</Text>
    <Text className="text-gray-600 mb-4">
      English, Nepali, Hindi
    </Text>

    <Text className="text-lg font-semibold text-gray-800 mb-2">Interests:</Text>
    <Text className="text-gray-600">
      Technology, UI/UX, Coding Projects, Hackathons, Story Writing (Horror/Short Films)
    </Text>
  </View>
</View>

  );
}
