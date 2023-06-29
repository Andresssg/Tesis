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
    <div className='flex flex-col items-center justify-center gap-4 text-gray-50 font-medium text-2xl p-5 w-full'>
      <h2>Conteo <span className='text-green-500'>Ingreso</span>: {statistics?.conteo?.ingreso_personas}</h2>
      <h2>Conteo <span className='text-red-500'>Salida</span>: {statistics?.conteo?.salida_personas}</h2>
      <div className='flex items-center flex-wrap justify-center xl:w-[85vw] 2xl:w-[80vw] py-5 px-2 xl:gap-x-5'>
        {statistics?.charts.map((chart, i) => <img key={`chart-${i}`} src={chart} alt='Gráfica' className='xl:w-[calc(49%-20px)] 2xl:max-w-2xl' />)}
      </div>
      <div className='flex w-full justify-evenly items-center font-medium text-base'>
        <button onClick={handleDownload} className='p-2 bg-sky-500 cursor-pointer hover:bg-sky-300'>Descargar video</button>
      </div>
    </div>
  )
}

export default Statistics
