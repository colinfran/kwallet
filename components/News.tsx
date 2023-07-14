import React, { useContext, useRef, useState } from "react"
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native"
import {
  Skeleton,
  Text,
  Heading,
  useContrastText,
  Image,
  Actionsheet,
} from "native-base"
import { DataContext } from "../providers/DataProvider"
import DoubleButton from "./Button/DoubleButton"
import { useNavigation } from "@react-navigation/native"
import { getLocales } from "expo-localization"
import { getCurrencySymbol } from "../constants/currencies"
import moment from "moment"
import RenderHtml from "react-native-render-html"
import { Ionicons } from "@expo/vector-icons"

const News = ({ mediumData }): JSX.Element => {
  const {
    graphData,
    appColor,
    backgroundColor,
    textColor,
    modalBackgroundColor,
    selectedCurrency,
  } = useContext(DataContext)
  const navigation = useNavigation()

  const [isOpen, setIsOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState()
  const scrollRef = useRef()

  const renderArticle = (item): JSX.Element => {
    return (
      <TouchableOpacity
        key={`${item.title}-${item.pubDate}`}
        style={{ width: 200, padding: 20 }}
        onPress={() => {
          scrollRef?.current?.scrollTo({
            y: 0,
            x: 0,
            animated: false,
          })
          setIsOpen(true)
          setSelectedArticle(item)
        }}
      >
        <View style={{ flexDirection: "column" }}>
          <Image
            alt={item.title}
            source={{ uri: item.thumbnail }}
            style={{ height: 100, width: "100%" }}
          />
          <Text style={{ color: textColor }}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View>
      <View
        style={[
          styles.shadow,
          {
            shadowColor: textColor,
            backgroundColor: backgroundColor,
            borderWidth: 2,
            borderColor: appColor,
            marginHorizontal: 20,
            borderRadius: 15,
            height: 200,
            // overflow: mediumData !== undefined ? "scroll" : "hidden",
          },
        ]}
      >
        <View style={{overflow: mediumData !== undefined ? "scroll" : "hidden",}}>
          {mediumData !== undefined ? (
            <View>
              <ScrollView
                horizontal={true}
                pagingEnabled={false}
                showsHorizontalScrollIndicator={false}
              >
                {mediumData.items.map((item) => {
                  return renderArticle(item)
                })}
                <TouchableOpacity
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    height: "100%",
                    width: 210,
                    borderColor: appColor,
                    padding: 20,
                  }}
                  onPress={() =>
                    Linking.openURL("https://medium.com/kaspa-currency")
                  }
                >
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "90%",
                      padding: 20,
                      borderColor: appColor,
                      borderWidth: 2,
                      borderRadius: 15,
                    }}
                  >
                    <Text style={{ color: textColor, textAlign: "center" }}>
                      Read more articles on Medium
                    </Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          ) : (
            <View style={{padding: 20, width: Dimensions.get("window").width - 44,}}>
              <View>
                <View style={{ flexDirection: "row", gap: 20 }}>
                  <View style={{ flexDirection: "column" }}>
                    <Skeleton h="100" w="200" />
                    <Skeleton h="3" marginTop={2} w="200" />
                    <Skeleton h="3" marginTop={2} w="200" />
                    <Skeleton h="3" marginTop={2} w="200" />
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <Skeleton h="100" w="200" />
                    <Skeleton h="3" marginTop={2} w="200" />
                    <Skeleton h="3" marginTop={2} w="200" />
                    <Skeleton h="3" marginTop={2} w="200" />
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
      <Actionsheet
        isOpen={isOpen}
        hideDragIndicator
        onClose={() => setIsOpen(false)}
      >
        <Actionsheet.Content
          _dragIndicator={{ style: { backgroundColor: "#a1a1aa" } }}
          style={{
            position: "relative",
            backgroundColor: modalBackgroundColor,
          }}
        >
          <TouchableOpacity
            style={{
              top: 0,
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
          <ScrollView ref={scrollRef}>
            <View style={{ height: "90%" }}>
              <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20 }}>{selectedArticle?.title}</Text>
                <Text style={{ fontSize: 12 }}>
                  {moment(selectedArticle?.pubDate).format(
                    "MMMM Do YYYY, h:mm A"
                  )}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  width: Dimensions.get("window").width - 20,
                  padding: 40,
                }}
              >
                <RenderHtml
                  contentWidth={Dimensions.get("window").width * 0.85}
                  source={{
                    html: `${
                      selectedArticle
                        ? `<div style="color: ${textColor}">
                            ${selectedArticle?.description}
                          </div>`
                        : "<div></div>"
                    }`,
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  )
}

export default News

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 5,
    borderWidth: 2,
    // borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    // paddingVertical: Dimensions.get("window").height < 800 ? "10%" : "20%",
    // borderBottomLeftRadius: 25,
    // borderBottomRightRadius: 25,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
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
