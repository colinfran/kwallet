import React, { useContext } from "react"
import { StyleSheet, Button, View } from "react-native"
import { Text } from "native-base"
import { DataContext } from "../../providers/DataProvider"
import AsyncStorage from "@react-native-async-storage/async-storage"

const TransactionsTab = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { wallets, setWallets } = useContext(DataContext)

  const removeWallet = (): void => {
    setWallets([])
    AsyncStorage.setItem("wallets", JSON.stringify([]))
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View
        darkColor="rgba(255,255,255,0.1)"
        lightColor="#eee"
        style={styles.separator}
      />
      <Button title="Logout" onPress={() => removeWallet()} />
    </View>
  )
}

export default TransactionsTab

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
