import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import * as serviceWorker from "./serviceWorker";
import AppRouter from "./common/routes";
import "./common/style/index.scss";
import rootReducer from "./reducers";
import thunk from 'redux-thunk';
// import { initAxios } from './common/config/axios';

const store = createStore(rootReducer, applyMiddleware(thunk));

// initAxios();

ReactDOM.render(
	<Provider store={store}>
		<AppRouter />
	</Provider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
