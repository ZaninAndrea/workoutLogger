import React, { Component } from "react"
import TextField from "@material-ui/core/TextField"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Button from "@material-ui/core/Button"

class NewExercise extends Component {
    state = {
        name: "",
        time: false,
        weight: false,
        variations: "",
    }

    render() {
        return (
            <div>
                Name
                <br />
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
                            onChange={e =>
                                this.setState({ time: e.target.checked })
                            }
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
                            onChange={e =>
                                this.setState({ weight: e.target.checked })
                            }
                            value="weight"
                        />
                    }
                    label="Log exercise weight"
                />
                <br />
                Variations (comma-separated)
                <br />
                <TextField
                    id="variations"
                    label="variations"
                    value={this.state.variations}
                    onChange={e =>
                        this.setState({ variations: e.target.variations })
                    }
                    margin="normal"
                />
                <br />
                <Button
                    variant="contained"
                    onClick={async () => {
                        const newExercise = {
                            name: this.state.name,
                            showActiveTime: this.state.time,
                            showWeight: this.state.weight,
                            variations: this.state.variations.split(","),
                        }

                        await fetch(
                            "https://workout-traking.herokuapp.com/exercise",
                            {
                                method: "POST",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(newExercise),
                            }
                        )

                        window.location.href = "/exercises"
                    }}
                >
                    Save
                </Button>
            </div>
        )
    }
}

export default NewExercise
