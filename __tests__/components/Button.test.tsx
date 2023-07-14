import React from "react"
import DoubleButton from "../../components/Button/DoubleButton"
import { Providers } from "../helper"
import { render, screen, fireEvent } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import ButtonOutline from "../../components/Button/ButtonOutline"

const onPressEventFunc1 = jest.fn()
const onPressEventFunc2 = jest.fn()
const onPressEventFunc3 = jest.fn()

describe("Button", () => {
  describe("<DoubleButton />", () => {
    it("renders correctly", () => {
      const tree = render(
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
        />,
        { wrapper: Providers }
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("text", () => {
      render(
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
        />,
        { wrapper: Providers }
      )
      const leftBtn = screen.getByTestId("test-left")
      const rightBtn = screen.getByTestId("test-right")
      expect(leftBtn).toHaveTextContent("left")
      expect(rightBtn).toHaveTextContent("right")
    })

    it("onClick", () => {
      render(
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
        />,
        { wrapper: Providers }
      )
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
      const tree = render(
        <ButtonOutline text="outlineButton" onPress={onPressEventFunc3} />,
        { wrapper: Providers }
      ).toJSON()
      expect(tree).toMatchSnapshot()
    })

    it("text", () => {
      render(
        <ButtonOutline text="outlineButton" onPress={onPressEventFunc3} />,
        { wrapper: Providers }
      )
      const btn = screen.getByTestId("test-button")
      expect(btn).toHaveTextContent("outlineButton")
    })

    it("onClick", () => {
      render(
        <ButtonOutline text="outlineButton" onPress={onPressEventFunc3} />,
        { wrapper: Providers }
      )
      const btn = screen.getByTestId("test-button")
      fireEvent.press(btn)
      expect(onPressEventFunc3.mock.calls.length).toBe(1)
    })
  })
})
