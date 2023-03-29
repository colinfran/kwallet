import React from "react"
import { StyleSheet, View } from "react-native"
import SettingsScreen from "./Settings/SettingsScreen"

const SettingsTab = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <SettingsScreen />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
})

export default SettingsTab
