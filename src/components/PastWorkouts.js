import React, { Component } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import PastWorkout from "./PastWorkout";
import Calendar from "react-calendar-material";
// TODO: fork calendar add dots and allow smaller width
import sampleTrainings from "../utils/sampleTrainings";

const trainings = sampleTrainings;

function sameDay(a, b) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getYear() === b.getYear()
  );
}

class PastWorkouts extends Component {
  state = {
    redirect: null
  };

  render() {
    const match = this.props.match;

    return (
      <React.Fragment>
        <Route
          path={`${match.path}/training-:trainingId`}
          component={PastWorkout}
        />
        <Route
          exact
          path={match.path}
          render={() => (
            <div>
              <Calendar
                // accentColor={"blue"}
                orientation={"flex-row"}
                showHeader={false}
                onDatePicked={d => {
                  for (const training of trainings) {
                    if (sameDay(training.date, d)) {
                      this.setState({
                        redirect: `${match.path}/training-${training.id}`
                      });
                    }
                  }
                }}
              />
              {this.state.redirect && <Redirect to={this.state.redirect} />}
            </div>
          )}
        />
      </React.Fragment>
    );
  }

  componentDidUpdate() {
    if (this.state.redirect) {
      //FIXME: this triggers a double rendering
      this.setState({ redirect: null });
    }
  }
}

export default PastWorkouts;
