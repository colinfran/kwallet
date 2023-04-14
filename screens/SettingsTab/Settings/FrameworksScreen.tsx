import { Ionicons } from "@expo/vector-icons"
import { Button } from "native-base"
import React, { useContext } from "react"
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  Linking,
} from "react-native"
import { DataContext } from "../../../providers/DataProvider"
import data from "./frameworks.json"

const FrameworksScreen = (): JSX.Element => {
  const { textColor, backgroundColor, appColor } = useContext(DataContext)
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: "100%" }}>
        <FlatList
          data={data}
          ListHeaderComponent={
            <View style={{ paddingTop: 20 }}>
              <Text style={{ fontSize: 30, color: textColor }}>Frameworks</Text>
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 20,
                  color: textColor,
                  marginVertical: 20,
                }}
              >
                Thank you to all the open source projects that were used to
                build this app. Their efforts are much appreciated!
              </Text>
            </View>
          }
          renderItem={({ item, index }) => {
            return (
              <View
                style={[
                  styles.shadow,
                  {
                    shadowColor: textColor,
                    borderRadius: 15,
                    backgroundColor: backgroundColor,
                  },
                  {
                    marginBottom: 20,
                    flexDirection: "column",
                    alignItems: "center",
                    borderColor: appColor,
                    borderWidth: 2,
                    padding: 10,
                    borderRadius: 10,
                    ...(index === data.length - 1 && { marginBottom: 60 }),
                  },
                ]}
              >
                <View>
                  <Text style={{ fontSize: 20, color: textColor }}>
                    {item.key}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 14, color: textColor }}>
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
                    <Text style={{ color: textColor }}>
                      Link to source code
                    </Text>
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
