import { useEffect, useState } from 'react'
import list from '../assets/parks.json'

function ParkList ({ handleShowParksList, filter = '', setParkName }) {
  const [parks, setParks] = useState([...list])
  const setName = (value) => {
    handleShowParksList()
    setParkName(value)
  }

  const filterParks = () => {
    const newList = list.filter(park => {
      return park.name.includes(filter) || park.code.includes(filter)
    })
    setParks(newList)
  }

  useEffect(filterParks, [filter])

  return (
    <div
      className='left-0 absolute top-16 flex max-h-96 w-full flex-col gap-y-2 overflow-auto bg-gray-200 p-4 py-6'
      onMouseLeave={handleShowParksList}
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
