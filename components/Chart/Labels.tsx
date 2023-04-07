import React, { useCallback, useContext, useMemo, useState } from "react"
import { View, Text } from "react-native"
import { useChartData } from "@colinfran/animated-charts"
import { DataContext } from "../../providers/DataProvider"

function trim(val): number {
  return Math.min(Math.max(val, 0.05), 0.95)
}

const CenteredLabel = ({ position, style, width, ...props }): JSX.Element => {
  const [componentWidth, setWidth] = useState(0)
  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { width: newWidth },
      },
    }) => {
      setWidth(newWidth)
    },
    [setWidth]
  )

  const left = useMemo(
    () =>
      Math.max(
        Math.floor(
          Math.min(
            width * position - componentWidth / 2,
            width - componentWidth - 10
          )
        ),
        10
      ),
    [componentWidth, position, width]
  )
  return (
    <View
      style={{
        ...style,
        left,
        opacity: componentWidth ? 1 : 0,
        position: "absolute",
      }}
      onLayout={onLayout}
    >
      <Text style={{ color: props.color, fontSize: 12 }} weight="bold">
        {props.children}
      </Text>
    </View>
  )
}

const getCurrencySymbol = (locale, currency) => (0).toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, '').trim()


const Labels = ({ width, isCard, color }): JSX.Element | null => {
  const { greatestX, greatestY, smallestX, smallestY } = useChartData()

  const { selectedCurrency, selectedCurrencyValue } = useContext(DataContext)

  const currencySymbol = getCurrencySymbol("en-US", selectedCurrency)

  if (!greatestX) {
    return null
  }
  const positionMin = trim(
    (smallestY.x - smallestX.x) / (greatestX.x - smallestX.x)
  )
  const positionMax = trim(
    (greatestY.x - smallestX.x) / (greatestX.x - smallestX.x)
  )

  const smallestYVal = Number(smallestY.y) * selectedCurrencyValue
  const largestYval = Number(greatestY.y) * selectedCurrencyValue

  return (
    <>
      {positionMin ? (
        <CenteredLabel
          color={color}
          fontSize={isCard ? "13pt" : undefined}
          position={positionMin}
          style={{
            bottom: isCard ? -12 : 70,
            zIndex: 6,
          }}
          width={width}
        >
          {`${currencySymbol}${smallestYVal.toFixed(7)}`}
        </CenteredLabel>
      ) : null}
      {positionMax ? (
        <CenteredLabel
          color={color}
          fontSize={isCard ? "13pt" : undefined}
          position={positionMax}
          style={{
            top: -10,
            left: isCard ? 0 : 50,
            zIndex: 6,
          }}
          width={width}
        >
          {`${currencySymbol}${largestYval.toFixed(7)}`}
        </CenteredLabel>
      ) : null}
    </>
  )
}

export default React.memo(Labels)
