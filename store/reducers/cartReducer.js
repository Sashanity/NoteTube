import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { 
    ADD_TO_CART,
    REMOVE_ITEM,
    SUB_QUANTITY,
    ADD_QUANTITY, 
    ADD_SHIPPING,
    ADD_QUANTITY_WITH_NUMBER,
    RESET_CART
} from '../actions/action-types/cart-actions'

const initState = {
    products: [
        {
            id: 1,
            title: "Novel Bunch",
            price: 455.50,
            image: require("../../images/shop/item1.jpg"),
            imageHover: require("../../images/shop/item1-hover.jpg")
        },
        {
            id: 2,
            title: "Book Chicks",
            price: 541.50,
            image: require("../../images/shop/item2.jpg"),
            imageHover: require("../../images/shop/item2-hover.jpg")
        },
        {
            id: 3,
            title: "Book Divas",
            price: 140.50,
            image: require("../../images/shop/item3.jpg"),
            imageHover: require("../../images/shop/item3-hover.jpg")
        },
        {
            id: 4,
            title: "Book Smart",
            price: 600.00,
            image: require("../../images/shop/item4.jpg"),
            imageHover: require("../../images/shop/item4-hover.jpg")
        },
        {
            id: 5,
            title: "Book Broads",
            price: 655.50,
            image: require("../../images/shop/item5.jpg"),
            imageHover: require("../../images/shop/item5-hover.jpg")
        },
        {
            id: 6,
            title: "Page Turners",
            price: 415.00,
            image: require("../../images/shop/item6.jpg"),
            imageHover: require("../../images/shop/item6-hover.jpg")
        }
    ],
    addedItems:[],
    total: 0,
    shipping: 0
}

const cartReducer= (state = initState, action) => {
   
    if(action.type === ADD_TO_CART){
        let addedItem = state.products.find(item => item.id === action.id)
        //check if the action id exists in the addedItems
        let existed_item= state.addedItems.find(item=> action.id === item.id)
        if(existed_item)
        {
            addedItem.quantity += 1 
            return {
                ...state,
                total: state.total + addedItem.price 
            }
        } else {
            addedItem.quantity = 1;
            //calculating the total
            let newTotal = state.total + addedItem.price 
            
            return {
                ...state,
                addedItems: [...state.addedItems, addedItem],
                total : newTotal
            }
            
        }
    }

    if(action.type === ADD_QUANTITY_WITH_NUMBER){
        let addedItem = state.products.find(item => item.id === action.id)
        //check if the action id exists in the addedItems
        let existed_item= state.addedItems.find(item=> action.id === item.id)
        if(existed_item)
        {
            addedItem.quantity += action.qty
            return {
                ...state,
                total: state.total + addedItem.price * action.qty
            }
        } else {
            addedItem.quantity = action.qty;
            //calculating the total
            let newTotal = state.total + addedItem.price * action.qty
            
            return {
                ...state,
                addedItems: [...state.addedItems, addedItem],
                total : newTotal
            }
            
        }
    }
    

    if(action.type === REMOVE_ITEM){
        let itemToRemove= state.addedItems.find(item=> action.id === item.id)
        let new_items = state.addedItems.filter(item=> action.id !== item.id)
        
        //calculating the total
        let newTotal = state.total - (itemToRemove.price * itemToRemove.quantity );

        return {
            ...state,
            addedItems: new_items,
            total: newTotal
        }
    }

    if(action.type === ADD_QUANTITY){
        let addedItem = state.products.find(item=> item.id === action.id)
        addedItem.quantity += 1 
        let newTotal = state.total + addedItem.price
        return {
            ...state,
            total: newTotal
        }
    }

    if(action.type === SUB_QUANTITY){  
        let addedItem = state.products.find(item=> item.id === action.id) 
        //if the qt == 0 then it should be removed
        if(addedItem.quantity === 1){
            let new_items = state.addedItems.filter(item=>item.id !== action.id)
            let newTotal = state.total - addedItem.price
            return {
                ...state,
                addedItems: new_items,
                total: newTotal
            }
        } else {
            addedItem.quantity -= 1
            let newTotal = state.total - addedItem.price
            return {
                ...state,
                total: newTotal
            }
        }
        
    }

    if(action.type === ADD_SHIPPING){
        return {
            ...state,
            shipping: state.shipping += 6
        }
    }

    if(action.type === 'SUB_SHIPPING'){
        return {
            ...state,
            shipping: state.shipping -= 6
        }
    }

    if(action.type === RESET_CART){
        return {
            ...state,
            addedItems: [],
            total: 0,
            shipping: 0
        }
    }
    
    else {
        return state
    }
}

export const initStore = (initialState = initState) => {
    return createStore(
        cartReducer,
        initialState,
        composeWithDevTools(applyMiddleware())
    )
}