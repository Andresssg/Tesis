import { useContext, useState } from 'react'
import Loading from './components/Loading'
import Canva from './components/Canva'
import { RequestContext } from './contexts/RequestContext'
import Statistics from './components/Statistics'

function App () {
  const [isLoading, setIsLoading] = useState(true)
  const [showImage, setShowImage] = useState(false)
  const [showStatistics, setShowStatistics] = useState(false)
  const [parkName, setParkName] = useState('')
  const [video, setVideo] = useState('')
  const [image, setImage] = useState('')
  const { BASE_URL } = useContext(RequestContext)
  const [data, setData] = useState()

  const [prevVideo, setPrevVideo] = useState('')

  const handleUpload = (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const formParkName = form.get('parkname')
    const formVideo = form.get('video')
    if (!formParkName || !formVideo.size) return window.alert('Por favor complete los campos')
    if (prevVideo === formVideo) {
      const confirmed = window.confirm('¿Desea subir nuevamente el mismo video?')
      if (!confirmed) { return }
    }
    setPrevVideo(formVideo)
    getData(form)
    setShowImage(true)
    setIsLoading(true)
    setShowStatistics(false)
  }

  const getData = async (form) => {
    const res = await fetch(`${BASE_URL}/upload/`, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json'
      },
      body: form
    })
    const data = await res?.json()
    if (!res.ok) {
      return data?.error
        ? window.alert(data?.error)
        : window.alert(`Error al enviar los datos: ${res.statusText}`)
    }
    const { first_frame } = data
    setImage(first_frame)
    setData(data)
    setIsLoading(false)
  }

  return (
    <article>
      <section className='flex flex-col justify-center items-center w-full p-10 gap-5 text-4xl text-center text-gray-50'>
        <h1 className='font-extrabold'>CESP</h1>
        <h2 className='text-2xl md:w-4/12'>Sistema de carga de videos de parques para conteo de ingreso y salida de personas con IA</h2>
      </section>
      <section className='flex flex-col items-center justify-center w-full'>
        <form
          onSubmit={handleUpload} className='flex flex-col p-5 gap-5 w-full md:w-4/6 lg:w-2/6 '
        >
          <input
            type='text' name='parkname' id='parkname'
            placeholder='Ingrese el nombre del parque' className='p-2 focus:outline-2 focus:outline-sky-500'
            defaultValue={parkName} onChange={(e) => setParkName(e.target.value)}
          />
          <input
            type='file' name='video' id='video' accept='video/*' className='text-gray-300 cursor-pointer'
            defaultValue={video} onChange={(e) => setVideo(e.target.value)}
          />
          <input type='submit' value='Subir video' className='p-2 bg-sky-500 hover:bg-sky-300 cursor-pointer' />
        </form>
      </section>
      {showImage &&
        <section className='flex flex-col items-center justify-center w-full'>
          {isLoading
            ? <Loading text='Subiendo video' />
            : <Canva
                imageBase64={image} processedData={data} setShowStatistics={() => setShowStatistics(!showStatistics)}
                setShowImage={() => setShowImage(!setShowImage)} setIsLoading={(value) => setIsLoading(value)}
              />}
        </section>}
      {showStatistics &&
        <section className='flex flex-col items-center justify-center w-full'>
          {isLoading
            ? <Loading text='Analizando video' />
            : <Statistics videoName={data?.video_name} />}
        </section>}
    </article>
  )
}

export default App
