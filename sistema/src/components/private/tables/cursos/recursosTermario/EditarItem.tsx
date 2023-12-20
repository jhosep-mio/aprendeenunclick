import { Dialog, DialogContent } from '@mui/material'
import {
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
  useRef,
  type MutableRefObject
} from 'react'
import {
  type temarioValues,
  type contenidoSeccionValues,
  type imagenUpladvalues
} from '../../../../shared/Interfaces'
import { Global } from '../../../../../helper/Global'
import { v4 as uuidv4 } from 'uuid'
import Swal from 'sweetalert2'
import { RiDeleteBack2Fill } from 'react-icons/ri'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  itemSeleccionado: contenidoSeccionValues | null
  contenido: temarioValues[]
  idSeleccion: string
  setContenido: Dispatch<SetStateAction<temarioValues[]>>
  setImagesDelete: Dispatch<SetStateAction<string[]>>
  examenes: never[]
}

interface DraggableImageProps {
  index: number
  image: imagenUpladvalues
  onDelete: (index: number, filename: string) => void
}

export const EditarItem = ({
  open,
  setOpen,
  itemSeleccionado,
  idSeleccion,
  setContenido,
  setImagesDelete,
  examenes
}: valuesProps): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState('')
  const fileInputRef: MutableRefObject<HTMLInputElement | null> = useRef(null)
  const [ordenContenidoItem, setOrdenContenidoItem] = useState<number[]>([])
  const [contenidoItem, setContenidoItem] = useState<
  string | imagenUpladvalues[]
  >([])

  useEffect(() => {
    if (open && itemSeleccionado) {
      setTitulo(itemSeleccionado?.titulo)
      setTipo(itemSeleccionado.tipo)
      setContenidoItem(itemSeleccionado.contenido)
    }
  }, [open, itemSeleccionado, tipo])

  const agregarNuevoItem = (): void => {
    if (titulo && contenidoItem && itemSeleccionado) {
      setContenido((prevContenido) => {
        const updatedContenido = [...prevContenido]
        const seccionIndex = updatedContenido.findIndex(
          (item) => item.id === idSeleccion
        )
        if (seccionIndex !== -1) {
          const claseIndex = updatedContenido[seccionIndex].clase.findIndex(
            (clase) => clase.id === itemSeleccionado.id
          )
          if (claseIndex !== -1) {
            updatedContenido[seccionIndex].clase[claseIndex] = {
              id: itemSeleccionado.id,
              tipo,
              titulo,
              contenido: contenidoItem
            }
          }
        }
        return updatedContenido
      })
      setTitulo('')
      setTipo('')
      setOpen(false)
      setContenidoItem([])
    } else {
      Swal.fire('Complete todos los campos', '', 'warning')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files
    if (files && files.length > 0) {
      const imageURL = URL.createObjectURL(files[0])
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const nameimage = `${uuidv4()}_${files[0].name}`
      setContenidoItem((prevContent) => {
        if (typeof prevContent === 'string') {
          return ''
        } else {
          return [
            ...prevContent,
            { visualizacion: imageURL, file: files[0], filename: nameimage }
          ]
        }
      })
    }
  }

  const eliminarImagen = (index: number, name: string): void => {
    // Eliminar la imagen del array antes de invocar onDelete
    setContenidoItem((prevContenido) => {
      if (Array.isArray(prevContenido)) {
        const nuevoContenido = [...prevContenido]
        nuevoContenido.splice(index, 1) // Elimina la imagen en el índice dado
        console.log(nuevoContenido)
        return nuevoContenido
      }
      return prevContenido
    })
    // Luego, puedes hacer cualquier otra cosa después de la eliminación, como eliminar el nombre
    setImagesDelete((prevNames) => [...prevNames, name])
  }

  useEffect(() => {
    setOrdenContenidoItem(
      Array.isArray(contenidoItem) ? contenidoItem.map((_, index) => index) : []
    )
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [contenidoItem])

  const DraggableImage = ({
    index,
    image,
    onDelete
  }: DraggableImageProps): JSX.Element => {
    const [, drag] = useDrag({
      type: 'IMAGE',
      item: { index }
    })

    const [, drop] = useDrop({
      accept: 'IMAGE',
      drop: (draggedItem: { index: number }) => {
        const { index: draggedIndex } = draggedItem
        // Intercambia las posiciones solo para los índices específicos
        if (index !== draggedIndex) {
          setContenidoItem((prevContenido): any => {
            const newOrder = [...prevContenido]
            const temp = newOrder[index]
            newOrder[index] = newOrder[draggedIndex]
            newOrder[draggedIndex] = temp
            return newOrder
          })
        }
      }
    })

    return (
      <div ref={(node) => drag(drop(node))} className="w-full relative">
        {!image?.file?.name && (
          <span
            className="absolute right-0 top-0 text-xl cursor-pointer transition-colors hover:text-red-800 text-red-600"
            onClick={() => {
              onDelete(index, image.filename)
            }}
          >
            <RiDeleteBack2Fill />
          </span>
        )}
        <img
          src={
            image?.file?.name
              ? image.visualizacion
              : `${Global.urlImages}/recurses/${image?.filename}`
          }
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog_bloque"
      >
        <DialogContent className="w-[500px]">
          <div className="w-full lg:relative  mb-5 flex flex-col justify-between gap-2">
            <div className="w-full gap-6 items-center">
              <h2 className="font-medium text-white w-full mb-8 text-center uppercase text-xl underline">
                Editar item2
              </h2>
              {tipo == 'Video' && (
                <>
                  <input
                    className="text-white border border-black w-full  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                    type="text"
                    placeholder="Titulo"
                    id="textI"
                    value={titulo}
                    onChange={(e) => {
                      setTitulo(e.target.value)
                    }}
                  />
                  <input
                    className="text-white border border-black w-full placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                    type="text"
                    placeholder="Link de YT"
                    id="input_file"
                    value={
                      typeof contenidoItem === 'string'
                        ? contenidoItem
                        : contenidoItem[0]?.visualizacion || ''
                    }
                    onChange={(e) => {
                      setContenidoItem(e.target.value)
                    }}
                  />
                </>
              )}
              {tipo == 'Imagen' && (
                <>
                  <input
                    className="text-white border border-black w-full  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-3 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                    type="text"
                    placeholder="Titulo"
                    id="textI"
                    value={titulo}
                    onChange={(e) => {
                      setTitulo(e.target.value)
                    }}
                  />
                  <div>
                    <div className="relative w-fit flex justify-center mx-auto mb-6">
                      <input
                        className="absolute inset-0 file:hidden cursor-pointer opacity-0"
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      <button className="w-fit mx-auto px-4 py-2 bg-red-500 text-white font-bold rounded-xl">
                        SUBIR IMAGENES
                      </button>
                    </div>
                    <div className="grid grid-cols-3 w-full gap-3">
                      {Array.isArray(contenidoItem) &&
                        ordenContenidoItem.map((orderedIndex) => (
                          <DraggableImage
                            key={orderedIndex}
                            index={orderedIndex}
                            image={contenidoItem[orderedIndex]}
                            onDelete={(deleteIndex, filename) => {
                              eliminarImagen(deleteIndex, filename)
                            }}
                          />
                        ))}
                    </div>
                  </div>
                </>
              )}
              {tipo == 'Examen' && (
                <>
                  <input
                    className="text-white border border-black w-full  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                    type="text"
                    placeholder="Titulo"
                    id="textI"
                    value={titulo}
                    onChange={(e) => {
                      setTitulo(e.target.value)
                    }}
                  />
                  <div className="flex w-full items-center gap-6">
                    <select
                      name=""
                      id=""
                      value={
                        typeof contenidoItem === 'string'
                          ? contenidoItem
                          : contenidoItem[0]?.visualizacion || ''
                      }
                      onChange={(e) => {
                        setContenidoItem(e.target.value)
                      }}
                      className="border border-black w-full text-white  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                    >
                      <option value="">Seleccionar examen</option>
                      {examenes.map(
                        (examen: { id: number, titulo: string }, index) => (
                          <option
                            value={examen.id}
                            className=""
                            key={index}
                          >
                            {examen.titulo}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  agregarNuevoItem()
                }}
                className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex mt-10 mx-auto items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Editar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DndProvider>
  )
}
