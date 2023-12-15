import perfil from '../../../../assets/aula/perfil/perfil.png'
import { Global } from '../../../../helper/Global'
const UpadateFoto = ({
  fotoperfil,
  handleChangeFotoPerfil
}: {
  fotoperfil: string
  handleChangeFotoPerfil: (e: any) => void
}): JSX.Element => {
  return (
    <div className="flex flex-col bg-[#6363a24d] rounded-2xl px-8 pb-12 py-5">
      <div className="flex flex-col">
        <span className="block w-full text-center text-2xl text-white pt-3">
          Recomendación: 200 x 200
        </span>
        <span className="w-[150px] h-[150px] rounded-full block mx-auto mt-5 mb-3 bg-transparent">
          <img
            src={
                fotoperfil
                  ? `${Global.urlImages}/fotoperfil/${fotoperfil}`
                  : perfil
            }
            alt=""
            className="w-full h-full object-contain rounded-full"
          />
        </span>
        <div className="mt-3">
          <p className="text-2xl text-center w-full text-white">
            Para cambiar tu foto de perfil{' '}
          </p>
          <div className="w-fit relative mx-auto overflow-hidden cursor-pointer text-white">
            <input
              type="file"
              className="absolute w-fit h-full opacity-0 cursor-pointer file:hidden"
              onChange={handleChangeFotoPerfil}
            />
            <span className="text-secondary-200 font-bold cursor-pointer text-2xl text-center block w-full underline text-primary">
              sube una foto
            </span>
          </div>
        </div>
      </div>
      <div className="grid mt-20 grid-cols-2 px-8 gap-10">
        <div className="bg-[#9a9ac192] p-5 py-12 rounded-lg flex flex-col">
          <p className="text-white text-3xl text-center font-bold">
            Completados
          </p>
          <span className="font-bold text-center mt-8 text-4xl text-[#9898ff]">
            8
          </span>
        </div>
        <div className="bg-[#9a9ac192] p-5 py-12 rounded-lg flex flex-col">
          <p className="text-white text-3xl text-center font-bold">
            Completados
          </p>
          <span className="font-bold text-center mt-8 text-4xl text-[#9898ff]">
            8
          </span>
        </div>
        <div className="bg-[#9a9ac192] p-5 py-12 rounded-lg flex flex-col">
          <p className="text-white text-3xl text-center font-bold">
            Completados
          </p>
          <span className="font-bold text-center mt-8 text-4xl text-[#9898ff]">
            8
          </span>
        </div>
        <div className="bg-[#9a9ac192] p-5 py-12 rounded-lg flex flex-col">
          <p className="text-white text-3xl text-center font-bold">
            Completados
          </p>
          <span className="font-bold text-center mt-8 text-4xl text-[#9898ff]">
            8
          </span>
        </div>
      </div>
    </div>
  )
}

export default UpadateFoto
