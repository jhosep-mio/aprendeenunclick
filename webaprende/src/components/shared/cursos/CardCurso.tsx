import { PiMathOperations } from "react-icons/pi";
const CardCurso = (): JSX.Element => {
  return (
    <>
        <div className="cardCurso">
            <div className="cardCurso__img">
                <PiMathOperations/>
            </div>
            <div className="cardCurso__title">
                <h5>Matemáticas</h5>
            </div>
        </div>
    </>
  )
}

export default CardCurso