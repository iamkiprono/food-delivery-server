import { addCartItem, getCartItems, updateCart, updateExtraNote, deleteItem } from '../controllers/cartController.js'
import customerProtect from '../middleware/customerMiddleware.js'
import express from 'express'
const router = express.Router()

router.route('/add').post(customerProtect,addCartItem)
router.route('/items/:id').get(getCartItems)
router.route('/update/:id').put(customerProtect,updateCart)
router.route('/update-note/:id').put(customerProtect, updateExtraNote)
router.route('/delete/:id').delete(customerProtect,deleteItem)

export default router