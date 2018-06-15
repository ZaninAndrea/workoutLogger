import React from "react";
import { Route, Link } from "react-router-dom";
import NewExercise from "./NewExercise";
import Exercise from "./Exercise";
import defaultExerciseDatabase from "../utils/defaultExerciseDatabase";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const exercises = defaultExerciseDatabase.sort(
  (a, b) => (a.name === b.name ? 0 : a.name > b.name ? 1 : -1)
);

const ExerciseDatabase = ({ match }) => (
  <React.Fragment>
    <Route
      exact
      path={match.path}
      render={() => (
        <List component="nav">
          {exercises.map(exercise => (
            <ListItem
              component={Link}
              //TODO: use slug function
              to={`${match.url}/exercise-${exercise.name}`}
              button
            >
              <ListItemText
                primary={exercise.name}
                secondary={`Clock: ${
                  exercise.showActiveTime ? "Yes" : "No"
                } Weight: ${exercise.showWeight ? "Yes" : "No"}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    />
    <Route path={`${match.path}/exercise-:topicId`} component={Exercise} />
    <Route path={`${match.path}/new`} component={NewExercise} />
  </React.Fragment>
);

export default ExerciseDatabase;
