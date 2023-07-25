
import React, { useEffect, useState } from 'react';
import { Tour } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import useHttp from '../../hooks/use-http';
import { mealsActions } from '../../redux/meals';

const PageTour = () => {  
  const [open, setOpen] = useState(false);
  const { refsTutorial } = useSelector(state => state.meals);
  const { stepsTutorial} = useSelector(state => state.meals);

  const dispatch = useDispatch();
  const {error, sendRequest} = useHttp();

  useEffect(() => {
    setOpen(true)
    stepsTutorial.setInput('carrot');

  }, [stepsTutorial]);

  const searchRecipe = () => {
    sendRequest(
        {url: `https://forkify-api.herokuapp.com/api/v2/recipes?search=${'carrot'}&key=4921d73e-5fc2-47b6-90a8-dfe1ae39f7cc`}, 
        (data) => dispatch(mealsActions.addfetchedMeals({data: data, error: error})),
        (isLoading) => dispatch(mealsActions.addfetchedMeals({isLoading: isLoading}))
    );
  }

  const handleSelectMeal = () => {
    sendRequest(
        {url: `https://forkify-api.herokuapp.com/api/v2/recipes/${'5ed6604591c37cdc054bca65'}?key=4921d73e-5fc2-47b6-90a8-dfe1ae39f7cc`}, 
        (data) => dispatch(mealsActions.addSelectedMeal({data: data, error: error})),
        (isLoading) => dispatch(mealsActions.addSelectedMeal({isLoading: isLoading}))
    );
  }

  const steps = [
    {
      title: 'Search for a recipe or an ingredient',
      placement: 'top',
      target: () => refsTutorial.searcher,
    },
    {
      title: 'Choose your best option',
      placement: 'right',
      target: () => refsTutorial.mealList
    },
    {
      title: 'See all the ingedients, change servings and bookmark it',
      placement: 'top',
      target: () => refsTutorial.mealDescription
    },
    {
      title: 'You can see your bookmarked recipes',
      placement: 'top',
      target: () => refsTutorial.options
    }
  ];

  const tryOnChange = (pageNumber) => {
    if(pageNumber === 1){
      searchRecipe();
    }
    if(pageNumber === 2){
      handleSelectMeal()
    }
  }

  return (
    <>
      <Tour onChange={tryOnChange} open={open} onClose={() => setOpen(false)} steps={steps} />
    </>
  );
};
export default PageTour;