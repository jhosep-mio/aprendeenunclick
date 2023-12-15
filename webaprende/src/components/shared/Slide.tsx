import React, { useState } from 'react'
import { useSpring, animated } from 'react-spring'
import slide1 from '../../assets/sliders/slide1.webp'
import slide2 from '../../assets/sliders/slide2.webp'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
const slides = [
  `${slide1}`,
  `${slide2}`

]

const Slide: React.FC = () => {
  const [index, setIndex] = useState(0)

  const handleNext = (): void => {
    setIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  const handlePrev = (): void => {
    setIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)
  }

  const calc = (x: number, y: number): [number, number] => [x - window.innerWidth / 2, y - window.innerHeight / 2]
  const trans = (x: number, y: number): string =>
  `perspective(600px) rotateY(${x / 20}deg) rotateX(${y / 20}deg)`
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

  return (
    <div className="parallax-slider-container">
      <div className="parallax-slider">
        <div className="slides-container">
          {slides.map((slide, i) => (
            <animated.div
              key={i}
              style={{
                backgroundImage: `url(${slide})`,
                transform: xy.interpolate(trans),
                zIndex: i === index ? 1 : 0,
                opacity: i === index ? 1 : 0.7
              }}
              className={`slide ${i === index ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="controls">
        <button onClick={handlePrev}><FaChevronLeft/></button>
        <button onClick={handleNext}><FaChevronRight/></button>
      </div>

      <animated.div
        className="mouse"
        onMouseMove={({ clientX, clientY }: React.MouseEvent) =>
          set({ xy: calc(clientX, clientY) })
        }
      />
    </div>
  )
}

export default Slide
