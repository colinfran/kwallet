import React, { useContext, useState } from "react"
import { Tooltip } from "native-base"
import {
  View,
  StyleSheet,
  Text,
  useColorScheme,
  Share,
  Dimensions,
} from "react-native"
import QRCode from "react-native-qrcode-svg"

import * as Clipboard from "expo-clipboard"
import { DataContext } from "../../providers/DataProvider"
import DoubleButton from "../../components/Button/DoubleButton"

const Recieve = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)
  const { pickedColor, wallets, selectedWalletIndex } = useContext(DataContext)
  const walletStr = wallets[selectedWalletIndex].walletData.address
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

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

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: "white", padding: 40, borderRadius: 20 }}>
        <QRCode
          backgroundColor="transparent"
          color={pickedColor}
          size={Dimensions.get("window").height < 800 ? 160 : 200}
          value={walletStr}
        />
        <View
          style={{
            marginTop: 20,
            width: Dimensions.get("window").height < 800 ? 160 : 200,
          }}
        >
          <Text style={{ fontSize: 12, textAlign: "center" }}>{walletStr}</Text>
        </View>
      </View>
      <View
        style={[
          {
            paddingTop: 20,
            margin: "auto",
          },
        ]}
      >
        <Tooltip
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
        </Tooltip>
      </View>
      <View
        style={{
          paddingTop: 30,
          justifyContent: "center",
          alignItems: "center",
          width: "70%",
          margin: "auto",
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
          paddingTop: 30,
          justifyContent: "center",
          alignItems: "center",
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  shadow: {
    backgroundColor: "transparent",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
})

export default Recieve
