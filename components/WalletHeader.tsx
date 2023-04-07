import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, View, useColorScheme, Dimensions } from "react-native"
import { Skeleton, Text, Heading, useContrastText, useTheme } from "native-base"
import { DataContext } from "../providers/DataProvider"
import DoubleButton from "./Button/DoubleButton"
import {
  DarkTheme,
  DefaultTheme,
  useNavigation,
} from "@react-navigation/native"

const currencyFormatter = (val: number): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
  return formatter.format(val)
}

const WalletAmount = (): JSX.Element => {
  const { graphData, pickedColor, walletBalance } = useContext(DataContext)
  const navigation = useNavigation()

  const isLoaded = walletBalance

  const walletTotal = walletBalance?.available || 0
  const textColor = useContrastText(pickedColor)
  const shadowColor = useColorScheme() === "dark" ? "#fff" : "#000"
  const color = useColorScheme() === "dark" ? "#fff" : "#000"

  const apiVal = graphData ? graphData : { currentPrice: "0" }

  const { currentPrice = "0" } = apiVal
  const value = parseFloat(walletTotal) * parseFloat(currentPrice)
  const walletTotalMonetaryValue = currencyFormatter(value)

  const buttonBackgroundColor =
    useColorScheme() === "dark"
      ? DarkTheme.colors.background
      : DefaultTheme.colors.background

  const textColorPressed = useContrastText(pickedColor)
  const theme = useTheme()
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: buttonBackgroundColor,
          borderColor: pickedColor,
          shadowColor: shadowColor,
        },
      ]}
    >
      <View>
        <Skeleton isLoaded={isLoaded} marginBottom={2} w={310}>
          <Heading color={color} size="3xl">
            {walletTotalMonetaryValue}
          </Heading>
        </Skeleton>
      </View>
      <View>
        <Skeleton isLoaded={isLoaded} w={230}>
          <Text color={color} fontSize="xl">{`${walletTotal} KAS`}</Text>
        </Skeleton>
      </View>
      <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 30 }}>
        <DoubleButton
          buttonGroupStyle={[
            styles.shadow,
            {
              shadowColor: color,
              backgroundColor: buttonBackgroundColor,
            },
          ]}
          buttonProps={{
            _pressed: {
              style: {
                backgroundColor: pickedColor,
                borderColor: pickedColor,
              },
              _text: { color: textColorPressed, borderColor: pickedColor },
            },
            _text: { color: color },
            backgroundColor: buttonBackgroundColor,
          }}
          left={{
            text: "Send",
            onPress: () => navigation.navigate("Send"),
          }}
          // pointerEvents="box-none"
          right={{
            text: "Receive",
            onPress: () => navigation.navigate("Receive"),
          }}
        />
      </View>
      <View
        style={{
          borderColor: pickedColor,
          borderWidth: 2,
          borderBottomWidth: 0,
          width: Dimensions.get("window").width,
          height: 500,
          position: "absolute",
          top: -500,
          zIndex: 0,
        }}
      ></View>
    </View>
  )
}

export default WalletAmount

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Dimensions.get("window").height < 800 ? "10%" : "20%",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
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
