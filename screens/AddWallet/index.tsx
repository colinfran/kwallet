import React, { useContext } from "react"
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  useColorScheme,
} from "react-native"
import { Button, Image } from "native-base"
import image from "../../assets/images/kwallet-icon.png"
import { DataContext } from "../../providers/DataProvider"
import ButtonOutline from "../../components/Button/ButtonOutline"

const AddWallet = ({ navigation }): JSX.Element => {
  const { pickedColor } = useContext(DataContext)
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  return (
    <View style={styles.componentContainer}>
      <View style={styles.logoContainer}>
        <View>
          <Image
            alt="Kwallet logo"
            resizeMode="contain"
            source={image}
            style={{ height: 300, width: 300 }}
          />
        </View>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 50 }}>kwallet</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <ButtonOutline
            text="Import Existing Wallet"
            onPress={() => navigation.navigate("ImportWallet")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <ButtonOutline
            text="Create New Wallet"
            onPress={() => navigation.navigate("CreateWalletStep1")}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  componentContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    padding: 20,
    gap: 40,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
  },
  buttonsContainer: {
    width: "100%",
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  box: {
    width: "100%",
    height: Dimensions.get("window").height / 3,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default AddWallet
