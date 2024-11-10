// Define default workout data
const defaultWorkoutData = [
    {
        day: "Monday",
        focus: "Back Focus + Pull",
        exercises: [
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
                duration: 30, // Duration in seconds
                weight: "Bodyweight",
                description: "Alternate between cat and cow positions to stretch the spine."
            },
            {
                name: "Child pose Stretch",
                sets: 1,
                duration: 30, // Duration in seconds
                weight: "Bodyweight",
                description: "Child pose."

            },
        ],
    },
    {
        day: "Tuesday",
        focus: "Push Focus + Core",
        exercises: [
            {
                name: "Push-Ups on Parallettes",
                sets: 4,
                reps: "8-12",
                weight: "Bodyweight",
                description: "Keep your body straight and lower chest between parallettes."
            },
            {
                name: "Ring Dips",
                sets: 3,
                reps: "8-10",
                weight: "Bodyweight",
                description: "Lower yourself until shoulders are below elbows."
            },
            {
                name: "Dumbbell Floor Press",
                sets: 4,
                reps: "8-10",
                weight: "As per your capacity",
                description: "Press dumbbells from chest upwards while lying on the floor."
            },
            {
                name: "Handstand Push-Ups or Pike Push-Ups",
                sets: 3,
                reps: "6-8",
                weight: "Bodyweight",
                description: "Perform against a wall or in pike position for shoulder strength."
            },
            {
                name: "Plank Holds (Front and Sides)",
                sets: 3,
                reps: "60 seconds",
                duration: 60,
                weight: "N/A",
                description: "Maintain a straight line from head to heels."
            },
            {
                name: "Isometric Wall Sits",
                sets: 3,
                reps: "60 seconds",
                duration: 60,
                weight: "Bodyweight",
                description: "Slide down a wall until knees are at 90 degrees."
            },

            {
                name: "Cobra Stretch",
                sets: 1,
                reps: "30 seconds",
                duration: 30,
                weight: "N/A",
                description: "Lie face down and lift chest upwards."
            },
            {
                name: "Quadriceps Stretch",
                sets: 2,
                reps: "30 seconds each side",
                duration: 30,
                weight: "N/A",
                description: "Stand and pull one foot towards your glutes."

            },
        ],
    },
    {
        day: "Wednesday",
        focus: "Lower Body + Postural Balance",
        exercises: [
            {
                name: "Goblet Squats with Dumbbells",
                sets: 4,
                reps: "8-10",
                weight: "As per your capacity",
                description: "Hold a dumbbell at chest level and squat."
            },
            {
                name: "Bulgarian Split Squats",
                sets: 3,
                reps: "10-12 each leg",
                weight: "Bodyweight or light dumbbells",
                description: "Place back foot on a bench and squat with front leg."
            },
            {
                name: "Romanian Deadlifts",
                sets: 4,
                reps: "8-10",
                weight: "As per your capacity",
                description: "Hinge at hips with slight knee bend and lower weights down."
            },
            {
                name: "Eccentric Step-Downs",
                sets: 3,
                reps: "8-10 each leg",
                weight: "Bodyweight",
                description: "Slowly lower yourself from a step, controlling the descent."
            },
            {
                name: "Isometric Wall Sits",
                sets: 3,
                reps: "45 seconds",
                duration: 45,
                weight: "Bodyweight",
                description: "Maintain a seated position against the wall."
            },
            {
                name: "Band-Resisted Side Steps",
                sets: 3,
                reps: "12-15 each side",
                weight: "Resistance band",
                description: "Step sideways against the resistance of the band."
            },
            {
                name: "Standing Calf Raises",
                sets: 4,
                reps: "15-20",
                weight: "Bodyweight or light weights",
                description: "Raise heels off the ground, standing on toes."
            },

            {
                name: "Hip Flexor Stretch",
                sets: 2,
                reps: "30 seconds each side",
                duration: 30,
                weight: "N/A",
                description: "Kneel and push hips forward to stretch the hip flexor."

            },
        ],
    },
    {
        day: "Thursday",
        focus: "Rest Day",
        exercises: []
    },
    {
        day: "Friday",
        focus: "Full Body + Mobility",
        exercises: [
            {
                name: "Pull-Up Variations",
                sets: 3,
                reps: "6-8",
                weight: "Bodyweight",
                description: "Perform different grip pull-ups."
            },
            {
                name: "Dumbbell Overhead Press",
                sets: 4,
                reps: "8-10",
                weight: "As per your capacity",
                description: "Press dumbbells overhead while standing."
            },
            {
                name: "Ring Push-Ups or Decline Push-Ups",
                sets: 3,
                reps: "8-12",
                weight: "Bodyweight",
                description: "Perform push-ups on rings or with feet elevated."
            },
            {
                name: "Dumbbell Thrusters",
                sets: 4,
                reps: "8-10",
                weight: "As per your capacity",
                description: "Squat down and then press dumbbells overhead as you stand."
            },
            {
                name: "Dead Bug (Core Stabilization)",
                sets: 3,
                reps: "12-15",
                weight: "N/A",
                description: "Lie on back and move opposite arm and leg simultaneously."
            },
            {
                name: "Eccentric Squats",
                sets: 3,
                reps: "8-10",
                weight: "Bodyweight or light weights",
                description: "Lower into squat slowly to focus on the eccentric phase."
            },
            {
                name: "Chin Tucks",
                sets: 3,
                reps: "10",
                weight: "N/A",
                description: "Pull chin back to align ears over shoulders."
            },
        ],
    },
    {
        name: "Doorway Stretch",
        sets: 1,
        reps: "30 seconds",
        duration: 30,
        weight: "N/A",
        description: "Stretch chest muscles by placing arms on doorframe and leaning forward."

    },
    {
        day: "Saturday",
        focus: "Core and Muscle-Up Practice",
        exercises: [
            {
                name: "Hanging Leg Raises",
                sets: 3,
                reps: "8-12",
                weight: "Bodyweight",
                description: "Hang from a bar and lift legs to hip level or higher."
            },
            {
                name: "Russian Twists",
                sets: 3,
                reps: "15-20 each side",
                weight: "Bodyweight or light weight",
                description: "Sit with torso leaned back and twist side to side."
            },
            {
                name: "Plank Variations",
                sets: 3,
                reps: "30-45 seconds",
                weight: "N/A",
                description: "Hold standard or side plank positions."
            },
            {
                name: "Bicycle Crunches",
                sets: 3,
                reps: "15-20",
                weight: "N/A",
                description: "Alternate opposite elbow to knee in a cycling motion."
            },
            {
                name: "Explosive Pull-Ups",
                sets: 4,
                reps: "3-5",
                weight: "Bodyweight",
                description: "Pull up explosively aiming to get chest to bar."
            },
            {
                name: "Dips (Rings if available)",
                sets: 4,
                reps: "8-10",
                weight: "Bodyweight",
                description: "Lower until shoulders are below elbows and press back up."
            },
            {
                name: "Straight Arm Strength Work",
                sets: 2,
                reps: "10-15 seconds",
                weight: "Bodyweight",
                description: "Perform scapular pull-ups or isometric holds."
            },
            {
                name: "Transition Practice",
                sets: 3,
                reps: "As needed",
                weight: "Bodyweight",
                description: "Practice the muscle-up transition movement."
            },
        ],
    },
    {
        day: "Sunday",
        focus: "Rest Day",
        exercises: []
    },
];

// Use defaultWorkoutData as the initial workoutData
let workoutData = JSON.parse(JSON.stringify(defaultWorkoutData));