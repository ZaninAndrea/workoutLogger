import React from "react"
import { Link } from "react-router-dom"
import defaultExerciseDatabase from "../utils/defaultExerciseDatabase"
import Graph from "./Graph"

const buildExercisesList = customExercises =>
    [...defaultExerciseDatabase, ...customExercises].sort((a, b) =>
        a.name === b.name ? 0 : a.name > b.name ? 1 : -1
    )

class Exercise extends React.Component {
    constructor() {
        super()

        this.state = {
            loading: 0,
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
                this.setState(({ loading }) => ({
                    exercises: buildExercisesList(res.exercises),
                    loading: loading + 1,
                }))
            )

        fetch("https://workout-traking.herokuapp.com/workouts", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(({ workouts }) =>
                this.setState(({ loading }) => ({
                    workouts,
                    loading: loading + 1,
                }))
            )
    }

    render() {
        const match = this.props.match
        if (this.state.loading < 2) return "loading"

        const exTemplate = this.state.exercises.find(
            ex => ex.name === match.params.topicId
        )

        console.log(this.state)

        const addRelevantExercises = (
            acc,
            current,
            parentSets = null
        ) => exercise => {
            if (exercise.name === match.params.topicId) {
                let volume =
                    parentSets !== null
                        ? exercise.reps * parentSets
                        : exercise.reps * exercise.sets
                if (exTemplate.showActiveTime) volume *= exercise.time
                if (exTemplate.showWeight) volume *= exercise.weight
                acc.push({
                    ...exercise,
                    date: current.date,
                    trainingId: current._id,
                    volume,
                })
            } else if (exercise.name === "Superserie") {
                exercise.exercises.map(
                    addRelevantExercises(acc, current, exercise.sets)
                )
            }
        }
        const occurrences = this.state.workouts.reduce((acc, current) => {
            current.exercises.map(addRelevantExercises(acc, current))
            return acc
        }, [])

        if (occurrences.length === 0)
            return <div>You've never done this exercise</div>

        let bestReps = occurrences.reduce((acc, curr) =>
            curr.reps > acc.reps ? curr : acc
        )
        let bestWeight = exTemplate.showWeight
            ? occurrences.reduce((acc, curr) =>
                  curr.weight > acc.weight ? curr : acc
              )
            : null
        let bestTime = exTemplate.showActiveTime
            ? occurrences.reduce((acc, curr) =>
                  curr.time > acc.time ? curr : acc
              )
            : null
        let bestVolume = occurrences.reduce((acc, curr) =>
            curr.volume > acc.volume ? curr : acc
        )

        let timeGraphData = null
        if (exTemplate.showActiveTime) {
            timeGraphData = []
            for (let i = 0; i < occurrences.length; i++) {
                timeGraphData.push([
                    new Date(occurrences[i].date),
                    occurrences[i].time,
                    true,
                ])
            }
        }

        let weightGraphData = null
        if (exTemplate.showWeight) {
            weightGraphData = []
            for (let i = 0; i < occurrences.length; i++) {
                weightGraphData.push([
                    new Date(occurrences[i].date),
                    occurrences[i].weight,
                    true,
                ])
            }
        }

        let repsGraphData = []
        for (let i = 0; i < occurrences.length; i++) {
            repsGraphData.push([
                new Date(occurrences[i].date),
                occurrences[i].reps,
                true,
            ])
        }

        let volumeGraphData = []
        for (let i = 0; i < occurrences.length; i++) {
            volumeGraphData.push([
                new Date(occurrences[i].date),
                occurrences[i].volume,
                true,
            ])
        }

        return (
            <div>
                <h3>{match.params.topicId}</h3>
                <Link to={`/workouts/training-${bestReps.trainingId}`}>
                    Best reps: {bestReps.reps}
                </Link>
                <br />
                <Graph data={repsGraphData} />

                {bestTime && (
                    <React.Fragment>
                        <br />
                        <Link to={`/workouts/training-${bestTime.trainingId}`}>
                            Best time: {bestReps.time}
                        </Link>

                        <br />
                        <Graph data={timeGraphData} />
                    </React.Fragment>
                )}
                {bestWeight && (
                    <React.Fragment>
                        <br />
                        <Link
                            to={`/workouts/training-${bestWeight.trainingId}`}
                        >
                            Best weight: {bestReps.weight}
                            <br />
                            <Graph data={weightGraphData} />
                        </Link>
                    </React.Fragment>
                )}
                <br />
                <Link to={`/workouts/training-${bestVolume.trainingId}`}>
                    Best volume: {bestReps.volume}
                </Link>
                <br />
                <Graph data={volumeGraphData} />
                <br />
            </div>
        )
    }
}

export default Exercise
