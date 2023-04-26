import React from "react"
import { Providers, setSelectedMock } from "../helper"
import { fireEvent, render, screen } from "@testing-library/react-native"
import Chart from "../../components/Chart"
import { cleanup } from "@testing-library/react-native"

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

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("renders correctly", () => {
    const tree = render(<Chart />, { wrapper: Providers }).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it("buttons", () => {
    render(<Chart />, { wrapper: Providers })
    for (let i = 0; i < 5; i++) {
      const btn = screen.getByTestId(`test-chart-btn-${i}`)
      fireEvent.press(btn)
      expect(setSelectedMock.mock.lastCall[0]).toBe(i)
    }
    expect(setSelectedMock.mock.calls.length).toBe(5)
  })
})
