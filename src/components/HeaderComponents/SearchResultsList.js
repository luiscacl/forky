
import { useRef, useEffect } from 'react';
import classes from './SearchResultsList.module.css';
import { useDispatch } from 'react-redux'
import { mealsActions } from '../../redux/meals';
import useHttp from '../../hooks/use-http';

function SearchResultsList(props){
  const resultsListRef = useRef(null);
  const dispatch = useDispatch();
  const {isLoading, error, sendRequest} = useHttp();

  useEffect(() => {
        const handleClickOutside = (event) => {
        if (resultsListRef.current && !resultsListRef.current.contains(event.target)) {
            props.setIsFocusInput(false);
        }};

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props]);
  
    const handleModalClick = (event) => {
        const meal = event.target.innerHTML;
        props.setInput(meal);
        props.setIsFocusInput(false);
        sendRequest(
            {url: `https://forkify-api.herokuapp.com/api/v2/recipes?search=${meal}&key=4921d73e-5fc2-47b6-90a8-dfe1ae39f7cc`}, 
            (data) => dispatch(mealsActions.addfetchedMeals({data: data, error: error, isLoading: isLoading})),
            (isLoading) => dispatch(mealsActions.addfetchedMeals({isLoading: isLoading}))
        );
    };

    return (
        <div ref={resultsListRef} onClick={handleModalClick} id='results-list' className={classes['results-list']}>
            {props.filteredQueries.map((word, i) => (
                <div key={i} className={classes.results}>{word}</div>
            ))}
        </div>
    );
}

export default SearchResultsList;