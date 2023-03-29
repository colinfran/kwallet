import React, { useContext, useEffect } from "react"
import { ColorSchemeName } from "react-native"
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import Loading from "../screens/Loading"
import { RootStackParamList } from "../types"
import BottomTabNavigator from "./BottomTabNavigator"
import { DataContext } from "../providers/DataProvider"
import AddWallet from "../screens/AddWallet"
import ImportWallet from "../screens/ImportWallet"
import {
  CreateWalletStep1,
  CreateWalletStep3,
  CreateWalletStep2,
} from "../screens/CreateWallet"

import { Ionicons } from "@expo/vector-icons"
import * as Font from "expo-font"
import * as SplashScreen from "expo-splash-screen"

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
const Navigation = ({
  colorScheme,
}: {
  colorScheme: ColorSchemeName
}): JSX.Element => {
  const { setLoading } = useContext(DataContext)

  useEffect(() => {
    const loadResourcesAndDataAsync = async (): Promise<void> => {
      try {
        SplashScreen.preventAutoHideAsync()

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
        })
      } catch (e) {
        // add code here for error reporting service
        console.warn(e)
      } finally {
        SplashScreen.hideAsync()
        setLoading(false)
      }
    }

    loadResourcesAndDataAsync()
  }, [setLoading])

  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  )
}

export default Navigation

const Stack = createStackNavigator<RootStackParamList>()

const RootNavigator = (): JSX.Element => {
  const { loading, wallets } = useContext(DataContext)
  if (loading) {
    return (
      <Stack.Navigator>
        <Stack.Screen component={Loading} name="Loading" />
      </Stack.Navigator>
    )
  }
  if (loading && wallets[0]) {
    return (
      <Stack.Navigator>
        <Stack.Screen component={Loading} name="Loading" />
      </Stack.Navigator>
    )
  }
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
