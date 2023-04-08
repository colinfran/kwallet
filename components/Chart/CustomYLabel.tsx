import React, { useEffect } from "react"
import { useSharedValue } from "react-native-reanimated"
import { ChartYLabel } from "@colinfran/animated-charts"

const CustomYLabel = ({
  currentPrice = 0,
  currencySymbol = "$",
  color,
}): JSX.Element => {
  const symbol = useSharedValue(currencySymbol)
  const latestCurrentPrice = useSharedValue(currentPrice)

  useEffect(() => {
    latestCurrentPrice.value = currentPrice
    symbol.value = currencySymbol
  }, [currencySymbol, currentPrice])

  const formatPrice = (value): any => {
    "worklet"
    if (value === "") {
      return `${symbol.value}${Number(latestCurrentPrice.value).toFixed(7)}`
    }
    return `${symbol.value}${Number(value).toFixed(7)}`
  }

  return <ChartYLabel color={color} format={formatPrice} />
}
export default CustomYLabel
