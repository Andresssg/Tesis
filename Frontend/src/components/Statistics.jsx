import { useContext } from 'react'
import { RequestContext } from '../contexts/RequestContext'

function Statistics ({ videoName }) {
  const { BASE_URL, statistics } = useContext(RequestContext)

  const handleDownload = async () => {
    const res = await fetch(`${BASE_URL}/download?video_name=${videoName}`,
      {
        method: 'GET'
      })
    if (!res.ok) {
      const data = await res?.json()
      return window.alert(data.error)
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = videoName
    link.click()
  }

  return (
    <div className='flex flex-col items-center justify-center gap-4 md:w-2/6 lg:w-4/6 text-gray-50 font-medium text-2xl p-5'>
      <h2>Conteo <span className='text-green-500'>Ingreso</span>: {statistics?.conteo?.ingreso_personas}</h2>
      <h2>Conteo <span className='text-red-500'>Salida</span>: {statistics?.conteo?.salida_personas}</h2>
      <img src={statistics?.chart} />
      <div className='flex w-full justify-evenly items-center font-medium text-base'>
        <button onClick={handleDownload} className='p-2 bg-sky-500 cursor-pointer hover:bg-sky-300'>Descargar video</button>
      </div>
    </div>
  )
}

export default Statistics
