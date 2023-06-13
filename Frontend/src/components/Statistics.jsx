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
    <div className='text-gray-50 font-medium text-2xl'>
      <h2>Conteo ingreso: {statistics.conteo.ingreso_personas}</h2>
      <h2>Conteo Salida: {statistics.conteo.salida_personas}</h2>
      <div className='flex w-full justify-evenly items-center font-medium text-base'>
        <button onClick={handleDownload} className='p-2 bg-sky-500 cursor-pointer hover:bg-sky-300'>Descargar video</button>
      </div>
    </div>
  )
}

export default Statistics
