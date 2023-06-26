import { createContext, useState } from 'react'

export const RequestContext = createContext({})

export function RequestContextProvider ({ children }) {
  const BASE_URL = 'http://20.150.195.115/api'
  const [statistics, setStatistics] = useState()

  return (
    <RequestContext.Provider value={{ BASE_URL, statistics, setStatistics }}>
      {children}
    </RequestContext.Provider>
  )
}
