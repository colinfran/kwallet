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

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  // variables
  const snapPoints = useMemo(() => ["80%"], [])

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const handleClosePress = useCallback(() => {
    bottomSheetModalRef.current?.close()
  }, [])

  const [sheetContent, setSheetContent] = useState("chart")

  const renderContent = () => {
    if (sheetContent === "transactions") return <TransactionHistory />
    if (sheetContent === "chart") return <Chart />
  }

  const handle = (): JSX.Element => (
    <View>
      <View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: "#a1a1aa",
              marginTop: 10,
              borderRadius: 100,
            }}
          />
        </View>
        <TouchableOpacity
          style={{
            top: 0,
            right: 10,
            width: 40,
            height: 40,
            alignSelf: "flex-end",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 100,
            backgroundColor: "#a1a1aa",
          }}
          onPress={() => handleClosePress()}
        >
          <Ionicons color="black" name="close-outline" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  )

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
                  setTimeout(() => {
                    handlePresentModalPress()
                  }, 100)
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
                  setTimeout(() => {
                    handlePresentModalPress()
                  }, 100)
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
      <BottomSheetModal
        backdropComponent={useCallback(
          (props) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
            />
          ),
          []
        )}
        backgroundStyle={{
          backgroundColor: modalBackgroundColor,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        enableOverDrag={true}
        enablePanDownToClose={true}
        handleComponent={handle}
        index={0}
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
      >
        <BottomSheetView style={{ position: "relative" }}>
          {renderContent()}
        </BottomSheetView>
      </BottomSheetModal>
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
