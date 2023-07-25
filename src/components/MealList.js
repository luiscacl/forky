
import classes from './MealList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { mealsActions } from '../redux/meals';
import { useEffect, useRef, useState } from 'react';
import useHttp from '../hooks/use-http';
import Loader from './UI/Loader';

const rightArrow = <FontAwesomeIcon icon={faArrowRight} />
const leftArrow = <FontAwesomeIcon icon={faArrowLeft} />

function MealList(){
    const { fetchedMeals } = useSelector(state => state.meals);
    const [renderRange, setRenderRange] = useState([0, 4]);
    const [pageNumber, setPageNumber] = useState(1);
    const mealListRef = useRef(null);

    const {error, sendRequest} = useHttp();
    const dispatch = useDispatch();

    useEffect(() => {
        setRenderRange([0, 4]);
        setPageNumber(1);
        dispatch(mealsActions.addRefsToTutorial({mealList: mealListRef.current}));

    }, [fetchedMeals, dispatch]);

    const handleSelectMeal = (recipeId) => {
        sendRequest(
            {url: `https://forkify-api.herokuapp.com/api/v2/recipes/${recipeId}?key=4921d73e-5fc2-47b6-90a8-dfe1ae39f7cc`}, 
            (data) => dispatch(mealsActions.addSelectedMeal({data: data, error: error})),
            (isLoading) => dispatch(mealsActions.addSelectedMeal({isLoading: isLoading}))
        );
    }

    const numberOfRecipesFetched = Object.keys(fetchedMeals.data).length;
    let recipesToRender = [];

    if(numberOfRecipesFetched > 1){
        recipesToRender = [];

        for (let i = 0; i < fetchedMeals.data.data.recipes.length; i++) {
            if(i < renderRange[0] || i > renderRange[1]) continue;

            const recipe = fetchedMeals.data.data.recipes[i];
            recipesToRender.push(
                <div onClick={handleSelectMeal.bind(null, recipe.id)} key={recipe.id} id={recipe.id} className={classes['meal-container']}>
                    <img className={classes.img} src={recipe['image_url']} alt={recipe.title}></img>
                    <div className={classes['text-container']}>
                        <h1 className={classes.title}>{recipe.title.length > 30 ? `${recipe.title.toUpperCase().slice(0, 30)}...` : recipe.title.toUpperCase()}</h1>
                        <p className={classes.description}>{recipe.publisher}</p>
                    </div>
                </div>
            );
        }
    }

    const renderNextPage = () => {
        setRenderRange((lastVal) => ([lastVal[0] + 5, lastVal[1] + 5]));
        setPageNumber((lastVal) => (lastVal + 1));
    }

    const renderPreviousPage = () => {
        setRenderRange((lastVal) => ([lastVal[0] - 5, lastVal[1] - 5]));
        setPageNumber((lastVal) => (lastVal - 1));
    }
    
    return (
        <div ref={mealListRef} className={classes['meal-list']}>
            <div>
                {fetchedMeals.isLoading ? <Loader/> : recipesToRender}
                {fetchedMeals.error !== null ? <div>Error to fetch data</div> : ''}
            </div>
            <div className={classes['buttons-container']}>
                {pageNumber > 1 ?
                    <button onClick={renderPreviousPage} className={classes.button}>{leftArrow} Page {pageNumber - 1}</button>
                    : ''
                }
                <div></div>
                {recipesToRender.length !== 0 && 
                recipesToRender[recipesToRender.length - 1].props.id !== fetchedMeals.data.data.recipes[fetchedMeals.data.data.recipes.length - 1].id ?
                    <button onClick={renderNextPage} className={classes.button}>Page {pageNumber + 1} {rightArrow}</button>
                    : ''
                }
            </div>
        </div>
    );
}

export default MealList;