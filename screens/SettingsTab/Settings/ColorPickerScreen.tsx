import React, { useContext } from "react"
import { View, StyleSheet } from "react-native"
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from "reanimated-color-picker"
import { DataContext } from "../../../providers/DataProvider"

const ColorPickerScreen = (): JSX.Element => {
  const { appColor, setappColor } = useContext(DataContext)
  return (
    <View style={styles.container}>
      <ColorPicker
        style={{ width: "70%" }}
        value={appColor}
        onComplete={({ hex }) => setappColor(hex)}
      >
        <Preview hideInitialColor={true} />
        <Panel1 />
        <HueSlider />
        <OpacitySlider />
        <Swatches />
      </ColorPicker>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
})

export default ColorPickerScreen
