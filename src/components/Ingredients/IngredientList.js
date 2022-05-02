import React from 'react';
import LoadingIndicator from '../UI/LoadingIndicator';

import './IngredientList.css';

const IngredientList = React.memo((props) => {
  const { ingredients, searching } = props;
  const onIngredientClicked = (ig) => props.onRemoveItem(ig.id);
  console.log('RENDERING INGREDIENT LIST');

  return (
    <section className="ingredient-list">
      {searching && <LoadingIndicator />}
      <h2>Loaded Ingredients</h2>
      <ul>
        {ingredients.map((ig) => (
          <li key={ig.id} onClick={() => onIngredientClicked(ig)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
});

export default IngredientList;
