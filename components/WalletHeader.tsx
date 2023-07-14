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
          // borderColor: appColor,
          // shadowColor: textColor,
        },
      ]}
    >
      <View style={{ height: 60 }}>
        <Skeleton isLoaded={isLoaded} marginBottom={2} w={310}>
          <Heading color={textColor} textAlign={"center"} size="3xl" width={Dimensions.get("window").width} testID="test-walletAmountUSD">
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
    </View>
  )
}

export default WalletAmount

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
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
