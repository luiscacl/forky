import{ createSlice } from '@reduxjs/toolkit'

const initialMealState = {fetchedMeals: {data: {}, error: null, isLoading: false}, selectedMeal: {data: {}, error: null, isLoading: false}, bookmarkedRecipes: [], refsTutorial: {}, stepsTutorial: {setInput: () => {}}};

const mealsSlice = createSlice({
    name: 'meals',
    initialState: initialMealState,
    reducers: {
        addfetchedMeals(state, action){
            if(action.payload.data) state.fetchedMeals.data = action.payload.data;
            if(action.payload.error) state.fetchedMeals.error = action.payload.error;
            state.fetchedMeals.isLoading = action.payload.isLoading;
        },
        addSelectedMeal(state, action){
            if(action.payload.data) state.selectedMeal.data = action.payload.data;
            if(action.payload.error) state.selectedMeal.error = action.payload.error;
            state.selectedMeal.isLoading = action.payload.isLoading;
        },
        bookmarkRecipe(state, action){
            state.bookmarkedRecipes = [...state.bookmarkedRecipes, action.payload];
        },
        removeRecipe(state, action){
            const updatedRecipes = [];
            state.bookmarkedRecipes.forEach((el) => {
                if(el.id !== action.payload) updatedRecipes.push(el);
            });
            state.bookmarkedRecipes = updatedRecipes;
        },
        addRefsToTutorial(state, action){
            state.refsTutorial = {...state.refsTutorial, ...action.payload};
        },
        executeStepsToTutorial(state, action){
            state.stepsTutorial = {...state.stepsTutorial, ...action.payload};
        }
    }
});

export const mealsActions = mealsSlice.actions;
export const mealsReducer = mealsSlice.reducer;