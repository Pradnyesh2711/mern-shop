import { useEffect, useState } from 'react'

import Products from '../components/Products'
import productService from '../services/products'
import LoadingButton from '../components/LoadingButton'
import { toast } from 'react-toastify'

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const loadProduct = async () => {
    setLoading(true)
    try {
      const result = await productService.getAll()
      setProducts(result)
      setLoading(false)
    } catch (error) {
      // alert(error)
      toast.error(error, { autoClose: 3000 })
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProduct()
  }, [])

  return (
    <div className="flex flex-col flex-1 items-center my-8">
      <Products data={products} />
      <LoadingButton
        loading={loading}
        screen={!products.length}
        onClick={loadProduct}
      />
    </div>
  )
}

export default Home
