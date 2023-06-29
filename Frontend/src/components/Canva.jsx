import React, { useContext, useEffect, useState } from 'react'
import { Stage, Layer, Image, Circle, Line, Text } from 'react-konva'
import { RequestContext } from '../contexts/RequestContext'
import ModelList from './ModelList'
import Details from './Details'
import horizontal1 from '../assets/Linea-horizontal1.gif'
import horizontal2 from '../assets/Linea-horizontal2.gif'
import vertical1 from '../assets/Linea-vertical1.gif'
import vertical2 from '../assets/Linea-vertical2.gif'
import bienHorizontal from '../assets/Linea-bien1.gif'
import bienVertical from '../assets/Linea-bien2.gif'
import malHorizontal from '../assets/Linea-mal1.gif'
import malVertical from '../assets/Linea-mal2.gif'

function Canva ({ imageBase64, processedData, setShowStatistics, setShowImage, setIsLoading }) {
  const { BASE_URL, setStatistics } = useContext(RequestContext)
  const [image, setImage] = useState(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [lines, setLines] = useState([])
  const [factor, setFactor] = useState(2)
  const [comments, setComments] = useState('')
  const [recordDate, setRecordDate] = useState()
  const [model, setModel] = useState('COCO')

  const [points, setPoints] = useState([
    { x: 50, y: 100, color: 'green' }, // punto de inicio
    { x: 100, y: 100, color: 'red' } // punto final
  ])

  // Calcular los límites teniendo en cuenta el radio del círculo
  const radius = 10
  const minX = 0
  const minY = 0
  const maxX = imageSize.width
  const maxY = imageSize.height

  const handleDragEnd = (index, e) => {
    const newPoints = [...points]
    const { x, y } = e.target.attrs

    const newX = Number.isNaN(x) ? 0 : x
    const newY = Number.isNaN(y) ? 0 : y

    newPoints[index] = {
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY)),
      color: newPoints[index].color
    }
    setPoints(newPoints)
  }

  const changeSize = (img) => {
    let value = 0
    if (img.width > window.outerWidth) {
      value = Math.floor(img.width / window.outerWidth) + 1.3
      setFactor(value)
    } else if (img.width >= 1792) {
      value = 2.5
      setFactor(value)
    } else {
      value = 1.5
      setFactor(value)
    }
    return value
  }

  useEffect(() => {
    if (imageBase64) {
      fetch(imageBase64)
        .then((response) => response.blob())
        .then((blob) => {
          const img = new window.Image()
          img.onload = () => {
            const newFactor = changeSize(img)
            setImage(img)
            setImageSize({ width: img.width / newFactor, height: img.height / newFactor })
          }
          img.src = URL.createObjectURL(blob)
        })
    }
  }, [imageBase64])

  useEffect(() => {
    const startPoint = points[0]
    const endPoint = points[1]
    const newLine = { start: startPoint, end: endPoint }
    setLines([newLine])
  }, [points])

  const handleAnalyze = async () => {
    const confirmMetadata = window.confirm(`La fecha proporcionada del video es: ${new Date(recordDate)}, ¿Esta fecha es correcta?`)
    if (!confirmMetadata) return

    const { x: startX, y: startY } = points[0]
    const { x: endX, y: endY } = points[1]
    const start = [startX * factor, startY * factor]
    const end = [endX * factor, endY * factor]

    const { park_name, video_name } = processedData
    const payload = {
      park_name,
      video_name,
      start,
      end,
      record_date: recordDate,
      comments,
      model
    }
    if (!park_name || !video_name || !start || !end || !recordDate || !comments || !model) {
      return window.alert('Campos incompletos')
    }

    setShowImage(false)
    setIsLoading(true)
    setShowStatistics(true)
    try {
      const res = await fetch(`${BASE_URL}/detect/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      setIsLoading(false)
      if (!res.ok) {
        setShowImage(true)
        setShowStatistics(false)
        return window.alert(data?.error || 'Hubo un problema al analizar el video')
      }
      setStatistics(data)
    } catch (error) {
      setIsLoading(false)
      setShowImage(true)
      setShowStatistics(false)
      window.alert('Error al analizar el video')
    }
  }

  const changeDate = (e) => {
    setRecordDate(e.target.value)
  }

  const maxDate = new Date().toISOString().slice(0, 19)

  const details = [
    {
      question: '¿Cómo se ubica la línea?',
      description: "Hay dos puntos uno que es el <span class='text-green-500 font-bold'>INICIAL</span> y el segundo que es el <span class='text-red-500 font-bold'>FINAL</span>",
      steps: [
        'Para mover un punto mantenga el click izquierdo presionado sobre él y arrastrelo.',
        'Para soltar el punto deje de mantener el click.',
        'Una vez tenga los puntos definidos y vea la línea en la posición deseada, complete los campos restantes y haga click en Analizar el video.'
      ],
      gifs: [{ name: 'Punto inicial a la izquierda y punto final a la derecha.', uri: horizontal1 },
        { name: 'Punto inicial a la derecha y punto final a la izquierda.', uri: horizontal2 },
        { name: 'Punto inicial abajo y punto final arriba.', uri: vertical1 },
        { name: 'Punto inicial arriba y punto final abajo.', uri: vertical2 }],
      note: 'Estos son algunos de los casos que se pueden presentar.'
    },
    {
      question: '¿Cómo funciona el conteo?',
      description: `Para que se realice el conteo, es necesario que el cuadro que envuelve a una persona,
      cruce de lado a lado la línea. De lo contrario, el contador no aumentará`,
      steps: [],
      gifs: [
        { name: 'Con la línea horizontal, ubicada correctamente', uri: bienHorizontal },
        { name: 'Con la línea vertical. ubicada correctamente', uri: bienVertical },
        { name: 'Con la línea horizontal, ubicada erroneamente', uri: malHorizontal },
        { name: 'Con la línea vertical. ubicada erroneamente', uri: malVertical }
      ]
    }

  ]

  return (
    <div className='flex flex-col p-5 gap-5 text-gray-50 w-full justify-center items-center'>
      <h2 className='text-2xl uppercase font-medium'>Dibujar línea</h2>
      <div className='flex justify-evenly flex-wrap w-full'>
        {details.map((detail, i) => <Details key={`detail-${i}`} detail={detail} />
        )}
      </div>
      {image && (
        <Stage width={imageSize.width} height={imageSize.height}>
          <Layer>
            <Image
              image={image}
              width={imageSize.width}
              height={imageSize.height}
            />
            {points.map((point, index) => (
              <Circle
                key={index}
                x={point.x}
                y={point.y}
                radius={radius}
                fill={point.color}
                draggable
                onDragEnd={(e) => handleDragEnd(index, e)}
                dragBoundFunc={(pos) => {
                  const newX = Math.max(minX, Math.min(maxX, pos.x))
                  const newY = Math.max(minY, Math.min(maxY, pos.y))
                  return { x: newX, y: newY }
                }}
              />
            ))}
            {lines.map((line, index) => {
              const shouldInvert = line.end.x < line.start.x // Verificar la posición de los puntos
              return (
                <React.Fragment key={index}>
                  <Line
                    points={[line.start.x, line.start.y, line.end.x, line.end.y]}
                    stroke='white'
                    strokeWidth={4}
                  />
                  <Text
                    x={(line.start.x + line.end.x) / 2}
                    y={(line.start.y + line.end.y) / 2 - 10}
                    text={shouldInvert ? 'Out' : 'In'} // Invertir el texto si es necesario
                    fontSize={16}
                    fontFamily='Arial'
                    fill='black'
                    align='center'
                  />
                  <Text
                    x={(line.start.x + line.end.x) / 2}
                    y={(line.start.y + line.end.y) / 2 + 10}
                    text={shouldInvert ? 'In' : 'Out'} // Invertir el texto si es necesario
                    fontSize={16}
                    fontFamily='Arial'
                    fill='black'
                    align='center'
                  />
                </React.Fragment>
              )
            })}
          </Layer>
        </Stage>
      )}
      <div className='flex flex-col gap-5 w-full text-black'>
        <input
          type='datetime-local' name='creation_date' id='creation_date'
          className='p-2 focus:outline-2 focus:outline-sky-500 w-full'
          defaultValue={recordDate} onChange={changeDate}
          max={maxDate}
        />
        <textarea
          name='comments' id='comments'
          className='p-2 focus:outline-2 focus:outline-sky-500 h-36 w-full'
          placeholder='Observaciones'
          defaultValue={comments} onChange={(e) => setComments(e.target.value)}
        />
      </div>
      <ModelList setModel={setModel} modelName={model} />
      <div className='flex w-full justify-evenly items-center font-medium'>
        <button onClick={handleAnalyze} className='p-2 bg-sky-500 cursor-pointer hover:bg-sky-300 w-full'>Analizar video</button>
      </div>
    </div>
  )
}

export default Canva
