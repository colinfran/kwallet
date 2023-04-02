import React, { useContext } from "react"
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  ListRenderItem,
  useColorScheme,
} from "react-native"
// import { Tabs } from "react-native-collapsible-tab-view"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"

import {
  HStack,
  WarningOutlineIcon,
  Text,
  Slide,
  Box,
  useTheme,
} from "native-base"
import { useNavigation } from "@react-navigation/native"

import WalletHeader from "../../components/WalletHeader"
import { DataContext } from "../../providers/DataProvider"
import Chart from "../../components/Chart"
import TransactionHistory from "../../components/TransactionHistory"
import opacity from "hex-color-opacity"

const renderScene = SceneMap({
  chart: Chart,
  transactions: TransactionHistory,
})

const WalletsTab = (): JSX.Element => {
  const navigation = useNavigation()

  const {
    apiData,
    showAlert,
    setShowAlert,
    pickedColor,
    setApiData,
    getApiData,

    selectedGraphIndex,
    setSelectedGraphIndex,
  } = useContext(DataContext)
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = React.useCallback(async () => {
    setApiData(null)
    setRefreshing(true)
    const response = await getApiData()
    if (response && !response.error && response.currentPrice) {
      setApiData(response)
      setRefreshing(false)
      setSelectedGraphIndex(0)
    }
  }, [getApiData, setApiData])

  const dismissAlert = (): void => {
    setShowAlert(undefined)
  }

  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: "chart", title: "Chart" },
    { key: "transactions", title: "Transactions" },
  ])

  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"
  const textColorOpposite = useColorScheme() === "dark" ? "#000" : "#fff"
  const theme = useTheme()
  return (
    <ScrollView
      contentContainerStyle={[styles.container, { height: "100%", gap: 20 }]}
      disableScrollViewPanResponder={true}
      refreshControl={
        <RefreshControl
          colors={[pickedColor]}
          refreshing={refreshing}
          style={{ zIndex: 200 }}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={{ gap: 30 }}>
        <View style={{ alignSelf: "flex-start", width: "100%" }}>
          <WalletHeader isLoaded={apiData} />
        </View>
        {/* <View style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 30 }}>
          <DoubleButton
            left={{
              text: "Send",
              onPress: () => navigation.navigate("Send"),
            }}
            pointerEvents="box-none"
            right={{
              text: "Receive",
              onPress: () => navigation.navigate("Receive"),
            }}
          />
        </View> */}
      </View>
      <TabView
        initialLayout={{ width: Dimensions.get("window").width }}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={(props) => {
          return (
            <View
              style={[
                styles.shadow,
                {
                  alignItems: "center",
                  borderRadius: 15,
                  margin: 20,
                  shadowColor: textColor,
                },
              ]}
            >
              <TabBar
                {...props}
                indicatorStyle={{
                  height: "100%",
                  backgroundColor: pickedColor,
                  borderRadius: 15,
                }}
                renderLabel={({ route, focused, color }) => (
                  <Text
                    style={{
                      color: focused ? "#000" : theme.colors.light["500"],
                    }}
                  >
                    {route.title}
                  </Text>
                )}
                style={{
                  backgroundColor: theme.colors.primary["200"],
                  width: Dimensions.get("window").width - 40,
                  borderRadius: 15,
                  shadowColor: textColor,
                }}
              />
            </View>
          )
        }}
        sceneContainerStyle={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        onIndexChange={setIndex}
      />
    </ScrollView>
  )
}

export default WalletsTab

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    // padding: 20,
    position: "relative",
    // height: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  loadingView: {
    width: "100%",
  },
  textHeader: {
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 5,
  },
  header: {
    width: "100%",
    backgroundColor: "#2196f3",
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
