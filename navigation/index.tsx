import React, { useContext, useEffect } from "react"
import { ColorSchemeName } from "react-native"
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import * as Sentry from "sentry-expo"

import { RootStackParamList } from "./types"
import BottomTabNavigator from "./BottomTabNavigator"
import { DataContext } from "../providers/DataProvider"
import AddWallet from "../screens/AddWallet"
import ImportWallet from "../screens/AddWallet/ImportWallet"
import {
  CreateWalletStep1,
  CreateWalletStep3,
  CreateWalletStep2,
} from "../screens/AddWallet/CreateWallet"

import { Ionicons } from "@expo/vector-icons"
import * as Font from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"

SplashScreen.preventAutoHideAsync()

const Navigation = ({
  colorScheme,
}: {
  colorScheme: ColorSchemeName
}): JSX.Element => {
  useEffect(() => {
    const loadResourcesAndDataAsync = async (): Promise<void> => {
      try {
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
        })
      } catch (e) {
        Sentry.Native.captureException(e)
        console.warn(e)
      } finally {
        SplashScreen.hideAsync()
      }
    }
    loadResourcesAndDataAsync()
  }, [])

  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <BottomSheetModalProvider>
        <RootNavigator />
      </BottomSheetModalProvider>
    </NavigationContainer>
  )
}

export default Navigation

const Stack = createStackNavigator<RootStackParamList>()

const RootNavigator = (): JSX.Element => {
  const { wallets } = useContext(DataContext)
  return (
    <Stack.Navigator
      initialRouteName={wallets.length > 0 ? "Root" : "AddWallet"}
    >
      {wallets.length > 0 ? (
        <>
          <Stack.Screen
            component={BottomTabNavigator}
            name="Root"
            options={{ title: "Kaspa Wallet", headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            component={AddWallet}
            name="AddWallet"
            options={{
              title: "",
            }}
          />
          <Stack.Screen
            component={ImportWallet}
            name="ImportWallet"
            options={{
              title: "",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            component={CreateWalletStep1}
            name="CreateWalletStep1"
            options={{
              title: "",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            component={CreateWalletStep2}
            name="CreateWalletStep2"
            options={{
              title: "",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            component={CreateWalletStep3}
            name="CreateWalletStep3"
            options={{
              title: "",
              headerBackTitle: "Back",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  )
}
