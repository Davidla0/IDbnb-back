const express = require('express')
const router = express.Router()
module.exports = router
const {MongoClient} = require('mongodb')
const socketService = require('../../service/socket.service')

const authService = require('../auth/auth.service')
const orderService = require('./order.service')
const logger = require('../../service/logger.service') 

async function getOrders(req, res){
    try {
        logger.debug('Getting Orders')
        var queryParams = req.query
        const orders = await orderService.query(queryParams)
        res.json(orders)
      } catch (err) {
        logger.error('Failed to get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
      }
}

async function getOrderById(req, res) {
    try {
      const orderId = req.params.id
      const order = await orderService.getById(orderId)
      res.json(order)
    } catch (err) {
      logger.error('Failed to get order', err)
      res.status(500).send({ err: 'Failed to get order' })
    }
  }

  async function addOrder(req, res) {
    try {
      const order = req.body
      const addedOrder = await orderService.add(order)
     return  res.json(addedOrder)
    } catch (err) {
      logger.error('Failed to add order', err)
      res.status(500).send({ err: 'Failed to add order' })
    }
  }

  async function updateOrder(req, res) {

    var loggedinUser = authService.validateToken(req.headers.cookie)
    try {
      const order = req.body
      const updatedOrder = await orderService.update(order)
      socketService.broadcast({type:'update-order',data: updatedOrder, userId: loggedinUser._id })
      res.json(updatedOrder)
    } catch (err) {
      logger.error('Failed to update order', err)
      res.status(500).send({ err: 'Failed to update order'})
    }
  }

  async function removeOrder(req, res) {
    try {
      const orderId = req.params.id;
      const removedId = await orderService.remove(orderId)
      res.send(removedId)
    } catch (err) {
      logger.error('Failed to remove order', err)
      res.status(500).send({ err: 'Failed to remove order' })
    }
  }

  module.exports = {
    getOrders,
    getOrderById,
    addOrder,
    updateOrder,
    removeOrder
  }