import React, { useContext } from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import { Skeleton, Text, Heading, useContrastText } from "native-base"
import { DataContext } from "../providers/DataProvider"
import DoubleButton from "./Button/DoubleButton"
import { useNavigation } from "@react-navigation/native"
import { getLocales } from "expo-localization"
import { getCurrencySymbol } from "../constants/currencies"

const WalletAmount = (): JSX.Element => {
  const { graphData, appColor, backgroundColor, textColor, selectedCurrency } =
    useContext(DataContext)
  const navigation = useNavigation()

  const apiVal = graphData ? graphData : { currentPrice: "0" }

  const isLoaded = graphData

  // console.log(apiVal?.walletBalance)

  const walletTotal = apiVal?.walletBalance?.available || 0

  const { currentPrice = "0" } = apiVal
  const value = parseFloat(walletTotal) * parseFloat(currentPrice)

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

  const walletTotalMonetaryValue = currencyFormatter(value)

  const textColorPressed = useContrastText(appColor)
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
          borderColor: appColor,
          shadowColor: textColor,
        },
      ]}
    >
      <View>
        <Skeleton isLoaded={isLoaded} marginBottom={2} w={310}>
          <Heading color={textColor} size="3xl" testID="test-walletAmountUSD">
            {walletTotalMonetaryValue}
          </Heading>
        </Skeleton>
      </View>
      <View>
        <Skeleton isLoaded={isLoaded} w={230}>
          <Text color={textColor} fontSize="xl" testID="test-walletAmount">
            {`${walletTotal} KAS`}
          </Text>
        </Skeleton>
      </View>
      <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 30 }}>
        <DoubleButton
          buttonGroupStyle={[
            styles.shadow,
            {
              shadowColor: textColor,
              backgroundColor: backgroundColor,
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
            backgroundColor: backgroundColor,
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
          borderColor: appColor,
          borderWidth: 2,
          borderBottomWidth: 0,
          width: Dimensions.get("window").width - 10,
          height: 500,
          position: "absolute",
          top: -500,
          zIndex: 0,
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowColor: textColor,
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
          elevation: 5,
        }}
      ></View>
    </View>
  )
}

export default WalletAmount

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
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
