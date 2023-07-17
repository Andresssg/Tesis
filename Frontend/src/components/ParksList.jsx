import { useEffect, useState, useRef, useContext } from 'react'
import ParkItem from './ParkItem'
import { RequestContext } from '../contexts/RequestContext'

function ParkList ({ handleShowParksList, filter = '', setParkName, setFilter }) {
  const { parks } = useContext(RequestContext)
  const [filteredParks, setFilteredParks] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(10)
  const listRef = useRef(null)

  const setName = (value) => {
    handleShowParksList()
    setParkName(value)
    setFilter(value)
  }

  const filterParks = () => {
    const newList = parks.filter((park) => {
      return park.name.includes(filter.trim()) || park.code.includes(filter.trim())
    })
    setFilteredParks(newList)
    setStartIndex(0)
    setEndIndex(10)
  }

  useEffect(filterParks, [filter])
  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = listRef.current

    if (scrollTop + clientHeight >= scrollHeight) {
      setEndIndex((prevEndIndex) => prevEndIndex + 10)
    }
  }

  useEffect(() => {
    if (listRef.current) {
      listRef.current.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (listRef.current) {
        listRef.current.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const visibleParks = filteredParks.slice(startIndex, endIndex)

  return (
    <div
      className='left-0 absolute top-16 flex max-h-96 w-full flex-col gap-y-2 overflow-auto
      bg-white p-4 py-6 z-20 shadow-md shadow-black rounded-lg'
      ref={listRef}
    >
      {visibleParks.map((park) => (
        <ParkItem key={park.code} park={park} setName={(value) => setName(value)} />
      ))}
    </div>
  )
}

export default ParkList
