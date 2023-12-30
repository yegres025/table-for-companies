import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {useDispatch} from 'react-redux'
import companiesReducer from './companies-slice'


const rootReducer = combineReducers({
    companies: companiesReducer,
})

const store = configureStore({
    reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch : () => AppDispatch = useDispatch

export default store