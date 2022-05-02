import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

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

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { ...currentHttpState, loading: true };
    case 'RESPONSE':
      return { ...currentHttpState, loading: false, searching: false };
    case 'SEARCH':
      return { ...currentHttpState, searching: true };
    case 'ERROR':
      return { loading: false, searching: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...currentHttpState, error: null };
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
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  // const [userIngredients, setUserIngredients] = useState([]);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, searching: false, error: null });
  // const [isLoading, setIsLoading] = useState(false);
  // const [isSearching, setIsSearching] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    console.log('Rendering Ingredients', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback(async (ingredient) => {
    dispatchHttp({ type: 'SEND' });
    try {
      const response = await fetch(
        'https://react-http-13cfc-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
        {
          method: 'POST',
          body: JSON.stringify(ingredient),
          headers: { 'Content-Type': 'application/json' },
        },
      );
      const data = await response.json();
      // setUserIngredients((prevState) => [...prevState, { id: data.name, ...ingredient }]);
      dispatch({ type: 'ADD', ingredient: { id: data.name, ...ingredient } });
      dispatchHttp({ type: 'RESPONSE' });
    } catch (error) {
      dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wront when sending!' });
    }
  }, []);

  const removeIngredientHandler = useCallback(async (ingredientId) => {
    dispatchHttp({ type: 'SEARCH' });
    try {
      await fetch(
        `https://react-http-13cfc-default-rtdb.europe-west1.firebasedatabase.app//ingredients/${ingredientId}.json`,
        {
          method: 'DELETE',
        },
      );
      // setUserIngredients((prevState) => prevState.filter((ingredient) => ingredient.id !== ingredientId));
      dispatch({ type: 'DELETE', id: ingredientId });
    } catch (error) {
      dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong when removing!' });
    }
    dispatchHttp({ type: 'RESPONSE' });
    // setIsSearching(false);
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
        searching={httpState.searching}
      />
    );
  }, [userIngredients, removeIngredientHandler, httpState.searching]);

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
