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

Sentry.init({
  dsn: sentryDsn,
  enableInExpoDevelopment: true,
  debug: true,
})

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
