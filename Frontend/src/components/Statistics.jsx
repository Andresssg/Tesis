import { useContext } from 'react'
import { RequestContext } from '../contexts/RequestContext'

function Statistics () {
  const { statistics } = useContext(RequestContext)
  const handleDownload = () => {
    window.alert('descargar')
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
