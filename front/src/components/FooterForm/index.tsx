import './FooterForm.css'

export function FooterForm(){
    return(
        <div className="barra_informacao">
                    <div className="inform">
                        <img src="/box.png" alt="" />
                        <p className="number">3</p>
                        <p className="paragrafo">Orders</p>
                    </div>
                    <div className="inform">
                        <img src="/heart.png" alt="" />
                        <p className="number">3</p>
                        <p className="paragrafo">Wishlist</p>
                    </div>
                    <div className="inform">
                        <img src="/star.png" alt="" />
                        <p className="number">3</p>
                        <p className="paragrafo">Reviews</p>
                    </div>
                </div>
    )
}
