import React, { useCallback } from "react"
import { StyleSheet, View } from "react-native"

import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet"

const BottomSheet = ({
  children,
  handleComponent,
  bottomSheetModalRef,
}): JSX.Element => {
  return (
    <View style={{ position: "relative", flex: 1 }}>
      <View style={styles.componentContainer}>
        <View>
          <BottomSheetModal
            animationConfigs={useBottomSheetTimingConfigs({
              duration: 100,
            })}
            backdropComponent={useCallback(
              (props) => (
                <BottomSheetBackdrop
                  {...props}
                  animatedIndex={{
                    value: 1,
                  }}
                  appearsOnIndex={1}
                />
              ),
              []
            )}
            enableHandlePanningGesture={false}
            enablePanDownToClose={false}
            handleComponent={handleComponent}
            ref={bottomSheetModalRef}
            snapPoints={["80%"]}
            style={{ zIndex: 5 }}
          >
            {children}
          </BottomSheetModal>
        </View>
      </View>
    </View>
  )
}

export default BottomSheet

const styles = StyleSheet.create({
  componentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: 20,
    zIndex: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "lightgrey",
    padding: 40,
  },
  headerContainer: {
    backgroundColor: "lightgrey",
    flex: 1,
    alignItems: "flex-start",
    paddingLeft: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  continueButton: {
    width: "100%",
    paddingTop: 40,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
})
