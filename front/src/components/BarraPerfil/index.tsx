import './BarraPerfil.css'


export function BarraPerfil(){
    return(<div  className="barra">
                    <div className="perfil">
                        <img className ="icon"src="/iconPerfil.png" alt="icon Perfil" />
                        <p>Perfil</p>
                    </div>
                    <div className="perfil">
                        <img className ="icon"src="/iconOrders.png" alt="icon Perfil" />
                        <p>Order</p>
                    </div>
                    <div className="perfil">
                        <img className ="icon"src="/iconSetting.png" alt="icon Perfil" />
                        <p>Setting</p>
                    </div> 
                </div>
    )
}