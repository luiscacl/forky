import classes from './Searcher.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { mealsActions } from '../../redux/meals';
import SearchResultsList from './SearchResultsList';
import useHttp from '../../hooks/use-http';

const glass = <FontAwesomeIcon className={classes.search} icon={faMagnifyingGlass} />
const queries = ['carrot', 'broccoli', 'asparagus', 'cauliflower', 'corn', 'cucumber', 'green pepper', 'lettuce', 'mushrooms', 'onion', 'potato', 'pumpkin', 'red pepper', 'tomato', 'beetroot', 'brussel sprouts', 'peas', 'zucchini', 'radish', 'sweet potato', 'artichoke', 'leek', 'cabbage', 'celery', 'garlic', 'basil', 'coriander', 'parsley', 'dill', 'rosemary', 'oregano', 'cinnamon', 'saffron', 'green bean', 'bean', 'chickpea', 'lentil', 'apple', 'apricot', 'avocado', 'banana', 'blackberry', 'blackcurrant', 'blueberry', 'boysenberry', 'cherry', 'coconut', 'fig', 'grape', 'grapefruit', 'kiwifruit', 'lemon', 'lime', 'lychee', 'mandarin', 'mango', 'melon', 'nectarine', 'orange', 'papaya', 'passion fruit', 'peach', 'pear', 'pineapple', 'plum', 'pomegranate', 'quince', 'raspberry', 'strawberry', 'watermelon', 'salad', 'pizza', 'pasta', 'popcorn', 'lobster', 'steak', 'bbq', 'pudding', 'hamburger', 'pie', 'cake', 'sausage', 'tacos', 'kebab', 'poutine', 'seafood', 'chips', 'fries', 'masala', 'paella', 'som tam', 'chicken', 'toast', 'marzipan', 'tofu', 'ketchup', 'hummus', 'chili', 'maple syrup', 'parma ham', 'fajitas', 'champ', 'lasagna', 'poke', 'chocolate', 'croissant', 'arepas', 'bunny chow', 'pierogi', 'donuts', 'rendang', 'sushi', 'ice cream', 'duck', 'curry', 'beef', 'goat', 'lamb', 'turkey', 'pork', 'fish', 'crab', 'bacon', 'ham', 'pepperoni', 'salami', 'ribs'];

function Searcher(){
    const [input, setInput] = useState('');
    const [filterQueries, setFilterQueries] = useState([...queries]);
    const [isFocusInput, setIsFocusInput] = useState(false);
    
    const searcherRef = useRef(null);
    const {error, sendRequest} = useHttp();
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(mealsActions.addRefsToTutorial({searcher: searcherRef.current}));
        dispatch(mealsActions.executeStepsToTutorial({setInput: setInput}));

    }, [dispatch]);

    const handleSearch = (event) => {
        const inputValue = event.target.value;
        setIsFocusInput(true)
        setInput(inputValue);
        setFilterQueries(() => {
            let filteredQueries = [];

            queries.forEach((word) => {
                for (let i = 0; i < word.length; i++) {
                    const char = word[i];
                    if(char !== inputValue[i]) break;
                    if(inputValue.length - 1 === i) filteredQueries.push(word);
                }
            });
            return filteredQueries;
        });
    }    

    const searchRecipe = (event) => {
        if(event !== null) event.preventDefault();
        sendRequest(
            {url: `https://forkify-api.herokuapp.com/api/v2/recipes?search=${input}&key=4921d73e-5fc2-47b6-90a8-dfe1ae39f7cc`}, 
            (data) => dispatch(mealsActions.addfetchedMeals({data: data, error: error})),
            (isLoading) => dispatch(mealsActions.addfetchedMeals({isLoading: isLoading}))
        );
    }

    const handleFocusIn = () => {
        const event = {target: {value: input}};
        handleSearch(event);
    }

    return (
        <form ref={searcherRef} className={classes.form}>
            <input value={input} onFocus={handleFocusIn} onChange={handleSearch} className={classes.input} placeholder='Search your favorite recipe' type='text' id='site-search' autoComplete="off"></input>
            <button className={classes.button} onClick={searchRecipe}>{glass} SEARCH</button>
            {input === '' || filterQueries.length === 0 || !isFocusInput ? '' : 
            <SearchResultsList 
                filteredQueries={filterQueries} 
                setIsFocusInput={setIsFocusInput} 
                setInput={setInput}
            />}    
        </form>
    );
}

export default Searcher;