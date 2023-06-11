function Canva ({ image }) {
  const handleDraw = () => {
    window.alert('Pintar linea')
  }

  const handleAnalyze = () => {
    window.alert('Analizar video')
  }
  return (
    <div className='flex flex-col p-5 gap-5 w-full md:w-2/6 text-gray-50'>
      <h2 className='text-2xl uppercase font-medium'>Dibujar linea</h2>
      <details>
        <summary>
          ¿Que hacer?
        </summary>
        <ol className='list-decimal px-6'>
          <li>Primero haga click aqui para x vaina</li>
          <li>Segundo haga no se que</li>
          <li>Tercero disfrute</li>
        </ol>
      </details>
      <img src={image} />
      <div className='flex w-full justify-evenly items-center font-medium'>
        <button onClick={handleDraw} className='p-2 bg-sky-500 cursor-pointer hover:bg-sky-300'>Pintar linea</button>
        <button onClick={handleAnalyze} className='p-2 bg-sky-500 cursor-pointer hover:bg-sky-300'>Analizar video</button>
      </div>
    </div>
  )
}

export default Canva
