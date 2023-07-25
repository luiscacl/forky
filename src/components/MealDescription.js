
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faUserGroup, faBookmark, faCirclePlus, faCircleMinus, faCheck, faArrowRight, faFaceSmile } from '@fortawesome/free-solid-svg-icons'
import classes from './MealDescription.module.css';
import { useSelector, useDispatch } from 'react-redux'
import { mealsActions } from '../redux/meals';
import Loader from './UI/Loader';
import { useEffect, useRef, useState } from 'react';
import TooltipEl from './UI/TooltipEl';

const clock = <FontAwesomeIcon className={classes.icon} icon={faClock} />
const user = <FontAwesomeIcon className={classes.icon} icon={faUserGroup} />
const bookmark = <FontAwesomeIcon className={classes.icon} icon={faBookmark} />
const faceSmile = <FontAwesomeIcon className={`${classes.icon} ${classes['happy-face']}`} icon={faFaceSmile} />
const plus = <FontAwesomeIcon className={`${classes.icon} ${classes.plus}`} icon={faCirclePlus} />
const minus = <FontAwesomeIcon className={`${classes.icon} ${classes.minus}`} icon={faCircleMinus} />
const check = <FontAwesomeIcon className={`${classes.check}`} icon={faCheck} />
const rightArrow = <FontAwesomeIcon className={classes['right-arrow']} icon={faArrowRight} />

function MealDescription(){
    const [servingsAmount, setServingsAmount] = useState(0);
    const [isTimeOverTooltip, setIsTimeOverTooltip] = useState(false);
    const { selectedMeal } = useSelector(state => state.meals);
    const { bookmarkedRecipes } = useSelector(state => state.meals);
    const dispatch = useDispatch();

    const mealDescriptionRef = useRef(null);

    useEffect(() => {
        dispatch(mealsActions.addRefsToTutorial({mealDescription: mealDescriptionRef.current}));

    }, [dispatch]);

    const isSelectedMeal = Object.keys(selectedMeal.data).length > 0;
    let meal = '';

    const increaseServing = () => {
        setServingsAmount((lastVal) => lastVal + 1);
    }

    const decreaseServing = (servings) => {
        if(servings + servingsAmount === 1) return;
        setServingsAmount((lastVal) => lastVal - 1);
    }

    let isAlreadyAdded = false;
    const addToBookmark = (recipe) => {
        bookmarkedRecipes.forEach(el => {
            if(el.id === recipe.id) isAlreadyAdded = true;
        });
        if(!isAlreadyAdded) dispatch(mealsActions.bookmarkRecipe(recipe));
        if (!isAlreadyAdded && !isTimeOverTooltip) {
            setIsTimeOverTooltip(true);
        }
        setTimeout(() => {
            setIsTimeOverTooltip(false);

        }, 1000);
    
    }

    if(isSelectedMeal){
        const recipe = selectedMeal.data.data.recipe;
        const ingredients = [];

        bookmarkedRecipes.forEach(el => {
            if(el.id === recipe.id) isAlreadyAdded = true;
        });

        for (let i = 0; i < recipe.ingredients.length; i++) {
            if(i === 9) break;
            const ingredient = recipe.ingredients[i];
            ingredients.push(
                <p key={i}>{check} {(recipe.servings + servingsAmount * ingredient.quantity) / recipe.servings} {ingredient.unit} {ingredient.description.length > 65 ? `${ingredient.description.slice(0, 30)}...` : ingredient.description}</p>
            );
        }
        meal = (
            <>
                <div className={classes.title}>
                    <h1>{recipe.title.toUpperCase()}</h1>
                </div>
                <div className={classes['img-container']}>
                    <img className={classes.img} src={recipe.image_url} alt={recipe.title}></img>
                </div>
                <div className={classes['info-container']}>
                    <div className={classes['minutes-servings']}>
                        <p>{clock} {recipe.cooking_time} MINUTES</p>
                        <p>{user} {recipe.servings + servingsAmount} SERVINGS <span onClick={decreaseServing.bind(null, recipe.servings)}>{minus}</span><span onClick={increaseServing}>{plus}</span></p>
                    </div>
                    <div onClick={addToBookmark.bind(null, recipe)} className={!isAlreadyAdded ? classes['bookmark-container-default'] : classes['bookmark-container-bookmarked']}>
                        {bookmark}
                    </div>
                </div>
                <div className={classes['ingredients-container']}>
                    <h1>RECIPE INGREDIENTS</h1>
                    {ingredients}
                    <a href={recipe.source_url} target='_blank' rel='noreferrer'>
                        <button className={classes['button-cook']}>HOW TO COOK IT {rightArrow}</button>
                    </a>
                </div>
                {isTimeOverTooltip ? <TooltipEl/> : ''}
            </>
        );
    } else {
        meal = (
            <p className={classes['default-text']}>{faceSmile} Start by searching for a recipe or an ingredient</p>
        );
    }

    return (
        <div ref={mealDescriptionRef} className={classes['meal-description']}>
            {selectedMeal.isLoading ? <div><Loader/></div> : meal}
            {selectedMeal.error !== null ? <div>Error to fetch data</div> : ''}
        </div>
    );
}

export default MealDescription;