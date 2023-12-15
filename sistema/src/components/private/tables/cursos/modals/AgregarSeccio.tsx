import { Dialog, DialogContent } from '@mui/material'
import { useState, type Dispatch, type SetStateAction } from 'react'
import Swal from 'sweetalert2'
import { type temarioValues } from '../../../../shared/Interfaces'
import { v4 as uuidv4 } from 'uuid'

export const AgregarSeccio = ({
  open,
  setOpen,
  setContenido
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setContenido: Dispatch<SetStateAction<temarioValues[]>>
}): JSX.Element => {
  const [titulo, setTitulo] = useState('')

  const agregarSeccion = (): void => {
    if (!titulo) {
      Swal.fire('Debe colocar el titulo', '', 'warning')
      return
    }
    const nuevaSeccion = {
      id: uuidv4(),
      titulo,
      clase: []
    }
    setContenido((prevContenido) => [...prevContenido, nuevaSeccion])
    setTitulo('')
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className="flex flex-col gap-6 w-[500px]">
        <input
          value={titulo}
          onChange={(e) => {
            setTitulo(e.target.value)
          }}
          className="text-white border border-black w-full placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
          type="text"
          placeholder="Titulo de la Seccion"
        />
        <button
          className="text-white font-bold bg-main rounded-xl w-fit px-4 py-2 mx-auto"
          type="button"
          onClick={() => {
            agregarSeccion()
          }}
        >
          Registrar sección
        </button>
      </DialogContent>
    </Dialog>
  )
}
