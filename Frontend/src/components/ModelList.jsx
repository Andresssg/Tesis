import ModelItem from './ModelItem'
import droneIcon from '../assets/drone-icon.webp'
import infiniteIcon from '../assets/infinite-icon.webp'

function ModelList () {
  const models = [
    {
      name: 'COCO',
      description: 'Este modelo funciona para todos los casos.',
      icon: infiniteIcon
    },
    {
      name: 'VISDRONE',
      description: 'Si la vista es aérea/elevada, este modelo es ideal para esas condiciones.',
      icon: droneIcon
    }
  ]
  return (
    <div className='gap-y-3 flex w-full flex-col items-center justify-center py-2
    font-semibold rounded-lg text-slate-200 flex-wrap'
    >
      {models.map((model, i) => {
        return (
          <ModelItem
            key={`model-${i}`} modelName={model.name}
            description={model.description} icon={model.icon}
          />
        )
      })}
    </div>
  )
}

export default ModelList
