import { Ionicons } from "@expo/vector-icons"
import {
  Box,
  Input,
  Button,
  IconButton,
  TextArea,
  useContrastText,
  Actionsheet,
  Icon,
} from "native-base"

import React, { useContext, useEffect, useState } from "react"
import {
  View,
  StyleSheet,
  useColorScheme,
  Text,
  Alert,
  Dimensions,
} from "react-native"
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons"
import { DataContext } from "../../providers/DataProvider"
import opacity from "hex-color-opacity"
import * as Clipboard from "expo-clipboard"
import {
  DarkTheme,
  DefaultTheme,
  useNavigation,
} from "@react-navigation/native"
import * as Sentry from "sentry-expo"

import { apiKey, apiUrl } from "../../constants/index"

import { Bounce } from "react-native-animated-spinkit"

const Send = ({ route }): JSX.Element => {
  const [address, setAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [fee, setFee] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState("loading")

  const {
    pickedColor,
    textColor,
    backgroundColor,
    wallets,
    selectedWalletIndex,
  } = useContext(DataContext)
  const navigation = useNavigation()

  useEffect(() => {
    if (route?.params?.data) {
      setAddress(route.params.data)
    }
  }, [route.params])

  const onPastePress = async (): Promise<void> => {
    const value = await Clipboard.getStringAsync()
    setAddress(value)
  }

  const submitTransaction = async (): Promise<void> => {
    console.log("Yes Pressed")
    setIsOpen(true)
    const selectedWallet = wallets[selectedWalletIndex]
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          address,
          amount,
          fee,
          password: selectedWallet.walletData.userPassword,
          encryptedMnemonic: selectedWallet.walletData.encryptedMnemonic,
        }),
      }
      const url = `${apiUrl}/api/wallet/send`
      const response = await fetch(url, options)
      const json = await response.json()
      console.log(json)
      setTimeout(() => {
        if (json) {
          if (json.error) {
            setSubmissionStatus("error")
          }
          if (json.sucess) {
            setSubmissionStatus("sucess")
            setAddress("")
            setAmount("")
            setFee("")
          }
        }
      }, 2000)
    } catch (error) {
      Sentry.Native.captureException(error)
      console.log(error)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setSubmissionStatus("loading")
    }
  }, [isOpen])

  const onButtonPress = (): void => {
    Alert.alert(
      "Submit transaction",
      // eslint-disable-next-line max-len
      "You are about to submit your transaction to the Kaspa blockchain. Are you sure you  want to continue?",
      [
        { text: "Yes", onPress: () => submitTransaction() },
        {
          text: "No",
          onPress: () => console.log("No Pressed"),
          style: "cancel",
        },
      ]
      //clicking out side of alert will not cancel
    )
  }

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: 50 }}>
        <Box
          alignItems="center"
          style={[
            styles.shadow,
            {
              shadowColor: textColor,
              borderRadius: 15,
              backgroundColor: backgroundColor,
            },
          ]}
        >
          <TextArea
            _focus={{
              style: {
                backgroundColor: opacity(pickedColor, 0.4),
                color: textColor,
              },
            }}
            borderColor={pickedColor}
            borderRadius={15}
            color={textColor}
            focusOutlineColor={pickedColor}
            h={"24"}
            InputRightElement={
              <View style={{ flexDirection: "row", height: "100%" }}>
                <IconButton
                  _icon={{
                    as: FontAwesome5,
                    name: "paste",
                    color: useContrastText(pickedColor),
                  }}
                  _pressed={{
                    style: {
                      backgroundColor: opacity(pickedColor, 0.8),
                    },
                    _icon: {
                      as: FontAwesome5,
                      name: "paste",
                      color: "#000",
                    },
                  }}
                  borderRadius={0}
                  key="paste"
                  style={{
                    backgroundColor: pickedColor,
                    height: "100%",
                  }}
                  w={"12"}
                  onPress={onPastePress}
                />
                <IconButton
                  _icon={{
                    as: Ionicons,
                    name: "qr-code",
                    color: useContrastText(pickedColor),
                  }}
                  _pressed={{
                    style: {
                      backgroundColor: opacity(pickedColor, 0.8),
                    },
                    _icon: {
                      as: Ionicons,
                      name: "qr-code",
                      color: "#000",
                    },
                  }}
                  borderRadius={0}
                  key="qr-code"
                  style={{ backgroundColor: pickedColor }}
                  w={"12"}
                  onPress={() => navigation.navigate("ScanQr")}
                />
              </View>
            }
            placeholder="Kaspa Address"
            placeholderTextColor={textColor}
            size="2xl"
            value={address}
            w="100%"
            onChangeText={(text) => setAddress(text)}
          />
        </Box>
      </View>
      <View style={{ paddingTop: 20 }}>
        <Box
          alignItems="center"
          style={[
            styles.shadow,
            {
              shadowColor: textColor,
              borderRadius: 15,
              backgroundColor: backgroundColor,
            },
          ]}
        >
          <Input
            _focus={{
              style: {
                backgroundColor: opacity(pickedColor, 0.4),
                color: textColor,
              },
            }}
            _stack={{ style: { borderColor: pickedColor } }}
            borderColor={pickedColor}
            borderRadius={15}
            color={textColor}
            colorScheme={pickedColor}
            focusOutlineColor={pickedColor}
            h={"16"}
            inputMode="decimal"
            InputRightElement={
              <Button
                _pressed={{
                  style: {
                    backgroundColor: opacity(pickedColor, 0.8),
                    borderLeftColor: pickedColor,
                    borderLeftWidth: 1,
                  },
                  _text: {
                    color: "#000",
                  },
                }}
                _text={{
                  color: useContrastText(pickedColor),
                }}
                borderColor={pickedColor}
                h="full"
                rounded="none"
                style={{ backgroundColor: pickedColor }}
                w="1/6"
              >
                Max
              </Button>
            }
            keyboardType="number-pad"
            placeholder="Amount"
            placeholderTextColor={textColor}
            returnKeyType="done"
            selectionColor={pickedColor}
            size="2xl"
            w="100%"
            onChangeText={(val) => setAmount(val)}
          />
        </Box>
      </View>
      <View style={{ paddingTop: 20 }}>
        <Box
          alignItems="center"
          style={[
            styles.shadow,
            {
              shadowColor: textColor,
              borderRadius: 15,
              backgroundColor: backgroundColor,
            },
          ]}
        >
          <Input
            _focus={{
              style: {
                backgroundColor: opacity(pickedColor, 0.4),
                color: textColor,
              },
            }}
            _stack={{ style: { borderColor: pickedColor } }}
            borderColor={pickedColor}
            borderRadius={15}
            color={textColor}
            colorScheme={pickedColor}
            focusOutlineColor={pickedColor}
            h={"16"}
            inputMode="decimal"
            keyboardType="number-pad"
            placeholder="Transaction Fee"
            placeholderTextColor={textColor}
            returnKeyType="done"
            selectionColor={pickedColor}
            size="2xl"
            w="100%"
            onChangeText={(val) => setFee(val)}
          />
        </Box>
      </View>
      <View style={{ paddingTop: 100 }}>
        <Button
          backgroundColor={pickedColor}
          isDisabled={address === "" || amount === "" || fee === ""}
          w="full"
          onPress={() => onButtonPress()}
        >
          Continue
        </Button>
      </View>
      <Actionsheet isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
        <Actionsheet.Content>
          <View
            style={{
              height: Dimensions.get("window").height / 2,
              justifyContent: "center",
            }}
          >
            <View>
              {submissionStatus === "success" && (
                <View style={{ alignItems: "center", gap: 20 }}>
                  <Icon
                    as={MaterialIcons}
                    color={pickedColor}
                    name="check-circle"
                    size={120}
                  />
                  <Text
                    style={{
                      color: textColor,
                      textAlign: "center",
                      width: "70%",
                    }}
                  >
                    Transaction succesfully submitted.
                  </Text>
                </View>
              )}
              {submissionStatus === "error" && (
                <View style={{ alignItems: "center", gap: 20 }}>
                  <Icon
                    as={MaterialIcons}
                    color="error.500"
                    name="error"
                    size={120}
                  />
                  <Text
                    style={{
                      color: textColor,
                      textAlign: "center",
                      width: "70%",
                    }}
                  >
                    There was an error submitting the transaction. Please try
                    again.
                  </Text>
                </View>
              )}
              {submissionStatus === "loading" && (
                <View style={{ alignItems: "center", gap: 20 }}>
                  <Bounce color={pickedColor} size={120} />
                  <Text
                    style={{
                      color: textColor,
                      textAlign: "center",
                      width: "70%",
                    }}
                  >
                    Submitting transaction
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  shadow: {
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3.5,
    elevation: 5,
  },
})

export default Send
