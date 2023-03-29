import React from "react"
import { StatusBar } from "expo-status-bar"
import { useColorScheme, LogBox } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NativeBaseProvider } from "native-base"
import { LinearGradient } from "expo-linear-gradient"
import * as Sentry from "sentry-expo"

import { DataProvider } from "./providers/DataProvider"

import Navigation from "./navigation"
import { sentryDsn } from "./env"
/*
  "Native crash reporting is not available in Expo Go, it is only available in 
  standalone builds or development builds."
 */
Sentry.init({
  dsn: sentryDsn,
  enableInExpoDevelopment: true,
  debug: true,
})

if (__DEV__) {
  const ignoreWarns = [
    "EventEmitter.removeListener",
    "[fuego-swr-keys-from-collection-path]",
    "Setting a timer for a long period of time",
    "ViewPropTypes will be removed from React Native",
    "AsyncStorage has been extracted from react-native",
    "exported from 'deprecated-react-native-prop-types'.",
    "Non-serializable values were found in the navigation state.",
    "VirtualizedLists should never be nested inside plain ScrollViews",
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

  return (
    <SafeAreaProvider>
      <DataProvider>
        <NativeBaseProvider
          config={{ dependencies: { "linear-gradient": LinearGradient } }}
        >
          <Navigation colorScheme={colorScheme} />
        </NativeBaseProvider>
      </DataProvider>
      <StatusBar />
    </SafeAreaProvider>
  )
}

export default App
