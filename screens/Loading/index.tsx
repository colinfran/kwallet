import React from "react"
import { StyleSheet, View, ActivityIndicator } from "react-native"

const Loading = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
})
