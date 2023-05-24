import React, { useState, useEffect, useContext } from "react"
import {
  StyleSheet,
  View,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native"
import {
  Button,
  Text,
  Input,
  Image,
  Actionsheet,
  Icon,
  Spinner,
  Pressable,
} from "native-base"
import * as Haptics from "expo-haptics"
import * as Sentry from "sentry-expo"

import UserResponsibility from "../../../components/UserResponsibility"
import { DataContext } from "../../../providers/DataProvider"
import image from "../../../assets/images/vault.png"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import ButtonOutline from "../../../components/Button/ButtonOutline"
import { apiKey, apiUrl } from "../../../constants/index"

const CreateWalletStep1 = ({ navigation }): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [checkbox1, setCheckbox1] = useState(false)
  const [checkbox2, setCheckbox2] = useState(false)
  const [checkbox3, setCheckbox3] = useState(false)
  const [walletPassword, setWalletPassword] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [show, setShow] = useState(false)

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const openBottomSheet = (): void => {
    setBottomSheetOpen(true)
  }

  const onCheckboxPress = (checkbox: number): void => {
    if (checkbox === 1) {
      setCheckbox1(!checkbox1)
    } else if (checkbox === 2) {
      setCheckbox2(!checkbox2)
    } else {
      setCheckbox3(!checkbox3)
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  useEffect(() => {
    setCheckbox1(false)
    setCheckbox2(false)
    setCheckbox3(false)
    setBottomSheetOpen(false)
  }, [])

  const getMnemonic = async (): void => {
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
        }),
      }
      const url = `${apiUrl}/api/wallet/create`
      const response = await fetch(url, options)
      const json = await response.json()
      console.log(json)
      if (!json.error) {
        setBottomSheetOpen(false)
        setLoading(false)
        navigation.navigate("CreateWalletStep2", { data: json })
      }
    } catch (error) {
      Sentry.Native.captureException(error)
    }
  }

  const { appColor, textColor } = useContext(DataContext)

  useEffect(() => {
    setIsValid(
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[\W_]).{8,}$/.test(
        walletPassword
      )
    )
  }, [walletPassword])

  return (
    <KeyboardAvoidingView behavior="padding" style={{ position: "relative" }}>
      <View style={styles.componentContainer}>
        <View style={styles.logoContainer}>
          <Image
            alt="Vault icon"
            resizeMode="contain"
            source={image}
            style={{ height: 175, width: 175, tintColor: textColor }}
          />
        </View>
        <View style={styles.textAndButtonContainer}>
          <View style={styles.textContainer}>
            <Text color={textColor} fontSize="2xl" bold>
              Back up secret phrase
            </Text>
            <Text color={textColor} fontSize="md" style={{ textAlign: "left" }}>
              {/* eslint-disable-next-line max-len */}
              {`Your secret phrase is the key to your wallet.\nNever share it and `}
              <Text
                color={textColor}
                fontSize="md"
                style={{ textDecorationLine: "underline", fontWeight: "bold" }}
              >
                do not lose it
              </Text>
              .
            </Text>
            <Text color={textColor} fontSize="sm">
              You must use a phrase that is longer than 8 characters, has at
              least 1 capital letter, and has at least one special character.
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Input
                autoCapitalize="none"
                borderColor={appColor}
                borderRadius={15}
                color={textColor}
                InputRightElement={
                  <Pressable onPress={() => setShow(!show)}>
                    <Icon
                      as={
                        <MaterialIcons
                          name={show ? "visibility" : "visibility-off"}
                        />
                      }
                      color="muted.400"
                      mr="2"
                      size={5}
                    />
                  </Pressable>
                }
                mx="3"
                placeholder="Wallet Password"
                returnKeyType="done"
                style={{ height: 60 }}
                textContentType="oneTimeCode"
                type={show ? "text" : "password"}
                w="100%"
                onChangeText={(e) => setWalletPassword(e)}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <ButtonOutline
              isDisabled={!isValid}
              leftIcon={
                <Icon
                  as={Ionicons}
                  name={
                    isValid ? "checkmark-circle-outline" : "warning-outline"
                  }
                  size="sm"
                />
              }
              text="Create Wallet"
              onPress={openBottomSheet}
            />
          </View>
        </View>
        <Actionsheet
          isOpen={bottomSheetOpen}
          onClose={() => setBottomSheetOpen(false)}
        >
          <View
            style={[styles.contentContainer, { backgroundColor: "#e5e5e5" }]}
          >
            <View style={styles.headerContainer}>
              <Button
                size="lg"
                variant="link"
                onPress={() => setBottomSheetOpen(false)}
              >
                Back
              </Button>
            </View>
            <UserResponsibility
              checkbox1={checkbox1}
              checkbox2={checkbox2}
              checkbox3={checkbox3}
              onCheckboxPress={onCheckboxPress}
            />
            <View style={styles.continueButton}>
              <ButtonOutline
                isDisabled={!(checkbox1 && checkbox2 && checkbox3)}
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
                        checkbox1 && checkbox2 && checkbox3
                          ? "checkmark-circle-outline"
                          : "warning-outline"
                      }
                      size="sm"
                    />
                  )
                }
                text="Continue"
                textColor="#000"
                onPress={getMnemonic}
              />
            </View>
          </View>
        </Actionsheet>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  componentContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: 20,
    zIndex: 0,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  textAndButtonContainer: {
    width: "100%",
  },
  textContainer: {
    paddingBottom: 40,
    gap: 10,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  boxLogo: {
    flex: 1,
    width: "100%",
    height: Dimensions.get("window").height / 3,
    justifyContent: "center",
    alignItems: "center",
  },
  boxCheckbox: {
    width: "100%",
  },
  boxCheckboxView: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 30,
    padding: 20,
  },
  checkboxText: {
    flexWrap: "wrap",
    paddingLeft: 20,
    paddingRight: 20,
    flexGrow: 1,
    flexShrink: 1,
  },
  contentContainer: {
    // flex: 1,
    alignItems: "center",
    backgroundColor: "#d4d4d4",
    padding: 40,
    width: "100%",
    position: "relative",
  },
  headerContainer: {
    alignItems: "flex-start",
    paddingLeft: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: "absolute",
    top: 0,
    left: 0,
  },
  continueButton: {
    width: "100%",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
})

export default CreateWalletStep1
