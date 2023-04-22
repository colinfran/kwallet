import React from "react"
import renderer from "react-test-renderer"
import { NativeBaseProviderTest } from "../helper"
import { fireEvent, render, screen } from "@testing-library/react-native"
import { DataContext } from "../../providers/DataProvider"
import Chart from "../../components/Chart"
import { cleanup } from "@testing-library/react-native"

const mockFunction = jest.fn()

const data = {
  prices: [
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
}

const RenderComponent = (): JSX.Element => (
  <DataContext.Provider
    value={
      {
        appColor: "#123456",
        selectedGraphIndex: 0,
        setSelectedGraphIndex: mockFunction,
        textColor: "#000",
        selectedCurrency: "USD",
        graphData: {
          day: data,
          week: data,
          month: data,
          year: data,
          all: data,
        },
      } as any
    }
  >
    <NativeBaseProviderTest>
      <Chart />
    </NativeBaseProviderTest>
  </DataContext.Provider>
)

describe("<Chart />", () => {
  const RealDate = Date

  beforeEach(() => {
    // @ts-ignore Type 'typeof Date' is not assignable to type 'DateConstructor'
    global.Date = class extends RealDate {
      constructor() {
        super()
        return new RealDate("04/20/2023")
      }
    }
  })
  afterEach(() => {
    global.Date = RealDate
  })
  afterEach(cleanup)

  it("renders correctly", () => {
    const tree = renderer.create(<RenderComponent />).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it("buttons", () => {
    render(<RenderComponent />)
    for (let i = 0; i < 5; i++) {
      const btn = screen.getByTestId(`test-chart-btn-${i}`)
      fireEvent.press(btn)
      expect(mockFunction.mock.lastCall[0]).toBe(i)
    }
    expect(mockFunction.mock.calls.length).toBe(5)
  })
})
