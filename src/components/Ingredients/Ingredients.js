import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://react-http-13cfc-default-rtdb.europe-west1.firebasedatabase.app//ingredients.json',
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
      setUserIngredients(loadedIngredients);
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log('Rendering Ingredients', userIngredients);
  }, [userIngredients]);

  const addIngredientHandler = async (ingredient) => {
    const response = await fetch(
      'https://react-http-13cfc-default-rtdb.europe-west1.firebasedatabase.app//ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const data = await response.json();
    setUserIngredients((prevState) => [...prevState, { id: data.name, ...ingredient }]);
  };

  const removeIngredientHandler = (ingredientId) => {
    setUserIngredients((prevState) => prevState.filter((ingredient) => ingredient.id !== ingredientId));
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
};

export default Ingredients;
