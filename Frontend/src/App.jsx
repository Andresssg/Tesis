import { useContext, useState } from 'react'
import Loading from './components/Loading'
import Canva from './components/Canva'
import Statistics from './components/Statistics'
import { RequestContext } from './contexts/RequestContext'
import ParkList from './components/ParksList'
import Sidebar from './components/sidebarcomponents/Sidebar'

function App () {
  const [isLoading, setIsLoading] = useState(true)
  const [showImage, setShowImage] = useState(false)
  const [showParksList, setShowParksList] = useState(false)
  const [showStatistics, setShowStatistics] = useState(false)
  const [parkName, setParkName] = useState('')
  const [video, setVideo] = useState('')
  const [image, setImage] = useState('')
  const { BASE_URL } = useContext(RequestContext)
  const [data, setData] = useState(null)
  const [prevVideo, setPrevVideo] = useState('')
  const [filter, setFilter] = useState('')
  const [duration, setDuration] = useState('')

  const handleUpload = (e) => {
    e.preventDefault()
    if (!parkName || !video.size || !filter) {
      window.alert('Por favor complete los campos')
      return
    }

    if (parkName !== filter.trim()) {
      window.alert('El parque seleccionado no corresponde a ninguno en la lista, por favor seleccione uno.')
      return
    }

    if (prevVideo === video && !window.confirm('¿Desea subir nuevamente el mismo video?')) {
      return
    }

    if (duration > 1200) {
      return window.alert('el video no puede tener una duración mayor a 20 minutos')
    }
    const form = new FormData()
    form.append('parkname', parkName)
    form.append('video', video)
    form.append('duration', duration)
    setPrevVideo(video)
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

  const handleParkName = (value) => {
    setParkName(value)
  }

  const handleInputChange = (e) => {
    setShowParksList(true)
    setFilter(e.target.value.toUpperCase())
  }

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowParksList(false)
    }, 500)
  }

  const handleVideoInput = (e) => {
    const rawVideo = e.target.files[0]
    if (!rawVideo) { return }
    setVideo(rawVideo)
    const videoURL = URL.createObjectURL(rawVideo)

    const videoElement = document.createElement('video')
    videoElement.setAttribute('src', videoURL)

    videoElement.onloadedmetadata = function () {
      URL.revokeObjectURL(videoURL)
      const durationInSeconds = videoElement.duration
      setDuration(parseInt(durationInSeconds))
    }
  }

  return (
    <div className='flex items-start relative'>
      <Sidebar />
      <article className='flex flex-col items-center justify-start w-full py-8 overflow-y-auto h-screen'>
        <section className='flex flex-col justify-center items-center w-full p-10 gap-5 text-4xl text-center text-gray-50'>
          <h1 className='font-extrabold'>CESP</h1>
          <h2 className='text-2xl md:w-9/12 lg:w-8/12 xl:w-4/12'>Sistema de carga de videos de parques para conteo de ingreso y salida de personas con IA</h2>
        </section>
        <div className='flex flex-col items-center justify-center w-full lg:w-4/5 xl:w-3/4 2xl:w-3/6 md:px-10 lg:max-w-4xl'>
          <section className='flex flex-col items-center justify-center w-full'>
            <form onSubmit={handleUpload} className='flex flex-col p-5 gap-5 w-full relative'>
              <input
                type='text'
                name='parkname'
                id='parkname'
                placeholder='Ingrese el nombre o código del parque'
                value={filter}
                className='w-full p-2 focus:outline-2 focus:outline-sky-500'
                onClick={() => setShowParksList(true)}
                onBlur={handleInputBlur}
                onChange={(e) => {
                  handleInputChange(e)
                }}
                autoComplete='off'
              />
              {showParksList &&
                <ParkList
                  handleShowParksList={() => setShowParksList(false)}
                  filter={filter} setParkName={(value) => handleParkName(value)}
                  setFilter={(value) => setFilter(value)}
                />}
              <input
                type='file'
                name='video'
                id='video'
                accept='video/*'
                className='text-gray-300 cursor-pointer'
                defaultValue={video}
                onChange={(e) => handleVideoInput(e)}
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
        </div>
      </article>
    </div>
  )
}

export default App
