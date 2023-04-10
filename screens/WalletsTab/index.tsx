import React, { useContext } from "react"
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
  SafeAreaView,
} from "react-native"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"

import { Text, useTheme } from "native-base"

import WalletHeader from "../../components/WalletHeader"
import { DataContext } from "../../providers/DataProvider"
import Chart from "../../components/Chart"
import TransactionHistory from "../../components/TransactionHistory"

const renderScene = SceneMap({
  chart: Chart,
  transactions: TransactionHistory,
})

const WalletsTab = (): JSX.Element => {
  const {
    pickedColor,
    setSelectedGraphIndex,
    textColor,
    backgroundColor,
    getGraphData,
    setGraphData,
  } = useContext(DataContext)
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    const response = await getGraphData()
    if (response) {
      setGraphData(response)
      setRefreshing(false)
      setSelectedGraphIndex(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSelectedGraphIndex])

  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: "chart", title: "Chart" },
    { key: "transactions", title: "Transactions" },
  ])

  const theme = useTheme()
  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={[styles.container, { height: "100%", gap: 20 }]}
        disableScrollViewPanResponder={true}
        refreshControl={
          <RefreshControl
            colors={[]}
            refreshing={refreshing}
            style={{ zIndex: 200 }}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={{ gap: 30 }}>
          <View style={{ alignSelf: "flex-start", width: "100%" }}>
            <WalletHeader />
          </View>
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
                    borderColor: pickedColor,
                    borderRadius: 12,
                  }}
                  renderLabel={({ route, focused }) => (
                    <Text
                      style={{
                        color: focused ? "#000" : theme.colors.light["500"],
                      }}
                    >
                      {route.title}
                    </Text>
                  )}
                  style={{
                    backgroundColor: backgroundColor,
                    borderColor: pickedColor,
                    borderWidth: 2,
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
    </SafeAreaView>
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
