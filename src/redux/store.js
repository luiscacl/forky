import { configureStore } from '@reduxjs/toolkit';
import { mealsReducer } from './meals';

export default configureStore({
    reducer: {
        meals: mealsReducer
    }
});
