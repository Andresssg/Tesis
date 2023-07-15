import { useEffect, useState } from 'react'
import list from '../assets/parks.json'

function ParkList ({ handleShowParksList, filter = '', setParkName, setFilter }) {
  const [parks, setParks] = useState([...list])
  const setName = (value) => {
    handleShowParksList()
    setParkName(value)
    setFilter(value)
  }

  const filterParks = () => {
    const newList = list.filter(park => {
      return park.name.includes(filter.trim()) || park.code.includes(filter.trim())
    })
    setParks(newList)
  }

  useEffect(filterParks, [filter])

  return (
    <div
      className='left-0 absolute top-16 flex max-h-96 w-full flex-col gap-y-2 overflow-auto bg-gray-200 p-4 py-6 z-20'
    >
      {parks?.map(
        park => {
          const { code, name } = park
          return (
            <div
              key={`park-${code}`}
              className='rounded-lg border-2 border-black p-2 w-full cursor-pointer hover:bg-sky-400'
              onClick={() => setName(name)}
            >{code}-{name}
            </div>
          )
        }
      )}
    </div>
  )
}

export default ParkList
