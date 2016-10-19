import React from 'react';
import { Route, IndexRoute } from 'react-router';

import LandingPage from '../containers/landing-page/landing-page';
import MakePage from '../containers/make-page/make-page';

export default function configureRoutes() {
  return (
    <Route path="/">
      <IndexRoute component={LandingPage}/>
      <Route path="make/:id" component={MakePage}/>
    </Route>
  );
}


