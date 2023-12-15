import { Link } from 'react-router-dom'
import perfil from '../../../../assets/aula/perfil/perfil.png'
import useAuth from '../../../../hooks/useAuth'
import { Global } from '../../../../helper/Global'
const CardGeneral = (): JSX.Element => {
  const { auth } = useAuth()
  return (
    <div className="flex flex-col bg-[#6363a24d] rounded-2xl px-8 pb-12 py-5">
      <div className="flex flex-col">
        <span className="w-[150px] h-[150px] rounded-full block mx-auto">
          <img src={auth.foto ? `${Global.urlImages}/fotoperfil/${auth.foto}` : perfil} alt="" className="rounded-full w-full h-full object-contain" />
        </span>
        <p className="text-center text-white text-4xl mt-6 font-Quicksand">{auth.onlyname}</p>
      </div>
      <Link to="" className="text-center mt-8 text-[#9898ff] text-3xl underline">Ver perfil</Link>
      <div className="grid mt-20 grid-cols-2 px-8 gap-10">
        <div className="bg-[#9a9ac192] p-5 py-12 rounded-lg flex flex-col">
            <p className="text-white text-3xl text-center font-bold">Completados</p>
            <span className="font-bold text-center mt-8 text-4xl text-[#9898ff]">8</span>
        </div>
        <div className="bg-[#9a9ac192] p-5 py-12 rounded-lg flex flex-col">
            <p className="text-white text-3xl text-center font-bold">Completados</p>
            <span className="font-bold text-center mt-8 text-4xl text-[#9898ff]">8</span>
        </div>
        <div className="bg-[#9a9ac192] p-5 py-12 rounded-lg flex flex-col">
            <p className="text-white text-3xl text-center font-bold">Completados</p>
            <span className="font-bold text-center mt-8 text-4xl text-[#9898ff]">8</span>
        </div>
        <div className="bg-[#9a9ac192] p-5 py-12 rounded-lg flex flex-col">
            <p className="text-white text-3xl text-center font-bold">Completados</p>
            <span className="font-bold text-center mt-8 text-4xl text-[#9898ff]">8</span>
        </div>
      </div>
    </div>
  )
}

export default CardGeneral
