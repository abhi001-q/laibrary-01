import "../global.css";
// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View className="flex-1 items-center justify-center bg-white">
//       <Text className="text-xl font-bold text-blue-500">
//         Welcome to Nativewind!
//       </Text>
//     </View>
//   );
// }

import { Redirect } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const index = () => {
  return <Redirect href="/(drawer)/login" />;
};

export default index;

const styles = StyleSheet.create({});
