import { useEffect, useState } from 'react'
import { db } from '../firebase-config'
import { doc, getDoc, updateDoc } from '@firebase/firestore'
import { DocumentData, DocumentSnapshot } from 'firebase/firestore'

interface IProps {
  brandChange: string
  currentUser: string
}

interface ICart {
  cart: {
    name: string
    size: string
    quantity: number
    price: number
    maxQuantity: number
    img?: string
  }[];
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
  Size?: {}
  img?: string
}

interface IShop {
  item: {
    name: string
    img?: string
    sizes?: {
      size: {
        Quantity: number
        Price: number
    }}
  }[]

}


const Shop = ({brandChange, currentUser}: IProps) => {

  const [shop, setShop] = useState<IShop['item']>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [sizesDetail, setSizesDetail] = useState<[string, {Price: number, Quantity: number}][]>([])
  const [singleFocus, setSingleFocus] = useState(false)
  const [currentShoe, setCurrentShoe] = useState<ICurrentShoe>({
    name: "",
    size: "",
    price: 0,
    quantity: 0,
    maxQuantity: 0,
})
  const [error, setError] = useState("")

const handleHomeItem = async(chosenItem: string) => {
  const brandsList: string[] = ["Jordan", "Nike", "Adidas", "Essentials"]
    for (let i = 0; i < brandsList.length; i++) {
      const stock: DocumentSnapshot<DocumentData> | undefined = await getDoc(doc(db, 'inventory', brandsList[i]))
      if (!stock.data()) {
        console.log("error retrieving stock")
        return
      }
      var stockName: string[] = Object.keys(stock.data()!)
      var stockDetails: any [] = Object.values(stock.data()!)
      const idx = stockName.findIndex(name => name === chosenItem)
      if (idx > -1) {
        const homeItem = {
          name: chosenItem,
          img: stockDetails[idx].img,
          sizes: stockDetails[idx].Size
        }
        setShop([{...homeItem}])
        window.localStorage.setItem('brand', brandsList[i])
      }
  }
}

const handleGetShop = async (chosenBrand: string) => {
  let allStock: any[] = []
  if (chosenBrand === "All") {
    const brandsList: string[] = ["Jordan", "Nike", "Adidas", "Essentials"]
    for (let i = 0; i < brandsList.length; i++) {
      const stock: DocumentSnapshot<DocumentData> | undefined = await getDoc(doc(db, 'inventory', brandsList[i]))
      if (stock.data()) {
        const stockName: string[] = Object.keys(stock.data()!)
        const stockDetails: any[] = Object.values(stock.data()!)
        let tempStock = []
        for (let i = 0; i < stockName.length; i++) {
          tempStock[i] = {name: stockName[i], img: stockDetails[i].img, sizes: stockDetails[i].Size}
        }
        allStock = [...allStock, ...tempStock]
      } else {
        console.log('error retrieiving inventory')
      }
    }
    setShop([...allStock])
  } else {
    const stock: DocumentSnapshot<DocumentData> | undefined = await getDoc(doc(db, 'inventory', chosenBrand))
      if (stock.data()) {
        const stockName: string[] = Object.keys(stock.data()!)
        const stockImg: IShopImages[] = Object.values(stock.data()!)
        let tempStock = []
        for (let i = 0; i < stockName.length; i++) {
          tempStock[i] = {name: stockName[i], img: stockImg[i].img, sizes: stockImg[i].Size}
        }
        allStock = [...allStock, ...tempStock]
        setShop([...allStock])
      } else {
        console.log("error retrieving stock")
      }
    }
  }

  const handleShoeSelection = async (chosenShoe: string) => {
    let tempShop = [...shop]
    let idx = -1;
    for (let i = 0; i < tempShop.length; i++ ) {
      if (tempShop[i].name === chosenShoe) {
        idx = i;
      }
    }
  
    // turning indi shoe into array of its params => finding idx of size param 
    // => turning size param into an array of sizes 
    //and array of entries containing size + each sizes details

    const tempObject = Object.entries(tempShop[idx])

    let sizeArrayIdx = -1;
 
    if (tempShop[idx]) {
      sizeArrayIdx = tempObject.findIndex(param => param[0] === "sizes")
    } else {
      console.log("item does not have sizes")
    }
    if (sizeArrayIdx > -1) {
      const sizeArray: string[] = Object.keys(tempObject[sizeArrayIdx][1])
      const sizeData: [string, {Price: number, Quantity: number}][] = Object.entries(tempObject[sizeArrayIdx][1])
      setSizesDetail([...sizeData])
      handleOrderSizes([...sizeArray])
      setCurrentShoe(() => ({...currentShoe, name: chosenShoe, img: `${tempShop[idx].img || ""}`, size: "", price: 0, maxQuantity: 0, quantity: 0}))
      setSingleFocus(true)
      setError("")
    } else {
      console.log("item does not have sizes")
    }

  }

  const handleSizeDetails = async (chosenSize: string) => {
    const idx: number = sizesDetail.findIndex((size: any) => size[0] === chosenSize)
    const sizeValues: any = Object.values(sizesDetail[idx])
    const tempShoe = {
      price: sizeValues[1].Price, maxQuantity: sizeValues[1].Quantity, size: sizeValues[0]
    }
    let tempCart: Awaited<ICart['cart']> | undefined  = await handleGetCart()
    if (tempCart) {
      const cartIdx = tempCart.findIndex((item: ICurrentShoe) => item.name === currentShoe.name && item.size === sizeValues[0])
      if (cartIdx > -1) {
        setCurrentShoe(() => ({...currentShoe, ...tempShoe, quantity: tempCart![cartIdx].quantity}))
      } else {
        setCurrentShoe(() => ({...currentShoe, ...tempShoe, quantity: 0}))
      }
      setError("")
    }

  }

  const handleGetCart = async () => {
    if (currentUser) {
      const usersDoc: DocumentSnapshot<DocumentData> | undefined = await getDoc(doc(db, 'users', currentUser))
      if (usersDoc.data() && usersDoc.data()!.cart) {
        let tempCart: ICart['cart'] = [...usersDoc.data()!.cart]
        return ([...tempCart])
      } else {
        console.log("error grabbing cart")
      }
    } else {
      return []
    }
  
  }


  const handleAddToCart = async () => {
    if (!currentUser) {
      setError("Login to add to cart.")
      return
    }
    var tempShoe = currentShoe
    const usersRef = doc(db, 'users', currentUser)
    var tempCart: Awaited<ICart['cart']> | undefined = await handleGetCart()
    
    if (tempCart) {

    let idx = tempCart.findIndex((item: ICurrentShoe) => item.name === tempShoe.name && item.size === tempShoe.size)

    if (idx > -1) {
      tempShoe = tempCart[idx]
      if (tempShoe.quantity === tempShoe.maxQuantity) {
          console.log("No more stock")
          setError("No more stock")
          return
      } else {
          tempShoe.quantity += 1
          setCurrentShoe(() => ({...tempShoe}))
          tempCart[idx] = tempShoe
          await updateDoc(usersRef, {
            cart: [...tempCart]
          })
      }
    } else {
      tempShoe.quantity = 1
      setCurrentShoe(() => ({...tempShoe}))
      var newItemCart: ICart['cart'] = [...tempCart, tempShoe]
      await updateDoc(usersRef, {
        cart: [...newItemCart]
      })
    }
  }
  }

const handleOrderSizes = (arrayOfSizes: string[]) => {
  var juniorArray: string[] = []
  var womenArray: string[] = []
  var menArray: string[] = []
    for (let i = 0; i < arrayOfSizes.length; i++) {
      if (arrayOfSizes[i].includes('Y')) {
        juniorArray = [...juniorArray, arrayOfSizes[i]]
      }  else if (arrayOfSizes[i].includes('W')) {
        womenArray = [...womenArray, arrayOfSizes[i]]
      } else {
        menArray = [...menArray, arrayOfSizes[i]]
      }
  }

  //turning sizes in number, ordering by size, then adding the necessary suffix

    const newArrayJ = juniorArray.map(item => parseFloat(item))
    newArrayJ.sort(function(a, b){ 
      return a - b
    })
      var newJuniorArray: string[] = []
      for (let i = 0; i < newArrayJ.length; i++) {
        newJuniorArray = [...newJuniorArray, (newArrayJ[i] + "Y")];
      }
    const newArrayW = womenArray.map(item => parseFloat(item))
    newArrayW.sort(function(a, b){ 
      return a - b
    })
      var newWomenArray: string[] = []
      for (let i = 0; i < newArrayW.length; i++) {
        newWomenArray = [...newWomenArray, (newArrayW[i] + "W")];
      }

    const tempMenArray: number[] = menArray.map(item => parseFloat(item))
    tempMenArray.sort(function(a, b){ 
      return a - b
    })
      const newMenArray = tempMenArray.map((size: number) => JSON.stringify(size))
        setSizes([...newJuniorArray, ...newWomenArray, ...newMenArray])
}


useEffect(() => {
  const chosenItem = window.localStorage.getItem('item') 
  const chosenBrand = window.localStorage.getItem('brand')
  console.log(chosenItem)
  if (chosenItem) {
    handleHomeItem(chosenItem)
    window.localStorage.setItem('item', "")
  } else {
      if (chosenBrand) {
        handleGetShop(chosenBrand)
      } else {
        handleGetShop("All")
    }
}
setSingleFocus(false)
}, [brandChange])

useEffect(() => {
  if (currentUser) {
    handleGetCart()
  }
}, [currentUser])


 const handleOnLoad = () => {
  const options = {
    threshold: 0.1
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
     if (entry.isIntersecting) {
      entry.target.className = 'fade-in'
     }})
  }, options)
  
  const imgs = document.querySelectorAll("#shop-imgs")
  imgs.forEach(img => observer.observe(img))
 }







  return (
    <div className='shop'>
        {singleFocus ? 
        <>
          <div id="single-focus-container">
            <div className="item-container">
                <img src={currentShoe.img} alt="Shoe" />
                <p>{currentShoe.name}</p>
            </div>
            <div id="details-container">
              <div>
                <h3>Price: ${currentShoe.price}</h3>
                <h4>Stock: {currentShoe.maxQuantity}</h4>
                <h4>In Cart: {currentShoe.quantity}</h4>
              </div>
              <span className='error' style={!error ? {display: "none"} : {}}>{error}</span>
              <ul>
                  {sizes.map((size) => (
                    <li key={size} onClick={() => handleSizeDetails(size)} style={size === currentShoe.size ? {backgroundColor: "#010A10", color: "#FFFBF2"} : {}}>{size}</li>
                  ))}
              </ul>
              <button className="add-to-cart" onClick={handleAddToCart} disabled={!currentShoe.size ? true : false}>ADD TO CART</button>
            </div>
          </div>
          <button id="back-to-shop" className="back-button" onClick={() => setSingleFocus(false)}>&#9664; Back</button>
        </> 
          :
          shop.map((item) => (
            <div key={item.name} className="item-container" onClick={() => handleShoeSelection(item.name)}>
              <img src={item.img} id="shop-imgs" alt={item.name} onLoad={handleOnLoad}/>
              <p>{item.name}</p>
            </div>
          )) 
          }
    </div>
  )
}

export default Shop