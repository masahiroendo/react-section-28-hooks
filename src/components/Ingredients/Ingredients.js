import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

export const dbUrl = 'https://react-http-13cfc-default-rtdb.europe-west1.firebasedatabase.app/ingredients';
export const JsonExtension = 'json';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter((ig) => ig.id !== action.id);
    default:
      throw new Error('Should not be reached!');
  }
};

/*
const initialIngredientsState = {
  ingredients: [],
  loading: false
}
*/
const Ingredients = () => {
  const { isLoading, searching, data, error, sendRequest, reqExtra, reqIdentifier, clear } = useHttp();
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({ type: 'ADD', ingredient: { id: data.name, ...reqExtra } });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback(
    async (ingredient) => {
      sendRequest(
        'https://react-http-13cfc-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
        'POST',
        JSON.stringify(ingredient),
        ingredient,
        'ADD_INGREDIENT',
      );
    },
    [sendRequest],
  );

  const removeIngredientHandler = useCallback(
    async (ingredientId) => {
      sendRequest(
        `https://react-http-13cfc-default-rtdb.europe-west1.firebasedatabase.app//ingredients/${ingredientId}.json`,
        'DELETE',
        null,
        ingredientId,
        'REMOVE_INGREDIENT',
      );
    },
    [sendRequest],
  );

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} searching={searching} />
    );
  }, [userIngredients, removeIngredientHandler, searching]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
