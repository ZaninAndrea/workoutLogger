import React, { Component } from "react"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Select from "@material-ui/core/Select"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import Button from "@material-ui/core/Button"
import defaultExerciseDatabase from "../utils/defaultExerciseDatabase"

const buildExercisesList = customExercises =>
    [...defaultExerciseDatabase, ...customExercises].sort((a, b) =>
        a.name === b.name ? 0 : a.name > b.name ? 1 : -1
    )

const renderExerciseDetails = (
    exercise,
    elevation,
    exerciseTemplate,
    allowSuperserie,
    updateExercise,
    updateSuperserieExerciseName,
    addSuperserieExercise,
    allExercises
) => {
    const updateExerciseName = e => {
        const exTemplate = allExercises.find(ex => ex.name === e.target.value)

        updateExercise({
            name: e.target.value,
            superserie: e.target.value === "Superserie",
            sets: 3,
            reps: e.target.value === "Superserie" ? undefined : 3,
            weight: exTemplate && exTemplate.showWeight ? 0 : undefined,
            time: exTemplate && exTemplate.showActiveTime ? 0 : undefined,
            notes: "",
            exercises:
                e.target.value === "Superserie"
                    ? [{ name: "", sets: 3 }]
                    : undefined,
        })
    }

    return (
        <Paper elevation={elevation} className="exerciseCard">
            <Select
                value={exercise.name}
                onChange={updateExerciseName}
                style={{ width: "100%" }}
                renderValue={value =>
                    value === "" ? (
                        <i>Choose an exercise</i>
                    ) : value === "Superserie" ? (
                        <b>Superserie</b>
                    ) : (
                        value
                    )
                }
                displayEmpty
            >
                <MenuItem value="" disabled>
                    Choose an exercise
                </MenuItem>
                {allowSuperserie && (
                    <MenuItem value="Superserie">
                        <b>Superserie</b>
                    </MenuItem>
                )}

                {allExercises.map(ex => (
                    <MenuItem value={ex.name}>{ex.name}</MenuItem>
                ))}
            </Select>
            <Typography component="p">
                {exercise.name !== "" && !exercise.insideSuperserie && (
                    <React.Fragment>
                        Sets:
                        <input
                            type="number"
                            value={exercise.sets}
                            onChange={e =>
                                updateExercise({
                                    sets: e.target.value,
                                })
                            }
                        />
                        <br />
                    </React.Fragment>
                )}
                {exerciseTemplate && (
                    <React.Fragment>
                        Reps:{" "}
                        <input
                            type="number"
                            value={exercise.reps}
                            onChange={e =>
                                updateExercise({
                                    reps: e.target.value,
                                })
                            }
                        />
                        <br />
                    </React.Fragment>
                )}
                {exerciseTemplate && exerciseTemplate.showActiveTime && (
                    <React.Fragment>
                        Time:{" "}
                        <input
                            type="number"
                            value={exercise.time}
                            onChange={e =>
                                updateExercise({
                                    time: e.target.value,
                                })
                            }
                        />
                        <br />
                    </React.Fragment>
                )}
                {exerciseTemplate && exerciseTemplate.showWeight && (
                    <React.Fragment>
                        Weight:{" "}
                        <input
                            type="number"
                            value={exercise.weight}
                            onChange={e =>
                                updateExercise({
                                    weight: e.target.value,
                                })
                            }
                        />
                        <br />
                    </React.Fragment>
                )}
                {exerciseTemplate && exerciseTemplate.variations.length !== 0 && (
                    <React.Fragment>
                        Variation:{" "}
                        <Select
                            value={exercise.variation}
                            onChange={e =>
                                updateExercise({
                                    variation: e.target.value,
                                })
                            }
                        >
                            {exerciseTemplate.variations.map(variation => (
                                <MenuItem value={variation}>
                                    {variation}
                                </MenuItem>
                            ))}
                        </Select>
                        <br />
                    </React.Fragment>
                )}
                {exercise.name !== "" && (
                    <React.Fragment>
                        Notes:{" "}
                        <input
                            value={exercise.notes}
                            onChange={e =>
                                updateExercise({
                                    notes: e.target.value,
                                })
                            }
                        />
                    </React.Fragment>
                )}
            </Typography>
            {exercise.superserie ? (
                <React.Fragment>
                    {exercise.exercises.map((ex, superserieExerciseIdx) =>
                        renderExerciseDetails(
                            ex,
                            2,
                            allExercises.find(
                                databaseEx => ex.name === databaseEx.name
                            ),
                            false,
                            updateSuperserieExerciseName(superserieExerciseIdx),
                            null,
                            null,
                            allExercises
                        )
                    )}
                    <Button variant="contained" onClick={addSuperserieExercise}>
                        Add exercise
                    </Button>
                </React.Fragment>
            ) : (
                ""
            )}
        </Paper>
    )
}
class NewWorkout extends Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            training: {
                id: (+new Date()).toString(), // unique id based on the number of milliseconds at the time of creation of the training
                date: new Date(),
                exercises: [
                    {
                        name: "",
                        insideSuperserie: false,
                    },
                ],
            },
        }

        fetch("https://workout-traking.herokuapp.com/exercises", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(customExercises =>
                this.setState({
                    allExercises: buildExercisesList(customExercises),
                    loading: false,
                })
            )
    }
    render() {
        if (this.state.loading) return "loading"

        const { allExercises } = this.state
        const exercises = this.state.training.exercises.map(
            (exercise, renderedExerciseIndex) => {
                // entry from ExerciseDatabase corresponding to the selected exercise
                const exerciseTemplate = allExercises.find(
                    ex => ex.name === exercise.name
                )
                const updateExercise = updateObj =>
                    this.setState(({ training }) => ({
                        training: {
                            ...training,
                            exercises: training.exercises.map((value, id) =>
                                renderedExerciseIndex === id
                                    ? {
                                          ...value,
                                          ...updateObj,
                                      }
                                    : value
                            ),
                        },
                    }))

                const updateSuperserieExercise = superserieExerciseIdx => updateObj =>
                    this.setState(({ training }) => ({
                        training: {
                            ...training,
                            exercises: training.exercises.map(
                                (superserieValue, id) =>
                                    renderedExerciseIndex === id
                                        ? {
                                              ...superserieValue,
                                              exercises: superserieValue.exercises.map(
                                                  (exValue, idx) =>
                                                      idx ===
                                                      superserieExerciseIdx
                                                          ? {
                                                                ...exValue,
                                                                ...updateObj,
                                                                insideSuperserie: true,
                                                            }
                                                          : exValue
                                              ),
                                          }
                                        : superserieValue
                            ),
                        },
                    }))

                const addSuperserieExercise = () =>
                    this.setState(({ training }) => {
                        return {
                            training: {
                                ...training,
                                exercises: training.exercises.map(
                                    (superserieValue, id) =>
                                        renderedExerciseIndex === id
                                            ? {
                                                  ...superserieValue,
                                                  exercises: [
                                                      ...superserieValue.exercises,
                                                      {
                                                          name: "",
                                                          insideSuperserie: true,
                                                      },
                                                  ],
                                              }
                                            : superserieValue
                                ),
                            },
                        }
                    })

                return renderExerciseDetails(
                    exercise,
                    4,
                    exerciseTemplate,
                    true,
                    updateExercise,
                    updateSuperserieExercise,
                    addSuperserieExercise,
                    allExercises
                )
            }
        )

        return (
            <div>
                {this.state.training.date.toString()}
                {exercises}
                <Button
                    variant="contained"
                    onClick={() =>
                        this.setState(({ training }) => ({
                            training: {
                                ...training,
                                exercises: [
                                    ...training.exercises,
                                    {
                                        name: "",
                                        insideSuperserie: false,
                                    },
                                ],
                            },
                        }))
                    }
                >
                    Add exercise
                </Button>
                <Button
                    variant="contained"
                    onClick={async () => {
                        await fetch(
                            "https://workout-traking.herokuapp.com/workout",
                            {
                                method: "POST",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(this.state.training),
                            }
                        )

                        window.location.href = "/workouts"
                    }}
                >
                    Save
                </Button>
            </div>
        )
    }
}

export default NewWorkout
