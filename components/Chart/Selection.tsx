import React, { useContext, useEffect } from "react"
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Dimensions,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { DataContext } from "../../providers/DataProvider"

export const Selection = ({
  graphData,
  arrayButtonsData,
  onButtonPress,
  selectedVariantIndex,
}): JSX.Element => {
  const offset = useSharedValue(0)

  const HEIGHT = 40
  const WIDTH = (Dimensions.get("window").width - 40) / arrayButtonsData.length

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value * WIDTH }],
    }
  })
  const { appColor, textColor, backgroundColor } = useContext(DataContext)

  const styles = StyleSheet.create({
    container: {
      width: "100%",
    },
    box: {
      width: WIDTH,
      height: HEIGHT,
      backgroundColor: backgroundColor,
      borderColor: appColor,
      borderRadius: 15,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      left: 0,
      right: 0,
      margin: "auto",
      zIndex: 0,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.35,
      shadowRadius: 3.5,
      elevation: 5,
      shadowColor: textColor,
    },
    buttonList: {
      flexDirection: "row",
      width: "100%",
    },
    button: {
      height: HEIGHT,
      width: WIDTH,
      justifyContent: "center",
      alignItems: "center",
    },
    label: {
      fontSize: 16,
      color: "#5A5A5A",
      // textAlign: "center",
      zIndex: 5,
    },
  })

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, animatedStyles]} />
      <View style={styles.buttonList}>
        {arrayButtonsData.map((element, i) => {
          const isSelected = i === selectedVariantIndex
          return (
            <TouchableWithoutFeedback
              key={i}
              testID={`test-chart-btn-${i}`}
              onPress={() => {
                onButtonPress(
                  graphData[element.buttonTitle.toLowerCase()].prices,
                  i
                )
                offset.value = withSpring(i)
              }}
            >
              <View style={styles.button}>
                <Text
                  style={[styles.label, isSelected && { color: textColor }]}
                >
                  {element.buttonTitle}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )
        })}
      </View>
    </View>
  )
}
