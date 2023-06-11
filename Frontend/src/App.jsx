import { useState } from 'react'
import Loading from './components/Loading'
import Canva from './components/Canva'

function App () {
  const [isLoading, setIsLoading] = useState(true)
  const [showImage, setShowImage] = useState(false)
  const [image, setImage] = useState('https://estaticos.elcolombiano.com/binrepository/720x674/0c54/720d565/none/11101/PCKJ/wilson-perro-pastor-belga-ninos-indigenas-rescatados_42572597_20230609220651.jpg')

  const handleUpload = (e) => {
    e.preventDefault()
    window.alert('Hola')
    setShowImage(true)
  }
  return (
    <article>
      <section className='flex flex-col justify-center items-center w-full p-10 gap-5 text-4xl text-center text-gray-50'>
        <h1 className='font-extrabold'>CESP</h1>
        <h2 className='text-2xl md:w-4/12'>Sistema de carga de videos de parques para conteo de ingreso y salida de personas con IA</h2>
      </section>
      <section className='flex flex-col items-center justify-center w-full'>
        <form onSubmit={handleUpload} className='flex flex-col p-5 gap-5 w-full md:w-2/6 '>
          <input
            type='text' name='parkname' id='parkname'
            placeholder='Ingrese el nombre del parque' className='p-2 focus:outline-2 focus:outline-sky-500'
          />
          <input type='file' name='video' id='video' accept='video/*' className='text-gray-300 cursor-pointer' />
          <input type='submit' value='Subir video' className='p-2 bg-sky-500 cursor-pointer hover:bg-sky-300' />
        </form>
      </section>
      {showImage &&
        <section className='flex flex-col items-center justify-center w-full'>
          {isLoading
            ? <Loading />
            : <Canva image={image} />}
        </section>}
    </article>
  )
}

export default App
