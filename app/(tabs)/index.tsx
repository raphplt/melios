import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import TopStats from "../../components/TopStats";

export default function TabOneScreen() {
  return (
    <View>
      <TopStats />
      <Text className="text-lg text-center">Good habits</Text>
      <View />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}
