import React, { useContext } from "react"
import { StyleSheet, View } from "react-native"
import { DataContext } from "../../providers/DataProvider"
import { Button } from "native-base"

const DoubleButton = ({
  left,
  right,
  style = {},
  pointerEvents = "auto",
  buttonGroupStyle,
  buttonProps,
}): JSX.Element => {
  const { appColor } = useContext(DataContext)

  return (
    <View style={[styles.container, style]}>
      <View>
        <View style={styles.row}>
          <View style={[styles.iconContainer]}>
            <Button.Group
              borderColor="red"
              borderRadius={15}
              // borderWidth={2}
              colorScheme="blue"
              pointerEvents={pointerEvents as any}
              style={buttonGroupStyle}
              variant="outline"
              isAttached
            >
              <Button
                {...buttonProps}
                pointerEvents={pointerEvents as any}
                style={{ borderColor: appColor, borderWidth: 2 }}
                testID="test-left"
                w="50%"
                onPress={left.onPress}
              >
                {left.text}
              </Button>
              <Button
                {...buttonProps}
                pointerEvents={pointerEvents as any}
                style={{ borderColor: appColor, borderWidth: 2 }}
                testID="test-right"
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
})
