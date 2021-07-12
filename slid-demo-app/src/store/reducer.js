import { PLAYVIDEOFROMTS } from "./actionTypes";

export const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case PLAYVIDEOFROMTS:
      return { ...state };
    default:
      return state;
  }
};
