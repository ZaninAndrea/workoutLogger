import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import defaultExerciseDatabase from "../utils/defaultExerciseDatabase";

let customExercises = [];
const loadedCustomExercises = window.localStorage.getItem("exercises");
if (loadedCustomExercises) customExercises = JSON.parse(loadedCustomExercises);

const allExercises = [...defaultExerciseDatabase, ...customExercises].sort(
  (a, b) => (a.name === b.name ? 0 : a.name > b.name ? 1 : -1)
);

const renderExerciseDetails = (
  exercise,
  elevation,
  exerciseTemplate,
  allowSuperserie,
  updateExercise,
  updateSuperserieExerciseName,
  addSuperserieExercise
) => {
  const updateExerciseName = e => {
    const exTemplate = allExercises.find(ex => ex.name === e.target.value);

    updateExercise({
      name: e.target.value,
      superserie: e.target.value === "Superserie",
      sets: 3,
      reps: e.target.value === "Superserie" ? undefined : 3,
      weight: exTemplate && exTemplate.showWeight ? 0 : undefined,
      time: exTemplate && exTemplate.showActiveTime ? 0 : undefined,
      exercises:
        e.target.value === "Superserie" ? [{ name: "", sets: 3 }] : undefined
    });
  };

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

        {allExercises.map(ex => <MenuItem value={ex.name}>{ex.name}</MenuItem>)}
      </Select>
      <Typography component="p">
        {exercise.name !== "" && (
          <React.Fragment>
            Sets:{" "}
            <input
              type="number"
              value={exercise.sets}
              onChange={e =>
                updateExercise({
                  sets: e.target.value
                })
              }
            />
          </React.Fragment>
        )}

        {exerciseTemplate && (
          <React.Fragment>
            <br />Reps:{" "}
            <input
              type="number"
              value={exercise.reps}
              onChange={e =>
                updateExercise({
                  reps: e.target.value
                })
              }
            />
          </React.Fragment>
        )}
        {exerciseTemplate &&
          exerciseTemplate.showActiveTime && (
            <React.Fragment>
              <br />Time:{" "}
              <input
                type="number"
                value={exercise.time}
                onChange={e =>
                  updateExercise({
                    time: e.target.value
                  })
                }
              />
            </React.Fragment>
          )}
        {exerciseTemplate &&
          exerciseTemplate.showWeight && (
            <React.Fragment>
              <br />Weight:{" "}
              <input
                type="number"
                value={exercise.weight}
                onChange={e =>
                  updateExercise({
                    weight: e.target.value
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
              allExercises.find(databaseEx => ex.name === databaseEx.name),
              false,
              updateSuperserieExerciseName(superserieExerciseIdx)
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
  );
};
class NewWorkout extends Component {
  state = {
    training: {
      id: (+new Date()).toString(), // unique id based on the number of milliseconds at the time of creation of the training
      date: new Date(),
      exercises: [
        {
          name: ""
        }
      ]
    }
  };

  render() {
    const exercises = this.state.training.exercises.map(
      (exercise, renderedExerciseIndex) => {
        // entry from ExerciseDatabase corresponding to the selected exercise
        const exerciseTemplate = allExercises.find(
          ex => ex.name === exercise.name
        );
        const updateExercise = updateObj =>
          this.setState(({ training }) => ({
            training: {
              ...training,
              exercises: training.exercises.map(
                (value, id) =>
                  renderedExerciseIndex === id
                    ? {
                        ...value,
                        ...updateObj
                      }
                    : value
              )
            }
          }));

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
                            idx === superserieExerciseIdx
                              ? {
                                  ...exValue,
                                  ...updateObj
                                }
                              : exValue
                        )
                      }
                    : superserieValue
              )
            }
          }));

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
                            { name: "" }
                          ]
                        }
                      : superserieValue
                )
              }
            };
          });

        return renderExerciseDetails(
          exercise,
          4,
          exerciseTemplate,
          true,
          updateExercise,
          updateSuperserieExercise,
          addSuperserieExercise
        );
      }
    );

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
                    name: ""
                  }
                ]
              }
            }))
          }
        >
          Add exercise
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            let trainings = [];
            const loadedTrainingsString = window.localStorage.getItem(
              "trainings"
            );
            if (loadedTrainingsString)
              trainings = JSON.parse(loadedTrainingsString);

            trainings.push(this.state.training);
            window.localStorage.setItem("trainings", JSON.stringify(trainings));

            window.location.href = "/workouts"; //FIXME: this doesn't use react routers
          }}
        >
          Save
        </Button>
      </div>
    );
  }
}

export default NewWorkout;
