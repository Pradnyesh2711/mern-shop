const logger = require('./logger')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const mutualexclusion = require('../models/mutualexclusion')
const SECRET = require('./config').SECRET

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    })
  }

  next(error)
}

const productDataExtractor = (request, response, next) => {
  const { name, description, price, imagePath } = request.body
  request.product = {
    name,
    description: description ? description : '',
    price,
    imagePath: imagePath ? imagePath : '',
    user: request.user._id,
  }
  next()
}


const mutualExclusionUpdater = async (request, response, next) => {
  const user_id = request.user._id
  const product_id = request.params.id
  const mutualExclusion = await mutualexclusion.findOne({ product_id: product_id })
  console.log(mutualExclusion);
  console.log(user_id);
  if (mutualExclusion?.user_id.toString() == user_id.toString()) {
    return response.status(200).json({ ok: true, message: 'Product is now locked for editing' })
  } else if (mutualExclusion) {
    const user = await User.findById(mutualExclusion.user_id);

    return response.status(403).json({ ok: false, message: `${user?.name} is currently updating this product, Try after sometime...` })
  } else {
    const newMutualExclusion = new mutualexclusion({
      product_id: product_id,
      user_id: user_id
    })
    await newMutualExclusion.save()
    return response.status(200).json({ ok: true, message: 'Product is now locked for editing' })
  }
}

const mutualExclusionChecker = async (request, response, next) => {
  const user_id = request.user._id
  const product_id = request.params.id
  const mutualExclusion = await mutualexclusion.findOne({ product_id: product_id, user_id: user_id })
  if (mutualExclusion && mutualExclusion.user_id.toString() != user_id.toString()) {
    return response.status(403).json({ ok: true, message: `${request.user.name} is currently updating this product, Try after sometime...` })
  } else {

    next()
  }
}

const mutualExclusionDeleter = async (request, response, next) => {
  const user_id = request.user._id
  const product_id = request.params.id
  await mutualexclusion.findOneAndDelete({ product_id: product_id, user_id: user_id })
  return response.status(200).json(request.updatedProduct)

}




const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  request.user = await User.findById(decodedToken.id)
  next()
}

const orderDataExtractor = async (request, response, next) => {
  const { name, description, price, imagePath } = request.body
  request.product = {
    name,
    description: description ? description : '',
    price,
    imagePath: imagePath ? imagePath : '',
    user: request.user._id,
  }
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  productDataExtractor,
  orderDataExtractor,
  mutualExclusionUpdater,
  mutualExclusionChecker,
  mutualExclusionDeleter
}
