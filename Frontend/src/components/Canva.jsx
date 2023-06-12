import React, { useContext, useEffect, useState } from 'react'
import { Stage, Layer, Image, Circle, Line, Text } from 'react-konva'
import { RequestContext } from '../contexts/RequestContext'

function Canva ({ imageBase64, processedData }) {
  const { BASE_URL } = useContext(RequestContext)
  const [image, setImage] = useState(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [lines, setLines] = useState([])

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

  useEffect(() => {
    if (imageBase64) {
      fetch(imageBase64)
        .then((response) => response.blob())
        .then((blob) => {
          const img = new window.Image()
          img.onload = () => {
            setImage(img)
            setImageSize({ width: img.width / 2, height: img.height / 2 })
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
    const { x: startX, y: startY } = points[0]
    const { x: endX, y: endY } = points[1]
    const start = [startX * 2, startY * 2]
    const end = [endX * 2, endY * 2]

    const { park_name, video_name } = processedData
    const payload = {
      park_name,
      video_name,
      start,
      end
    }

    const res = await fetch(`${BASE_URL}/detect/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const data = await res?.json()
    if (!res.ok) return window.alert(data?.error || 'Hubo un problema al analizar el video')
    console.log(data)
  }

  return (
    <div className='flex flex-col p-5 gap-5 text-gray-50 w-full md:w-2/6 justify-center items-center '>
      <h2 className='text-2xl uppercase font-medium'>Dibujar línea</h2>
      <details className=' self-baseline'>
        <summary>
          ¿Qué hacer?
        </summary>
        <p className='font-bold'>Hay dos puntos uno que es el <span className='text-green-500'>INICIO</span> y el segundo que es el <span className='text-red-500'>FINAL</span> </p>
        <ol className='list-decimal px-4'>
          <li>Para mover un punto mantenga el click presionado sobre él y arrastrelo.</li>
          <li>Para soltar el punto deje de mantener el click.</li>
          <li>Una vez tenga los puntos definidos y vea la linea en la posición deseada, haga click en Analizar el video</li>
        </ol>
      </details>
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
      <div className='flex w-full justify-evenly items-center font-medium'>
        <button onClick={handleAnalyze} className='p-2 bg-sky-500 cursor-pointer hover:bg-sky-300'>Analizar video</button>
      </div>
    </div>
  )
}

export default Canva
