const init = {
  email: null,
  firstName: null,
  lastName: null,
  isLoggedIn: false,
  loading: false,
};

const reducer = (state = init, action) => {
  switch (action.type) {
    case "LOGGEDIN":
      return {
        ...state,
        email: action.payload?.email?.String,
        isLoggedIn: true,
      };
    case "LOGGEDOUT":
      return {
        ...state,
        email: null,
        isLoggedIn: false,
      };
    case "LOADING":
      return {
        ...state,
        loading: action.payload,
      };
  }

  return state;
};
export default reducer;
