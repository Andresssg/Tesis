function Loading () {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='w-12 h-12 rounded-full animate-spin
                    border-4 border-dashed border-sky-500 border-t-transparent'
      />
      <p className='text-gray-50'>Subiendo video</p>
      <p className='text-gray-50'>Esto puede tardar unos minutos...</p>
    </div>

  )
}

export default Loading
