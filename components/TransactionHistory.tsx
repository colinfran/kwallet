import React, { useContext } from "react"
import { StyleSheet, View, Dimensions, TouchableOpacity } from "react-native"
import { Text, Icon } from "native-base"
import { DataContext } from "../providers/DataProvider"
import { Ionicons } from "@expo/vector-icons"

const TransactionHistory = (): JSX.Element => {
  const { appColor, textColor, backgroundColor } = useContext(DataContext)

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

  if (temp.length !== 0) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
          // height:"80%",
        }}
      >
        <View
          style={[
            styles.container,
            {
              width: Dimensions.get("window").width - 40,
              height: "100%",
              padding: 20,
            },
          ]}
        >
          <View
            style={[
              styles.shadow,
              {
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
                height: 150,
                borderColor: appColor,
                borderWidth: 2,
                borderRadius: 16,
                shadowColor: textColor,
                backgroundColor: backgroundColor,
              },
            ]}
          >
            <View>
              <Text style={{ color: textColor }}>No transactions</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
  return (
    <View
      style={{
        width: Dimensions.get("window").width - 40,
        paddingHorizontal: 20,
      }}
    >
      <View
        style={[
          styles.container,
          {
            borderColor: appColor,
            shadowColor: textColor,
            // backgroundColor: backgroundColor,
          },
          styles.shadow,
        ]}
      >
        <View style={{ alignSelf: "flex-end", paddingTop: 10 }}>
          <TouchableOpacity>
            <Text style={{ color: textColor }}>{`View More >`}</Text>
          </TouchableOpacity>
        </View>
        {temp.map((item) => {
          return (
            <View
              key={`${item.date}-${item.amount}-${item.type}`}
              style={[styles.wrapper, { borderColor: appColor }]}
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
                  <Text style={{ textTransform: "capitalize" }}>
                    {item?.type}
                  </Text>
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
    padding: 20,
    paddingTop: 0,
    gap: 10,
    height: 210,
  },
  wrapper: {
    borderWidth: 2,
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

export default TransactionHistory
