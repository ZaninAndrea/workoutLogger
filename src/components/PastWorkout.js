import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const PastWorkout = ({ match }) => {
  let trainings = [];
  const loadedTrainingsString = window.localStorage.getItem("trainings");
  if (loadedTrainingsString) trainings = JSON.parse(loadedTrainingsString);

  const training = trainings.find(
    training => training.id === match.params.trainingId
  );

  if (!training) {
    return "No training found";
  }

  const renderExerciseDetails = (exercise, elevation) => (
    <Paper elevation={elevation} className="exerciseCard">
      <Typography variant="title">{exercise.name}</Typography>
      <Typography component="p">
        Reps:{exercise.reps}
        <br />
        Sets:{exercise.sets}
        <br />
        {exercise.time && (
          <React.Fragment>
            Time:{exercise.time}
            <br />
          </React.Fragment>
        )}
        {exercise.weight && (
          <React.Fragment>
            Weight:{exercise.weight}
            <br />
          </React.Fragment>
        )}
      </Typography>
    </Paper>
  );

  const exercises = training.exercises.map(exercise => {
    if (exercise.superserie) {
      return (
        <Paper elevation={4} className="exerciseCard">
          Sets:{exercise.sets}
          {exercise.exercises.map(ex => renderExerciseDetails(ex, 2))}
        </Paper>
      );
    } else {
      return renderExerciseDetails(exercise, 4);
    }
  });
  return (
    <div>
      {training.date.toString()}
      {exercises}
    </div>
  );
};

export default PastWorkout;
