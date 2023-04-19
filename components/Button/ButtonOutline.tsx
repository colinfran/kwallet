import React, { useContext } from "react"
import { DataContext } from "../../providers/DataProvider"
import { Button } from "native-base"

type ButtonProps = {
  text: string
  route?: string
  isDisabled?: boolean
  leftIcon?: JSX.Element[] | JSX.Element
  onPress?: () => void
  textColor?: string
}

const ButtonOutline = ({
  text,
  isDisabled = false,
  leftIcon,
  onPress,
  textColor,
}: ButtonProps): JSX.Element => {
  const { appColor, textColor: fontColor } = useContext(DataContext)
  return (
    <Button
      _text={{
        style: {
          color: textColor || fontColor,
        },
      }}
      borderColor={appColor}
      borderRadius={15}
      isDisabled={isDisabled}
      leftIcon={leftIcon}
      size="lg"
      testID="test-button"
      variant="outline"
      onPress={onPress}
    >
      {text}
    </Button>
  )
}

export default ButtonOutline
