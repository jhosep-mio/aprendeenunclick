const Plan = (): JSX.Element => {
  return (
    <>
      <section className="plan">
        <div className="w-full flex flex-col pt-16">
          <div className="flex items-center h-fit bg-[#8686ff] w-full px-12 py-8">
            <h2 className="text-white text-4xl font-bold">Mi plan</h2>
          </div>
          <div className="w-full bg-[#353573] px-16 py-8 flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col w-full lg:w-[70%]">
              <p className="text-white text-2xl text-justify">
                <p><strong>Detalle del pago:</strong></p>
                Tu plan fue adquirido el{' '}
                <strong>5 de diciembre del 2023</strong> y finaliza el{' '}
                <strong>5 de enero del 2024.</strong>
              </p>
              <div className="flex gap-4 bg-[#8686ff] w-fit text-2xl text-white p-8 rounded-xl font-bold mt-6 mx-auto">
                <p>PLAN BÁSICO</p>
                <p>S/. 39.00</p>
              </div>
              <div className="flex w-full flex-col sm:flex-row gap-8 mt-20">
                <button className="w-full sm:w-1/2 bg-[#8686ff] text-white py-4 text-2xl font-semibold rounded-sm">Cambiar plan</button>
                <button className="w-full sm:w-1/2 bg-[#b43a34] text-white py-4 text-2xl font-semibold rounded-sm">Anular plan</button>

              </div>
            </div>
            <div className="flex flex-col w-full lg:w-[30%]">
              <p className="text-white text-3xl font-bold mb-4">Tu plan incluye:</p>
              <ul className="pl-6 text-white text-2xl square">
                <li>Acceso a 4 cursos</li>
                <li>Contenido interactivo </li>
                <li>Actualizaciones regulares</li>
                <li>Precio asequible para familias</li>
                <li>Soporte en línea para dudas y preguntas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Plan
