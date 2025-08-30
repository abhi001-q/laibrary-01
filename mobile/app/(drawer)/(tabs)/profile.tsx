// import * as ImagePicker from "expo-image-picker";
// import React, { useState } from "react";
// import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

// export default function Profile() {
//   const [images, setImages] = useState<string[]>([]);

//   const openCamera = async () => {
//     const permission = await ImagePicker.requestCameraPermissionsAsync();
//     if (!permission.granted) {
//       alert("Camera permission is required!");
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImages((prev) => [...prev, result.assets[0].uri]);
//     }
//   };

//   return (
//     <View className="flex-1 bg-white px-4 pt-8">
//       <Text className="text-2xl font-bold text-center mb-6">👤 Profile</Text>

//       <TouchableOpacity
//         onPress={openCamera}
//         className="bg-blue-600 py-3 rounded-2xl mb-6"
//       >
//         <Text className="text-white text-center text-lg font-semibold">
//           📸 Open Camera
//         </Text>
//       </TouchableOpacity>

//       <ScrollView className="mt-2">
//         {images.map((uri, index) => (
//           <View
//             key={index}
//             className="flex-row items-center border-b border-gray-200 py-3"
//           >
//             <Text className="w-12 text-center text-gray-700">{index + 1}</Text>
//             <Image source={{ uri }} className="w-16 h-16 rounded-lg mx-3" />
//             <Text className="flex-1 text-gray-600">Captured</Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface CapturedItem {
  uri: string;
  location: { latitude: number; longitude: number } | null;
}

export default function Profile() {
  const [items, setItems] = useState<CapturedItem[]>([]);

  const openCamera = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      alert("Camera permission is required!");
      return;
    }

    const locationPermission =
      await Location.requestForegroundPermissionsAsync();
    if (!locationPermission.granted) {
      alert("Location permission is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const loc = await Location.getCurrentPositionAsync({});
      const newItem: CapturedItem = {
        uri: result.assets[0].uri,
        location: loc
          ? {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            }
          : null,
      };

      setItems((prev) => [...prev, newItem]);
    }
  };

  return (
   <View className="flex-1 bg-gradient-to-b from-blue-50 to-white px-4 pt-8">
  <Text className="text-3xl font-extrabold text-blue-600 text-center mb-8">
    👤 Profile
  </Text>

  {/* Camera Button */}
  <TouchableOpacity
    onPress={openCamera}
    className="bg-blue-600 py-4 rounded-3xl mb-8 shadow-lg"
  >
    <Text className="text-white text-center text-lg font-semibold">
      📸 Open Camera & Get Location
    </Text>
  </TouchableOpacity>

  {/* Captured Items List */}
  <ScrollView className="mt-2">
    {items.map((item, index) => (
      <View
        key={index}
        className="flex-row items-center bg-white rounded-2xl p-3 mb-4 shadow border border-gray-100"
      >
        <Text className="w-8 text-center text-gray-700 font-semibold">
          {index + 1}
        </Text>
        <Image
          source={{ uri: item.uri }}
          className="w-16 h-16 rounded-xl mx-3"
        />
        <View className="flex-1">
          <Text className="text-gray-700 font-medium">Captured</Text>
          {item.location && (
            <Text className="text-xs text-gray-500 mt-1">
              📍 {item.location.latitude.toFixed(4)},{" "}
              {item.location.longitude.toFixed(4)}
            </Text>
          )}
        </View>
      </View>
    ))}
  </ScrollView>
</View>

  );
}
