import React, { useEffect } from "react"
import { useSharedValue } from "react-native-reanimated"
import { ChartYLabel } from "@colinfran/animated-charts"

const CustomYLabel = ({
  currentPrice = 0,
  currencySymbol = "$",
  color,
  style,
}): JSX.Element => {
  const symbol = useSharedValue(currencySymbol)
  const latestCurrentPrice = useSharedValue(currentPrice)

  useEffect(() => {
    latestCurrentPrice.value = currentPrice
    symbol.value = currencySymbol
  }, [currencySymbol, currentPrice, latestCurrentPrice, symbol])

  const formatPrice = (value): any => {
    "worklet"
    if (value === "") {
      return `${symbol.value}${Number(latestCurrentPrice.value).toFixed(7)}`
    }
    return `${symbol.value}${Number(value).toFixed(7)}`
  }

  return <ChartYLabel color={color} format={formatPrice} style={style} />
}
export default CustomYLabel
