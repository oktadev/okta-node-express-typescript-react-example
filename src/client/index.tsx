import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { LoginCallback, Security } from "@okta/okta-react";

import App from "./App";

ReactDOM.render(
  <Router>
    <Security
      issuer={`${process.env.OKTA_ORG_URL}/oauth2/default`}
      client_id={process.env.OKTA_CLIENT_ID}
      redirect_uri={`${window.location.origin}/callback`}
    >
      <Route path="/" exact component={App} />
      <Route path="/callback" component={LoginCallback} />
    </Security>
  </Router>,
  document.getElementById("root"),
);