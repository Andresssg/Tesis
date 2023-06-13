import { useEffect, useState } from 'react'

function Loading ({ text }) {
  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [hours, setHours] = useState(0)

  setTimeout(() => {
    let sec = seconds + 1
    if (sec === 60) {
      sec = 0
      setSeconds(sec)
      setMinutes(minutes + 1)
    }
    if (minutes === 60) {
      setHours(hours + 1)
      setMinutes(0)
    }
    setSeconds(sec)
  }, 1000)

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='w-12 h-12 rounded-full animate-spin
                    border-4 border-dashed border-sky-500 border-t-transparent'
      />
      <p className='text-gray-50'>{text}</p>
      <p className='text-gray-50'>Esto puede tardar unos minutos...</p>
      <p className='text-gray-50'>Tiempo transcurrido: {hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds} segundos</p>
    </div>

  )
}

export default Loading
