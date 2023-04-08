import React, { useContext, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native"
import { DataContext } from "../../../providers/DataProvider"
import { currenciesList } from "../../../constants/currencies"
import { CheckIcon, Input } from "native-base"
import { filter, sortBy } from "lodash"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"

const SelectedCurrencyScreen = (): JSX.Element => {
  const {
    textColor,
    pickedColor,
    selectedCurrency,
    setSelectedCurrency,
    setSelectedCurrencyValue,
  } = useContext(DataContext)

  const navigation = useNavigation()

  const sortedItems = sortBy(currenciesList, ({ code }) =>
    code === selectedCurrency ? 0 : 1
  )

  const [data, setData] = useState(sortedItems)
  const [query, setQuery] = useState("")

  const contains = ({ description, code }, queryVal): boolean => {
    if (
      description.toLowerCase().includes(queryVal) ||
      code.toLowerCase().includes(queryVal)
    ) {
      return true
    }
    return false
  }

  const handleSearch = (text): void => {
    const formattedQuery = text.toLowerCase()
    const val = filter(sortedItems, (currency) => {
      return contains(currency, formattedQuery)
    })
    console.log(text)
    console.log(val)
    setQuery(text)
    setData(val)
  }

  const onSelectionPress = (item) => {
    console.log(item)
    setSelectedCurrency(item.code)
    navigation.navigate("SettingsTab")
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginVertical: 60 }}>
        <View style={[styles.wrapper, { borderColor: pickedColor }]}>
          <View>
            {data.map((item, index) => {
              return (
                <View key={item.code}>
                  <TouchableOpacity
                    style={{
                      padding: 20,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                    onPress={() => onSelectionPress(item)}
                  >
                    <View
                      style={{
                        width: "75%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        height: 30,
                        alignItems: "center",
                      }}
                    >
                      <View style={{ width: "75%" }}>
                        <Text style={{ fontSize: 14, color: textColor }}>
                          {item.description}
                        </Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 14, color: textColor }}>
                          {item.code}
                        </Text>
                      </View>
                    </View>
                    {item.code === selectedCurrency && (
                      <View>
                        <CheckIcon color={pickedColor} mt="0.5" size="5" />
                      </View>
                    )}
                  </TouchableOpacity>
                  {index !== data.length - 1 && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: pickedColor,
                      }}
                    />
                  )}
                </View>
              )
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    // alignItems: "center",
    paddingHorizontal: 20,
  },
  wrapper: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 15,
    height: "100%",
  },
})

export default SelectedCurrencyScreen
