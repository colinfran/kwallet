import React, { useContext, useEffect, useRef, useState } from "react"
import { Tooltip, useContrastText } from "native-base"
import {
  View,
  StyleSheet,
  Text,
  Share,
  Dimensions,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import QRCode from "react-native-qrcode-svg"

import * as Clipboard from "expo-clipboard"
import { DataContext } from "../../providers/DataProvider"
import DoubleButton from "../../components/Button/DoubleButton"
import { Ionicons } from "@expo/vector-icons"

const Recieve = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    appColor,
    wallets,
    selectedWalletIndex,
    textColor,
    backgroundColor,
    modalBackgroundColor,
  } = useContext(DataContext)
  const walletStr = wallets[selectedWalletIndex].walletData.address

  const copyOnPress = async (): Promise<void> => {
    await Clipboard.setStringAsync(walletStr)
    setIsOpen(true)
    setTimeout(() => {
      setIsOpen(false)
    }, 3000)
  }

  const shareOnPress = async (): Promise<void> => {
    await Share.share({
      message: walletStr,
      title: "Kaspa Wallet Address",
    })
  }

  const textColorPressed = useContrastText(appColor)

  const qrBackgroundColor = useColorScheme() === "dark" ? "#f5f5f5" : "#262626"
  const textAlt = useColorScheme() === "dark" ? "#000" : "#fff"
  const scrollRef = useRef()

  useEffect(() => {
    return () => {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: false,
      })
    }
  }, [])

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      ref={scrollRef}
      style={{ width: "100%" }}
    >
      <View
        style={{
          backgroundColor: qrBackgroundColor,
          padding: 40,
          borderRadius: 20,
        }}
      >
        <QRCode
          backgroundColor="transparent"
          color={appColor}
          size={Dimensions.get("window").height < 800 ? 160 : 200}
          value={walletStr}
        />
        <View
          style={{
            marginTop: 20,
            width: Dimensions.get("window").height < 800 ? 160 : 200,
          }}
        >
          <Text
            style={{
              color: useColorScheme() === "dark" ? "#000" : "#fff",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            {walletStr}
          </Text>
        </View>
        <View>
          <Tooltip
            isOpen={isOpen}
            label="Copied to clipboard"
            placement="bottom"
            style={{ margin: "auto", alignSelf: "center" }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 30,
              }}
            >
              <TouchableOpacity onPress={() => copyOnPress()}>
                <Ionicons color={appColor} name="copy" size={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => shareOnPress()}>
                <Ionicons color={appColor} name="share-social" size={24} />
              </TouchableOpacity>
            </View>
          </Tooltip>
        </View>
      </View>
      <View
        style={[
          {
            margin: "auto",
          },
        ]}
      >
        {/* <Tooltip
          isOpen={isOpen}
          label="Copied to clipboard"
          placement="bottom"
          style={{ margin: "auto", alignSelf: "center" }}
        >
          <View
            style={{
              alignSelf: "center",
              justifyContent: "center",
              flexDirection: "row",
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <DoubleButton
              buttonGroupStyle={[
                styles.shadow,
                {
                  shadowColor: textColor,
                  backgroundColor: modalBackgroundColor,
                },
              ]}
              buttonProps={{
                _pressed: {
                  style: {
                    backgroundColor: appColor,
                    borderColor: appColor,
                  },
                  _text: { color: textColorPressed, borderColor: appColor },
                },
                _text: { color: textColor },
                backgroundColor: modalBackgroundColor,
              }}
              left={{
                text: "Copy",
                onPress: () => copyOnPress(),
              }}
              right={{
                text: "Share",
                onPress: () => shareOnPress(),
              }}
            />
          </View>
        </Tooltip> */}
      </View>
      <View style={{ gap: 10, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            width: "70%",
          }}
        >
          <Text style={{ color: textColor, textAlign: "center", fontSize: 12 }}>
            Scan the QR or tap the above button to copy this wallet address to
            your clipbaord.
          </Text>
        </View>
        <View
          style={{
            width: "70%",
            margin: "auto",
            gap: 5,
          }}
        >
          <Text style={{ color: textColor, textAlign: "center", fontSize: 12 }}>
            **IMPORTANT**
          </Text>
          <Text style={{ color: textColor, textAlign: "center", fontSize: 12 }}>
            Send only Kaspa (KAS) to this Address.
          </Text>
          <Text style={{ color: textColor, textAlign: "center", fontSize: 12 }}>
            Sending any other coins will result in permanent loss.
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // justifyContent: "center",
    alignItems: "center",
    gap: 20,
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

export default Recieve
