import React, { useContext, useEffect, useState } from "react"
import { Dimensions, View, StyleSheet } from "react-native"
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartXLabel,
} from "@colinfran/animated-charts"
import * as Haptics from "expo-haptics"
import { Selection } from "./Selection"
import { DataContext } from "../../providers/DataProvider"

import Labels from "./Labels"
import { Skeleton } from "native-base"
import opacity from "hex-color-opacity"
import CustomYLabel from "./CustomYLabel"

export const { width: SIZE } = Dimensions.get("window")

const defaultData = [
  {
    timestamp: 1679246714543,
    value: 0.014540020460445197,
  },
  {
    timestamp: 1679247047789,
    value: 0.014571506674731024,
  },
  {
    timestamp: 1679247288167,
    value: 0.014452072671740143,
  },
]

const getCurrencySymbol = (currency): string => {
  let symbol = "$"
  switch (currency) {
    case "EUR":
      symbol = "€"
      break
    case "JPY":
      symbol = "¥"
      break
    case "GBP":
      symbol = "£"
      break
    case "CNY":
      symbol = "¥"
      break
    case "AUD":
      symbol = "$"
      break
    case "CAD":
      symbol = "$"
      break
    case "CHF":
      symbol = "CHF "
      break
    default:
      symbol = "$"
      break
  }
  return symbol
}

const Chart = (): JSX.Element => {
  const {
    graphData,
    pickedColor,
    selectedGraphIndex,
    setSelectedGraphIndex,
    textColor,
    selectedCurrency,
  } = useContext(DataContext)

  const currencySymbol = getCurrencySymbol(selectedCurrency)

  const isLoaded = graphData

  // const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)

  const [data, setData] = useState(graphData?.day?.prices || defaultData)

  const [arrayButtonsData, setArrayButtonsData] = useState([
    { buttonTitle: "Day" },
  ])

  // const [, forceUpdate] = useReducer((x) => x + 1, 0)

  // useEffect(() => {
  //   forceUpdate()
  // }, [selectedCurrency])

  useEffect(() => {
    if (graphData) {
      if (graphData?.day?.prices) {
        setData(graphData?.day?.prices)
      }
      const arrayButtons = [{ buttonTitle: "Day" }]
      if (graphData?.week?.prices.length > 0)
        arrayButtons.push({ buttonTitle: "Week" })
      if (graphData?.month?.prices.length > 0)
        arrayButtons.push({ buttonTitle: "Month" })
      if (graphData?.year?.prices.length > 0)
        arrayButtons.push({ buttonTitle: "Year" })
      if (graphData?.all?.prices.length > 0)
        arrayButtons.push({ buttonTitle: "All" })
      setArrayButtonsData(arrayButtons)
    }
  }, [graphData, selectedCurrency])

  const invokeHaptic = (): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const onButtonPress = (element, index): void => {
    setSelectedGraphIndex(index)
    setData(element)
    invokeHaptic()
  }

  const getX = (value): string => {
    "worklet"
    if (value && !isNaN(value)) {
      // return `${runOnJS(getTimeDate)(new Number(value))}`
      return `${new Date(new Number(value)).toLocaleString([], {
        dateStyle: "short",
        timeStyle: "short",
      })}`
    }
    return `${value}`
  }

  const [isActive, setIsActive] = useState(false)

  return (
    <Skeleton
      h={360}
      isLoaded={isLoaded}
      w={Dimensions.get("window").width}
      // style={{justifyContent:"center", alignItems:'center'}}
    >
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <View style={styles.selectionContainer}>
            <Selection
              arrayButtonsData={arrayButtonsData}
              graphData={graphData}
              selectedVariantIndex={selectedGraphIndex}
              onButtonPress={onButtonPress}
            />
          </View>
        </View>
        <View>
          <ChartPathProvider
            data={{
              points: data.map(({ timestamp, value }) => ({
                x: timestamp,
                y: value,
              })),
              smoothingStrategy: "bezier",
            }}
            nowData={{
              currentPrice: graphData?.currentPrice || "",
              currencySymbol,
            }}
          >
            {!isActive && (
              <Labels color={textColor} isCard={false} width={SIZE} />
            )}
            <ChartPath
              backgroundGrandient={opacity(pickedColor, 0.2)}
              gradientEnabled={true}
              hapticsEnabled={true}
              height={
                Dimensions.get("window").height > 800 ? SIZE / 3 : SIZE / 3.5
              }
              selectedStrokeWidth={3}
              stroke={pickedColor}
              strokeWidth={3}
              width={SIZE}
              onActiveFunction={() => setIsActive(true)}
              onEndFunction={() => setIsActive(false)}
            />
            <ChartDot size={16} style={{ backgroundColor: pickedColor }} />
            <View
              style={{
                // backgroundColor: opacity(pickedColor, 0.2),
                marginTop: -10,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 30,
                }}
              >
                <ChartXLabel color={textColor} format={getX} />
                <CustomYLabel
                  color={textColor}
                  currencySymbol={currencySymbol}
                  currentPrice={graphData?.currentPrice || 0}
                />
              </View>
            </View>
          </ChartPathProvider>
        </View>
      </View>
    </Skeleton>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    // padding: 20,
    paddingTop: 0,
    // marginBottom: 20,
  },
  selectionContainer: {
    justifyContent: "space-evenly",
  },
})

export default Chart
