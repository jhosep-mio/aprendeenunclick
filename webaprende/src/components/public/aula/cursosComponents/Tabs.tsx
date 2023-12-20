import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import GridCursos from './GridCursos'
import { type valuesExamenesEntrada, type productosValues } from '../../../shared/Interfaces'
import GridCursosEnProgreso from './GridCursosEnProgreso'
import GridCursosSinIniciar from './GridCursosSinIniciar'
import GridCursosAprobados from './GridCursosAprobados'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel (props: TabPanelProps): JSX.Element {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps (index: number): { id: string, 'aria-controls': string } {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

export default function BasicTabs ({
  cursos,
  examenes,
  examenesCurso
}: {
  cursos: productosValues[]
  examenes: valuesExamenesEntrada[]
  examenesCurso: valuesExamenesEntrada[]
}): JSX.Element {
  const [value, setValue] = React.useState(0)

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number
  ): void => {
    event.preventDefault()
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Todos mis cursos" {...a11yProps(0)} />
          <Tab label="Cursos aprobados" {...a11yProps(1)} />
          <Tab label="Cursos en progreso" {...a11yProps(2)} />
          <Tab label="Cursos sin revisar" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <GridCursos cursos={cursos} examenes={examenes} examenesCurso={examenesCurso}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <GridCursosAprobados cursos={cursos} examenes={examenes} examenesCurso={examenesCurso}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <GridCursosEnProgreso cursos={cursos} examenes={examenes} examenesCurso={examenesCurso}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <GridCursosSinIniciar cursos={cursos} examenes={examenes}/>
      </CustomTabPanel>
    </Box>
  )
}
