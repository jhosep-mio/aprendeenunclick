import { Outlet } from 'react-router-dom'
import  HeaderAula  from './aula/estructura/Header'
import FooterAula  from './aula/estructura/Footer'

export const PublicAula = (): JSX.Element => {
  return (
    <>
      <HeaderAula />
      <Outlet />
      <FooterAula />
    </>
  )
}
