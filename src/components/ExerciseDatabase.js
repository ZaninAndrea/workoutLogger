import React from "react"
import { Route, Link } from "react-router-dom"
import NewExercise from "./NewExercise"
import Exercise from "./Exercise"
import defaultExerciseDatabase from "../utils/defaultExerciseDatabase"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add"

const buildExercisesList = customExercises =>
    [...defaultExerciseDatabase, ...customExercises].sort((a, b) =>
        a.name === b.name ? 0 : a.name > b.name ? 1 : -1
    )

class ExerciseDatabase extends React.Component {
    constructor() {
        super()

        this.state = {
            loading: true,
        }

        fetch("https://workout-traking.herokuapp.com/exercises", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(res =>
                this.setState({
                    exercises: buildExercisesList(res.exercises),
                    loading: false,
                })
            )
    }

    render() {
        if (this.state.loading) {
            return "loading"
        }
        const match = this.props.match
        const exercises = this.state.exercises

        return (
            <React.Fragment>
                <Route
                    exact
                    path={match.path}
                    render={() => (
                        <React.Fragment>
                            <List component="nav">
                                {exercises.map(exercise => (
                                    <ListItem
                                        component={Link}
                                        //TODO: use slug function
                                        to={`${match.url}/exercise-${
                                            exercise.name
                                        }`}
                                        button
                                    >
                                        <ListItemText
                                            primary={exercise.name}
                                            secondary={`Clock: ${
                                                exercise.showActiveTime
                                                    ? "Yes"
                                                    : "No"
                                            } Weight: ${
                                                exercise.showWeight
                                                    ? "Yes"
                                                    : "No"
                                            }`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Button
                                variant="fab"
                                color="primary"
                                aria-label="add"
                                className="addExerciseFab"
                                component={Link}
                                to={`${match.path}/new`}
                            >
                                <AddIcon />
                            </Button>
                        </React.Fragment>
                    )}
                />
                <Route
                    path={`${match.path}/exercise-:topicId`}
                    component={Exercise}
                />
                <Route path={`${match.path}/new`} component={NewExercise} />
            </React.Fragment>
        )
    }
}

export default ExerciseDatabase
