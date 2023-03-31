import React, { useContext } from "react"
import { StyleSheet, View, Dimensions, TouchableOpacity, useColorScheme } from "react-native"
import { Box, Text, Checkbox, Icon } from "native-base"
import { DataContext } from "../providers/DataProvider"
import { Ionicons } from "@expo/vector-icons"

const TransactionsPreview = (): JSX.Element => {
  const { pickedColor } = useContext(DataContext)
  const textColor = useColorScheme() === "dark" ? "#fff" : "#000"

  const temp = [
    {
      type: "send",
      date: new Date(),
      amount: 132.0321,
    },
    {
      type: "recieve",
      date: new Date(),
      amount: 132.0321,
    },
  ]

  if (temp.length === 0) {
    return (
      <View style={{ marginTop: 30, width: "100%", padding: 20 }}>
        <View style={[styles.container, { borderColor: pickedColor }]}>
          <View>
            <Text>No Transactions</Text>
          </View>
        </View>
      </View>
    )
  }
  return (
    <View style={{ width: "100%", paddingHorizontal: 20 }}>
      <View style={[styles.container, { borderColor: pickedColor }]}>
        <View style={{alignSelf:"flex-end", paddingTop: 10 }}>
          <TouchableOpacity>
            <Text style={{color: textColor}}>{`View More >`}</Text>
          </TouchableOpacity>
        </View>
        {temp.map((item) => {
          return (
            <View
              key={`${item.date}-${item.amount}-${item.type}`}
              style={[styles.wrapper, { borderColor: pickedColor }]}
            >
              <View style={styles.left}>
                <View>
                  <Icon
                    as={Ionicons}
                    name={
                      item.type === "send"
                        ? "arrow-up-circle"
                        : "arrow-down-circle"
                    }
                  />
                </View>
                <View>
                  <Text style={{textTransform:"capitalize"}}>{item?.type}</Text>
                  <Text>{item?.date.toLocaleString()}</Text>
                </View>
              </View>
              <View style={styles.right}>
                <Text>{item?.amount}</Text>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    padding: 20,
    paddingTop: 0,
    borderRadius: 16,
    gap: 10,
  },
  wrapper: {
    borderWidth: 1,
    width: "100%",
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "space-between",
  },
  left: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
})

export default TransactionsPreview
