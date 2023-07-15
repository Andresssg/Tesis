import parkIcon from '../assets/trees-icon.webp'

function ParkItem ({ park = {}, setName }) {
  return (
    <div
      className='flex items-center gap-x-4 rounded-lg border-2 border-slate-800 border-opacity-20 p-2 w-full
      cursor-pointer hover:bg-sky-600 text-xs font-bold'
      onClick={() => setName(park.name)}
    >
      <img src={parkIcon} alt='' className='h-14 p-2 rounded-full border-2 bg-slate-800' />
      <div>
        <p className=''>Código: <span className='font-semibold'>{park.code}</span></p>
        <p className='text-base'>Nombre: <span className='font-normal'>{park.name}</span></p>
        <p className=''>Dirección: <span className='font-semibold'>{park.code}</span></p>
        <p className=''>Tipo: <span className='font-semibold'>{park.code}</span></p>
      </div>
    </div>
  )
}

export default ParkItem
