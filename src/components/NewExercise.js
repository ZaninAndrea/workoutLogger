import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";

class NewExercise extends Component {
  state = {
    name: "",
    time: false,
    weight: false
  };

  render() {
    return (
      <div>
        <TextField
          id="name"
          label="Name"
          value={this.state.name}
          onChange={e => this.setState({ name: e.target.value })}
          margin="normal"
        />

        <br />

        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.time}
              onChange={e => this.setState({ time: e.target.checked })}
              value="time"
            />
          }
          label="Log exercise time"
        />

        <br />

        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.weight}
              onChange={e => this.setState({ weight: e.target.checked })}
              value="weight"
            />
          }
          label="Log exercise weight"
        />
        <br />

        <Button
          variant="contained"
          onClick={() => {
            let customExercises = [];
            const loadedCustomExercises = window.localStorage.getItem(
              "exercises"
            );
            if (loadedCustomExercises)
              customExercises = JSON.parse(loadedCustomExercises);

            customExercises.push({
              name: this.state.name,
              showActiveTime: this.state.time,
              showWeight: this.weight
            });
            window.localStorage.setItem(
              "exercises",
              JSON.stringify(customExercises)
            );

            window.location.href = "/exercises"; //FIXME: this doesn't use react routers
          }}
        >
          Save
        </Button>
      </div>
    );
  }
}

export default NewExercise;
