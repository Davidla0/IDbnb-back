const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getUser, getUsers, deleteUser, updateUser, createUser} = require('./user.controller')
const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
// router.put('/:id',  updateUser)
router.post('/',  createUser)
// router.delete('/:id ',  requireAuth, requireAdmin, deleteUser)
router.delete('/:id', deleteUser)

module.exports = router