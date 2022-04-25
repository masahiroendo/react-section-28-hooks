import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIgredients, setUserIngredients] = useState([]);

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
        <IngredientList ingredients={userIgredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
};

export default Ingredients;
