import { createContext } from 'react'

export const RequestContext = createContext({})

export function RequestContextProvider ({ children }) {
  const BASE_URL = 'http://localhost:8000'

  return (
    <RequestContext.Provider value={{ BASE_URL }}>
      {children}
    </RequestContext.Provider>
  )
}
