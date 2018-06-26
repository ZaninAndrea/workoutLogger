import React from "react";
import { Link } from "react-router-dom";
import defaultExerciseDatabase from "../utils/defaultExerciseDatabase";

const Exercise = ({ match }) => {
  let customExercises = [];
  const loadedCustomExercises = window.localStorage.getItem("exercises");
  if (loadedCustomExercises)
    customExercises = JSON.parse(loadedCustomExercises);

  const exercises = [...defaultExerciseDatabase, ...customExercises];

  let trainings = [];
  const loadedTrainingsString = window.localStorage.getItem("trainings");
  if (loadedTrainingsString) trainings = JSON.parse(loadedTrainingsString);

  const exTemplate = exercises.find(ex => ex.name === match.params.topicId);

  const occurrences = trainings.reduce((acc, current) => {
    current.exercises.map(exercise => {
      if (exercise.name === match.params.topicId) {
        let volume = exercise.reps * exercise.sets;
        if (exTemplate.showActiveTime) volume *= exercise.time;
        if (exTemplate.showWeight) volume *= exercise.weight;
        acc.push({
          ...exercise,
          date: current.date,
          trainingId: current.id,
          volume
        });
      }
    });
    return acc;
  }, []);

  if (occurrences.length === 0)
    return <div>You've never done this exercise</div>;

  let bestReps, bestWeight, bestTime, bestVolume;

  bestReps = occurrences.reduce(
    (acc, curr) => (curr.reps > acc.reps ? curr : acc)
  );
  bestWeight = exTemplate.showWeight
    ? occurrences.reduce((acc, curr) => (curr.weight > acc.weight ? curr : acc))
    : null;
  bestTime = exTemplate.showActiveTime
    ? occurrences.reduce((acc, curr) => (curr.time > acc.time ? curr : acc))
    : null;
  bestVolume = occurrences.reduce(
    (acc, curr) => (curr.volume > acc.volume ? curr : acc)
  );

  return (
    <div>
      <h3>{match.params.topicId}</h3>
      <Link to={`/workouts/training-${bestReps.trainingId}`}>
        Best reps: {bestReps.reps}
      </Link>
      {bestTime && (
        <React.Fragment>
          <br />
          <Link to={`/workouts/training-${bestTime.trainingId}`}>
            Best time: {bestReps.time}
          </Link>
        </React.Fragment>
      )}
      {bestWeight && (
        <React.Fragment>
          <br />
          <Link to={`/workouts/training-${bestWeight.trainingId}`}>
            Best weight: {bestReps.weight}
          </Link>
        </React.Fragment>
      )}
      <br />
      <Link to={`/workouts/training-${bestVolume.trainingId}`}>
        Best volume: {bestReps.volume}
      </Link>
    </div>
  );
};

export default Exercise;
