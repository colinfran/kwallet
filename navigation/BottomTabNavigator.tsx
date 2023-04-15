/* eslint-disable max-len */
import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import React, { useContext, useEffect } from "react"

import WalletsTab from "../screens/WalletsTab"
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from "./types"
import { DataContext } from "../providers/DataProvider"
import SettingsScreen from "../screens/SettingsTab/Settings/SettingsScreen"
import FrameworksScreen from "../screens/SettingsTab/Settings/FrameworksScreen"
import TermsScreen from "../screens/SettingsTab/Settings/TermsScreen"
import PrivacyPolicyScreen from "../screens/SettingsTab/Settings/PrivacyPolicyScreen"
import Recieve from "../screens/WalletsTab/Receive"
import Send from "../screens/WalletsTab/Send"
import ScanQr from "../screens/WalletsTab/ScanQr"
import AddWallet from "../screens/AddWallet"
import {
  CreateWalletStep1,
  CreateWalletStep2,
  CreateWalletStep3,
} from "../screens/AddWallet/CreateWallet"
import ImportWallet from "../screens/AddWallet/ImportWallet"
import FaqScreen from "../screens/SettingsTab/Settings/FaqScreen"
import GuideScreen from "../screens/SettingsTab/Settings/GuideScreen"
import SelectedCurrencyScreen from "../screens/SettingsTab/Settings/SelectedCurrencyScreen"

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

const BottomTabNavigator = (): JSX.Element => {
  const { appColor, setGraphData, getGraphData, selectedCurrency } =
    useContext(DataContext)

  useEffect(() => {
    const getLineGraphData = async (): Promise<void> => {
      const response = await getGraphData()
      if (response && !response.error && response.currentPrice) {
        setGraphData(response)
      }
    }
    getLineGraphData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency])

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: appColor,
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        component={TabOneNavigator}
        name="TabOne"
        options={() => ({
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name="wallet" />,
          tabBarShowLabel: false,
        })}
      />
      <BottomTab.Screen
        component={TabTwoNavigator}
        name="TabTwo"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} name="settings-outline" />
          ),
          tabBarShowLabel: false,
        }}
      />
    </BottomTab.Navigator>
  )
}

export default BottomTabNavigator

const TabBarIcon = (props: { name: string; color: string }): JSX.Element => {
  return (
    <Ionicons
      color={props.color}
      name={props.name as any}
      size={30}
      style={{ marginBottom: -3 }}
    />
  )
}

const TabOneStack = createStackNavigator<TabOneParamList>()

const TabOneNavigator = (): JSX.Element => {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        component={WalletsTab}
        name="WalletsTab"
        options={{ title: "", headerShown: false }}
      />
      <TabOneStack.Screen
        component={Recieve}
        name="Receive"
        options={{ title: "" }}
      />
      <TabOneStack.Screen
        component={Send}
        name="Send"
        options={{ title: "" }}
      />
      <TabOneStack.Screen
        component={ScanQr}
        name="ScanQr"
        options={{ title: "" }}
      />
    </TabOneStack.Navigator>
  )
}

const TabTwoStack = createStackNavigator<TabTwoParamList>()

const TabTwoNavigator = (): JSX.Element => {
  return (
    <TabTwoStack.Navigator screenOptions={{ headerShown: true }}>
      <TabTwoStack.Screen
        component={SettingsScreen}
        name="SettingsTab"
        options={{ title: "", headerShown: false }}
      />
      <TabTwoStack.Screen
        component={SelectedCurrencyScreen}
        name="SelectedCurrencyScreen"
        options={{ title: "" }}
      />
      <TabTwoStack.Screen
        component={FaqScreen}
        name="FaqScreen"
        options={{ title: "" }}
      />
      <TabTwoStack.Screen
        component={GuideScreen}
        name="GuideScreen"
        options={{ title: "" }}
      />
      <TabTwoStack.Screen
        component={TermsScreen}
        name="TermsScreen"
        options={{ title: "" }}
      />
      <TabTwoStack.Screen
        component={PrivacyPolicyScreen}
        name="PrivacyPolicyScreen"
        options={{ title: "" }}
      />
      <TabTwoStack.Screen
        component={FrameworksScreen}
        name="FrameworksScreen"
        options={{ title: "" }}
      />
      <TabTwoStack.Screen
        component={AddWallet}
        name="AddWallet"
        options={{ title: "" }}
      />
      <TabTwoStack.Screen
        component={CreateWalletStep1}
        name="CreateWalletStep1"
        options={{ title: "" }}
      />
      <TabTwoStack.Screen
        component={CreateWalletStep2}
        name="CreateWalletStep2"
        options={{ title: "" }}
      />
      <TabTwoStack.Screen
        component={CreateWalletStep3}
        name="CreateWalletStep3"
        options={{ title: "" }}
      />
      <TabTwoStack.Screen
        component={ImportWallet}
        name="ImportWallet"
        options={{ title: "" }}
      />
    </TabTwoStack.Navigator>
  )
}
