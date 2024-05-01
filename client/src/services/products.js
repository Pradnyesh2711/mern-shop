import axios from 'axios'
const baseUrl = 'http://localhost:5000/api/products'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const updateProduct = async (id, product) => {
  const config = {
    headers: { Authorization: `bearer ${JSON.parse(localStorage.getItem("USER")).token}` },
  }


  const response = axios.put(`${baseUrl}/${id}`, product, config)
  return response.then(response => response.data)
}


const startEditing = async (id) => {
  try {
    const config = {
      headers: { Authorization: `bearer ${JSON.parse(localStorage.getItem("USER")).token}` },
    }


    const response = await axios.post(`${baseUrl}/${id}/start_editing`, {}, config)
    return response.data

  } catch (error) {
    console.log(error);
    return error.response.data;
  }
}


const get = async id => {
  const request = axios.get(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const create = async newObj => {
  const config = {
    headers: { Authorization: token },
  }

  const response = axios.post(baseUrl, newObj, config)
  return response.then(response => response.data)
}

export default { get, getAll, create, setToken, updateProduct, startEditing }
