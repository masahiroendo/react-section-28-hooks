import { useReducer, useCallback } from 'react';

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { ...currentHttpState, loading: true };
    case 'RESPONSE':
      return { ...currentHttpState, loading: false, searching: false, data: action.responseData };
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

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    searching: false,
    error: null,
    data: null,
  });

  const sendRequest = useCallback(async (url, method, body) => {
    dispatchHttp({ type: 'SEND' });
    try {
      const response = await fetch(url, {
        method: method,
        body: body,
        header: { 'Content-Type': 'application/json' },
      });
      const responseData = await response.json();
      dispatchHttp({ type: 'RESPONSE', responseData: responseData });
    } catch (error) {
      dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong when removing!' });
    }
  }, []);

  return {
    isLoading: httpState.loading,
    searching: httpState.searching,
    sendRequest: sendRequest,
    data: httpState.data,
    error: httpState.error,
  };
};

export default useHttp;
