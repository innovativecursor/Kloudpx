import { createStore } from "redux";

const initialState = {
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const store = createStore(reducer);
