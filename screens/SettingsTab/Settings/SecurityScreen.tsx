import React, { useContext, useEffect, useState } from "react"
import { View, StyleSheet, Text, ScrollView } from "react-native"
import { DataContext } from "../../../providers/DataProvider"
import { CheckIcon } from "native-base"
import { TouchableOpacity } from "react-native-gesture-handler"
// import { useNavigation } from "@react-navigation/native"
import * as LocalAuthentication from "expo-local-authentication"
import * as SecureStore from "expo-secure-store"

const SecurityScreen = (): JSX.Element => {
  const { textColor, appColor, setLockType, lockType } = useContext(DataContext)

  // const navigation = useNavigation()

  // const onSelectionPress = (item): void => {
  //   console.log(item)
  //   // setSelectedCurrency(item.code)
  //   navigation.navigate("SettingsTab")
  // }

  const [supportedList, setSupportList] = useState<any | null>()

  useEffect(() => {
    const getList = async (): Promise<void> => {
      const list = await LocalAuthentication.supportedAuthenticationTypesAsync()
      console.log(list)
      setSupportList(list)
    }
    getList()
  }, [])

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginVertical: 60 }}>
        <View style={[styles.wrapper, { borderColor: appColor }]}>
          <View>
            {!supportedList ||
              (supportedList.length === 0 && (
                <View>
                  <Text>
                    This device does not support any authentication methods that
                    this app uses.
                  </Text>
                </View>
              ))}
            {supportedList && (
              <View>
                <View>
                  <TouchableOpacity
                    style={{
                      padding: 20,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      setLockType("nolock")
                      SecureStore.setItemAsync("lockType", `nolock`)
                    }}
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
                          Do not lock
                        </Text>
                      </View>
                    </View>
                    {lockType === "nolock" && (
                      <View>
                        <CheckIcon color={appColor} mt="0.5" size="5" />
                      </View>
                    )}
                  </TouchableOpacity>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: appColor,
                    }}
                  />
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      padding: 20,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      setLockType("lock")
                      SecureStore.setItemAsync("lockType", `lock`)
                    }}
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
                      <View>
                        <Text style={{ fontSize: 14, color: textColor }}>
                          Use existing passcode / biometrics
                        </Text>
                      </View>
                    </View>
                    {lockType === "lock" && (
                      <View>
                        <CheckIcon color={appColor} mt="0.5" size="5" />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
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

export default SecurityScreen
