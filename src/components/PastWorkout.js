import React from "react";

const PastWorkout = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);

export default PastWorkout;
