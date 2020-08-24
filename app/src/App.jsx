import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import theme from "./theme";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";

import Main from "./Main";
import Onboarding from "./Onboarding";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Router>
        <div>
          <Switch>
            <Route path="/onboarding">
              <Onboarding />
            </Route>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}
