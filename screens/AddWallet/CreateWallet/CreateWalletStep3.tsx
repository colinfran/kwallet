import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, View, KeyboardAvoidingView } from "react-native"
import { Button, Text, Input, Icon, Spinner } from "native-base"
import ordinal from "ordinal"
import { Ionicons } from "@expo/vector-icons"

import { DataContext } from "../../../providers/DataProvider"
import { useNavigation } from "@react-navigation/native"

const randomUniqueIntegers = (total, quantity): number[] => {
  const numbers = Array(total)
    .fill(null)
    .map((_, i) => i + 1)

  return numbers
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .slice(0, quantity)
}

const CreateWalletStep3 = ({ route }): JSX.Element => {
  const {
    wallets,
    setWallets,
    setSelectedWalletIndex,
    appColor,
    textColor,
    setWalletData,
  } = useContext(DataContext)
  const [loading, setLoading] = useState(false)

  const [input1, setInput1] = useState("")
  const [input2, setInput2] = useState("")
  const [input3, setInput3] = useState("")

  const [mnemonicArrayIndexes, setSeedArrayIndexes] = useState<number[]>([])
  const [mnemonicArrayValues, setSeedArrayValues] = useState<string[]>([])

  const [walletName, setWalletName] = useState("")

  const navigation = useNavigation()

  const [data, setData] = useState()

  useEffect(() => {
    if (route?.params?.data) {
      setData(route.params.data)
    }
  }, [route.params])

  useEffect(() => {
    if (data) {
      // Generate Random Seed Phrase
      // pick 3 random indexes between 0 and 11 (1-12)
      const arrayIndexes = randomUniqueIntegers(12, 3)
      setSeedArrayIndexes(arrayIndexes)
      // those 3 random indexes will be used as the
      // nth mnemonic value for the user to input and match
      const arrayValues = (): string[] =>
        arrayIndexes.map((idx) => data.mnemonicArray[idx - 1])
      setSeedArrayValues(arrayValues())
    }
  }, [data])

  // dirt cash post pause use beyond actual view autumn near panel empower
  const addWallet = (): void => {
    setLoading(true)
    const newWalletObject = {
      walletName,
      walletData: data,
    }
    console.log(newWalletObject)
    let newWalletArray = []
    if (wallets.length > 0) {
      newWalletArray = [...wallets, newWalletObject]
      setWalletData(newWalletArray)
      // setWallets(newWalletArray)
      // SecureStore.setItemAsync("wallets", JSON.stringify(newWalletArray))
      setSelectedWalletIndex(newWalletArray.length - 1)
      setLoading(false)
      navigation.navigate("SettingsTab")
    } else {
      newWalletArray.push(newWalletObject)
      setWalletData(newWalletArray)
      // setWallets(newWalletArray)
      // SecureStore.setItemAsync("wallets", JSON.stringify(newWalletArray))
      setSelectedWalletIndex(newWalletArray.length - 1)
    }
  }
  const validInputtedSeed =
    input1 === mnemonicArrayValues[0] &&
    input2 === mnemonicArrayValues[1] &&
    input3 === mnemonicArrayValues[2] &&
    walletName !== ""

  console.log("mnemonicArrayIndexes", mnemonicArrayIndexes)
  console.log("mnemonicArrayValues", mnemonicArrayValues)
  console.log("\n")
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View>
        <Text color={textColor} fontSize="2xl" bold>
          Verify your new phrase
        </Text>
      </View>
      {mnemonicArrayValues.length !== 0 &&
        mnemonicArrayIndexes.length !== 0 && (
          <View style={styles.inputContainerWrapper}>
            <View style={styles.inputContainerWrapper}>
              <View style={styles.inputContainer}>
                <Input
                  autoCapitalize="none"
                  borderColor={appColor}
                  borderRadius={15}
                  color={textColor}
                  mx="3"
                  placeholder={`${ordinal(mnemonicArrayIndexes[0])} word`}
                  returnKeyType="done"
                  size="2xl"
                  style={{ height: 50 }}
                  variant="outline"
                  w="100%"
                  onChangeText={(e) => setInput1(e)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Input
                  autoCapitalize="none"
                  borderColor={appColor}
                  borderRadius={15}
                  color={textColor}
                  mx="3"
                  placeholder={`${ordinal(mnemonicArrayIndexes[1])} word`}
                  returnKeyType="done"
                  size="2xl"
                  style={{ height: 50 }}
                  variant="outline"
                  w="100%"
                  onChangeText={(e) => setInput2(e)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Input
                  autoCapitalize="none"
                  borderColor={appColor}
                  borderRadius={15}
                  color={textColor}
                  mx="3"
                  placeholder={`${ordinal(mnemonicArrayIndexes[2])} word`}
                  returnKeyType="done"
                  size="2xl"
                  style={{ height: 50 }}
                  variant="outline"
                  w="100%"
                  onChangeText={(e) => setInput3(e)}
                />
              </View>
            </View>
            <View style={styles.walletName}>
              <View style={styles.walletNameView}>
                <Text color={textColor} fontSize="2xl" bold>
                  Wallet Name
                </Text>
              </View>
              <View style={styles.walletNameInput}>
                <Input
                  autoCapitalize="none"
                  borderColor={appColor}
                  borderRadius={15}
                  color={textColor}
                  mx="3"
                  placeholder="Wallet 1"
                  returnKeyType="done"
                  size="2xl"
                  style={{ height: 50 }}
                  variant="outline"
                  w="100%"
                  onChangeText={(e) => setWalletName(e)}
                />
              </View>
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
                isDisabled={!validInputtedSeed}
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
                        validInputtedSeed
                          ? "checkmark-circle-outline"
                          : "warning-outline"
                      }
                      size="sm"
                    />
                  )
                }
                size="lg"
                variant="outline"
                onPress={() => addWallet()}
              >
                Continue
              </Button>
            </View>
          </View>
        )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  inputContainerWrapper: {
    width: "100%",
  },
  inputContainer: {
    paddingTop: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    paddingTop: 40,
    justifyContent: "center",
    textAlign: "center",
  },
  walletName: {
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: "center",
    textAlign: "center",
  },
  walletNameInput: {
    paddingTop: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  walletNameView: {
    alignItems: "center",
    justifyContent: "center",
  },
})

export default CreateWalletStep3
