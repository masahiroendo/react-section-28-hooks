import React, { useCallback, useState } from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';
import './IngredientForm.css';

const IngredientForm = React.memo((props) => {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState(0);

  const resetForm = () => {
    setEnteredTitle('');
    setEnteredAmount(0);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onAddIngredient({ title: enteredTitle, amount: enteredAmount });
    resetForm();
  };

  const titleChangeHandler = useCallback((event) => {
    setEnteredTitle(event.target.value);
  }, []);

  const amountChangeHandler = useCallback(({ target: { value } }) => {
    if (isNaN(value) || value === '') {
      return;
    }

    setEnteredAmount(parseInt(value));
  }, []);

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={enteredTitle} onChange={titleChangeHandler} />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={enteredAmount} onChange={amountChangeHandler} />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator />}
            <button type="button" className="reset" onClick={resetForm}>
              Reset form
            </button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
