import React, { useContext, useState } from "react"
import {
  StyleSheet,
  View,
  Dimensions,
  useColorScheme,
  KeyboardAvoidingView,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Button, TextArea, Input, Icon } from "native-base"

import { DataContext } from "../../providers/DataProvider"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const ImportWallet = (): JSX.Element => {
  const {
    wallets,
    setWallets,
    setSelectedWalletIndex,
    getApiData,
    setApiData,
    pickedColor,
  } = useContext(DataContext)
  const [walletName, setWalletName] = useState("")
  const [walletMnemonic, setWalletMnemonic] = useState("")
  const [walletPassword, setWalletPassword] = useState("")
  const navigation = useNavigation()

  const importWallet = (): void => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: walletPassword,
          mnemonic: walletMnemonic,
        }),
      }
      // const url = "http://localhost:3000/api/wallet/import"
      const url = "https://kwallet.app/api/wallet/import"
      const response = fetch(url, options)
      console.log(response)
    } catch (error) {
      // catch
    }
    const newWalletObject = {
      walletName,
      walletMnemonic,
    }
    let newWalletArray = []
    if (wallets.length > 0) {
      newWalletArray = [...wallets, newWalletObject]
      setWallets(newWalletArray)
      AsyncStorage.setItem("wallets", JSON.stringify(newWalletArray))
      setSelectedWalletIndex(newWalletArray.length - 1)
      setTimeout(() => {
        const response = getApiData()
        if (response && !response.error && response.currentPrice) {
          setApiData(response)
        }
      }, 500)
      navigation.navigate("SettingsTab")
    } else {
      newWalletArray.push(newWalletObject)
      setWallets(newWalletArray)
      setSelectedWalletIndex(0)
      AsyncStorage.setItem("wallets", JSON.stringify(newWalletArray))
    }
  }

  const validSeedPhrase = (): boolean => {
    // run seed phrase validation here,
    // return true if valid seed phrase
    return walletMnemonic !== ""
  }

  const valid = walletName !== "" && validSeedPhrase()

  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  return (
    <KeyboardAvoidingView style={styles.componentContainer}>
      <View style={styles.walletNameContainer}>
        <Input
          borderColor={pickedColor}
          borderRadius={15}
          color={textColor}
          mx="3"
          placeholder="Wallet Name"
          returnKeyType="done"
          size="2xl"
          style={{ height: 60 }}
          w="100%"
          onChangeText={(e) => setWalletName(e)}
        />
      </View>
      <View style={styles.walletNameContainer}>
        <Input
          borderColor={pickedColor}
          borderRadius={15}
          color={textColor}
          mx="3"
          placeholder="Wallet Password"
          returnKeyType="done"
          size="2xl"
          style={{ height: 60 }}
          textContentType="oneTimeCode"
          type="password"
          w="100%"
          onChangeText={(e) => setWalletPassword(e)}
        />
      </View>
      <View style={styles.walletMnemonicContainer}>
        <TextArea
          autoCompleteType={false}
          blurOnSubmit={true}
          borderColor={pickedColor}
          borderRadius={15}
          color={textColor}
          fontSize="lg"
          h={Dimensions.get("window").height / 3}
          maxW="100%"
          placeholder="Wallet Seed Phrase"
          returnKeyType="done"
          size="2xl"
          style={{ height: 60 }}
          w="100%"
          onChangeText={(e) => setWalletMnemonic(e)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          _text={{
            style: {
              color: textColor,
            },
          }}
          borderColor={pickedColor}
          borderRadius={15}
          isDisabled={!valid}
          leftIcon={
            <Icon
              as={Ionicons}
              name={valid ? "checkmark-circle-outline" : "warning-outline"}
              size="sm"
            />
          }
          size="lg"
          variant="outline"
          onPress={() => importWallet()}
        >
          Import Wallet
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  componentContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 30,
  },
  walletNameContainer: {},
  walletMnemonicContainer: {},
  buttonContainer: {
    width: "100%",
  },
})

export default ImportWallet
