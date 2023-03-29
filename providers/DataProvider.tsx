/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, createContext, useEffect } from "react"
import * as SecureStore from "expo-secure-store"
import * as Sentry from "sentry-expo"
import { useColorScheme } from "react-native"

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

  selectedWalletIndex: 0,
  setSelectedWalletIndex: (index: number) => {},

  apiData: undefined,
  setApiData: (data) => {},
  getApiData: async () => {
    return {}
  },

  showAlert: undefined,
  setShowAlert: (data) => {},
})

export const DataProvider = ({ children }): JSX.Element => {
  const [textColor, setTextColor] = useState("#000")
  const [wallets, setWallets] = useState([])
  const [selectedWalletIndex, setSelectedWalletIndex] = useState(0)
  const [pickedColor, setPickedColor] = useState("#7fdccc")

  const [apiData, setApiData] = useState<ApiType>()
  const [showAlert, setShowAlert] = useState()

  const getApiData = async (): Promise<any> => {
    console.log("Data refresh occurring.")
    const selectedWallet = wallets[selectedWalletIndex]
    console.log(selectedWallet)
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: selectedWallet.walletData.userPassword,
          encryptedMnemonic: selectedWallet.walletData.encryptedMnemonic,
        }),
      }
      const url = "http://localhost:3000/api/data"
      // const url = "https://kwallet.app/api/data"
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

  const getData = async () => {
    const walletData = await SecureStore.getItemAsync("wallets")
    if (walletData !== null) {
      setWallets(JSON.parse(walletData))
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

        apiData,
        setApiData,
        getApiData,

        showAlert,
        setShowAlert,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
