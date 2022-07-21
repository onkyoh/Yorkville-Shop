import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SignupPop from '../components/SignupPopup'
import next from '../icons/morethan.png'
import { db } from '../firebase-config'
import { doc, getDoc} from '@firebase/firestore'
import { DocumentData, DocumentSnapshot } from 'firebase/firestore'


interface IProps {
  currentUser: string
  classes: {
    navClass: string
    burgerClass: string
    navBarClass: string
  }
  setClasses: React.Dispatch<React.SetStateAction<IProps['classes']>>
  }

interface IStock {
  Shoes: IShoe[]
}

interface IShoe {
  img: string
  Price: number
  Name: string
}


const Home = ({currentUser, classes, setClasses}: IProps) => {

 
  const [newCarousel, setNewCarousel] = useState("0")
  const [saleCarousel, setSaleCarousel] = useState("0")
  const [popCarousel, setPopCarousel] = useState("0")
  const [newStock, setNewStock] = useState<IStock['Shoes']>([])
  const [saleStock, setSaleStock] = useState<IStock['Shoes']>([])
  const [popStock, setPopStock] = useState<IStock['Shoes']>([])

  const [popup, setPopup] = useState(false)

  useEffect(() => {
    if (!popup) {
      setTimeout(() => {
        setPopup(true)
      }, 5000)
    }
    else {
      if (!currentUser) {
        const modal: any = document.querySelector(".modal")
        modal.showModal();
      }
    }
  }, [popup])

 const handleGetStock = async () => {
  const brandArray = ["NewlyAdded", "PriceDrops", "Popular"]
  for (let i = 0; i < brandArray.length; i++) {
    const fetchNew: DocumentSnapshot<DocumentData> | undefined = await getDoc(doc(db, "homeDisplay", brandArray[i]))
    let stockArray: IStock['Shoes'] = []
    if (!fetchNew) {
      console.log("error fetching stock")
    } else {
      if (!fetchNew.data()?.Stock) {
        console.log("error fetching stock")
      } else {
        stockArray = [...fetchNew.data()!.Stock]
      }
      switch(brandArray[i]) {
        case 'NewlyAdded': setNewStock([...stockArray]); break;
        case 'PriceDrops': setSaleStock([...stockArray]); break;
        case 'Popular': setPopStock([...stockArray]); break;
        default: return;
      }
    }
   }
  }

  useEffect(() => {
    handleGetStock()
  }, [])

  const handleCarousel = (move: number, carouselId: string) => {
    switch (carouselId) {
      case "new": {
        let current: number = parseFloat(newCarousel)
        if ((current + move) < 0 || (current + move) > (newStock.length - 1)) {
          return
        } else {
          const next:string = current + move + "";
          setNewCarousel(next)
        }
      } break;
      case "sale": {
        let current: number = parseFloat(saleCarousel)
        if ((current + move) < 0 || (current + move) > (saleStock.length - 1) ) {
          return
        } else {
          const next:string = current + move + "";
          setSaleCarousel(next)
        }
      } break;
      case "pop": {
        let current: number = parseFloat(popCarousel)
        if ((current + move) < 0 || (current + move) > (popStock.length - 1) ) {
          return
        } else {
          const next:string = current + move + "";
          setPopCarousel(next)
        }
      } break;
    }
  
  }

  const navigate = useNavigate()

  const handleShoeSelection = (name: string) => {
    window.localStorage.setItem('brand', "All")
    window.localStorage.setItem('item', name)
    navigate('/Shop')
  }

  return (
    <section className='home'>
      <section className='home-container'>
        <section>
          <h2>NEWLY ADDED</h2>
          <div className='clickers'>
            <div onClick={() => handleCarousel(-1, "new")}><img src={next} alt="previous"/></div>
            <div onClick={() => handleCarousel(+1, "new")}><img src={next} alt="next" /></div>
          </div>
          <section className='carousel'>
            <ul>
              {newStock.map((item: IShoe) => (
                <li key={item.Name} style={{transform: `translate(calc(${newCarousel} * (-100% - 25px)))`}} onClick={() => handleShoeSelection(item.Name)}>
                  <img src={item.img} alt="shoe pic"/>
                  <div><p>{item.Name}</p><p>${item.Price}</p></div>
                </li>
              ))}
            </ul>
          </section>
        </section>
        <section>
          <h2>Price Drops</h2>
          <div className='clickers'>
            <div onClick={() => handleCarousel(-1, "sale")}><img src={next} alt="previous"/></div>
            <div onClick={() => handleCarousel(+1, "sale")}><img src={next} alt="next" /></div>
          </div>
          <section className='carousel'>
            <ul>
              {saleStock.map((item: IShoe) => (
                <li key={item.Name}  style={{transform: `translate(calc(${saleCarousel} * (-100% - 25px)))`}} onClick={() => handleShoeSelection(item.Name)}>
                  <img src={item.img} alt="shoe pic"/>
                  <div><p>{item.Name}</p><p>${item.Price}</p></div>
                </li>
              ))}
            </ul>
          </section>
        </section>
        <section>
          <h2>Most Popular</h2>
          <div className='clickers'>
            <div onClick={() => handleCarousel(-1, "pop")}><img src={next} alt="previous"/></div>
            <div onClick={() => handleCarousel(+1, "pop")}><img src={next} alt="next" /></div>
          </div>
          <section className='carousel'>
            <ul>
              {popStock.map((item: IShoe) => (
                <li key={item.Name}  style={{transform: `translate(calc(${popCarousel} * (-100% - 25px)))`}} onClick={() => handleShoeSelection(item.Name)}>
                  <img src={item.img} alt="shoe pic"/>
                  <div><p>{item.Name}</p><p>${item.Price}</p></div>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </section>
      <SignupPop classes={classes} setClasses={setClasses}/>
    </section>
  )
}

export default Home