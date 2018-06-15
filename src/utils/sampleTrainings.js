export default [
  {
    id: "0",
    date: new Date("June 14, 2018 03:24:00"),
    exercises: [
      {
        name: "Pull Up",
        reps: 6,
        sets: 3
      },
      {
        name: "Push Up (weighted)",
        reps: 8,
        sets: 3,
        weight: 10
      },
      {
        name: "German Hang",
        reps: 1,
        sets: 3,
        time: 15
      },
      {
        superserie: true,
        exercises: [
          {
            name: "Dips (bar)",
            reps: 8
          },
          {
            name: "Pull Up",
            reps: 4
          }
        ],
        sets: 3
      }
    ]
  }
];
