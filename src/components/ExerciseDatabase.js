import React from "react";
import { Route, Link } from "react-router-dom";
import NewExercise from "./NewExercise";
import Exercise from "./Exercise";

const ExerciseDatabase = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/exercise-rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/exercise-components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/exercise-props-v-state`}>Props v. State</Link>
      </li>
      <li>
        <Link to={`${match.url}/new`}>Add New one</Link>
      </li>
    </ul>

    <Route path={`${match.path}/exercise-:topicId`} component={Exercise} />
    <Route path={`${match.path}/new`} component={NewExercise} />
    <Route
      exact
      path={match.path}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

export default ExerciseDatabase;
