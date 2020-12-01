import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import StepOne from '../pages/StepOne';
import StepTwo from '../pages/StepTwo';
import StepThree from '../pages/StepThree';
import ShowOrder from '../pages/ShowOrder';

const Routes: React.FC = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/order/step-one" />
    </Route>

    <Route path="/order/step-one" exact component={StepOne} />
    <Route path="/order/step-two" exact component={StepTwo} />
    <Route path="/order/step-three" exact component={StepThree} />
    <Route path="/order/show" exact component={ShowOrder} />
  </Switch>
);

export default Routes;
