import { configureStore } from "@reduxjs/toolkit";

import todosReducer from "../features/todos/todosSlice.js";

export default configureStore({
  reducer: {
    todos: todosReducer,
  },
});
