import { useEffect, useState } from 'react'
import { db } from '../firebase-config'
import { doc, getDoc, updateDoc } from '@firebase/firestore'

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
  Size: {}
  img?: string
}


const Shop = ({brandChange, currentUser}: IProps) => {

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


    
    setSizesDetail([...sizeData])
    handleOrderSizes([...sizeArray])
    setCurrentShoe(({...currentShoe, name: e.target.innerHTML, img: selectedImg, size: "", price: 0, maxQuantity: 0}))
    setSingleFocus(true)
  }

  const handleSizeDetails = (e: any) => {
    const idx = sizesDetail.findIndex((size: any) => size[0] === e.target.innerHTML)
    const sizeValues:any = Object.values(sizesDetail[idx])
    setCurrentShoe(({...currentShoe, price: sizeValues[1].Price, maxQuantity: sizeValues[1].Quantity, size: sizeValues[0]}))
  }

  const handleAddToCart = async () => {
    const usersRef = doc(db, 'users', currentUser)
    const usersDoc: any = await getDoc(usersRef)
    var tempCart: ICart['cart'] = usersDoc.data().cart
    let idx = tempCart.findIndex((item: ICurrentShoe) => item.name === currentShoe.name && item.size === currentShoe.size)
    if (idx > -1) {

      if (currentShoe.quantity === currentShoe.maxQuantity) {
          console.log("No more stock")
          return
        } else {
          currentShoe.quantity += 1;
          let shoeToAdd = currentShoe
          delete shoeToAdd.img
           //add a currentShoe clone that doesnt have img parameter
          //when imgs get added delete this
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
      //add a currentShoe clone that doesnt have img parameter
      var newItemCart: ICart['cart'] = [...tempCart, shoeToAdd]
      await updateDoc(usersRef, {
        cart: [...newItemCart]
      })
      console.log("trigged when item added for first time")
    }
    //after adding to cart clicking another size = no img
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

//turning sizes in number, ordering by size, then adding the necessary suffix at the end

 const newArrayJ = juniorArray.map(item => parseFloat(item))
 newArrayJ.sort(function(a, b){ 
  return a - b
})

var newJuniorArray: any = []
 for (let i = 0; i < newArrayJ.length; i++) {
  newJuniorArray = [...newJuniorArray, (newArrayJ[i] + "Y")];
 }

const newArrayW = womenArray.map(item => parseFloat(item))
 newArrayW.sort(function(a, b){ 
  return a - b
})

var newWomenArray: any = []
 for (let i = 0; i < newArrayW.length; i++) {
  newWomenArray = [...newWomenArray, (newArrayW[i] + "W")];
 }

const newMenArray = menArray.map(item => parseFloat(item))
 newMenArray.sort(function(a, b){ 
  return a - b
})

  setSizes([...newJuniorArray, ...newWomenArray, ...newMenArray])
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
                  {sizes.map((size: string, i) => (
                    <li key={size} onClick={(e) => handleSizeDetails(e)} style={size === currentShoe.size ? {backgroundColor: "#010A10", color: "#FFFBF2"} : {}}>{size}</li>
                  // TODO: add href/active class to sizes
                  ))}
              </ul>
              <button className="add-to-cart" onClick={handleAddToCart} disabled={currentShoe.size ? false : true}>ADD TO CART</button>
            </div>
          </div>
          <button id="back-to-shop" onClick={() => setSingleFocus(false)}>Back</button>
          </> 
          :
          shop.map((shoe: string, i: number) => (
            <div key={i}  className="item-container">
              <img src={shopImages[i].img} alt="shoe" />
              <p onClick={(e) => handleShoeSelection(e)}>{shoe}</p>
            </div>
          )) 
          }


    </div>
  )
}

export default Shop