import { type contenidoSeccionValues, type temarioValues } from '../../../../shared/Interfaces'
import { FaChevronUp } from 'react-icons/fa'
import { BsFillTrash2Fill, BsPencilSquare } from 'react-icons/bs'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { EditarTituloTemario } from './EditarTituloTemario'
import { AgregarNuevoItem } from './AgregarNuevoItem'
import { EditarItem } from './EditarItem'

export const ListaTemario = ({
  contenido,
  setContenido,
  setImagesDelete,
  examenes
}: {
  contenido: temarioValues[]
  setContenido: Dispatch<SetStateAction<temarioValues[]>>
  setImagesDelete: Dispatch<SetStateAction<string[]>>
  examenes: never[]
}): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [openClase, setOpenClase] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [idSeleccion, setIdSeleccion] = useState('')
  const [pased, setPased] = useState<temarioValues>({
    id: '',
    titulo: '',
    clase: []
  })

  const [itemSeleccionado, setItemSeleccionado] =
  useState<contenidoSeccionValues>({
    id: '',
    titulo: '',
    tipo: '',
    contenido: []
  })

  //   FUNCIONES EN BLOQUE
  const eliminarBloque = (bloqueIndex: string): void => {
    const nuevasClases = contenido.filter(
      (content) => content.id != bloqueIndex
    )
    setContenido(nuevasClases)
  }

  const moverBloqueArriba = (id: number): void => {
    if (id == 0) return // No mover si ya está al principio

    const nuevoOrden = [...contenido];
    [nuevoOrden[id], nuevoOrden[id - 1]] = [nuevoOrden[id - 1], nuevoOrden[id]]
    setContenido(nuevoOrden)
  }

  const moverBloqueAbajo = (indice: number): void => {
    if (indice == contenido.length - 1) return // No mover si ya está al final
    const nuevoOrden = [...contenido];
    [nuevoOrden[indice], nuevoOrden[indice + 1]] = [
      nuevoOrden[indice + 1],
      nuevoOrden[indice]
    ]
    setContenido(nuevoOrden)
  }

  //   FUNCIONES POR ITEM

  const moverItemArriba = (bloqueId: string, claseIndex: number): void => {
    // Buscar el bloque por su id
    const bloque = contenido.find((bloque) => bloque.clase.some((clase) => clase.id == bloqueId))
    if (!bloque || claseIndex == 0) return // No mover si no se encuentra el bloque o ya está al principio de la clase
    // Intercambiar elementos en la propiedad 'clase' del bloque
    [bloque.clase[claseIndex], bloque.clase[claseIndex - 1]] = [
      bloque.clase[claseIndex - 1],
      bloque.clase[claseIndex]
    ]
    // Actualizar el estado
    setContenido([...contenido])
  }

  const moverItemAbajo = (bloqueId: string, claseIndex: number): void => {
    // Buscar el bloque por su id
    const bloque = contenido.find((bloque) => bloque.clase.some((clase) => clase.id == bloqueId))
    if (!bloque || claseIndex == bloque.clase.length - 1) return; // No mover si no se encuentra el bloque o ya está al final de la clase
    // Intercambiar elementos en la propiedad 'clase' del bloque
    [bloque.clase[claseIndex], bloque.clase[claseIndex + 1]] = [
      bloque.clase[claseIndex + 1],
      bloque.clase[claseIndex]
    ]
    // Actualizar el estado
    setContenido([...contenido])
  }

  const abrirModalEdicionItem = (
    clase: contenidoSeccionValues
  ): void => {
    setItemSeleccionado({
      id: clase.id,
      tipo: clase.tipo,
      titulo: clase.titulo,
      contenido: clase.contenido
    })
    setOpenClase(true)
  }

  const eliminarItemDeClase = (claseId: string, itemId: string): void => {
    console.log(contenido)
    const nuevoContenido = contenido.map((clase) => {
      if (clase.id === claseId) {
        const nuevaClase = clase.clase.filter((cls) => cls.id !== itemId)
        return { ...clase, clase: nuevaClase }
      }
      return clase
    })
    setContenido(nuevoContenido)
  }

  return (
    <ul>
      {contenido.map((content, index) => (
        <li key={content.id} className="flex gap-3 w-full my-6">

          <div className="flex flex-col items-center gap-2 ">
            <button
              type="button"
              onClick={() => {
                moverBloqueArriba(index)
              }}
            >
              <FaChevronUp className=" text-gray-400 text-lg" />
            </button>
            <button
              type="button"
              onClick={() => {
                moverBloqueAbajo(index)
              }}
            >
              <FaChevronUp className=" text-gray-400 text-lg rotate-180" />
            </button>
          </div>
          <div className="w-full">
            <div className="flex gap-6 items-center mb-2 justify-between">
              <h3 className="font-bold uppercase">{content.titulo}</h3>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpenAdd(true)
                    setIdSeleccion(content.id)
                  }}
                  className="text-white underline text-xl"
                >
                  <IoIosAddCircleOutline className=" text-white text-2xl" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(true)
                    setPased(content)
                  }}
                  className="text-green-600 underline"
                >
                  <BsPencilSquare className=" text-white text-xl" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    eliminarBloque(content.id)
                  }}
                  className="text-red-500 underline"
                >
                  <BsFillTrash2Fill className=" text-white text-xl" />
                </button>
              </div>
            </div>
            <ul className="mb-5 pl-5">
            {content.clase?.map((clase, claseIndex: number) => (
              <li key={claseIndex} className="flex items-center gap-6 mb-1">
                -
                <span className="ml-2 text-gray-500">
                {clase.tipo}
                </span>
                {clase.titulo}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      moverItemArriba(clase.id, claseIndex)
                    }}
                  >
                    <FaChevronUp className=" text-gray-400 text-xl" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      moverItemAbajo(clase.id, claseIndex)
                    }}
                  >
                    <FaChevronUp className=" text-gray-400 text-xl rotate-180" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIdSeleccion(content.id)
                      abrirModalEdicionItem(clase)
                    }}
                  >
                    <BsPencilSquare className=" text-green-600 text-xl" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      eliminarItemDeClase(content.id, clase.id)
                    }}
                  >
                    <BsFillTrash2Fill className=" text-red-500 text-xl" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          </div>

        </li>
      ))}
      <EditarTituloTemario
        contenido={contenido}
        open={open}
        setOpen={setOpen}
        pased={pased}
        setContenido={setContenido}
      />
      <AgregarNuevoItem
        contenido={contenido}
        idSeleccion={idSeleccion}
        open={openAdd}
        setOpen={setOpenAdd}
        setContenido={setContenido}
        examenes={examenes}
      />
      <EditarItem
        open={openClase}
        setOpen={setOpenClase}
        idSeleccion={idSeleccion}
        itemSeleccionado={itemSeleccionado}
        contenido={contenido}
        setContenido={setContenido}
        setImagesDelete={setImagesDelete}
        examenes={examenes}
      />
    </ul>
  )
}
