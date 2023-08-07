import { createContext, useEffect, useState } from 'react'

export const RequestContext = createContext({})

export function RequestContextProvider ({ children }) {
  const BASE_URL = 'http://cesp.westus3.cloudapp.azure.com/api'
  const [statistics, setStatistics] = useState()
  const [parks, setParks] = useState([])
  const [model, setModel] = useState('COCO')
  const [isPartial, setIsPartial] = useState(false)

  useEffect(() => {
    fetchParks()
  }, [])

  const fetchParks = async () => {
    const res = await fetch(`${BASE_URL}/getparks/`, { method: 'GET' })
    const data = await res?.json()
    setParks(data?.parks)
  }

  const changeModel = (selectedModel) => {
    setModel(selectedModel)
  }

  const updateIsPartial = (value) => {
    setIsPartial(value)
  }

  return (
    <RequestContext.Provider value={{ BASE_URL, statistics, setStatistics, parks, changeModel, model, isPartial, updateIsPartial }}>
      {children}
    </RequestContext.Provider>
  )
}
