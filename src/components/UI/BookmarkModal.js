
import classes from './BookmarkModal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { mealsActions } from '../../redux/meals';
import { useEffect, useRef } from 'react';
import useHttp from '../../hooks/use-http';

const xmark = <FontAwesomeIcon className={classes.xmark} icon={faXmark}/>
const triangleExclamation = <FontAwesomeIcon className={`${classes.icon}`} icon={faTriangleExclamation} />

function BookmarkModal(props){
    const { bookmarkedRecipes } = useSelector(state => state.meals);
    const bookmarkListRef = useRef(null);
    const {isLoading, error, sendRequest} = useHttp();
    const dispatch = useDispatch();

    const handleClickOutside = (event) => {
    if (bookmarkListRef.current && !bookmarkListRef.current.contains(event.target)) {
        props.closeBookmarks();
    }};

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    let isRemoveRecipeExecuted = false;

    const removeRecipe = (recipeId, event) => {
        dispatch(mealsActions.removeRecipe(recipeId));

        isRemoveRecipeExecuted = true;
    }

    const handleSelectMeal = (recipeId) => {
        if(isRemoveRecipeExecuted){
            isRemoveRecipeExecuted = false;
            return;
        }
        props.closeBookmarks();
        sendRequest(
            {url: `https://forkify-api.herokuapp.com/api/v2/recipes/${recipeId}?key=4921d73e-5fc2-47b6-90a8-dfe1ae39f7cc`}, 
            (data) => dispatch(mealsActions.addSelectedMeal({data: data, error: error, isLoading: isLoading})),
            (isLoading) => dispatch(mealsActions.addSelectedMeal({isLoading: isLoading}))
        );
    }

    const isBookmarkedRecipes = bookmarkedRecipes.length > 0;
    let recipesToRender = [];

    if(isBookmarkedRecipes){
        for (let i = 0; i < bookmarkedRecipes.length; i++) {
            const recipe = bookmarkedRecipes[i];

            recipesToRender.push(
                <div onClick={handleSelectMeal.bind(null, recipe.id)} key={recipe.id} id={recipe.id} className={classes['meal-container']}>
                    <img className={classes.img} src={recipe.image_url} alt={recipe.title}></img>
                    <div className={classes['text-container']}>
                        <h1 className={classes.title}>{recipe.title.length > 30 ? `${recipe.title.toUpperCase().slice(0, 30)}...` : recipe.title.toUpperCase()}</h1>
                        <p className={classes.description}>{recipe.publisher}</p>
                    </div>
                    <div onClick={removeRecipe.bind(null, recipe.id)}>{xmark}</div>
                </div>
            );
        }
    }
    
    return (
        <div ref={bookmarkListRef} className={classes['bookmark-list']}>
            {isBookmarkedRecipes ? recipesToRender : 
                <div className={classes['default-text-container']}>
                    <p className={classes['default-text']}>{triangleExclamation} No bookmarks yet. Find a nice recipe and bookmark it</p>
                </div>
            }
        </div>
    );
}

export default BookmarkModal;