import axios from 'axios'
import { useEffect, useState } from 'react'
import { Global } from '../../../helper/Global'
import useAuth from '../../../hooks/useAuth'
import Loading from '../../shared/Loading'
import {
  type miplanValues,
  type detalleTransaccionValues
} from '../../shared/Interfaces'
import { Fechas } from './recursesPlan/Fechas'
import { ListaplanesRenovacion } from '../planes/ListaPlanesRenovacion'
import { ListaPlanesNuevo } from '../planes/ListaPlanesNuevo'
const Plan = (): JSX.Element => {
  const [miplan, setMiPlan] = useState<miplanValues | null>(null)
  const [detalle, setDetalle] = useState<detalleTransaccionValues | null>(null)
  const { auth } = useAuth()
  const token = localStorage.getItem('tokenUser')
  const [loadingComponent, setLoadingComponent] = useState(true)
  const [estado, setEstado] = useState(0)
  const [planterminado, setPlanTerminado] = useState(false)
  const getcursosToCompra = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/cursesToCompras2/${auth.id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    if (request.data && JSON.parse(request.data.array_productos)[0]) {
      setDetalle(request.data)
      const transaccion = JSON.parse(request.data.array_productos)[0]
      setMiPlan(transaccion)
      const fechaInicio = new Date(request.data.created_at)
      const tiempoEnMeses =
        parseInt(JSON.parse(transaccion.description).tiempo, 10) || 0
      const fechaFin = new Date(fechaInicio)
      fechaFin.setMonth(fechaInicio.getMonth() + tiempoEnMeses)
      const planTerminado = new Date() > fechaFin
      //   console.log(planTerminado)
      setPlanTerminado(planTerminado)
      setLoadingComponent(false)
    } else {
      setLoadingComponent(false)
      setEstado(99)
    }
  }

  useEffect(() => {
    if (auth.id) {
      getcursosToCompra()
    }
  }, [auth.id])

  return (
    <>
      {loadingComponent
        ? <Loading />
        : estado == 0
          ? <section className="plan">
          <div className="w-full flex flex-col pt-16">
            <div className="flex items-center h-fit bg-[#8686ff] w-full px-12 py-8">
              <h2 className="text-white text-4xl font-bold">Mi plan</h2>
            </div>
            <div className="w-full bg-[#353573] px-16 py-8 flex flex-col lg:flex-row gap-6">
              <div className="flex flex-col w-full lg:w-[50%]">
                <Fechas fecha={detalle?.created_at ?? ''} miplan={miplan} />
                <div
                  className={`flex gap-4 ${
                    !planterminado ? 'bg-[#8686ff]' : 'bg-gray-500'
                  } w-fit text-2xl text-white p-8 rounded-xl font-bold mt-6 `}
                >
                  <p className="uppercase">
                    {JSON.parse(miplan?.description ?? '').plan} -{' '}
                    {JSON.parse(miplan?.description ?? '').tiempo}
                  </p>
                  <p>S/. {parseFloat(detalle?.total_pago ?? '').toFixed(2)}</p>
                </div>
                <div className="flex w-full flex-col sm:flex-row gap-8 mt-20">
                  {planterminado
                    ? (
                    <button
                      className="w-full sm:w-1/2 bg-[#b43a34] text-white py-4 text-2xl font-semibold rounded-sm"
                      onClick={() => {
                        setEstado(2)
                      }}
                    >
                      Adquirir un plan
                    </button>
                      )
                    : (
                    <button
                      className="w-full sm:w-1/2 bg-[#b43a34] text-white py-4 text-2xl font-semibold rounded-sm"
                      onClick={() => {
                        setEstado(1)
                      }}
                    >
                      Cambiar plan
                    </button>
                      )}
                  {/* <button className="w-full sm:w-1/2 bg-[#b43a34] text-white py-4 text-2xl font-semibold rounded-sm">
                    Anular plan
                  </button> */}
                </div>
              </div>
              {!planterminado && (
                <div className="flex flex-col w-full lg:w-[50%]">
                  <p className="text-white text-3xl font-bold mb-4 pl-4 underline">
                    Tu plan incluye:
                  </p>
                  <ul className="pl-6 text-white text-2xl square columns-3">
                    {JSON.parse(miplan?.description ?? '').plan ==
                    'Plan Basico'
                      ? (
                      <>
                        <li>Resolución de problemas</li>
                        <li>Solo visualiza los temarios</li>
                        <li>Ingreso a examenes</li>
                      </>
                        )
                      : (
                      <>
                        <li>Clases interactivas</li>
                        <li>Clasificacion segun rendimiento</li>
                        <li>Seguimiento de avances</li>
                        <li>Acessos para el padre de familia</li>
                        <li>Resolución de problemas</li>
                        <li>Solo visualiza los temarios</li>
                        <li>Ingreso a examenes</li>
                        <li>Control de progreso</li>
                      </>
                        )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
          : estado == 1
            ? (
        <section className="bg-paleta-900 w-screen  h-screen">
          <ListaplanesRenovacion miplan={miplan} />
        </section>
              )
            : estado == 2
              ? (
        <section className="bg-paleta-900 w-screen  h-screen">
          <ListaPlanesNuevo />
        </section>
                )
              : (
                  estado == 99 && (
          <section className="plan">
            <div className="w-full flex flex-col pt-16">
              <div className="flex items-center h-fit bg-[#8686ff] w-full px-12 py-8">
                <h2 className="text-white text-4xl font-bold">Mi plan</h2>
              </div>
              <div className="w-full bg-[#353573] px-16 py-8 flex flex-col lg:flex-row gap-6">
                <div className="flex flex-col w-full lg:w-[50%]">
                  <p className="text-white text-3xl text-justify">
                      <strong>☹️ No tienes un plan activo</strong>
                  </p>

                  <div className="flex w-full flex-col sm:flex-row gap-8 mt-20">

                      <button
                        className="w-full sm:w-1/2 bg-[#b43a34] text-white py-4 text-2xl font-semibold rounded-sm"
                        onClick={() => {
                          setEstado(2)
                        }}
                      >
                        Adquirir un plan
                      </button>
                  </div>
                </div>

              </div>
            </div>
          </section>
                  )
                )}
    </>
  )
}

export default Plan
