import { Ionicons } from "@expo/vector-icons"
import { DarkTheme, DefaultTheme } from "@react-navigation/native"
import { Button } from "native-base"
import React from "react"
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  Linking,
  useColorScheme,
} from "react-native"
import data from "./frameworks.json"

const FrameworksScreen = (): JSX.Element => {
  const color = useColorScheme() === "dark" ? "#fff" : "#000"
  const backgroundColor =
    useColorScheme() === "dark"
      ? DarkTheme.colors.background
      : DefaultTheme.colors.background
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: "100%" }}>
        <FlatList
          data={data}
          ListHeaderComponent={
            <View style={{ paddingTop: 20 }}>
              <Text style={{ fontSize: 30, color: color }}>Frameworks</Text>
              <Text style={{ fontSize: 16, marginBottom: 20, color: color }}>
                Listed below are the open-sourced frameworks that were used to
                build this application. Their efforts are much appreciated.
              </Text>
            </View>
          }
          renderItem={({ item, index }) => {
            return (
              <View
                style={[
                  styles.shadow,
                  {
                    shadowColor: color,
                    borderRadius: 15,
                    backgroundColor: backgroundColor,
                  },
                  {
                    marginBottom: 20,
                    flexDirection: "column",
                    alignItems: "center",
                    borderColor: color,
                    borderWidth: 2,
                    padding: 10,
                    borderRadius: 10,
                    ...(index === data.length - 1 && { marginBottom: 60 }),
                  },
                ]}
              >
                <View>
                  <Text style={{ fontSize: 20, color: color }}>{item.key}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 14, color: color }}>
                    {item.description}
                  </Text>
                </View>
                <Button
                  marginTop={4}
                  size="sm"
                  variant="outline"
                  onPress={async () => await Linking.openURL(item.src)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Ionicons color={"lightblue"} name="link" size={24} />
                    <Text style={{ color: color }}>Link to source code</Text>
                  </View>
                </Button>
              </View>
            )
          }}
          style={{ paddingHorizontal: 20 }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3.5,
    elevation: 5,
  },
})

export default FrameworksScreen
