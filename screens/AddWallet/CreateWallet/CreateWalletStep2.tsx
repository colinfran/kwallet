import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, View, Dimensions, ScrollView } from "react-native"
import { Text, Alert, VStack, HStack } from "native-base"

import { useNavigation } from "@react-navigation/native"
import ButtonOutline from "../../../components/Button/ButtonOutline"
import { DataContext } from "../../../providers/DataProvider"

const CreateWalletStep2 = ({ route }): JSX.Element => {
  const [data, setData] = useState({})

  const { textColor } = useContext(DataContext)
  const navigation = useNavigation()

  useEffect(() => {
    if (route?.params?.data) {
      setData(route.params.data)
    }
  }, [route.params])

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.alertContainer}>
          <Alert
            colorScheme="error"
            status="error"
            variant="outline-light"
            w="100%"
          >
            <VStack flexShrink={1} space={2} w="100%">
              <HStack
                alignItems="center"
                flexShrink={1}
                justifyContent="space-between"
                space={2}
              >
                <HStack alignItems="center" flexShrink={1} space={2}>
                  <Alert.Icon />
                  <Text
                    color={textColor}
                    style={{ paddingLeft: 20, flex: 1, flexWrap: "wrap" }}
                  >
                    Never share your secret seed phrase. Write this seed phrase
                    down and put it in a safe and secure place.
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </Alert>
        </View>
        <View style={styles.seedContainer}>
          {data?.mnemonic?.split(" ").map((element, index) => (
            <View key={`${element}-${index}`} style={styles.seedItemView}>
              <View style={styles.seedItem}>
                <Text>{`${index + 1}. ${element}`}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <ButtonOutline
            text="Continue"
            onPress={() => {
              navigation.navigate("CreateWalletStep3", {
                data: { ...data, mnemonicArray: data?.mnemonic?.split(" ") },
              })
            }}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  seedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  seedItemView: {
    width: "50%",
    padding: 10,
    textAlign: "center",
    margin: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  seedItem: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 4,
    width: Dimensions.get("window").width / 2 - 30,
  },
  alertContainer: {
    paddingBottom: 30,
    width: "100%",
  },
  buttonContainer: {
    alignSelf: "flex-start",
    paddingTop: 30,
    width: "100%",
  },
})

export default CreateWalletStep2
