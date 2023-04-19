import React from "react"
import { extendTheme, NativeBaseProvider } from "native-base"
import { LinearGradient } from "expo-linear-gradient"

const theme = extendTheme({
  colors: {
    primary: {
      50: "#EAF9F7",
      100: "#D4F3EE",
      200: "#BFEEE6",
      300: "#AAE8DD",
      400: "#94E2D5",
      500: "#7FDCCC",
      600: "#66B0A3",
      700: "#4C847A",
      800: "#335852",
      900: "#192C29",
    },
  },
  config: {
    initialColorMode: "dark",
  },
})

export const NativeBaseProviderTest = ({ children }): JSX.Element => {
  return (
    <NativeBaseProvider
      config={{ dependencies: { "linear-gradient": LinearGradient } }}
      initialWindowMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
      theme={theme}
    >
      {children}
    </NativeBaseProvider>
  )
}