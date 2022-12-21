const fs = require('fs')
const ObjectId = require('mongodb').ObjectId

const dbService = require('../../service/db.service')

async function query(filterBy) {
    try {
        // const criteria = _buildCriteria(filterBy)
        const criteria = filterBy//_buildCriteria(filterBy)

        const collection = await dbService.getCollection('order')
        var orders = await collection.find(criteria).toArray()
        return orders
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

// function _buildCriteria({ inStock, name, labels }) {
//     const criteria = {}

//     if (name) {
//         const regex = new RegExp(name, 'i')
//         criteria.name = { $regex: regex }
//     }
//     if (inStock === 'true') {
//         criteria.inStock = true
//     }
//     if (inStock === 'false') {
//         criteria.inStock = false
//     }
//     if (labels) {
//         criteria.labels = { $in: labels }
//     }
//     return criteria
// }

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = collection.findOne({ _id: ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding car ${orderId}`, err)
        throw err
    }
}

async function add(order) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.insertOne(order)
        return order
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

async function update(order) {
    try {
        var id = ObjectId(order._id)
        delete order._id
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: id }, { $set: { ...order } })
        return order
    } catch (err) {
        logger.error(`cannot update order ${orderId}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ _id: ObjectId(orderId) })
        return orderId
    } catch (err) {
        logger.error(`cannot remove car ${orderId}`, err)
        throw err
    }
}

module.exports = {
    query,
    add,
    update,
    getById,
    remove
}