import React, { useContext } from "react"
import { View, StyleSheet, Text } from "react-native"
import { DataContext } from "../../../providers/DataProvider"

const GuideScreen = (): JSX.Element => {
  const { textColor } = useContext(DataContext)
  return (
    <View style={styles.container}>
      <Text style={{ color: textColor }}>GuideScreen</Text>
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
