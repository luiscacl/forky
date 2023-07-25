import Header from './components/Header';
import MealDescription from './components/MealDescription';
import MealList from './components/MealList';
import PageTour from './components/UI/PageTour';
import classes from './App.module.css'

function App() {
  return (
    <div className={classes.app}>
      <Header/>
      <MealList/>
      <MealDescription/>
      <PageTour/>
    </div>
  );
}

export default App;
