const fs = require('fs')
const ObjectId = require('mongodb').ObjectId

const dbService = require('../../service/db.service')
const logger = require("../../service/logger.service")


async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)

        const collection = await dbService.getCollection('check')
        var stays = await collection.find(criteria).toArray()
        // needed to add rate key to the data
        // addRate(stays)
       
        return stays

    }
    catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}

    if (filterBy.name) {
        const txtCriteria = { $regex: filterBy.name, $options: 'i' }
        criteria.name = txtCriteria
    }
    if (filterBy.minPrice && filterBy.maxPrice) {
        criteria.price = { $gt: +filterBy.minPrice, $lt: +filterBy.maxPrice }
    }
    if (filterBy.label) {
        const labelCriteria = { $regex: filterBy.label, $options: 'i' }
        criteria.type = labelCriteria
    }
    // if (filterBy.amenities) { //יש לעדכן את הפרונט למערך
    //     criteria.amenities = { amenities: { $in: filterBy.amenities } }
    // }
    if (filterBy.where) {
        const locCriteria = { $regex: filterBy.where, $options: 'i' }
        criteria['loc.country'] = locCriteria
    }
    return criteria
}


async function getById(stayId) {
    try {

        const collection = await dbService.getCollection('check')
        const stay = await collection.findOne({ _id: stayId })
        return stay
    } catch (err) {
        logger.error(`while finding car ${stayId}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        const collection = await dbService.getCollection('stay')
        const addedStay = await collection.insertOne(stay)
        return addedStay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

async function update(stay) {
    try {
        var id = ObjectId(stay._id)
        delete stay._id
        const collection = await dbService.getCollection('check')
        await collection.updateOne({ _id: id }, { $set: { ...stay } })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${id}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        const collection = await dbService.getCollection('check')
        await collection.deleteOne({ _id: ObjectId(stayId) })
        return stayId
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}

function getRandomRate(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return +(Math.random() * (max - min + 1) + min).toFixed(2) //The maximum is inclusive and the minimum is inclusive 
}

function addRate(stays){
    console.log('there isnt rate1');
    stays.forEach(stay => {
        stay.reviews.forEach(review => {
            // review.rate = await utilService.getRandomIntInclusive(3, 5)
            const random =  getRandomRate(3, 5)
            review.rate = random
        })
        update(stay)
    }
    )
}

module.exports = {
    query,
    add,
    update,
    getById,
    remove
}