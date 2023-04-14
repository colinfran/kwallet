import React, { useContext } from "react"
import { View, StyleSheet, Text, ScrollView } from "react-native"
import { DataContext } from "../../../providers/DataProvider"
import { currenciesList } from "../../../constants/currencies"
import { CheckIcon, Link } from "native-base"
import { sortBy } from "lodash"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"

const SelectedCurrencyScreen = (): JSX.Element => {
  const { textColor, appColor, selectedCurrency, setSelectedCurrency } =
    useContext(DataContext)

  const navigation = useNavigation()

  const sortedItems = sortBy(currenciesList, ({ code }) =>
    code === selectedCurrency ? 0 : 1
  )

  const onSelectionPress = (item): void => {
    console.log(item)
    setSelectedCurrency(item.code)
    navigation.navigate("SettingsTab")
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginVertical: 60 }}>
        <View style={[styles.wrapper, { borderColor: appColor }]}>
          <View>
            {sortedItems.map((item, index) => {
              return (
                <View key={item.code}>
                  <TouchableOpacity
                    style={{
                      padding: 20,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
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
                        <CheckIcon color={appColor} mt="0.5" size="5" />
                      </View>
                    )}
                  </TouchableOpacity>
                  {index !== sortedItems.length - 1 && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: appColor,
                      }}
                    />
                  )}
                </View>
              )
            })}
          </View>
        </View>
        <View style={{ marginVertical: 20, padding: 20 }}>
          <Text style={{ color: textColor, textAlign: "center" }}>
            At the moment, we only currently support the above list of
            international currencies. If there is a currency you would like us
            to support
          </Text>
          <View style={{ alignItems: "center" }}>
            <Link
              _text={{
                _light: {
                  color: "cyan.500",
                },
                color: "cyan.300",
              }}
              href="https://github.com/colinfran/kwallet/issues"
            >
              please submit an issue here
            </Link>
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
    borderWidth: 2,
    borderRadius: 15,
    height: "100%",
  },
})

export default SelectedCurrencyScreen
