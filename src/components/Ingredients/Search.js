import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [searchName, setSearchName] = useState('');
  const nameInputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchName !== nameInputRef.current.value) {
        return;
      }

      const query = searchName.length === 0 ? '' : `?orderBy="title"&equalTo="${searchName}"`;
      const fetchData = async () => {
        const response = await fetch(
          'https://react-http-13cfc-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json' + query,
        );
        const responseData = await response.json();
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount,
          });
        }
        onLoadIngredients(loadedIngredients);
      };
      fetchData();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchName, onLoadIngredients, nameInputRef]);

  const enteredNameHandler = (event) => {
    setSearchName(event.target.value);
  };

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>
            <b>Filter by Title</b>
          </label>
          <input type="text" value={searchName} ref={nameInputRef} onChange={enteredNameHandler} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
