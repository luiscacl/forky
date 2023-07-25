
import classes from './Header.module.css';
import img1 from '../images/forky.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import Searcher from './HeaderComponents/Searcher';
import BookmarkModal from './UI/BookmarkModal';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { mealsActions } from '../redux/meals';

const bookmark = <FontAwesomeIcon className={`${classes['icon-color']} ${classes.bookmarks}`} icon={faBookmark} />

function Header(){
    const [isShowBookmarks, setIsShowBookmarks] = useState(false);
    const dispatch = useDispatch(null);
    const optionsRef = useRef(null);

    useEffect(() => {
        dispatch(mealsActions.addRefsToTutorial({options: optionsRef.current}));

    }, [dispatch]);

    const showBookmarks = () => {
        setIsShowBookmarks(true);
    }

    const closeBookmarks = () => {
        setIsShowBookmarks(false);
    }

    return (
        <div className={classes.header}>
            <img className={classes.image} src={img1} alt='forky'></img>
            <Searcher/>
            <div ref={optionsRef} className={classes['recipe-book-container']}>
                {isShowBookmarks ? 
                    <div>
                        <h1 onClick={showBookmarks} className={classes.bookmarks}>{bookmark} BOOKMARKS</h1>
                    </div> :
                    <h1 onClick={showBookmarks} className={classes.bookmarks}>{bookmark} BOOKMARKS</h1>
                }
            </div>
            {isShowBookmarks ? <BookmarkModal closeBookmarks={closeBookmarks}/> : ''}
        </div>
    );
}

export default Header;
