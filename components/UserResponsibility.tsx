import React, { useContext } from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import { Box, Text, Checkbox } from "native-base"
import { DataContext } from "../providers/DataProvider"

const UserResponsibility = ({
  checkbox1,
  checkbox2,
  checkbox3,
  onCheckboxPress,
}): JSX.Element => {
  const { appColor } = useContext(DataContext)
  return (
    <View style={{ marginTop: 30 }}>
      <View>
        <Box bg="gray.100" rounded="xl" style={styles.boxCheckbox}>
          <View style={styles.boxCheckboxView}>
            <Box style={{ gap: 40 }} width="100%">
              <Checkbox
                _checked={{
                  backgroundColor: appColor,
                  borderColor: appColor,
                }}
                _text={{ width: "100%" }}
                backgroundColor="gray.100"
                isChecked={checkbox1}
                testID="checkbox1"
                value="one"
                width={"100%"}
                onChange={() => onCheckboxPress(1)}
              >
                <Text style={styles.checkboxText}>
                  If I lose my secret phrase, I will not be able to recover this
                  wallet
                </Text>
              </Checkbox>
              <Checkbox
                _checked={{
                  backgroundColor: appColor,
                  borderColor: appColor,
                }}
                _text={{ width: "100%" }}
                backgroundColor="gray.100"
                isChecked={checkbox2}
                testID="checkbox2"
                value="two"
                width={"100%"}
                onChange={() => onCheckboxPress(2)}
              >
                <Text style={styles.checkboxText}>
                  I am responsible for any issue that happens when using this
                  wallet.
                </Text>
              </Checkbox>
              <Checkbox
                _checked={{
                  backgroundColor: appColor,
                  borderColor: appColor,
                }}
                _text={{ width: "100%" }}
                backgroundColor="gray.100"
                isChecked={checkbox3}
                testID="checkbox3"
                value="three"
                width={"100%"}
                onChange={() => onCheckboxPress(3)}
              >
                <Text style={styles.checkboxText}>
                  I am ready to create my new wallet.
                </Text>
              </Checkbox>
            </Box>
          </View>
        </Box>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  boxLogo: {
    flex: 1,
    width: "100%",
    height: Dimensions.get("window").height / 3,
    justifyContent: "center",
    alignItems: "center",
  },
  boxCheckbox: {
    width: "100%",
  },
  boxCheckboxView: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 30,
    padding: 20,
  },
  checkboxText: {
    flexWrap: "wrap",
    paddingLeft: 20,
    paddingRight: 20,
    flexGrow: 1,
    flexShrink: 1,
    color: "#000",
  },
})

export default UserResponsibility
