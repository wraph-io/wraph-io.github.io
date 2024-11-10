// Define default workout data
const defaultWorkoutData = [
    {
        day: "Monday",
        focus: "Back Focus + Pull",
        exercises: [
            {
                superset: [
                    {
                        name: "Ring Rows",
                        sets: 4,
                        reps: "8-10",
                        weight: "Bodyweight",
                        description: "Perform ring rows with a neutral spine."
                    },
                    {
                        name: "Dumbbell Bent-Over Rows",
                        sets: 4,
                        reps: "8-10",
                        weight: "As per your capacity",
                        description: "Keep your back straight and hinge at the hips."
                    }
                ]
            },
            {
                name: "Pull-Ups",
                sets: 3,
                reps: "To failure",
                weight: "Bodyweight",
                description: "Perform pull-ups with full range of motion."
            },
            {
                name: "Face Pulls with Bands",
                sets: 3,
                reps: "12-15",
                weight: "Use appropriate band resistance",
                description: "Focus on squeezing the shoulder blades together."
            },
            {
                name: "Plank",
                sets: 3,
                duration: 60, // Duration in seconds
                weight: "Bodyweight",
                description: "Maintain a straight line from head to heels."
            },
            {
                name: "Cat-Cow Stretch",
                sets: 1,
                duration: 180, // Duration in seconds
                weight: "Bodyweight",
                description: "Alternate between cat and cow positions to stretch the spine."
            }
        ]
    },
    // Include other days' data as needed
];

// Use defaultWorkoutData as the initial workoutData
let workoutData = JSON.parse(JSON.stringify(defaultWorkoutData));