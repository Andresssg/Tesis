import { useState } from 'react'
import SettingsIcon from '../../icons/SettingsIcon'
import SidebarItem from './SidebarItem'
import SidebarList from './SidebarList'
import ModelList from '../ModelList'
import closeIcon from '../../assets/close-icon.svg'

function Sidebar () {
  const [isOpen, setIsOpen] = useState(false)

  const handleIsOpen = () => {
    setIsOpen(!isOpen)
  }
  return (
    <>
      {
      isOpen
        ? (
          <div
            className='fixed w-full top-0 bottom-0 p-5
            overflow-y-auto text-center bg-gray-900 z-50 md:absolute
            md:w-[25rem] lg:w-[31rem] lg:static min-h-screen'
          >
            <div className='text-gray-100 text-xl'>
              <div className='flex items-center w-full'>
                <div className='p-2.5 flex items-center w-full'>
                  <SettingsIcon className='w-8 h-8 stroke-white' />
                  <h1 className='font-bold text-gray-200 text-[15px] ml-3'>Configuraciones</h1>
                </div>
                <img className='h-8 w-8 justify-self-end cursor-pointer hover:border-white hover:border-2 rounded-full' src={closeIcon} alt='botón para cerrar el menú' onClick={handleIsOpen} />
              </div>
              <hr className='my-2 border-gray-600 h-[1px]' />
            </div>
            <SidebarItem text='Activar línea parcial' />
            <hr className='my-2 border-gray-600 h-[1px]' />
            <SidebarList text='Modelos disponibles' list={<ModelList />} />
          </div>
          )
        : (

          <div
            className='fixed top-3 rounded-full p-2 m-4 bg-gray-900 z-20 cursor-pointer hover:scale-110 animate-bounce'
            onClick={handleIsOpen}
          >
            <span className='absolute flex h-3 w-3 top-1 right-0'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-200 opacity-75'>{/*  */}</span>
              <span className='absolute inline-flex rounded-full h-3 w-3 bg-yellow-500'>{/*  */}</span>
            </span>
            <SettingsIcon className='w-10 h-10 stroke-white' />
          </div>
          )
    }
    </>

  )
}

export default Sidebar
