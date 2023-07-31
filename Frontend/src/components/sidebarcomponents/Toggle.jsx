import { useContext } from 'react'
import { RequestContext } from '../../contexts/RequestContext'

function Toggle () {
  const { isPartial, updateIsPartial } = useContext(RequestContext)

  const handleCheckboxChange = () => {
    updateIsPartial(!isPartial)
  }

  return (
    <>
      <label className='flex cursor-pointer select-none items-center'>
        <div className='relative'>
          <input
            type='checkbox'
            checked={isPartial}
            onChange={handleCheckboxChange}
            className='sr-only'
          />
          <div
            className={`box block h-6 w-10 rounded-full ${
              isPartial ? 'bg-emerald-500' : 'bg-slate-600'
            }`}
          />
          <div
            className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
              isPartial ? 'translate-x-full' : ''
            }`}
          />
        </div>
      </label>
    </>
  )
}

export default Toggle
