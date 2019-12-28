import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import { LinksPage } from "../src/pages/LinksPage";
import { CreatePage } from "./pages/CreatePage";
import { DetailPage } from "./pages/DetailPage";
import { AuthPage } from "../src/pages/AuthPage";

export const useRoutes = isAutenticated => {
  if (isAutenticated) {
    return (
      <Switch>
        <Route path="/links">
          <LinksPage />
        </Route>
        <Route path="/create" exact>
          <CreatePage />
        </Route>
        <Route path="/detail/:id">
          <DetailPage />
        </Route>
        <Redirect to="/create" />
      </Switch>
    );
  }
  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};
