import React from "react"
import renderer from "react-test-renderer"
import { NativeBaseProviderTest } from "../helper"
import { fireEvent, render, screen } from "@testing-library/react-native"
import { DataContext } from "../../providers/DataProvider"
import UserResponsibility from "../../components/UserResponsibility"

const mockFunction = jest.fn()

const RenderComponent = (): JSX.Element => (
  <DataContext.Provider
    value={
      {
        selectedCurrency: "USD",
        graphData: {
          day: [
            {
              x: 1679246714543,
              y: 0.014540020460445197,
            },
            {
              x: 1679247047789,
              y: 0.014571506674731024,
            },
            {
              x: 1679247288167,
              y: 0.014452072671740143,
            },
          ],
        },
      } as any
    }
  >
    <NativeBaseProviderTest>
      <UserResponsibility
        checkbox1={false}
        checkbox2={false}
        checkbox3={false}
        onCheckboxPress={mockFunction}
      />
    </NativeBaseProviderTest>
  </DataContext.Provider>
)

describe("<UserResponsibility />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<RenderComponent />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("text", () => {
    render(<RenderComponent />)
    const kwallet = screen.getByText("I am ready to create my new wallet.")
    expect(kwallet).toBeDefined()
  })

  it("checkboxes", async () => {
    render(<RenderComponent />)
    const checkbox1 = screen.getByTestId("checkbox1")
    fireEvent.press(checkbox1)
    const checkbox2 = screen.getByTestId("checkbox2")
    fireEvent.press(checkbox2)
    const checkbox3 = screen.getByTestId("checkbox3")
    fireEvent.press(checkbox3)
    expect(mockFunction.mock.calls.length).toBe(3)
  })
})
