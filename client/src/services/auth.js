import axios from 'axios'
const loginUrl = `${process.env.REACT_APP_BASE_URL}/api/login`
const registerUrl = `${process.env.REACT_APP_BASE_URL}/api/users`

const login = async user => {
  const request = axios.post(loginUrl, user)
  return request.then(response => response.data)
}

const register = async user => {
  const request = axios.post(registerUrl, user)
  return request.then(response => response.data)
}

export default { login, register }
