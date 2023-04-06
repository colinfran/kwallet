/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, createContext, useEffect } from "react"
import * as SecureStore from "expo-secure-store"
import * as Sentry from "sentry-expo"
import { useColorScheme } from "react-native"
import { apiKey, apiUrl } from "../constants/index"

type DataPoint = {
  timestamp: number
  value: number
}

type Prices = DataPoint[]

type Interval = {
  percent_change: number
  prices: Prices
}

export type ApiType = {
  appStatus?: {
    alert: boolean
    alertHeader: string
    alertDescription: string
  }
  error?: boolean
  errorDescription?: string
  currentPrice?: string
  day?: Interval
  week?: Interval
  month?: Interval
  year?: Interval
  all?: Interval
  walletData?: any
}

// exposed context for doing awesome things directly in React
export const DataContext = createContext({
  textColor: "#000",

  pickedColor: "#7fdccc",
  setPickedColor: (hex: string) => {},

  wallets: [],
  setWallets: (newWallet: object) => {},

  isLoaded: false,
  setIsLoaded: (loaded: boolean) => {},

  walletBalance: undefined,
  setWalletBalance: (walletBalance: object) => {},

  selectedWalletIndex: 0,
  setSelectedWalletIndex: (index: number) => {},

  graphData: undefined,
  setGraphData: (data) => {},
  getGraphData: async () => {
    return {}
  },

  showAlert: undefined,
  setShowAlert: (data) => {},

  selectedGraphIndex: 0,
  setSelectedGraphIndex: (idx) => {},
})

export const DataProvider = ({ children }): JSX.Element => {
  const [textColor, setTextColor] = useState("#000")
  const [wallets, setWallets] = useState([])
  const [selectedWalletIndex, setSelectedWalletIndex] = useState(0)
  const [pickedColor, setPickedColor] = useState("#7fdccc")

  const [isLoaded, setIsLoaded] = useState(false)
  const [graphData, setGraphData] = useState()
  const [walletBalance, setWalletBalance] = useState()

  const [showAlert, setShowAlert] = useState()

  const [selectedGraphIndex, setSelectedGraphIndex] = useState(0)

  useEffect(() => {
    if (graphData?.appStatus) {
      setShowAlert(graphData.appStatus)
    }
  }, [graphData])

  const getData = async () => {
    const walletData = await SecureStore.getItemAsync("wallets")
    if (walletData !== null) {
      setWallets(JSON.parse(walletData))
    }
  }

  const getGraphData = async (): Promise<any> => {
    console.log("Fetching graph data")
    const selectedWallet = wallets[selectedWalletIndex]
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          password: selectedWallet.walletData.userPassword,
          encryptedMnemonic: selectedWallet.walletData.encryptedMnemonic,
        }),
      }
      const url = `${apiUrl}/api/data`
      const response = await fetch(url, options)
      const json = await response.json()
      if (json && !json.error) {
        return json
      }
    } catch (error) {
      Sentry.Native.captureException(error)
      return { error: true, errorDescription: "" }
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <DataContext.Provider
      value={{
        textColor,
        setTextColor,

        wallets,
        setWallets,

        selectedWalletIndex,
        setSelectedWalletIndex,

        pickedColor,
        setPickedColor,

        isLoaded,
        setIsLoaded,

        graphData,
        setGraphData,
        getGraphData,

        walletBalance,
        setWalletBalance,

        showAlert,
        setShowAlert,

        selectedGraphIndex,
        setSelectedGraphIndex,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
