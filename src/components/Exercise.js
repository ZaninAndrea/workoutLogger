import React from "react";

const Exercise = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);

export default Exercise;
