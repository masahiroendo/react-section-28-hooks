import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  searching: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { ...currentHttpState, loading: true, extra: null, identifier: action.identifier };
    case 'RESPONSE':
      return { ...currentHttpState, loading: false, searching: false, data: action.responseData, extra: action.extra };
    case 'ERROR':
      return { loading: false, searching: false, error: action.errorMessage };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not be reached!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' });
  }, []);

  const sendRequest = useCallback(async (url, method, body, reqExtra, reqIdentifier) => {
    dispatchHttp({ type: 'SEND', identifier: reqIdentifier });
    try {
      const response = await fetch(url, {
        method: method,
        body: body,
        header: { 'Content-Type': 'application/json' },
      });
      const responseData = await response.json();
      dispatchHttp({ type: 'RESPONSE', responseData: responseData, extra: reqExtra });
    } catch (error) {
      dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong when removing!' });
    }
  }, []);

  return {
    isLoading: httpState.loading,
    sendRequest: sendRequest,
    data: httpState.data,
    error: httpState.error,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear: clear,
  };
};

export default useHttp;
