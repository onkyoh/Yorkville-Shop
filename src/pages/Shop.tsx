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

const handleHomeItem = async(chosenItem: string) => {
  const brandsList: string[] = ["Jordan", "Nike", "Adidas", "Essentials", "Test"]
    for (let i = 0; i < brandsList.length; i++) {
      const stock: any = await getDoc(doc(db, 'inventory', brandsList[i]))
      var stockName: string[] = Object.keys(stock.data())
      var stockImg: IShopImages[] = Object.values(stock.data())
      const idx = stockName.findIndex(name => name === chosenItem)
      if (idx > -1) {
        setShop([{name: chosenItem, img: stockImg[idx].img}])
        window.localStorage.setItem('item', brandsList[i])
      }
  }
}

const handleGetShop = async (chosenBrand: string) => {
  let allStock: any[]= []
  if (chosenBrand === "All") {
    const brandsList: string[] = ["Jordan", "Nike", "Adidas", "Essentials"]
    for (let i = 0; i < brandsList.length; i++) {
      const stock: DocumentSnapshot<DocumentData> | undefined = await getDoc(doc(db, 'inventory', brandsList[i]))
      if (stock.data()) {
        const stockName: string[] = Object.keys(stock.data()!)
        const stockImg: any[] = Object.values(stock.data()!)
        let tempStock = []
        for (let i = 0; i < stockName.length; i++) {
          tempStock[i] = {name: stockName[i], img: stockImg[i].img, sizes: stockImg[i].Size}
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
      setCurrentShoe(({...currentShoe, name: chosenShoe, img: tempShop[idx].img, size: "", price: 0, maxQuantity: 0}))
      setSingleFocus(true)
    } else {
      console.log("item does not have sizes")
    }

  }

  const handleSizeDetails = (chosenSize: string) => {
    const idx: number = sizesDetail.findIndex((size: any) => size[0] === chosenSize)
    const sizeValues: any = Object.values(sizesDetail[idx])
    setCurrentShoe(({...currentShoe, price: sizeValues[1].Price, maxQuantity: sizeValues[1].Quantity, size: sizeValues[0]}))
  }

  const handleAddToCart = async () => {
    const usersRef = doc(db, 'users', currentUser)
    const usersDoc: DocumentSnapshot<DocumentData> | undefined = await getDoc(usersRef)
    if (!usersDoc.data() || !usersDoc.data()!.cart) {
      console.log('error grabbing cart')
      return
    }
    var tempCart: ICart['cart'] = usersDoc.data()!.cart
    let idx = tempCart.findIndex((item: ICurrentShoe) => item.name === currentShoe.name && item.size === currentShoe.size)

    if (idx > -1) {
      if (currentShoe.quantity === currentShoe.maxQuantity) {
          console.log("No more stock")
          return
        } else {
          currentShoe.quantity += 1;
          let shoeToAdd = currentShoe
          delete shoeToAdd.img
           tempCart[idx] = shoeToAdd
          await updateDoc(usersRef, {
            cart: [...tempCart]
          })
          console.log("item added to cart for non-initial time")
      }
    } else {
      currentShoe.quantity = 1
      let shoeToAdd = currentShoe
      delete shoeToAdd.img
      var newItemCart: ICart['cart'] = [...tempCart, shoeToAdd]
      await updateDoc(usersRef, {
        cart: [...newItemCart]
      })
      console.log("trigged when item added for first time")
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
  console.log(chosenBrand)
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
              </div>
              <ul>
                  {sizes.map((size) => (
                    <li key={size} onClick={() => handleSizeDetails(size)} style={size === currentShoe.size ? {backgroundColor: "#010A10", color: "#FFFBF2"} : {}}>{size}</li>
                  ))}
              </ul>
              <button className="add-to-cart" onClick={handleAddToCart} disabled={currentShoe.size ? false : true}>ADD TO CART</button>
            </div>
          </div>
          <button id="back-to-shop" className="back-button" onClick={() => setSingleFocus(false)}>&#9664; Back</button>
          </> 
          :
          shop.map((item) => (
            <div key={item.name} className="item-container">
              <img src={item.img || ""} alt={`${item.name} Product Pic`} />
              <p onClick={() => handleShoeSelection(item.name)}>{item.name}</p>
            </div>
          )) 
          }


    </div>
  )
}

export default Shop