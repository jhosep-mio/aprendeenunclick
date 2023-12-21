import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { type ConfiguracionValues } from '../Interfaces'

export default function VideoIntro ({ data }: { data: ConfiguracionValues }): JSX.Element {
  const [open, setOpen] = React.useState(true)
  const handleClose = (): void => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${data.youtube}-Gc?si=g1B2kNBz-KMVaBbO`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
