import React, { useState, useEffect, useRef } from 'react';
import useHttp from '../../hooks/http';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import LoadingIndicator from '../UI/LoadingIndicator';
import './Search.css';

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [searchName, setSearchName] = useState('');
  const nameInputRef = useRef();
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchName !== nameInputRef.current.value) {
        return;
      }
      const query = searchName.length === 0 ? '' : `?orderBy="title"&equalTo="${searchName}"`;
      sendRequest(
        'https://react-http-13cfc-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json' + query,
        'GET',
      );
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchName, nameInputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [isLoading, data, error, onLoadIngredients]);

  const enteredNameHandler = (event) => {
    setSearchName(event.target.value);
  };

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>
            <b>Filter by Title</b>
          </label>
          {isLoading && <LoadingIndicator />}
          <input type="text" value={searchName} ref={nameInputRef} onChange={enteredNameHandler} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
