import { useState } from 'react'
import caretUp from '../../assets/caret-up.svg'
import caretDown from '../../assets/caret-down.svg'
import modelsIcon from '../../assets/models-icon.svg'

function SidebarList ({ text = 'List head', list = [] }) {
  const [showList, setShowList] = useState(false)

  const handleShowList = () => {
    setShowList(!showList)
  }
  return (
    <>
      <div
        className='p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white'
        onClick={handleShowList}
      >
        <div className='flex justify-between w-full items-center'>
          <img className='h-10 w-10' src={modelsIcon} alt='Icono modelos disponibles' />
          <span className='text-gray-200 font-bold'>{text}</span>
          <span className='text-sm rotate-180' id='arrow'>
            {showList
              ? <img className='h-8 w-8 ' src={caretUp} alt='flecha para cerrar la lista de modelos' />
              : <img className='h-8 w-8 ' src={caretDown} alt='flecha para abrir la lista de modelos' />}
          </span>
        </div>
      </div>
      {showList && list}
    </>
  )
}

export default SidebarList
