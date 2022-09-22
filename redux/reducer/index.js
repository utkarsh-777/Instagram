import { combineReducers } from "redux";
import { userReducer } from "./reducer";
import { users } from "./users";


const Reducers = combineReducers({
    userState : userReducer,
    usersState:users
})
export default Reducers
