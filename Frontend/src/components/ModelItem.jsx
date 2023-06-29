function ModelItem ({ modelName, description, icon, setModel, isSelected }) {
  const handleClick = () => {
    setModel(modelName.toUpperCase())
  }
  return (
    <div
      className={`flex w-80 min-h-[9rem] p-2 border items-center gap-x-3
    border-slate-200 rounded-lg hover:cursor-pointer md:text-lg ${isSelected && 'bg-sky-500'}`} onClick={handleClick}
    >
      <img src={icon} alt='' className='w-10' />
      <div>
        <p className='font-bold'>{modelName}</p>
        <p className='text-sm md:text-lg font-light'>{description}</p>
      </div>
    </div>
  )
}

export default ModelItem
