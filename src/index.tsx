import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from './components';
import * as serviceWorker from "./serviceWorker";
import { NeoReact } from "./neoreact";
import { Extension } from "./neoreact/src/core";

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

/** example of redux saga implementation (doesnt work) */
const SagaSupport: Extension = {
  name: "redux-saga",
  lifecycleDesired: "pre-creation",
  type: "stateHandler",
  func: (instance: any) => {
    instance.stateHandler = (state: any[]) =>
      state.filter(({ type }) => type === "redux-saga");
  }
};

const conductor = new NeoReact<any>(
  {
    services: [
      {
        name: "player",
        state: {
          type: "redux-saga",
          props: {
            reducers: [],
            sagas: []
          }
        },
        zones: [],
        communicationMethod: "redux-saga",
        required: true
      },
    ],
    target: "#root",
    extensions: {
      reduxSaga: SagaSupport
    },
    // Maybe?
    debug: true,
    component: <App />
  },
  ReactDOM.render
);

window.conductor = conductor;

conductor.render();