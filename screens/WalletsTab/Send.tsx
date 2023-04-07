import { Ionicons } from "@expo/vector-icons"
import {
  Box,
  Input,
  Button,
  IconButton,
  TextArea,
  useContrastText,
} from "native-base"
import React, { useContext, useEffect, useState } from "react"
import { View, StyleSheet, useColorScheme } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { DataContext } from "../../providers/DataProvider"
import opacity from "hex-color-opacity"
import * as Clipboard from "expo-clipboard"
import {
  DarkTheme,
  DefaultTheme,
  useNavigation,
} from "@react-navigation/native"

const Send = ({ route }): JSX.Element => {
  const [address, setAddress] = useState("")
  const [amount, setAmount] = useState("")
  const { pickedColor, textColor, backgroundColor } = useContext(DataContext)
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
      <View style={{ paddingTop: 20, height: "100%" }}>
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
      <View style={{ paddingTop: 100 }}>
        <Button
          backgroundColor={pickedColor}
          isDisabled={address === "" || amount === ""}
          w="full"
        >
          Continue
        </Button>
      </View>
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
