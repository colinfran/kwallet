import React, { useEffect, useState } from "react"
import { View, StyleSheet, Text } from "react-native"
import { BarCodeScanner } from "expo-barcode-scanner"
import { useNavigation } from "@react-navigation/native"

const ScanQr = (): JSX.Element => {
  const [hasPermission, setHasPermission] = useState(null)
  const navigation = useNavigation()

  useEffect(() => {
    const getBarCodeScannerPermissions = async (): Promise<void> => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === "granted")
    }
    getBarCodeScannerPermissions()
  }, [])

  const handleBarCodeScanned = ({ data }): void => {
    navigation.navigate("Send", { data })
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={handleBarCodeScanned}
      />
      <View
        style={{
          height: "50%",
          width: "80%",
          borderColor: "#fff",
          borderWidth: 10,
          borderRadius: 20,
        }}
      />
      <View style={{ position: "absolute", left: 0, right: 0, top: "15%" }}>
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Scan Your Wallet QR
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
})

export default ScanQr
