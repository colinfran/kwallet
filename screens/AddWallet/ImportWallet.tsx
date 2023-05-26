import React, { useContext, useState } from "react"
import {
  StyleSheet,
  View,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native"
import { Button, TextArea, Input, Icon, Spinner } from "native-base"
import * as Sentry from "sentry-expo"
import { DataContext } from "../../providers/DataProvider"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { apiKey, apiUrl } from "../../constants/index"

const ImportWallet = (): JSX.Element => {
  const {
    wallets,
    setWallets,
    setSelectedWalletIndex,
    appColor,
    textColor,
    setWalletData,
  } = useContext(DataContext)

  const [loading, setLoading] = useState(false)
  const [validSeedPhrase, setValidSeedPhrase] = useState(false)

  const [walletName, setWalletName] = useState("")
  const [walletMnemonic, setWalletMnemonic] = useState("")
  const [walletPassword, setWalletPassword] = useState("")
  const navigation = useNavigation()

  const importWallet = async (): void => {
    setLoading(true)
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          password: walletPassword,
          mnemonic: walletMnemonic,
        }),
      }
      const url = `${apiUrl}/v1/wallet/import`
      const response = await fetch(url, options)
      const json = await response.json()
      console.log(json)
      if (json?.error) {
        setLoading(false)
        setValidSeedPhrase(false)
        return
      }
      setValidSeedPhrase(true)
      const newWalletObject = {
        walletName,
        walletData: json,
      }
      console.log(newWalletObject)
      let newWalletArray = []
      console.log("wallets.length", wallets.length)
      if (wallets.length > 0) {
        newWalletArray = [...wallets, newWalletObject]
        // setWallets(newWalletArray)
        // SecureStore.setItemAsync("wallets", JSON.stringify(newWalletArray))
        setWalletData(newWalletArray)
        setSelectedWalletIndex(newWalletArray.length - 1)
        setLoading(false)
        // navigation.navigate("SettingsTab")
      } else {
        newWalletArray.push(newWalletObject)
        setWalletData(newWalletArray)
        // setWallets(newWalletArray)
        setSelectedWalletIndex(0)
        setLoading(false)
        // SecureStore.setItemAsync("wallets", JSON.stringify(newWalletArray))
      }
    } catch (error) {
      Sentry.Native.captureException(error)
      setLoading(false)
    }
  }

  const valid = walletName !== "" && walletPassword !== ""

  return (
    <KeyboardAvoidingView style={styles.componentContainer}>
      <View style={styles.walletNameContainer}>
        <Input
          autoCapitalize="none"
          borderColor={appColor}
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
          autoCapitalize="none"
          borderColor={appColor}
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
          borderColor={appColor}
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
          borderColor={appColor}
          borderRadius={15}
          isDisabled={!valid}
          leftIcon={
            loading ? (
              <Spinner
                color={appColor}
                size="sm"
                style={{
                  transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
                }}
              />
            ) : (
              <Icon
                as={Ionicons}
                name={
                  !valid || !validSeedPhrase
                    ? "warning-outline"
                    : "checkmark-circle-outline"
                }
                size="sm"
              />
            )
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
