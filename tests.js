QUnit.module("Workout Tracker Tests", function(hooks) {
    hooks.beforeEach(function() {
        // Reset application state before each test
        restDuration = 30;
        currentWorkout = workoutData[0];
        currentExerciseIndex = 0;
        isResting = false;
        sessionData = [];
        exerciseContainer.innerHTML = '';
        clearSessionData();
    });

    QUnit.test("Time-based exercise uses user-entered duration", function(assert) {
        // Navigate to a time-based exercise
        currentExerciseIndex = 3; // Assuming index 3 is a time-based exercise like Plank
        displayExercise();

        const exerciseIndex = currentExerciseIndex;

        const durationInput = document.getElementById(`exercise-${exerciseIndex}-duration`);
        durationInput.value = 45; // User enters 45 seconds
        const startBtn = document.getElementById('start-exercise-btn');

        assert.equal(durationInput.value, '45', "Duration input should be 45 seconds");

        const done = assert.async();

        startBtn.click();

        setTimeout(() => {
            assert.equal(sessionData.length, 1, "Session data should have one entry after time-based exercise");
            assert.equal(sessionData[0].exercise, currentWorkout.exercises[exerciseIndex].name, "Exercise name should match");
            assert.equal(sessionData[0].repsOrDuration, 45, "Reps/Duration should record the user-entered duration of 45 seconds");
            done();
        }, 2000); // Adjust the timeout as needed
    });

    QUnit.test("App proceeds after time-based exercise completes", function(assert) {
        // Navigate to a time-based exercise
        currentExerciseIndex = 3; // Assuming index 3 is a time-based exercise like Plank
        displayExercise();

        const exerciseIndex = currentExerciseIndex;

        const durationInput = document.getElementById(`exercise-${exerciseIndex}-duration`);
        durationInput.value = 1; // For testing, set duration to 1 second
        const startBtn = document.getElementById('start-exercise-btn');

        const done = assert.async();

        startBtn.click();

        setTimeout(() => {
            assert.equal(currentExerciseIndex, 4, "Should proceed to next exercise after time-based exercise");
            done();
        }, 2000);
    });

    QUnit.test("Input validation prevents invalid data submission", function(assert) {
        currentExerciseIndex = 1; // Navigate to an exercise requiring input
        displayExercise();

        const exerciseIndex = currentExerciseIndex;

        const weightInput = document.getElementById(`exercise-${exerciseIndex}-0-weight-set-1`);
        const repsInput = document.getElementById(`exercise-${exerciseIndex}-0-reps-set-1`);
        weightInput.value = -10; // Invalid weight
        repsInput.value = "abc"; // Invalid reps

        const completeBtn = document.getElementById('complete-btn');

        const done = assert.async();

        // Mock alert
        window.alert = function(message) {
            assert.ok(message.includes('Please enter valid numbers'), "Alert message displayed for invalid input");
        };

        completeBtn.click();

        setTimeout(() => {
            assert.equal(sessionData.length, 0, "Session data should not have entries after invalid input");
            done();
        }, 1000);
    });
});
