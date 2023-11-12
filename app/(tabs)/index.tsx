import { StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";

export default function TabOneScreen() {
  return (
    <View>
      <Text className="text-lg text-center">Good habits</Text>
      <View />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}
