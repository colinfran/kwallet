import React from "react"
import { Providers } from "../helper"
import { fireEvent, render, screen } from "@testing-library/react-native"
import UserResponsibility from "../../components/UserResponsibility"

const mockFunction = jest.fn()

describe("<UserResponsibility />", () => {
  it("renders correctly", () => {
    const tree = render(
      <UserResponsibility
        checkbox1={false}
        checkbox2={false}
        checkbox3={false}
        onCheckboxPress={mockFunction}
      />,
      { wrapper: Providers }
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("text", () => {
    render(
      <UserResponsibility
        checkbox1={false}
        checkbox2={false}
        checkbox3={false}
        onCheckboxPress={mockFunction}
      />,
      { wrapper: Providers }
    )
    const kwallet = screen.getByText("I am ready to create my new wallet.")
    expect(kwallet).toBeDefined()
  })

  it("checkboxes", async () => {
    render(
      <UserResponsibility
        checkbox1={false}
        checkbox2={false}
        checkbox3={false}
        onCheckboxPress={mockFunction}
      />,
      { wrapper: Providers }
    )
    const checkbox1 = screen.getByTestId("checkbox1")
    fireEvent.press(checkbox1)
    const checkbox2 = screen.getByTestId("checkbox2")
    fireEvent.press(checkbox2)
    const checkbox3 = screen.getByTestId("checkbox3")
    fireEvent.press(checkbox3)
    expect(mockFunction.mock.calls.length).toBe(3)
  })
})
