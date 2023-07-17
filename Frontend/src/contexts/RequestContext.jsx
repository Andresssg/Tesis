import { createContext, useEffect, useState } from 'react'

export const RequestContext = createContext({})

export function RequestContextProvider ({ children }) {
  const BASE_URL = 'http://cesp.westus3.cloudapp.azure.com/api'
  const [statistics, setStatistics] = useState()
  const [parks, setParks] = useState([])

  useEffect(() => {
    fetchParks()
  }, [])

  const fetchParks = async () => {
    const res = await fetch(`${BASE_URL}/getparks/`, { method: 'GET' })
    const data = await res?.json()
    setParks(data?.parks)
  }

  return (
    <RequestContext.Provider value={{ BASE_URL, statistics, setStatistics, parks }}>
      {children}
    </RequestContext.Provider>
  )
}
