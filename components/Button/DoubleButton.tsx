import React, { useContext } from "react"
import { StyleSheet, useColorScheme, View } from "react-native"
import { DataContext } from "../../providers/DataProvider"
import { DarkTheme, DefaultTheme } from "@react-navigation/native"
import { Button, useContrastText } from "native-base"

const DoubleButton = ({
  left,
  right,
  style = {},
  pointerEvents = "auto",
}): JSX.Element => {
  const color = useColorScheme() === "dark" ? "#fff" : "#000"
  const { pickedColor } = useContext(DataContext)
  const buttonBackgroundColor =
    useColorScheme() === "dark"
      ? DarkTheme.colors.background
      : DefaultTheme.colors.background

  const textColorPressed = useContrastText(pickedColor)

  return (
    <View style={[styles.container, style]}>
      <View>
        <View style={styles.row}>
          <View style={[styles.iconContainer]}>
            <Button.Group
              borderColor="red"
              borderRadius={15}
              colorScheme="blue"
              pointerEvents={pointerEvents as any}
              style={[
                styles.shadow,
                {
                  shadowColor: color,
                  backgroundColor: buttonBackgroundColor,
                },
              ]}
              variant="outline"
              isAttached
            >
              <Button
                _pressed={{
                  style: {
                    backgroundColor: pickedColor,
                    borderColor: pickedColor,
                  },
                  _text: { color: textColorPressed, borderColor: pickedColor },
                }}
                _text={{ color: color }}
                backgroundColor={buttonBackgroundColor}
                pointerEvents={pointerEvents as any}
                style={{ borderColor: pickedColor }}
                w="50%"
                onPress={left.onPress}
              >
                {left.text}
              </Button>
              <Button
                _pressed={{
                  style: {
                    backgroundColor: pickedColor,
                    borderLeftWidth: 1,
                    borderColor: pickedColor,
                  },
                  _text: { color: textColorPressed, borderColor: pickedColor },
                }}
                _text={{ color: color }}
                backgroundColor={buttonBackgroundColor}
                pointerEvents={pointerEvents as any}
                style={{ borderColor: pickedColor }}
                w="50%"
                onPress={right.onPress}
              >
                {right.text}
              </Button>
            </Button.Group>
          </View>
        </View>
      </View>
    </View>
  )
}

export default DoubleButton

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
