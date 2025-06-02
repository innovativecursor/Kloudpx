const init = {
  email: null,
  firstName: null,
  lastName: null,
  isLoggedIn: false,
  loading: false,
  role_id: null,
};

const reducer = (state = init, action) => {
  switch (action.type) {
    case "LOGGEDIN":
      return {
        ...state,
        email: action.payload?.email,
        firstName: action.payload?.first_name,
        lastName: action.payload?.last_name,
        role_id: action.payload?.role_id,
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
