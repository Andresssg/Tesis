import parkIcon from '../assets/trees-icon.webp'

function ParkItem ({ park = {}, setName }) {
  const { name, code, scale, locality, address } = park
  const defaultTexts = {
    codeText: 'Sin código',
    nameText: 'Sin nombre',
    scaleText: 'Sin tipo',
    addressText: 'Sin dirección',
    localityText: 'Sin localidad'
  }
  return (
    <div
      className='flex items-center gap-x-4 rounded-lg border-2 border-slate-800 border-opacity-20 p-2 w-full
      cursor-pointer hover:bg-sky-600 text-xs font-bold'
      onClick={() => setName(park.name)}
    >
      <img src={parkIcon} alt='' className='h-14 p-2 rounded-full border-2 bg-slate-800' />
      <div>
        <p>Código: <span className='font-semibold'>{code || defaultTexts.codeText}</span></p>
        <p className='text-base'>Nombre: <span className='font-normal'>{name || defaultTexts.nameText}</span></p>
        <p>Dirección: <span className='font-semibold'>{address || defaultTexts.addressText}</span> - Localidad: <span className='font-semibold'>{locality || defaultTexts.localityText}</span></p>
        <p>Tipo: <span className='font-semibold'>{scale || defaultTexts.scaleText}</span></p>
      </div>
    </div>
  )
}

export default ParkItem
