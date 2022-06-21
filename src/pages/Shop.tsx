import React, { useEffect, useState } from 'react'
import { db } from '../firebase-config'
import { doc, getDoc } from '@firebase/firestore'

interface IProps {
  cart: {
    name: string
    size: string
    quantity: number
    price: number
    maxQuantity: number
    img?: string
  }[];
  setCart: React.Dispatch<React.SetStateAction<IProps['cart']>>;
  brandChange: string
}

interface ICurrentShoe {
  name: string
  size: string
  price: number
  quantity: number
  maxQuantity: number
  img?: string
}

interface IShopImages {
  Size: {}
  img?: string
}





const Shop = ({cart, setCart, brandChange}: IProps) => {

  const [shop, setShop] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [sizesDetail, setSizesDetail] = useState<object[]>([])
  const [singleFocus, setSingleFocus] = useState(false)
  const [currentShoe, setCurrentShoe] = useState<ICurrentShoe>({
    name: "",
    size: "",
    price: 0,
    quantity: 0,
    maxQuantity: 0,
})
  const [brand, setBrand] = useState<string>("")
  const [shopImages, setShopImages] = useState<IShopImages[]>([])


const handleGetShop = async (chosenBrand: string) => {
  if (chosenBrand === "All") {
    const brandsList: string[] = ["Jordan", "Nike", "Adidas", "Essentials"]
    var allStock: any = []
    var allImages: any = []
    for (let i = 0; i < brandsList.length; i++) {
      const stock: any = await getDoc(doc(db, 'inventory', brandsList[i]))
      var stockName: string[] = Object.keys(stock.data())
      var stockImg: IShopImages[] = Object.values(stock.data())
      allImages = [...allImages, stockImg]
      allStock = [...allStock, stockName]
    }
    allStock = [...allStock[0], ...allStock[1], ...allStock[2], allStock[3]]
    allImages = [...allImages[0], ...allImages[1], ...allImages[2], allImages[3]]
    setShopImages([...allImages])
    setShop([...allStock])
  } else {
    const stock: any = await getDoc(doc(db, 'inventory', chosenBrand))
    const stockName: string[] = Object.keys(stock.data())
    const stockImg: IShopImages[] = Object.values(stock.data())
    setShop([...stockName])
    setShopImages([...stockImg])
  }
  }

  const handleShoeSelection = async (e: any) => {
    var stock: any;
    if (brand === "All") {
      const shoeName = e.target.innerHTML
      const nameArray = shoeName.split(" ")
        var shoeBrand: string;
        if (nameArray[0] === "YEEZY") {
          shoeBrand = "Adidas"
        } else {
          shoeBrand = nameArray[0]
        }
        //determing which brand to get shoe data from depending on items name
      stock = await getDoc(doc(db, 'inventory', shoeBrand))
    } else {
      stock = await getDoc(doc(db, 'inventory', brand))
    } 
    
    var tempStock: [string, {Size: {}, img?: string}][] = Object.entries(stock.data())

    var idx = -1;
    for (let i = 0; i < tempStock.length; i++ ) {
      if (tempStock[i][0] === e.target.innerHTML) {
        idx = i;
      }
    }

    var selectedImg = tempStock[idx][1].img
    var sizeArray: string[] = Object.keys(tempStock[idx][1].Size)
    var sizeMap: any = Object.entries(tempStock[idx][1])
    
    const idxOfSize = sizeMap.findIndex((array: any) => array[0] === "Size")
    const tempSizeDetails = sizeMap[idxOfSize]
    const sizeData = Object.entries(tempSizeDetails[1])


    setSizes([...sizeArray])
    setSizesDetail([...sizeData])
    setCurrentShoe(({...currentShoe, name: e.target.innerHTML, img: selectedImg, size: ""}))
    setSingleFocus(true)
  }

  const handleSizeDetails = (e: any) => {
    const idx = sizesDetail.findIndex((size: any) => size[0] === e.target.innerHTML)
    const sizeValues:any = Object.values(sizesDetail[idx])
    console.log(sizeValues[1])

    setCurrentShoe(({...currentShoe, price: sizeValues[1].Price, maxQuantity: sizeValues[1].Quantity, size: sizeValues[0]}))
  }

  const handleAddToCart = () => {
    var tempCart: IProps['cart'] = cart
    let idx = tempCart.findIndex((item: ICurrentShoe) => item.name === currentShoe.name && item.size === currentShoe.size)
    if (idx > -1) {
      if (currentShoe.quantity === currentShoe.maxQuantity) {
          console.log("No more stock")
          return
        } else {
          currentShoe.quantity += 1;
          tempCart[idx] = currentShoe
          setCart([...tempCart])
          console.log("item added to cart for non-initial time")
      }
    } else {
      currentShoe.quantity = 1
      var newItemCart: IProps['cart'] = [...tempCart, currentShoe]
      setCart([...newItemCart])
      console.log("trigged when item added for first time")
    }
  }

useEffect(() => {
  const chosenBrand = window.localStorage.getItem('brand')
  if (typeof(chosenBrand) === 'string' ) {
    setBrand(() => (chosenBrand!))
  } else {
    setBrand(() => "Jordan")
  }
  handleGetShop(chosenBrand!)
  setSingleFocus(false)
}, [brandChange])

  return (
    <div className='shop'>
        {singleFocus ? 
          <div id="single-focus-container">
            <div id="back-to-shop" onClick={() => setSingleFocus(false)}>Back</div>
            <div id="content-container">
              <div id="p-img-container">
                <img src={currentShoe.img} alt="Shoe" />
                <p>{currentShoe.name}</p>
              </div>
              <div id="size-container">
                {sizes.map((size: string, i: number) => (
                  <button className="size-buttons" key={i} onClick={(e) => handleSizeDetails(e)}>{size}</button>
                ))}
              </div>
                {!currentShoe.size ? 
                  <button className="add-to-cart inactive" >ADD TO CART</button> 
                  :
                  <button className="add-to-cart" onClick={handleAddToCart}>ADD TO CART</button>
                }
            </div>
          </div> 
          :
          shop.map((shoe: string, i: number) => (
            <div key={i}  className="item-container">
              <img src={shopImages[i].img} alt="shoe" />
              <p onClick={(e) => handleShoeSelection(e)}>{shoe}</p>
            </div>
          )) 
          }

      
     {cart.map((item: any, i: number) => (
        <div key={i}>Shoe: {item.name}, Size: {item.size}, Price: {item.price}, Quantity: {item.quantity}</div>
      ))}

    </div>
  )
}

export default Shop