function Details ({ detail }) {
  const { question, steps, note, gifs, description } = detail
  return (
    <details>
      <summary className='font-bold text-lg py-2'>
        {question}
      </summary>
      <p className='text-lg' dangerouslySetInnerHTML={{ __html: description }} />
      <ol className='list-decimal px-4'>
        {steps?.map((step, i) => <li key={`step-${i}`}>{step}</li>)}
      </ol>
      {note && <p className='text-lg font-semibold'><span className='text-red-500 font-bold'>Nota:</span> {note}</p>}
      <div className='flex justify-center flex-wrap gap-2 py-4'>
        {gifs?.map((gif, i) => {
          const { name, uri } = gif
          return (
            <div key={`gif-${i}`} className='text-center font-semibold text-yellow-300'>
              <h4>{name}</h4>
              <img src={uri} alt={`gif con la explicación de ${question}`} className='w-96' />
            </div>
          )
        })}
      </div>
    </details>
  )
}

export default Details
