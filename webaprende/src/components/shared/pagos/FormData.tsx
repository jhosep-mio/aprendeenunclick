import React, { type FC } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { IoClose, IoPricetagOutline } from 'react-icons/io5'

interface FormDataProps {
  open: boolean
  handleClose: (open: boolean) => void
}

const FormData: FC<FormDataProps> = ({ open, handleClose }) => {
  const handleClickOpen = (): void => {
    handleClose(true)
  }

  const handleCloseDialog = (): void => {
    handleClose(false)
  }

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogContent>
          <div className="p-8 py-12 pt-20 relative">
            <button
              type="button"
              className="absolute top-4 right-2"
              onClick={() => {
                handleCloseDialog()
              }}
            >
              <IoClose className="text-5xl text-[#B43A34]" />
            </button>

            <form action="" className="px-6">
              <div className="flex gap-6 justify-between items-center border px-6 py-4 mb-12 rounded-md bg-[#f9f9f9] ">
                <div className="flex gap-4 items-center">
                  <span className="w-[40px] h-[40px] rounded-full bg-[#b43a34c2] flex items-center justify-center">
                    <IoPricetagOutline className="text-4xl text-white" />
                  </span>
                  <p className="text-4xl text-[#202020] tracking-wide">
                    Plan básico
                  </p>
                </div>
                <span className="text-4xl font-bold text-[#B43A34]">
                  S/. 49.00
                </span>
              </div>

              <div className="flex gap-6">
                <div className="input-group w-1/2">
                  <label className="label">Nombres</label>
                  <input
                    autoComplete=""
                    name="nombres"
                    id="Email"
                    className="input"
                    type="password"
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="input-group w-1/2">
                  <label className="label">Apellidos</label>
                  <input
                    autoComplete=""
                    name="nombres"
                    id="Email"
                    className="input"
                    type="password"
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="input-group w-1/2">
                  <label className="label">Email</label>
                  <input
                    autoComplete=""
                    name="nombres"
                    id="Email"
                    className="input"
                    type="password"
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="input-group w-1/2">
                  <label className="label">Celular</label>
                  <input
                    autoComplete=""
                    name="nombres"
                    id="Email"
                    className="input"
                    type="password"
                  />
                </div>
              </div>

              <input
                type="submit"
                className="bg-[#009EE3] w-full py-5 rounded-2xl text-2xl text-white"
                value="Pagar con Mercado Pago"
              />
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

export default FormData
