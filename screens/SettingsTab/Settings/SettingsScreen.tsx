import React, { useContext, useState } from "react"
import {
  StyleSheet,
  Linking,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  SafeAreaView,
} from "react-native"
import {
  VStack,
  Divider,
  HStack,
  Actionsheet,
  Box,
  Button,
  Link,
  Image,
} from "native-base"
import Svg, { Circle, Path } from "react-native-svg"
import { SwipeListView } from "react-native-swipe-list-view"
import icons from "currency-icons"

import Constants from "expo-constants"

const version = Constants.manifest.version
import * as StoreReview from "expo-store-review"

import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons"
import { DataContext } from "../../../providers/DataProvider"
import { useNavigation } from "@react-navigation/native"

type IconType = {
  name: string
  color: string
  type?: string
  size?: number
}

const goToRating = (): void => {
  if (!StoreReview.isAvailableAsync()) {
    Linking.openURL(
      // eslint-disable-next-line max-len
      "https://apps.apple.com/us/app/wallpaperqr/id1558057109?action=write-review"
    )
  } else {
    StoreReview.requestReview()
  }
}

const SettingsScreen = (): JSX.Element => {
  const navigation = useNavigation()
  const {
    appColor,
    wallets,
    selectedWalletIndex,
    setSelectedWalletIndex,
    setWallets,
    textColor,
    backgroundColor,
    modalBackgroundColor,
    selectedCurrency,
    setWalletData,
  } = useContext(DataContext)

  const [openWalletPicker, setOpenWalletPicker] = useState(false)

  const currencyIcon = icons[selectedCurrency].icon

  // console.log(currencyIcon)

  const Icon = (props: IconType): JSX.Element => {
    if (props.type === "currency") {
      return (
        <View
          style={{
            borderColor: appColor,
            borderWidth: 2,
            borderRadius: 100,
          }}
        >
          <Image
            alt={selectedCurrency}
            source={{ uri: currencyIcon }}
            style={{ width: 20, height: 20, tintColor: appColor }}
          />
        </View>
      )
    }
    if (props.type === "mci") {
      return (
        <MaterialCommunityIcons
          color={props.color}
          name={props.name as any}
          size={props.size || 30}
        />
      )
    }
    if (props.type === "fa") {
      return (
        <FontAwesome5
          color={props.color}
          name={props.name as any}
          size={props.size || 30}
        />
      )
    }
    if (props.type === "en") {
      return (
        <Entypo
          color={props.color}
          name={props.name as any}
          size={props.size || 30}
        />
      )
    }
    if (props.type === "discord") {
      return (
        <Svg
          fill="transparent"
          style={{ height: props.size, width: props.size }}
          viewBox="0 0 512 512"
        >
          <Circle cx="256" cy="256" fill={props.color} id="ellipse" r="256" />
          <Path
            // eslint-disable-next-line max-len
            d="M372.4,168.7c0,0-33.3-26.1-72.7-29.1l-3.5,7.1c35.6,8.7,51.9,21.2,69,36.5  c-29.4-15-58.5-29.1-109.1-29.1s-79.7,14.1-109.1,29.1c17.1-15.3,36.5-29.2,69-36.5l-3.5-7.1c-41.3,3.9-72.7,29.1-72.7,29.1  s-37.2,54-43.6,160c37.5,43.3,94.5,43.6,94.5,43.6l11.9-15.9c-20.2-7-43.1-19.6-62.8-42.3c23.5,17.8,59.1,36.4,116.4,36.4  s92.8-18.5,116.4-36.4c-19.7,22.7-42.6,35.3-62.8,42.3l11.9,15.9c0,0,57-0.3,94.5-43.6C409.6,222.7,372.4,168.7,372.4,168.7z   M208.7,299.6c-14.1,0-25.5-13-25.5-29.1s11.4-29.1,25.5-29.1c14.1,0,25.5,13,25.5,29.1S222.8,299.6,208.7,299.6z M303.3,299.6  c-14.1,0-25.5-13-25.5-29.1s11.4-29.1,25.5-29.1s25.5,13,25.5,29.1S317.3,299.6,303.3,299.6z"
            fill={props.boxBackgroundColor}
          />
        </Svg>
      )
    }
    return (
      <Ionicons
        color={props.color}
        name={props.name as any}
        size={props.size || 30}
      />
    )
  }

  const settingsData = [
    [
      {
        text: "Wallets",
        iconName: "vector-selection",
        iconType: "mci",
        onPress: () => setOpenWalletPicker(true),
      },
      {
        text: "Currency",
        iconName: "vector-selection",
        iconType: "currency",
        onPress: () => navigation.navigate("SelectedCurrencyScreen"),
      },
    ],
    [
      {
        text: "FAQ",
        iconName: "help-circle-outline",
        iconType: "",
        onPress: () => navigation.navigate("FaqScreen"),
      },
      {
        text: "Guide",
        iconName: "information-circle-outline",
        iconType: "",
        onPress: () => navigation.navigate("GuideScreen"),
      },
    ],

    [
      // {
      //   text: "Change App Color",
      //   iconName: "color-palette-outline",
      //   iconType: "",
      //   onPress: () => navigation.navigate("ColorPickerScreen"),
      // },
      {
        text: "Rate This App",
        iconName: "star-face",
        iconType: "mci",
        onPress: () => goToRating(),
      },
      {
        text: "Terms",
        iconName: "copyright",
        iconType: "mci",
        onPress: () => navigation.navigate("TermsScreen"),
      },
      {
        text: "Privacy Policy",
        iconName: "text-box-outline",
        iconType: "mci",
        onPress: () => navigation.navigate("PrivacyPolicyScreen"),
      },
      {
        text: "Frameworks",
        iconName: "code-json",
        iconType: "mci",
        onPress: () => navigation.navigate("FrameworksScreen"),
      },
    ],

    [
      {
        text: "Twitter",
        iconName: "twitter-with-circle",
        iconType: "en",
        onPress: async () =>
          await Linking.openURL("https://twitter.com/KaspaCurrency"),
      },
      {
        text: "Discord",
        iconName: "discord",
        iconType: "discord",
        boxBackgroundColor: backgroundColor,
        size: 30,
        onPress: async () =>
          await Linking.openURL("https://discord.gg/kS3SK5F36R"),
      },
      {
        text: "Reddit",
        iconName: "reddit",
        iconType: "fa",
        onPress: async () =>
          await Linking.openURL("https://www.reddit.com/r/kaspa/"),
      },
      {
        text: "Telegram",
        iconName: "telegram",
        iconType: "fa",
        onPress: async () => await Linking.openURL("https://t.me/Kaspaenglish"),
      },
      {
        text: "Facebook",
        iconName: "facebook",
        iconType: "fa",
        onPress: async () =>
          await Linking.openURL("https://www.facebook.com/KaspaCurrencyh"),
      },
      {
        text: "YouTube",
        iconName: "youtube-with-circle",
        iconType: "en",
        onPress: async () =>
          await Linking.openURL("https://www.youtube.com/@kaspaCurrency"),
      },
      {
        text: "GitHub",
        iconName: "github",
        iconType: "fa",
        onPress: async () =>
          await Linking.openURL("https://github.com/kaspanet"),
      },
    ],
  ]

  const renderItem = (wallet): JSX.Element => {
    return (
      <TouchableHighlight
        style={styles.rowFront}
        underlayColor={"#AAA"}
        onPress={() => {
          setSelectedWalletIndex(wallet.index)
          setOpenWalletPicker(false)
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontSize: 16 }}>{wallet.item.walletName}</Text>
          {wallet.index === selectedWalletIndex && (
            <Icon color="#000" name="checkmark" size={20} />
          )}
        </View>
      </TouchableHighlight>
    )
  }

  const renderHiddenItem = (data): JSX.Element => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() =>
          Alert.alert(
            "Are you sure you want to remove this wallet?",
            // eslint-disable-next-line max-len
            "**IMPORTANT**\nIf you do not know your seed phrase, you will not be able to recover this wallet.",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Remove",
                onPress: () => {
                  if (wallets.length === 1) {
                    setOpenWalletPicker(false)
                    setWalletData([])
                    // setWallets([])
                    // SecureStore.setItemAsync("wallets", JSON.stringify([]))
                  } else {
                    const newWallets = wallets.filter(
                      (wallet) => wallet !== wallets[data.index]
                    )
                    setWalletData(newWallets)
                    // setWallets(newWallets)
                    // SecureStore.setItemAsync(
                    //   "wallets",
                    //   JSON.stringify(newWallets)
                    // )
                  }
                },
              },
            ]
          )
        }
      >
        <Text style={styles.backTextWhite}>Remove Wallet</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView>
      <ScrollView style={styles.full}>
        <View style={[styles.container]}>
          <View style={[styles.screen]}>
            {settingsData.map((section, i) => (
              <View key={`${i}-container`} style={[styles.sectionContainer]}>
                <View
                  style={[
                    styles.box,
                    {
                      backgroundColor: backgroundColor,
                      borderColor: appColor,
                      borderWidth: 2,
                    },
                  ]}
                >
                  <VStack
                    divider={<Divider backgroundColor={appColor} />}
                    width="100%"
                  >
                    {section.map((sectionElement) => {
                      return (
                        <TouchableOpacity
                          key={sectionElement.text}
                          style={{ width: "100%" }}
                          onPress={sectionElement.onPress}
                        >
                          <HStack
                            alignItems="center"
                            h={12}
                            justifyContent="center"
                            margin="auto"
                            w="90%"
                          >
                            <View style={styles.listItemLeft}>
                              <Icon
                                boxBackgroundColor={
                                  sectionElement.boxBackgroundColor
                                }
                                color={appColor}
                                name={sectionElement.iconName}
                                size={sectionElement.size}
                                type={sectionElement.iconType}
                              />
                            </View>
                            <View style={styles.listItemCenter}>
                              <Text style={{ fontSize: 18, color: textColor }}>
                                {sectionElement.text}
                              </Text>
                            </View>
                            <View style={styles.listItemRight}>
                              {sectionElement.text === "Wallets" && (
                                <Text
                                  style={{ fontSize: 14, color: textColor }}
                                >
                                  {wallets[selectedWalletIndex]?.walletName ||
                                    ""}
                                </Text>
                              )}
                              <Icon
                                color={appColor}
                                name="arrow-forward"
                                style={styles.align}
                              />
                            </View>
                          </HStack>
                        </TouchableOpacity>
                      )
                    })}
                  </VStack>
                </View>
              </View>
            ))}
          </View>
          <View>
            <View style={{ margin: 30 }}>
              <View>
                <Text style={{ textAlign: "center", color: textColor }}>
                  Designed, devloped, and built
                </Text>
                <Link
                  href="https://colinfran.com"
                  style={{ alignSelf: "center", color: textColor }}
                >
                  by Colin Franceschini
                </Link>
              </View>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                {/* <Thumbnail source={logo} small square /> */}
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 12, color: "grey" }}
                >{`v${version}`}</Text>
              </View>
            </View>
          </View>
        </View>
        <Actionsheet
          isOpen={openWalletPicker}
          onClose={() => setOpenWalletPicker(false)}
        >
          <Actionsheet.Content
            style={{ backgroundColor: modalBackgroundColor }}
          >
            <Box
              h={Dimensions.get("window").height / 2}
              justifyContent="center"
              px={4}
              style={{ marginBottom: 30 }}
              w="100%"
            >
              <Text
                style={{ fontSize: 20, color: textColor, paddingBottom: 40 }}
              >
                Select Wallet
              </Text>
              <SwipeListView
                data={wallets}
                renderHiddenItem={renderHiddenItem}
                renderItem={renderItem}
                rightOpenValue={-75}
                scrollEnabled={false}
                style={{ width: "100%" }}
              />
              <Button
                style={{ backgroundColor: appColor, marginTop: 30 }}
                w={"100%"}
                onPress={() => {
                  setOpenWalletPicker(false)
                  navigation.navigate("AddWallet")
                }}
              >
                Add
              </Button>
            </Box>
          </Actionsheet.Content>
        </Actionsheet>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Dimensions.get("window").height < 800 ? "10%" : "14%",
    width: "100%",
    padding: 20,
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
  screen: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 40,
  },
  box: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },

  box2: {
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b0b0e",
    borderRadius: 15,
    padding: 15,
  },

  boxButton: {
    width: "95%",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#555554",
    borderRadius: 15,
  },
  align: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  headerContainer: {
    width: "100%",
    height: 30,
    justifyContent: "flex-start",
  },
  sectionContainer: {
    width: "100%",
  },
  pageHeader: {
    width: "100%",
    justifyContent: "center",
    marginBottom: 30,
  },
  full: {
    width: "100%",
  },
  listItemLeft: {
    width: "25%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  listItemCenter: {
    alignItems: "flex-start",
    width: "50%",
  },
  listItemCenterText: {
    fontSize: 16,
    textAlign: "left",
  },
  listItemRight: {
    alignItems: "center",
    width: "25%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  backTextWhite: {
    color: "#FFF",
    textAlign: "center",
  },
  rowFront: {
    backgroundColor: "#CCC",
    justifyContent: "center",
    height: 50,
    width: "100%",
    marginBottom: 2,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    marginBottom: 2,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },
})

export default SettingsScreen
