import { useContext, useState } from 'react'
import Loading from './components/Loading'
import Canva from './components/Canva'
import Statistics from './components/Statistics'
import { RequestContext } from './contexts/RequestContext'

function App () {
  const [isLoading, setIsLoading] = useState(true)
  const [showImage, setShowImage] = useState(false)
  const [showStatistics, setShowStatistics] = useState(false)
  const [parkName, setParkName] = useState('')
  const [video, setVideo] = useState('')
  const [image, setImage] = useState('')
  const { BASE_URL } = useContext(RequestContext)
  const [data, setData] = useState(null)
  const [prevVideo, setPrevVideo] = useState('')

  const handleUpload = (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const formParkName = form.get('parkname')
    const formVideo = form.get('video')

    if (!formParkName || !formVideo.size) {
      window.alert('Por favor complete los campos')
      return
    }

    if (prevVideo === formVideo && !window.confirm('¿Desea subir nuevamente el mismo video?')) {
      return
    }
    setPrevVideo(formVideo)
    getData(form)
  }

  const getData = async (form) => {
    setShowStatistics(false)
    setShowImage(true)
    setIsLoading(true)

    try {
      const res = await fetch(`${BASE_URL}/upload/`, {
        method: 'POST',
        body: form
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error || `Error al enviar los datos: ${res.statusText}`)
      }

      const data = await res.json()
      const { first_frame } = data
      setImage(first_frame)
      setData(data)
      setIsLoading(false)
      setShowStatistics(false)
    } catch (error) {
      window.alert('Error al subir el video')
      setIsLoading(false)
      if (!image) setShowImage(false)
    }
  }

  return (
    <article className='flex flex-col items-center justify-center w-full'>
      <section className='flex flex-col justify-center items-center w-full p-10 gap-5 text-4xl text-center text-gray-50'>
        <h1 className='font-extrabold'>CESP</h1>
        <h2 className='text-2xl md:w-4/12'>Sistema de carga de videos de parques para conteo de ingreso y salida de personas con IA</h2>
      </section>
      <section className='flex flex-col items-center justify-center w-full'>
        <form onSubmit={handleUpload} className='flex flex-col p-5 gap-5 w-full md:w-4/6 lg:w-2/6'>
          <input
            type='text'
            name='parkname'
            id='parkname'
            placeholder='Ingrese el nombre del parque'
            className='p-2 focus:outline-2 focus:outline-sky-500'
            defaultValue={parkName}
            onChange={(e) => setParkName(e.target.value)}
          />
          <input
            type='file'
            name='video'
            id='video'
            accept='video/*'
            className='text-gray-300 cursor-pointer'
            defaultValue={video}
            onChange={(e) => setVideo(e.target.value)}
          />
          <input type='submit' value='Subir video' className='p-2 bg-sky-500 hover:bg-sky-300 cursor-pointer font-medium text-gray-50' />
        </form>
      </section>
      {showImage && (
        <section className='flex flex-col items-center justify-center w-full'>
          {isLoading
            ? <Loading text='Subiendo video' />
            : <Canva
                imageBase64={image}
                processedData={data}
                setShowStatistics={(value) => setShowStatistics(value)}
                setShowImage={(value) => setShowImage(value)}
                setIsLoading={(value) => setIsLoading(value)}
              />}
        </section>
      )}
      {showStatistics && (
        <section className='flex flex-col items-center justify-center w-full'>
          {isLoading
            ? <Loading text='Analizando video' />
            : <Statistics videoName={data?.video_name} />}
        </section>
      )}
    </article>
  )
}

export default App
