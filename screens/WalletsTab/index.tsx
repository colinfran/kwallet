import React, { useContext } from "react"
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native"
import { HStack, WarningOutlineIcon, Text, Slide, Box } from "native-base"
import { useNavigation } from "@react-navigation/native"

import WalletAmount from "../../components/WalletAmount"
import { DataContext } from "../../providers/DataProvider"
import DoubleButton from "../../components/Button/DoubleButton"
import Chart from "../../components/Chart"

const WalletsTab = (): JSX.Element => {
  const navigation = useNavigation()

  const {
    apiData,
    showAlert,
    setShowAlert,
    pickedColor,
    setApiData,
    getApiData,
  } = useContext(DataContext)
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = React.useCallback(async () => {
    setApiData(null)
    setRefreshing(true)
    const response = await getApiData()
    if (response && !response.error && response.currentPrice) {
      setApiData(response)
      setRefreshing(false)
    }
  }, [getApiData, setApiData])

  const dismissAlert = (): void => {
    setShowAlert(undefined)
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          colors={[pickedColor]}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={{ alignSelf: "flex-start", width: "100%" }}>
        <WalletAmount isLoaded={apiData} />
      </View>
      <View style={{ paddingLeft: 20, paddingRight: 20 }}>
        <DoubleButton
          left={{
            text: "Send",
            onPress: () => navigation.navigate("Send"),
          }}
          right={{
            text: "Receive",
            onPress: () => navigation.navigate("Receive"),
          }}
        />
      </View>
      <View>
        <Chart isLoaded={apiData} />
      </View>
      <Slide in={showAlert?.alert} placement="top">
        <Box
          alignItems="center"
          bg="red.400"
          borderRadius="xs"
          justifyContent="center"
          p="2"
          w="100%"
          safeArea
        >
          <HStack paddingLeft={5} paddingRight={5} space={2}>
            <WarningOutlineIcon color="white" mt="1" size="4" />
            <Text color="white" fontWeight="medium" textAlign="center">
              {showAlert?.alertDescription}
            </Text>
          </HStack>
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 10,
              right: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={dismissAlert}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={{ color: "#fff", textDecorationLine: "underline" }}>
                Dismiss
              </Text>
            </View>
          </TouchableOpacity>
        </Box>
      </Slide>
    </ScrollView>
  )
}

export default WalletsTab

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    // padding: 20,
    position: "relative",
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
})
