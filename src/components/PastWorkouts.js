import React from "react";
import { Route, Link } from "react-router-dom";
import PastWorkout from "./PastWorkout";

const PastWorkouts = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>

      <li>
        <Link to={`/newWorkout`}>Add New one</Link>
      </li>
    </ul>

    <Route path={`${match.path}/:topicId`} component={PastWorkout} />
    <Route
      exact
      path={match.path}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

export default PastWorkouts;
