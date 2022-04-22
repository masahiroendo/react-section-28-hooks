import React from 'react';

import './IngredientList.css';

const IngredientList = (props) => {
  const onIngredientClicked = (ig) => props.onRemoveItem(ig.id);

  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map((ig) => (
          <li key={ig.id} onClick={() => onIngredientClicked(ig)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
