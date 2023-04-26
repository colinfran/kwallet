import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from "react-native"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"

import WalletHeader from "../../components/WalletHeader"
import { DataContext } from "../../providers/DataProvider"
import Chart from "../../components/Chart"
import TransactionHistory from "../../components/TransactionHistory"
import { AntDesign, Ionicons } from "@expo/vector-icons"
import News from "../../components/News"
import { Actionsheet } from "native-base"

const WalletsTab = (): JSX.Element => {
  const {
    appColor,
    setSelectedGraphIndex,
    textColor,
    backgroundColor,
    modalBackgroundColor,
    getGraphData,
    setGraphData,
    wallets,
  } = useContext(DataContext)
  const [refreshing, setRefreshing] = React.useState(false)
  const [mediumData, setMediumData] = useState()
  const [isOpen, setIsOpen] = useState(false)

  const getMediumData = async (): Promise<void> => {
    try {
      const res = await fetch(
        // eslint-disable-next-line max-len
        "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/kaspa-currency"
      )
      const json = await res.json()
      if (json.status === "ok") {
        setTimeout(() => {
          setMediumData(json)
        }, 2000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMediumData()
  }, [])

  const onRefresh = React.useCallback(async () => {
    setMediumData(undefined)
    setRefreshing(true)
    getMediumData()
    const response = await getGraphData()
    if (response) {
      setGraphData(response)
      setRefreshing(false)
      setSelectedGraphIndex(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSelectedGraphIndex])

  const [sheetContent, setSheetContent] = useState("chart")

  const renderContent = () => {
    if (sheetContent === "transactions") return <TransactionHistory />
    if (sheetContent === "chart") return <Chart />
  }

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            height: "100%",
            // gap: 20,
            // borderColor: appColor,
            // borderRightWidth: 2,
            // borderLeftWidth: 2,
          },
        ]}
        disableScrollViewPanResponder={true}
        refreshControl={
          <RefreshControl
            colors={[]}
            refreshing={refreshing}
            style={{ zIndex: 200 }}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%" }}>
          <View
            style={{
              alignSelf: "center",
              justifyContent: "center",
              width: "100%",
              // gap: 30,
            }}
          >
            <WalletHeader />
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                padding: 20,
                gap: 20,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.shadow,
                  {
                    backgroundColor: backgroundColor,
                    shadowColor: textColor,
                    borderColor: appColor,
                    borderWidth: 2,
                    borderRadius: 15,
                    width: Dimensions.get("window").width * 0.5 - 30,
                    height: 130,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
                onPress={() => {
                  setSheetContent("transactions")
                  setIsOpen(true)
                }}
              >
                <AntDesign color={textColor} name="bars" size={30} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.shadow,
                  {
                    backgroundColor: backgroundColor,
                    shadowColor: textColor,
                    borderColor: appColor,
                    borderWidth: 2,
                    borderRadius: 15,
                    width: Dimensions.get("window").width * 0.5 - 30,
                    height: 130,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
                onPress={() => {
                  setSheetContent("chart")
                  setIsOpen(true)
                }}
              >
                <AntDesign color={textColor} name="linechart" size={25} />
              </TouchableOpacity>
            </View>
            <View>
              <News mediumData={mediumData} />
            </View>
          </View>
        </View>
      </ScrollView>
      <Actionsheet isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
        <Actionsheet.Content
          _dragIndicator={{ style: { backgroundColor: "#a1a1aa" } }}
          style={{
            position: "relative",
            backgroundColor: modalBackgroundColor,
          }}
        >
          <TouchableOpacity
            style={{
              top: -10,
              right: 0,
              width: 40,
              height: 40,
              alignSelf: "flex-end",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 100,
              backgroundColor: "#a1a1aa",
            }}
            onPress={() => setIsOpen(!isOpen)}
          >
            <Ionicons color="black" name="close-outline" size={24} />
          </TouchableOpacity>
          {renderContent()}
        </Actionsheet.Content>
      </Actionsheet>
    </SafeAreaView>
  )
}

export default WalletsTab

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
