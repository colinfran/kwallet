import React from "react"
import { StatusBar } from "expo-status-bar"
import { useColorScheme, LogBox } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { extendTheme, NativeBaseProvider } from "native-base"
import { LinearGradient } from "expo-linear-gradient"
import * as Sentry from "sentry-expo"
import { DataProvider } from "./providers/DataProvider"
import Navigation from "./navigation"
import { devEnv, sentryDsn } from "./constants"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"

Sentry.init({
  dsn: sentryDsn,
  enableInExpoDevelopment: true,
  debug: devEnv !== "production",
  enabled: devEnv === "production",
})

if (devEnv === "development") {
  const ignoreWarns = [
    "EventEmitter.removeListener",
    "[fuego-swr-keys-from-collection-path]",
    "Setting a timer for a long period of time",
    "ViewPropTypes will be removed from React Native",
    "AsyncStorage has been extracted from react-native",
    "exported from 'deprecated-react-native-prop-types'.",
    "Non-serializable values were found in the navigation state.",
    "VirtualizedLists should never be nested inside plain ScrollViews",
    "Sending `onAnimatedValueUpdate` with no listeners registered",
  ]

  const warn = console.warn
  console.warn = (...arg) => {
    for (const warning of ignoreWarns) {
      if (arg[0].startsWith(warning)) {
        return
      }
    }
    warn(...arg)
  }

  LogBox.ignoreLogs(ignoreWarns)
}

const App = (): JSX.Element | null => {
  const colorScheme = useColorScheme()

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
      initialColorMode: useColorScheme(),
    },
  })

  return (
    <SafeAreaProvider>
      <DataProvider>
        <NativeBaseProvider
          config={{ dependencies: { "linear-gradient": LinearGradient } }}
          theme={theme}
        >
          <Navigation colorScheme={colorScheme} />
        </NativeBaseProvider>
      </DataProvider>
      <StatusBar />
    </SafeAreaProvider>
  )
}

export default App
