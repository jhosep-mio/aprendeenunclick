import { Dialog, DialogContent } from '@mui/material'
import {
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
  useRef,
  type MutableRefObject
} from 'react'
import Swal from 'sweetalert2'
import {
  type imagenUpladvalues,
  type temarioValues
} from '../../../../shared/Interfaces'
import { v4 as uuidv4 } from 'uuid'

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  idSeleccion: string
  contenido: temarioValues[]
  setContenido: Dispatch<SetStateAction<temarioValues[]>>
  examenes: never[]
}

export const AgregarNuevoItem = ({
  open,
  setOpen,
  idSeleccion,
  setContenido,
  examenes
}: valuesProps): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }

  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState('')
  const fileInputRef: MutableRefObject<HTMLInputElement | null> = useRef(null)
  const [contenidoItem, setContenidoItem] = useState<
  string | imagenUpladvalues[]
  >([])

  const agregarNuevoItem = (): void => {
    if (titulo && contenidoItem) {
      setContenido((prevContenido) =>
        prevContenido.map((item: temarioValues) =>
          item.id == idSeleccion
            ? {
                ...item,
                clase: [
                  ...(item.clase || []),
                  { id: uuidv4(), tipo, titulo, contenido: contenidoItem }
                ]
              }
            : item
        )
      )
      // Optionally, clear the input fields after adding the item
      setTitulo('')
      setTipo('')
      setOpen(false)
      setContenidoItem([]) // Clear contenidoItem after adding the item
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

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [contenidoItem])

  useEffect(() => {
    setContenidoItem([])
    setTitulo('')
  }, [tipo])

  return (
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
              Agregar item
            </h2>
            <select
              name=""
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value)
              }}
              id=""
              className="border text-white border-black w-full mx-auto  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
            >
              <option value="">Seleccionar tipo</option>
              <option value="Video">Video</option>
              <option value="Imagen">Imagen</option>
              <option value="Ejercicio">Ejercicio</option>
              <option value="Examen">Examen</option>
            </select>
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
                      contenidoItem.map((conten, index: number) => (
                        <img
                          src={conten.visualizacion}
                          alt=""
                          key={index}
                          className="w-full h-full object-contain"
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
              Agregar item
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
