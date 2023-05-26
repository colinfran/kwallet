/* eslint-disable max-len */
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
  WarningOutlineIcon,
  PresenceTransition,
} from "native-base"
import { getLocales } from "expo-localization"
import React, { useContext, useEffect, useState, useRef } from "react"
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native"
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons"
import { DataContext } from "../../providers/DataProvider"
import opacity from "hex-color-opacity"
import * as Clipboard from "expo-clipboard"
import { useNavigation } from "@react-navigation/native"
import * as Sentry from "sentry-expo"
import FadeInOut from "react-native-fade-in-out"

import { apiKey, apiUrl } from "../../constants/index"

import { Bounce } from "react-native-animated-spinkit"
import { getCurrencySymbol } from "../../constants/currencies"

const Send = ({ route }): JSX.Element => {
  const [address, setAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [fee, setFee] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState("confirm")

  const [addressError, setAddressError] = useState(false)
  const [amountError, setAmountError] = useState(false)
  const [feeError, setFeeError] = useState(false)

  const {
    appColor,
    textColor,
    backgroundColor,
    wallets,
    selectedWalletIndex,
    graphData,
    selectedCurrency,
    modalBackgroundColor,
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

  const showAlert = (): void => {
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
    )
  }

  useEffect(() => {
    if (!isOpen) {
      setSubmissionStatus("confirm")
      setAddress("")
      setAmount("")
      setFee("")
    }
  }, [isOpen])

  const submitTransaction = async (): Promise<void> => {
    setSubmissionStatus("loading")
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
      const url = `${apiUrl}/v1/wallet/send`
      const response = await fetch(url, options)
      const json = await response.json()
      console.log(json)
      if (json) {
        if (json.error) {
          setSubmissionStatus("error")
          setAddress("")
          setAmount("")
          setFee("")
        }
        if (json.success) {
          setSubmissionStatus("success")
          setAddress("")
          setAmount("")
          setFee("")
        }
      }
    } catch (error) {
      Sentry.Native.captureException(error)
      console.log(error)
    }
  }

  const onButtonPress = (): void => {
    const isAddressInvalid = address.slice(0, 6) !== "kaspa:"
    if (isAddressInvalid) {
      setAddressError(true)
      return
    }

    const numAmount = Number(amount)
    const numFee = Number(fee)
    const numAvailable = graphData?.walletBalance?.available

    const isAmountInvalid = numAmount <= 0 || numAmount >= numAvailable
    if (isAmountInvalid) {
      setAmountError(true)
      return
    }

    const isFeeInvalid = numFee >= numAvailable
    if (isFeeInvalid) {
      setFeeError(true)
      return
    }
    setAddressError(false)
    setAmountError(false)
    setFeeError(false)
    setIsOpen(true)
  }

  const deviceLanguage = getLocales()[0]
  const locale = `${
    deviceLanguage.languageCode
  }-${deviceLanguage.measurementSystem.toUpperCase()}`

  const currencyFormatter = (val: number): string => {
    const symb = getCurrencySymbol(selectedCurrency)
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: selectedCurrency,
      currencyDisplay: "symbol",
    })
    const str = formatter.format(val).toString().split(symb)[1]
    return `${symb}${str}`
  }

  const monetaryValue = currencyFormatter(
    Number(amount) * graphData.currentPrice
  )

  const ref_input2 = useRef()
  const ref_input3 = useRef()

  const askSubmnit = (
    <View
      style={{
        width: Dimensions.get("window").width,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <View style={[styles.headerContainer, { left: 0 }]}>
        <Button size="lg" variant="link" onPress={() => setIsOpen(false)}>
          Back
        </Button>
      </View>
      <View style={{ marginTop: 60 }}>
        <Text style={{ color: textColor, fontSize: 26 }}>
          Confirm Transaction
        </Text>
      </View>
      <View
        style={{ flexDirection: "column", alignItems: "center", marginTop: 30 }}
      >
        <Text style={{ color: textColor, fontSize: 32 }}>{amount} KAS</Text>
        <Text style={{ color: textColor }}>{monetaryValue}</Text>
      </View>
      <View style={{ width: "100%", marginTop: 30, paddingHorizontal: 40 }}>
        <View style={{ borderTopColor: "lightgrey", borderTopWidth: 2 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 20,
            }}
          >
            <Text style={{ color: textColor }}>KAS price</Text>
            <Text style={{ color: textColor }}>
              {currencyFormatter(graphData.currentPrice)}
            </Text>
          </View>
        </View>
        <View style={{ borderTopColor: "lightgrey", borderTopWidth: 2 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 20,
            }}
          >
            <Text style={{ color: textColor }}>Fee</Text>
            <Text style={{ color: textColor }}>{fee}</Text>
          </View>
        </View>
        <View style={{ borderTopColor: "lightgrey", borderTopWidth: 2 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 20,
            }}
          >
            <Text style={{ color: textColor }}>Addresss</Text>
            <Text style={{ color: textColor }}>{address}</Text>
          </View>
        </View>
        <View style={{}}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 20,
            }}
          >
            <Text style={{ color: textColor }}>Total</Text>
            <Text style={{ color: textColor }}>
              {Number(amount) + Number(fee)} KAS
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{ width: "100%", paddingHorizontal: 40, marginVertical: 50 }}
      >
        <Button onPress={showAlert}>Confirm Transaction</Button>
      </View>
    </View>
  )

  return (
    <KeyboardAvoidingView style={styles.container}>
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
          <Input
            _focus={{
              style: {
                backgroundColor: opacity(appColor, 0.4),
                color: textColor,
              },
            }}
            autoCapitalize="none"
            autoFocus={true}
            borderColor={appColor}
            borderRadius={15}
            color={textColor}
            focusOutlineColor={appColor}
            h={"24"}
            InputRightElement={
              <View style={{ flexDirection: "row", height: "100%" }}>
                <IconButton
                  _icon={{
                    as: FontAwesome5,
                    name: "paste",
                    color: useContrastText(appColor),
                  }}
                  _pressed={{
                    style: {
                      backgroundColor: opacity(appColor, 0.8),
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
                    backgroundColor: appColor,
                    height: "100%",
                  }}
                  w={"12"}
                  onPress={onPastePress}
                />
                <IconButton
                  _icon={{
                    as: Ionicons,
                    name: "qr-code",
                    color: useContrastText(appColor),
                  }}
                  _pressed={{
                    style: {
                      backgroundColor: opacity(appColor, 0.8),
                    },
                    _icon: {
                      as: Ionicons,
                      name: "qr-code",
                      color: "#000",
                    },
                  }}
                  borderRadius={0}
                  key="qr-code"
                  style={{ backgroundColor: appColor }}
                  w={"12"}
                  onPress={() => navigation.navigate("ScanQr")}
                />
              </View>
            }
            placeholder="Kaspa Address"
            placeholderTextColor={textColor}
            returnKeyType="next"
            size="2xl"
            value={address}
            w="100%"
            onChangeText={(text) => setAddress(text)}
            onSubmitEditing={() => ref_input2?.current.focus()}
          />
        </Box>
        <View style={{ justifyContent: "center", marginTop: 10 }}>
          {addressError ? (
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <WarningOutlineIcon color={"error.500"} size="xs" />
              <Text style={{ color: "#ef4444", width: "80%" }}>
                {`Invalid address. Please make sure your address has the prefix "kaspa:"`}
              </Text>
            </View>
          ) : (
            <View style={{ height: 34 }} />
          )}
        </View>
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
                backgroundColor: opacity(appColor, 0.4),
                color: textColor,
              },
            }}
            _stack={{ style: { borderColor: appColor } }}
            autoCapitalize="none"
            borderColor={appColor}
            borderRadius={15}
            color={textColor}
            colorScheme={appColor}
            focusOutlineColor={appColor}
            h={"16"}
            inputMode="decimal"
            InputRightElement={
              <Button
                _pressed={{
                  style: {
                    backgroundColor: opacity(appColor, 0.8),
                    borderLeftColor: appColor,
                    borderLeftWidth: 2,
                  },
                  _text: {
                    color: "#000",
                  },
                }}
                _text={{
                  color: useContrastText(appColor),
                }}
                borderColor={appColor}
                h="full"
                rounded="none"
                style={{ backgroundColor: appColor }}
                w="1/6"
              >
                Max
              </Button>
            }
            keyboardType="number-pad"
            placeholder="Amount"
            placeholderTextColor={textColor}
            ref={ref_input2}
            returnKeyType="next"
            selectionColor={appColor}
            size="2xl"
            value={amount}
            w="100%"
            onChangeText={(val) => setAmount(val)}
            onSubmitEditing={() => ref_input3?.current.focus()}
          />
        </Box>
        <View style={{ justifyContent: "center", marginTop: 10 }}>
          {amountError ? (
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <WarningOutlineIcon color={"error.500"} size="xs" />
              <Text style={{ color: "#ef4444", width: "80%" }}>
                {`Invalid amount`}
              </Text>
            </View>
          ) : (
            <View style={{ height: 17 }} />
          )}
        </View>
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
                backgroundColor: opacity(appColor, 0.4),
                color: textColor,
              },
            }}
            _stack={{ style: { borderColor: appColor } }}
            autoCapitalize="none"
            borderColor={appColor}
            borderRadius={15}
            color={textColor}
            colorScheme={appColor}
            focusOutlineColor={appColor}
            h={"16"}
            inputMode="decimal"
            keyboardType="number-pad"
            placeholder="Transaction Fee"
            placeholderTextColor={textColor}
            ref={ref_input3}
            returnKeyType="done"
            selectionColor={appColor}
            size="2xl"
            value={fee}
            w="100%"
            onChangeText={(val) => setFee(val)}
          />
        </Box>
        <View style={{ justifyContent: "center", marginTop: 10 }}>
          {feeError ? (
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <WarningOutlineIcon color={"error.500"} size="xs" />
              <Text style={{ color: "#ef4444", width: "80%" }}>
                {`Invalid fee`}
              </Text>
            </View>
          ) : (
            <View style={{ height: 17 }} />
          )}
        </View>
      </View>
      <View style={{ paddingTop: 100 }}>
        <Button
          backgroundColor={appColor}
          isDisabled={address === "" || amount === "" || fee === ""}
          w="full"
          onPress={() => onButtonPress()}
        >
          Continue
        </Button>
      </View>
      <Actionsheet
        hideDragIndicator={true}
        isOpen={submissionStatus === "loading" ? true : isOpen}
        onClose={() => submissionStatus !== "loading" && setIsOpen(!isOpen)}
      >
        <Actionsheet.Content style={{ backgroundColor: modalBackgroundColor }}>
          <View
            style={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: "90%",
                justifyContent: "flex-start",
                alignItems: "center",
                position: "relative",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: submissionStatus === "confirm" ? 0 : -1000,
                  height: "100%",
                }}
              >
                <FadeInOut visible={submissionStatus === "confirm"}>
                  {askSubmnit}
                </FadeInOut>
              </View>
              <View
                style={{
                  position: "absolute",
                  top: submissionStatus === "success" ? 0 : -1000,
                  height: "100%",
                }}
              >
                <FadeInOut visible={submissionStatus === "success"}>
                  <View
                    style={{
                      width: Dimensions.get("screen").width - 40,
                      height: "100%",
                      position: "relative",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View style={[styles.headerContainer, { right: 0 }]}>
                      <Button
                        size="lg"
                        variant="link"
                        onPress={() => setIsOpen(false)}
                      >
                        Done
                      </Button>
                    </View>
                    <View
                      style={{
                        width: "70%",
                        alignItems: "center",
                        gap: 20,
                        justifyContent: "center",
                      }}
                    >
                      <Icon
                        as={MaterialIcons}
                        color={appColor}
                        name="check-circle"
                        size={120}
                      />
                      <Text
                        style={{
                          color: textColor,
                          textAlign: "center",
                          fontSize: 24,
                        }}
                      >
                        Transaction succesfully submitted.
                      </Text>
                    </View>
                  </View>
                </FadeInOut>
              </View>
              <View
                style={{
                  position: "absolute",
                  top: submissionStatus === "error" ? 0 : -1000,
                  height: "100%",
                }}
              >
                <FadeInOut visible={submissionStatus === "error"}>
                  <View
                    style={{
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 20,
                      position: "relative",
                    }}
                  >
                    <View style={[styles.headerContainer, { right: -20 }]}>
                      <Button
                        size="lg"
                        variant="link"
                        onPress={() => setIsOpen(false)}
                      >
                        Done
                      </Button>
                    </View>
                    <Icon
                      as={MaterialIcons}
                      color="error.500"
                      name="error"
                      size={120}
                    />
                    <View style={{ width: "90%" }}>
                      <Text
                        style={{
                          color: textColor,
                          textAlign: "center",
                          fontSize: 24,
                        }}
                      >
                        There was an error submitting the transaction. Please
                        try again.
                      </Text>
                    </View>
                  </View>
                </FadeInOut>
              </View>
              <View
                style={{
                  position: "absolute",
                  top: submissionStatus === "loading" ? 0 : -1000,
                  width: "100%",
                  height: "100%",
                }}
              >
                <FadeInOut visible={submissionStatus === "loading"}>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 20,
                      height: "100%",
                    }}
                  >
                    <Bounce color={appColor} size={120} />
                    <Text
                      style={{
                        color: textColor,
                        textAlign: "center",
                        fontSize: 24,
                      }}
                    >
                      Submitting transaction
                    </Text>
                  </View>
                </FadeInOut>
              </View>
            </View>
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </KeyboardAvoidingView>
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
  headerContainer: {
    alignItems: "flex-start",
    paddingLeft: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: "absolute",
    top: -20,
    zIndex: 50,
    height: "100%",
  },
})

export default Send
