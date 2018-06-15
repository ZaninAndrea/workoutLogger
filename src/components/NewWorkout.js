import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import defaultExerciseDatabase from "../utils/defaultExerciseDatabase";

const allExercises = defaultExerciseDatabase.sort(
  (a, b) => (a.name === b.name ? 0 : a.name > b.name ? 1 : -1)
);

const renderExerciseDetails = (
  exercise,
  elevation,
  exerciseTemplate,
  allowSuperserie,
  updateExerciseName,
  updateSuperserieExerciseName
) => (
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
      Sets: <input type="number" value={exercise.sets} />
      {exerciseTemplate && (
        <React.Fragment>
          <br />Reps: <input type="number" />
        </React.Fragment>
      )}
      {exerciseTemplate &&
        exerciseTemplate.showActiveTime && (
          <React.Fragment>
            <br />Time: <input type="number" />
          </React.Fragment>
        )}
      {exerciseTemplate &&
        exerciseTemplate.showWeight && (
          <React.Fragment>
            <br />Weight: <input type="number" />
          </React.Fragment>
        )}
    </Typography>
    {exercise.superserie
      ? exercise.exercises.map((ex, superserieExerciseIdx) =>
          renderExerciseDetails(
            ex,
            2,
            allExercises.find(databaseEx => ex.name === databaseEx.name),
            false,
            updateSuperserieExerciseName(superserieExerciseIdx)
          )
        )
      : ""}
  </Paper>
);
class NewWorkout extends Component {
  state = {
    training: {
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

        const updateExerciseName = e =>
          this.setState(({ training: { exercises } }) => {
            const exTemplate = allExercises.find(
              ex => ex.name === e.target.value
            );
            return {
              training: {
                exercises: exercises.map(
                  (value, id) =>
                    renderedExerciseIndex === id
                      ? {
                          ...value,
                          name: e.target.value,
                          superserie: e.target.value === "Superserie",
                          sets: 3,
                          reps: e.target.value === "Superserie" ? undefined : 3,
                          weight:
                            exTemplate && exTemplate.showWeight ? 0 : undefined,
                          time:
                            exTemplate && exTemplate.showActiveTime
                              ? 0
                              : undefined,
                          exercises:
                            e.target.value === "Superserie"
                              ? [{ name: "", sets: 3 }]
                              : undefined
                        }
                      : value
                )
              }
            };
          });

        const updateSuperserieExerciseName = superserieExerciseIdx => e =>
          this.setState(({ training: { exercises } }) => {
            // Exercise Database entry corresponding to the exercise being selected
            const exTemplate = allExercises.find(
              ex => ex.name === e.target.value
            );

            return {
              training: {
                exercises: exercises.map(
                  (superserieValue, id) =>
                    renderedExerciseIndex === id
                      ? {
                          ...superserieValue,
                          exercises: superserieValue.exercises.map(
                            (exValue, idx) =>
                              idx === superserieExerciseIdx
                                ? {
                                    ...exValue,
                                    name: e.target.value,
                                    sets: 3,
                                    reps: 3,
                                    weight: exTemplate.showWeight
                                      ? 0
                                      : undefined,
                                    time: exTemplate.showActiveTime
                                      ? 0
                                      : undefined
                                  }
                                : exValue
                          )
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
          updateExerciseName,
          updateSuperserieExerciseName
        );
      }
    );

    return (
      <div>
        DATE_PICKER
        {exercises}
      </div>
    );
  }
}

export default NewWorkout;
