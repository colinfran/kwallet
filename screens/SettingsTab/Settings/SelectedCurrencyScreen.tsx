import React, { useContext, useState } from "react"
import { View, StyleSheet, Text, FlatList, Dimensions } from "react-native"
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
    if (item.code === "USD") {
      setSelectedCurrencyValue(1)
    }
    navigation.navigate("SettingsTab")
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View>
          <Input
            autoCapitalize="none"
            borderColor={pickedColor}
            borderRadius={15}
            clearButtonMode="always"
            color={textColor}
            mx="3"
            placeholder="search"
            returnKeyType="done"
            size="2xl"
            style={{ height: 50 }}
            variant="outline"
            w={Dimensions.get("window").width - 40}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      <FlatList
        data={data}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: pickedColor,
              // marginLeft: "5%",
            }}
          />
        )}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
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
              }}
            >
              <View style={{ width: "50%" }}>
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
        )}
        style={[styles.wrapper, { borderColor: pickedColor }]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  wrapper: {
    width: Dimensions.get("window").width - 40,
    borderWidth: 1,
    borderRadius: 15,
  },
})

export default SelectedCurrencyScreen
