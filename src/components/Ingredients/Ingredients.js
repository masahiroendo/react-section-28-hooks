import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

export const dbUrl = 'https://react-http-13cfc-default-rtdb.europe-west1.firebasedatabase.app/ingredients';
export const JsonExtension = 'json';
const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log('Rendering Ingredients', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = async (ingredient) => {
    setIsLoading(true);
    const response = await fetch(
      'https://react-http-13cfc-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' },
      },
    );
    setIsLoading(false);

    const data = await response.json();
    setUserIngredients((prevState) => [...prevState, { id: data.name, ...ingredient }]);
  };

  const removeIngredientHandler = async (ingredientId) => {
    setIsSearching(true);
    try {
      await fetch(
        `https://react-http-13cfc-default-rtdb.europe-west1.firebasedatabase.app//ingredients/${ingredientId}.json`,
        {
          method: 'DELETE',
        },
      );
      setUserIngredients((prevState) => prevState.filter((ingredient) => ingredient.id !== ingredientId));
    } catch (error) {
      setError('Something whent merde!');
    }
    setIsSearching(false);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} searching={isSearching} />
      </section>
    </div>
  );
};

export default Ingredients;
