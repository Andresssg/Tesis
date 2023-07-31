import Toggle from './Toggle'

function SidebarItem ({ text, icon }) {
  return (
    <div
      className='p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer  text-white gap-x-2'
    >
      <span className='text-gray-200 font-bold'>{text}</span>
      <Toggle />
    </div>
  )
}

export default SidebarItem
