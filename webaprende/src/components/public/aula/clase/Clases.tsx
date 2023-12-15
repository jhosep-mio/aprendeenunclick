import * as React from 'react'
import { styled } from '@mui/material/styles'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  type AccordionSummaryProps
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { type valuesClase, type valuesCurso } from '../../../shared/Interfaces'
import { Link } from 'react-router-dom'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  }
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}))

export default function Clases ({
  contenido,
  idClase,
  curso
}: {
  contenido: valuesCurso[]
  idClase: string | undefined
  curso: string

}): JSX.Element {
  const [expanded, setExpanded] = React.useState<string | false>(
    `panel${contenido[0].id}`
  )

  const handleChange =
    (panel: string) =>
      (event: React.SyntheticEvent, newExpanded: boolean): void => {
        event.preventDefault()
        setExpanded(newExpanded ? panel : false)
      }

  return (
    <div>
      {contenido.map((conten) => (
        <Accordion
          key={conten.id}
          expanded={expanded === `panel${conten.id}`}
          className=""
          onChange={handleChange(`panel${conten.id}`)}
        >
          <AccordionSummary
            aria-controls={`panel${conten.id}-content`}
            id={`panel${conten.id}-header`}
            className="bg-white p-4 shadow-md mt-4"
          >
            <Typography className="title_clase">{conten.titulo}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex items-center h-full w-full">
              <div className="flex pl-8 relative w-full">
                <span className="w-1 h-full bg-gray-300 block absolute top-0 left-0"></span>
                <div className="flex flex-col gap-4 bg-red w-full">
                  {conten.clase?.map((clase: valuesClase) => (
                    <Link to={`/cursos/curso/${curso}/clases/clase/${clase.id}`} className="flex gap-2 relative w-full" key={clase.id} >
                        {/* bg-[#8686ff] */}
                      <span className={`rounded-full w-4 h-4 ${clase.id == idClase ? 'bg-paleta-900' : 'bg-gray-500'} absolute top-0 bottom-0 my-auto -left-[24px]`}></span>
                      <p className={` text-[16px] w-fit ${clase.id == idClase ? 'text-paleta-900 font-bold' : 'text-[#3b3b3b]'} lowercase first-letter:uppercase`}>
                        {clase.titulo}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}
