import { createContext, useState } from 'react'

export const RequestContext = createContext({})

export function RequestContextProvider ({ children }) {
  const BASE_URL = 'http://cesp.westus3.cloudapp.azure.com:8000'
  const [statistics, setStatistics] = useState()

  return (
    <RequestContext.Provider value={{ BASE_URL, statistics, setStatistics }}>
      {children}
    </RequestContext.Provider>
  )
}
