import React from "react"
import renderer from "react-test-renderer"
import DoubleButton from "../../components/Button/DoubleButton"
import { NativeBaseProviderTest } from "../helper"
import { render, screen, fireEvent } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import ButtonOutline from "../../components/Button/ButtonOutline"

const onPressEventFunc1 = jest.fn()
const onPressEventFunc2 = jest.fn()
const onPressEventFunc3 = jest.fn()

const RenderDoubleButton = (): JSX.Element => {
  return (
    <NativeBaseProviderTest>
      <DoubleButton
        buttonGroupStyle={undefined}
        buttonProps={undefined}
        left={{
          text: "left",
          onPress: onPressEventFunc1,
        }}
        right={{
          text: "right",
          onPress: onPressEventFunc2,
        }}
      />
    </NativeBaseProviderTest>
  )
}

const RenderButtonOutline = (): JSX.Element => {
  return (
    <NativeBaseProviderTest>
      <ButtonOutline text={"outlineButton"} onPress={onPressEventFunc3} />
    </NativeBaseProviderTest>
  )
}

describe("Button", () => {
  describe("<DoubleButton />", () => {
    it("renders correctly", () => {
      const tree = renderer.create(<RenderDoubleButton />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("text", () => {
      render(<RenderDoubleButton />)
      const leftBtn = screen.getByTestId("test-left")
      const rightBtn = screen.getByTestId("test-right")
      expect(leftBtn).toHaveTextContent("left")
      expect(rightBtn).toHaveTextContent("right")
    })

    it("onClick", () => {
      render(<RenderDoubleButton />)
      const leftBtn = screen.getByTestId("test-left")
      const rightBtn = screen.getByTestId("test-right")
      fireEvent.press(leftBtn)
      fireEvent.press(rightBtn)
      expect(onPressEventFunc1.mock.calls.length).toBe(1)
      expect(onPressEventFunc2.mock.calls.length).toBe(1)
    })
  })
  describe("<ButtonOutline />", () => {
    it("renders correctly", () => {
      const tree = renderer.create(<RenderButtonOutline />).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("text", () => {
      render(<RenderButtonOutline />)
      const btn = screen.getByTestId("test-button")
      expect(btn).toHaveTextContent("outlineButton")
    })

    it("onClick", () => {
      render(<RenderButtonOutline />)
      const btn = screen.getByTestId("test-button")
      fireEvent.press(btn)
      expect(onPressEventFunc3.mock.calls.length).toBe(1)
    })
  })
})
