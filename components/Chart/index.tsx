import React, { useContext, useEffect, useState } from "react"
import { Dimensions, View, StyleSheet, useColorScheme } from "react-native"
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartXLabel,
  ChartYLabel,
} from "@colinfran/animated-charts"
import * as Haptics from "expo-haptics"
import { Selection } from "./Selection"
import { DataContext } from "../../providers/DataProvider"
import { Svg, Rect, Defs, Stop, LinearGradient } from "react-native-svg"

import Labels from "./Labels"
import { Skeleton } from "native-base"
import opacity from "hex-color-opacity"

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

const Chart = (): JSX.Element => {
  const { apiData, pickedColor } = useContext(DataContext)

  const isLoaded = apiData

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)

  const [data, setData] = useState(apiData?.week?.prices || defaultData)

  const [arrayButtonsData, setArrayButtonsData] = useState([
    { buttonTitle: "Day" },
  ])

  useEffect(() => {
    if (apiData) {
      if (apiData?.day?.prices) {
        setData(apiData?.day?.prices)
      }
      const arrayButtons = [{ buttonTitle: "Day" }]
      if (apiData?.week?.prices.length > 0)
        arrayButtons.push({ buttonTitle: "Week" })
      if (apiData?.month?.prices.length > 0)
        arrayButtons.push({ buttonTitle: "Month" })
      if (apiData?.year?.prices.length > 0)
        arrayButtons.push({ buttonTitle: "Year" })
      if (apiData?.all?.prices.length > 0)
        arrayButtons.push({ buttonTitle: "All" })
      setArrayButtonsData(arrayButtons)
    }
  }, [apiData])

  const invokeHaptic = (): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const onButtonPress = (element, index): void => {
    setSelectedVariantIndex(index)
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

  const getY = (value): string => {
    "worklet"
    if (value && !isNaN(value)) {
      return `$${new Number(value).toFixed(7)}`
    }
    return `${value}`
  }

  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  const [isActive, setIsActive] = useState(false)

  const whiteThemSkeletonStyles = useColorScheme() !== "dark" && {
    startColor: "muted.100",
    endColor: "muted.400",
  }

  return (
    <Skeleton
      {...whiteThemSkeletonStyles}
      h={360}
      isLoaded={isLoaded}
      w={Dimensions.get("window").width}
      // style={{justifyContent:"center", alignItems:'center'}}
    >
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <View style={styles.selectionContainer}>
            <Selection
              apiData={apiData}
              arrayButtonsData={arrayButtonsData}
              selectedVariantIndex={selectedVariantIndex}
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
            nowData={{ currentPrice: apiData?.currentPrice || "" }}
          >
            {!isActive && (
              <Labels color={textColor} isCard={false} width={SIZE} />
            )}
            <ChartPath
              // backgroundColor="red"
              backgroundGradientFrom={opacity(pickedColor, 0.4)}
              backgroundGradientTo={pickedColor}
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
                backgroundColor: opacity(pickedColor, 0.2),
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
                <ChartYLabel color={textColor} format={getY} />
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
