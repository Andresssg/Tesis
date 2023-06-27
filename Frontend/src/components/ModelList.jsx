import ModelItem from './ModelItem'

function ModelList ({ setModel, modelName }) {
  const models = [
    {
      name: 'COCO',
      description: 'Este modelo funciona para todos los casos.',
      icon: 'https://www.freepnglogos.com/uploads/infinity-symbol-png/infinity-symbol-clipart-download-best-infinity-14.png'
    },
    {
      name: 'VISDRONE',
      description: 'Si la vista es aérea/elevada, este modelo es ideal para esas condiciones.',
      icon: 'https://cdn-icons-png.flaticon.com/512/1830/1830867.png'
    }
  ]
  return (
    <div className='gap-y-3 flex w-full flex-col items-center justify-center py-2
    font-semibold rounded-lg text-slate-200'
    >
      <h3 className='font-bold text-xl'>Lista de modelos disponibles</h3>
      {models.map((model, i) => {
        return (
          <ModelItem
            key={`model-${i}`} modelName={model.name}
            description={model.description} icon={model.icon}
            setModel={value => setModel(value)}
            isSelected={model.name.toUpperCase() === modelName}
          />
        )
      })}
    </div>
  )
}

export default ModelList
