import React from "react"
import { View, StyleSheet, Text, useColorScheme } from "react-native"

const GuideScreen = (): JSX.Element => {
  const color = useColorScheme() === "dark" ? "#fff" : "#000"
  return (
    <View style={styles.container}>
      <Text style={{ color }}>GuideScreen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
})

export default GuideScreen
