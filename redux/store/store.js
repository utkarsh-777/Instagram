import { applyMiddleware, legacy_createStore } from "redux";
import thunk from "redux-thunk";
import Reducers from "../reducer";

export const store = legacy_createStore(Reducers , applyMiddleware(thunk));