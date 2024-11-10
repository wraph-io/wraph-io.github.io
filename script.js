// Application state variables
let restDuration = 30; // Default rest duration in seconds
let currentWorkout;
let currentExerciseIndex = 0;
let isResting = false;
let sessionData = []; // Accumulates data over multiple sessions

const daySelect = document.getElementById('day-select');
const exerciseContainer = document.getElementById('exercise-container');

// Load custom workout data from localStorage if available
function loadCustomWorkoutData() {
    const savedWorkoutData = localStorage.getItem('workoutData');
    if (savedWorkoutData) {
        workoutData = JSON.parse(savedWorkoutData);
    } else {
        workoutData = JSON.parse(JSON.stringify(defaultWorkoutData));
    }
}

// Save custom workout data to localStorage
function saveCustomWorkoutData() {
    localStorage.setItem('workoutData', JSON.stringify(workoutData));
}

// Initialize the app
function initializeApp() {
    loadCustomWorkoutData();
    populateDaySelect();
    currentWorkout = workoutData[daySelect.value || 0];
    loadSessionData();
    updateProgressBar(); // Initialize progress bar
}

// Populate day selection dropdown
function populateDaySelect() {
    // Clear existing options
    daySelect.innerHTML = '';
    workoutData.forEach((workout, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = workout.day;
        daySelect.appendChild(option);
    });
}

// Event listener for day selection
daySelect.addEventListener('change', () => {
    if (sessionData.length > 0) {
        if (!confirm('Changing the day will reset your current session. Proceed?')) {
            daySelect.value = workoutData.findIndex(w => w.day === currentWorkout.day);
            return;
        }
        clearSessionData();
    }
    currentWorkout = workoutData[daySelect.value];
    currentExerciseIndex = 0;
    isResting = false;
    sessionData = []; // Reset session data when changing days
    displayExercise();
    updateProgressBar();
});

// Display the current exercise
function displayExercise() {
    // Update progress bar
    updateProgressBar();

    // Check if there are exercises for the selected day
    if (!currentWorkout.exercises || currentWorkout.exercises.length === 0) {
        exerciseContainer.innerHTML = '<h2>Rest Day</h2>';
        return;
    }

    const exerciseItem = currentWorkout.exercises[currentExerciseIndex];

    // Clear previous content
    exerciseContainer.innerHTML = '';

    // Display progress
    const progressText = document.createElement('div');
    progressText.id = 'progress-text';
    progressText.textContent = `Exercise ${currentExerciseIndex + 1} of ${currentWorkout.exercises.length}`;
    exerciseContainer.appendChild(progressText);

    // Rest duration input on first exercise
    if (currentExerciseIndex === 0 && !isResting) {
        const restInput = document.createElement('input');
        restInput.type = 'number';
        restInput.placeholder = 'Rest duration in seconds (default 30)';
        restInput.value = restDuration;
        restInput.id = 'rest-input';
        restInput.setAttribute('aria-label', 'Set Rest Duration');
        restInput.addEventListener('change', (e) => {
            restDuration = parseInt(e.target.value) || 30;
        });
        exerciseContainer.appendChild(restInput);
    }

    // Capture the current exercise index
    const exerciseIndex = currentExerciseIndex;

    // Handle Supersets
    if (exerciseItem.superset) {
        const supersetDiv = document.createElement('div');
        supersetDiv.classList.add('superset-group');

        const supersetLabel = document.createElement('div');
        supersetLabel.classList.add('superset-label');
        supersetLabel.textContent = 'Superset:';
        supersetDiv.appendChild(supersetLabel);

        exerciseItem.superset.forEach((exercise, idx) => {
            const exerciseDetails = createExerciseDetails(exercise, idx, exerciseIndex, true);
            supersetDiv.appendChild(exerciseDetails);
        });

        const completeBtn = document.createElement('button');
        completeBtn.id = 'complete-btn';
        completeBtn.innerHTML = '<i class="fas fa-check"></i> Complete Superset';
        completeBtn.setAttribute('aria-label', 'Complete Superset');
        completeBtn.addEventListener('click', () => completeExercise(exerciseItem.superset, exerciseIndex, true));
        supersetDiv.appendChild(completeBtn);

        exerciseContainer.appendChild(supersetDiv);
    } else {
        const exerciseDetails = createExerciseDetails(exerciseItem, 0, exerciseIndex);
        exerciseContainer.appendChild(exerciseDetails);

        if (exerciseItem.duration) {
            // Time-based exercise
            const durationInput = document.createElement('input');
            durationInput.type = 'number';
            durationInput.placeholder = `Duration in seconds (default ${exerciseItem.duration})`;
            durationInput.value = exerciseItem.duration;
            durationInput.id = `exercise-${exerciseIndex}-duration`;
            durationInput.setAttribute('aria-label', 'Enter Duration');
            exerciseContainer.appendChild(durationInput);

            const startBtn = document.createElement('button');
            startBtn.id = 'start-exercise-btn';
            startBtn.innerHTML = '<i class="fas fa-play"></i> Start Exercise';
            startBtn.setAttribute('aria-label', 'Start Exercise Timer');

            // Capture the exerciseIndex
            startBtn.addEventListener('click', () => startExerciseTimer(exerciseItem, exerciseIndex));
            exerciseContainer.appendChild(startBtn);
        } else {
            const completeBtn = document.createElement('button');
            completeBtn.id = 'complete-btn';
            completeBtn.innerHTML = '<i class="fas fa-check"></i> Complete Exercise';
            completeBtn.setAttribute('aria-label', 'Complete Exercise');

            // Capture the exerciseIndex
            completeBtn.addEventListener('click', () => completeExercise([exerciseItem], exerciseIndex));
            exerciseContainer.appendChild(completeBtn);
        }
    }

    // Skip Exercise Button
    const skipBtn = document.createElement('button');
    skipBtn.id = 'skip-btn';
    skipBtn.innerHTML = '<i class="fas fa-forward"></i> Skip Exercise';
    skipBtn.setAttribute('aria-label', 'Skip Exercise');
    skipBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to skip this exercise?')) {
            if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
                currentExerciseIndex++;
                displayExercise();
            } else {
                // Workout complete
                exerciseContainer.innerHTML = '<h2>Workout Complete!</h2>';

                const exportBtn = document.createElement('button');
                exportBtn.id = 'export-btn';
                exportBtn.innerHTML = '<i class="fas fa-file-export"></i> Export Session Data';
                exportBtn.setAttribute('aria-label', 'Export Session Data');
                exportBtn.addEventListener('click', exportSessionData);
                exerciseContainer.appendChild(exportBtn);
            }
            updateProgressBar();
        }
    });
    exerciseContainer.appendChild(skipBtn);
}

// Create exercise details for display
function createExerciseDetails(exercise, idx = 0, exerciseIndex, isSuperset = false) {
    const exerciseDetails = document.createElement('div');
    exerciseDetails.classList.add('exercise-details');

    const exerciseTitle = document.createElement('h2');
    exerciseTitle.textContent = exercise.name;
    exerciseDetails.appendChild(exerciseTitle);

    const exerciseDescription = document.createElement('p');
    exerciseDescription.textContent = exercise.description;
    exerciseDetails.appendChild(exerciseDescription);

    let exerciseInfoText = `Sets: ${exercise.sets}`;
    if (exercise.reps) {
        exerciseInfoText += `, Reps: ${exercise.reps}`;
    }
    if (exercise.duration && !exercise.reps) {
        exerciseInfoText += `, Duration: ${exercise.duration} seconds`;
    }
    exerciseInfoText += `, Weight: ${exercise.weight}`;

    const exerciseInfo = document.createElement('p');
    exerciseInfo.textContent = exerciseInfoText;
    exerciseDetails.appendChild(exerciseInfo);

    // Create input fields for each set
    for (let setNumber = 1; setNumber <= exercise.sets; setNumber++) {
        const setLabel = document.createElement('p');
        setLabel.textContent = `Set ${setNumber}:`;
        exerciseDetails.appendChild(setLabel);

        // Input for actual weight used
        const weightInput = document.createElement('input');
        weightInput.type = 'number';
        weightInput.placeholder = 'Weight used';
        weightInput.id = `exercise-${exerciseIndex}-${idx}-weight-set-${setNumber}`;
        weightInput.setAttribute('aria-label', `Enter Weight Used for Set ${setNumber}`);
        // Pre-populate with expected weight if numeric
        if (!isNaN(parseFloat(exercise.weight))) {
            weightInput.value = parseFloat(exercise.weight);
        }
        exerciseDetails.appendChild(weightInput);

        // Input for actual reps completed or duration held
        const repsOrDurationInput = document.createElement('input');
        if (exercise.duration && !exercise.reps) {
            repsOrDurationInput.type = 'number';
            repsOrDurationInput.placeholder = 'Duration held (seconds)';
            repsOrDurationInput.setAttribute('aria-label', `Enter Duration Held for Set ${setNumber}`);
            repsOrDurationInput.value = exercise.duration;
        } else {
            repsOrDurationInput.type = 'number';
            repsOrDurationInput.placeholder = 'Reps completed';
            repsOrDurationInput.setAttribute('aria-label', `Enter Reps Completed for Set ${setNumber}`);
            // Pre-populate with expected reps if numeric
            if (!isNaN(parseInt(exercise.reps))) {
                repsOrDurationInput.value = parseInt(exercise.reps);
            }
        }
        repsOrDurationInput.id = `exercise-${exerciseIndex}-${idx}-reps-set-${setNumber}`;
        exerciseDetails.appendChild(repsOrDurationInput);
    }

    return exerciseDetails;
}

// Complete the current exercise
function completeExercise(exercises, exerciseIndex, isSuperset = false) {
    let inputsValid = true;
    exercises.forEach((exercise, idx) => {
        for (let setNumber = 1; setNumber <= exercise.sets; setNumber++) {
            const weightInput = document.getElementById(`exercise-${exerciseIndex}-${idx}-weight-set-${setNumber}`);
            const repsOrDurationInput = document.getElementById(`exercise-${exerciseIndex}-${idx}-reps-set-${setNumber}`);
            const weightUsed = weightInput.value;
            const repsOrDuration = repsOrDurationInput.value;

            // Validate inputs
            if (isNaN(weightUsed) || weightUsed < 0) {
                weightInput.classList.add('input-error');
                inputsValid = false;
            } else {
                weightInput.classList.remove('input-error');
            }
            if (isNaN(repsOrDuration) || repsOrDuration <= 0) {
                repsOrDurationInput.classList.add('input-error');
                inputsValid = false;
            } else {
                repsOrDurationInput.classList.remove('input-error');
            }
        }
    });

    if (!inputsValid) {
        alert('Please enter valid numbers for all fields.');
        return;
    }

    // Proceed with recording data and moving to next exercise
    exercises.forEach((exercise, idx) => {
        for (let setNumber = 1; setNumber <= exercise.sets; setNumber++) {
            // Record inputs
            const weightUsed = document.getElementById(`exercise-${exerciseIndex}-${idx}-weight-set-${setNumber}`).value;
            const repsOrDuration = document.getElementById(`exercise-${exerciseIndex}-${idx}-reps-set-${setNumber}`).value;

            // Store the data
            const exerciseData = {
                date: new Date().toLocaleString(),
                day: currentWorkout.day,
                exercise: `${exercise.name} (Set ${setNumber})`,
                weight: weightUsed || '',
                repsOrDuration: repsOrDuration || '',
                notes: ''
            };

            sessionData.push(exerciseData);
        }
    });

    saveSessionData();

    if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
        currentExerciseIndex++;
        startRestTimer();
    } else {
        // Workout complete
        exerciseContainer.innerHTML = '<h2>Workout Complete!</h2>';

        const exportBtn = document.createElement('button');
        exportBtn.id = 'export-btn';
        exportBtn.innerHTML = '<i class="fas fa-file-export"></i> Export Session Data';
        exportBtn.setAttribute('aria-label', 'Export Session Data');
        exportBtn.addEventListener('click', exportSessionData);
        exerciseContainer.appendChild(exportBtn);
    }
    updateProgressBar();
}

// Start the timer for time-based exercises
function startExerciseTimer(exercise, exerciseIndex) {
    // Get the user-entered duration using the captured index
    const durationInput = document.getElementById(`exercise-${exerciseIndex}-duration`);
    let totalTime = parseInt(durationInput.value) || exercise.duration;
    if (isNaN(totalTime) || totalTime <= 0) {
        durationInput.classList.add('input-error');
        alert('Please enter a valid duration.');
        return;
    }
    durationInput.classList.remove('input-error');
    let timeLeft = totalTime;

    // Record the duration used
    const durationUsed = totalTime;

    // Clear previous content
    exerciseContainer.innerHTML = '';

    const exerciseNameDisplay = document.createElement('div');
    exerciseNameDisplay.id = 'exercise-name';
    exerciseNameDisplay.textContent = exercise.name;
    exerciseContainer.appendChild(exerciseNameDisplay);

    const timerDisplay = document.createElement('div');
    timerDisplay.id = 'timer-display';
    timerDisplay.textContent = timeLeft;
    exerciseContainer.appendChild(timerDisplay);

    let isPaused = false;

    const pauseBtn = document.createElement('button');
    pauseBtn.id = 'pause-btn';
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    pauseBtn.setAttribute('aria-label', 'Pause Timer');
    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseBtn.innerHTML = isPaused ? '<i class="fas fa-play"></i> Resume' : '<i class="fas fa-pause"></i> Pause';
    });
    exerciseContainer.appendChild(pauseBtn);

    const timerId = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerId);

                // Play sound
                playSound();

                // Record that the exercise was completed
                const exerciseData = {
                    date: new Date().toLocaleString(),
                    day: currentWorkout.day,
                    exercise: exercise.name,
                    weight: '', // Weight is usually bodyweight for time-based exercises
                    repsOrDuration: durationUsed,
                    notes: ''
                };

                sessionData.push(exerciseData);
                saveSessionData();

                if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
                    currentExerciseIndex++;
                    startRestTimer();
                } else {
                    // Workout complete
                    exerciseContainer.innerHTML = '<h2>Workout Complete!</h2>';

                    const exportBtn = document.createElement('button');
                    exportBtn.id = 'export-btn';
                    exportBtn.innerHTML = '<i class="fas fa-file-export"></i> Export Session Data';
                    exportBtn.setAttribute('aria-label', 'Export Session Data');
                    exportBtn.addEventListener('click', exportSessionData);
                    exerciseContainer.appendChild(exportBtn);
                }
                updateProgressBar();
            }
        }
    }, 1000);
}

// Start the rest timer between exercises
function startRestTimer() {
    isResting = true;
    let timeLeft = restDuration;

    // Update progress bar
    updateProgressBar();

    // Clear previous content
    exerciseContainer.innerHTML = '';

    const timerDisplay = document.createElement('div');
    timerDisplay.id = 'timer-display';
    timerDisplay.textContent = timeLeft;
    exerciseContainer.appendChild(timerDisplay);

    let isPaused = false;

    const pauseBtn = document.createElement('button');
    pauseBtn.id = 'pause-btn';
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    pauseBtn.setAttribute('aria-label', 'Pause Rest Timer');
    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseBtn.innerHTML = isPaused ? '<i class="fas fa-play"></i> Resume' : '<i class="fas fa-pause"></i> Pause';
    });
    exerciseContainer.appendChild(pauseBtn);

    const nextExerciseInfo = document.createElement('div');
    nextExerciseInfo.id = 'next-exercise';
    const nextExerciseItem = currentWorkout.exercises[currentExerciseIndex];
    if (nextExerciseItem.superset) {
        nextExerciseInfo.textContent = `Up Next: Superset`;
    } else {
        nextExerciseInfo.textContent = `Up Next: ${nextExerciseItem.name}`;
    }
    exerciseContainer.appendChild(nextExerciseInfo);

    const timerId = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerId);
                isResting = false;

                // Play sound
                playSound();

                displayExercise();
            }
        }
    }, 1000);
}

// Update Progress Bar
function updateProgressBar() {
    const progressElement = document.getElementById('progress');
    const totalExercises = currentWorkout.exercises.length;
    const progressPercentage = ((currentExerciseIndex + (isResting ? 0 : 1)) / totalExercises) * 100;
    progressElement.style.width = `${progressPercentage}%`;
}

// Play sound when timer ends
function playSound() {
    const audio = new Audio('beep.mp3'); // Ensure you have a beep.mp3 file in your project directory
    audio.play().catch(error => {
        console.error('Sound playback failed:', error);
    });
}

// Export session data to CSV
function exportSessionData() {
    if (!confirm('Are you sure you want to export the session data?')) {
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,Date,Day,Exercise,Weight Used,Reps/Duration,Notes\n";

    sessionData.forEach(data => {
        const row = [
            data.date,
            data.day,
            data.exercise,
            data.weight,
            data.repsOrDuration,
            data.notes
        ].join(",");
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "workout_sessions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clear session data after export
    clearSessionData();
}

// Save session data to localStorage
function saveSessionData() {
    localStorage.setItem('sessionData', JSON.stringify(sessionData));
    localStorage.setItem('currentExerciseIndex', currentExerciseIndex);
    localStorage.setItem('currentWorkoutDay', currentWorkout.day);
}

// Load session data from localStorage
function loadSessionData() {
    const savedSessionData = localStorage.getItem('sessionData');
    const savedExerciseIndex = localStorage.getItem('currentExerciseIndex');
    const savedWorkoutDay = localStorage.getItem('currentWorkoutDay');

    if (savedSessionData && savedExerciseIndex !== null && savedWorkoutDay) {
        if (confirm('Resume previous session?')) {
            sessionData = JSON.parse(savedSessionData);
            currentExerciseIndex = parseInt(savedExerciseIndex);
            const workoutIndex = workoutData.findIndex(workout => workout.day === savedWorkoutDay);
            currentWorkout = workoutData[workoutIndex];
            daySelect.value = workoutIndex;
            displayExercise();
        } else {
            clearSessionData();
            displayExercise();
        }
    } else {
        displayExercise();
    }
}

// Clear session data from localStorage
function clearSessionData() {
    localStorage.removeItem('sessionData');
    localStorage.removeItem('currentExerciseIndex');
    localStorage.removeItem('currentWorkoutDay');
    sessionData = [];
    currentExerciseIndex = 0;
    isResting = false;
}

// Exercise Editor Logic

const editExercisesBtn = document.getElementById('edit-exercises-btn');
const exerciseEditorModal = document.getElementById('exercise-editor-modal');
const closeEditorBtn = document.getElementById('close-editor-btn');
const editorContainer = document.getElementById('editor-container');

editExercisesBtn.addEventListener('click', openExerciseEditor);
closeEditorBtn.addEventListener('click', closeExerciseEditor);

function openExerciseEditor() {
    // Clear previous content
    editorContainer.innerHTML = '';

    // Create interface to edit workout data
    workoutData.forEach((workout, dayIndex) => {
        const dayHeader = document.createElement('h3');
        dayHeader.textContent = `${workout.day} (${workout.focus})`;
        editorContainer.appendChild(dayHeader);

        const exercisesList = document.createElement('div');
        exercisesList.classList.add('exercises-list');

        workout.exercises.forEach((exerciseItem, exerciseIndex) => {
            const exerciseDiv = createEditorExerciseDiv(exerciseItem, dayIndex, exerciseIndex);
            exercisesList.appendChild(exerciseDiv);
        });

        // Add New Exercise Button
        const addExerciseBtn = document.createElement('button');
        addExerciseBtn.classList.add('add-exercise-btn');
        addExerciseBtn.innerHTML = '<i class="fas fa-plus"></i> Add Exercise';
        addExerciseBtn.addEventListener('click', () => addNewExercise(dayIndex));
        exercisesList.appendChild(addExerciseBtn);

        editorContainer.appendChild(exercisesList);
    });

    // Save Exercises Button
    const saveExercisesBtn = document.createElement('button');
    saveExercisesBtn.classList.add('save-exercises-btn');
    saveExercisesBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
    saveExercisesBtn.addEventListener('click', saveExercises);
    editorContainer.appendChild(saveExercisesBtn);

    exerciseEditorModal.style.display = 'block';
}

function closeExerciseEditor() {
    exerciseEditorModal.style.display = 'none';
}

function createEditorExerciseDiv(exerciseItem, dayIndex, exerciseIndex) {
    const exerciseDiv = document.createElement('div');
    exerciseDiv.classList.add('editor-exercise');

    if (exerciseItem.superset) {
        const supersetLabel = document.createElement('p');
        supersetLabel.textContent = 'Superset:';
        exerciseDiv.appendChild(supersetLabel);

        exerciseItem.superset.forEach((exercise, idx) => {
            const exerciseFields = createExerciseFields(exercise, dayIndex, exerciseIndex, idx, true);
            exerciseDiv.appendChild(exerciseFields);
        });

        const removeSupersetBtn = document.createElement('button');
        removeSupersetBtn.classList.add('remove-exercise-btn');
        removeSupersetBtn.innerHTML = '<i class="fas fa-trash"></i> Remove Superset';
        removeSupersetBtn.addEventListener('click', () => removeExercise(dayIndex, exerciseIndex));
        exerciseDiv.appendChild(removeSupersetBtn);

    } else {
        const exerciseFields = createExerciseFields(exerciseItem, dayIndex, exerciseIndex);
        exerciseDiv.appendChild(exerciseFields);

        const removeExerciseBtn = document.createElement('button');
        removeExerciseBtn.classList.add('remove-exercise-btn');
        removeExerciseBtn.innerHTML = '<i class="fas fa-trash"></i> Remove Exercise';
        removeExerciseBtn.addEventListener('click', () => removeExercise(dayIndex, exerciseIndex));
        exerciseDiv.appendChild(removeExerciseBtn);
    }

    return exerciseDiv;
}

function createExerciseFields(exercise, dayIndex, exerciseIndex, supersetIndex = null, isSuperset = false) {
    const exerciseFields = document.createElement('div');
    exerciseFields.classList.add('exercise-fields');

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Exercise Name';
    nameInput.value = exercise.name;
    nameInput.addEventListener('input', (e) => {
        if (isSuperset) {
            workoutData[dayIndex].exercises[exerciseIndex].superset[supersetIndex].name = e.target.value;
        } else {
            workoutData[dayIndex].exercises[exerciseIndex].name = e.target.value;
        }
    });
    exerciseFields.appendChild(nameInput);

    const setsInput = document.createElement('input');
    setsInput.type = 'number';
    setsInput.placeholder = 'Sets';
    setsInput.value = exercise.sets || '';
    setsInput.addEventListener('input', (e) => {
        const value = parseInt(e.target.value) || 0;
        if (isSuperset) {
            workoutData[dayIndex].exercises[exerciseIndex].superset[supersetIndex].sets = value;
        } else {
            workoutData[dayIndex].exercises[exerciseIndex].sets = value;
        }
    });
    exerciseFields.appendChild(setsInput);

    const repsInput = document.createElement('input');
    repsInput.type = 'text';
    repsInput.placeholder = 'Reps';
    repsInput.value = exercise.reps || '';
    repsInput.addEventListener('input', (e) => {
        if (isSuperset) {
            workoutData[dayIndex].exercises[exerciseIndex].superset[supersetIndex].reps = e.target.value;
        } else {
            workoutData[dayIndex].exercises[exerciseIndex].reps = e.target.value;
        }
    });
    exerciseFields.appendChild(repsInput);

    const durationInput = document.createElement('input');
    durationInput.type = 'number';
    durationInput.placeholder = 'Duration (sec)';
    durationInput.value = exercise.duration || '';
    durationInput.addEventListener('input', (e) => {
        const value = parseInt(e.target.value) || 0;
        if (isSuperset) {
            workoutData[dayIndex].exercises[exerciseIndex].superset[supersetIndex].duration = value;
        } else {
            workoutData[dayIndex].exercises[exerciseIndex].duration = value;
        }
    });
    exerciseFields.appendChild(durationInput);

    const weightInput = document.createElement('input');
    weightInput.type = 'text';
    weightInput.placeholder = 'Weight';
    weightInput.value = exercise.weight || '';
    weightInput.addEventListener('input', (e) => {
        if (isSuperset) {
            workoutData[dayIndex].exercises[exerciseIndex].superset[supersetIndex].weight = e.target.value;
        } else {
            workoutData[dayIndex].exercises[exerciseIndex].weight = e.target.value;
        }
    });
    exerciseFields.appendChild(weightInput);

    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.placeholder = 'Description';
    descriptionInput.value = exercise.description || '';
    descriptionInput.addEventListener('input', (e) => {
        if (isSuperset) {
            workoutData[dayIndex].exercises[exerciseIndex].superset[supersetIndex].description = e.target.value;
        } else {
            workoutData[dayIndex].exercises[exerciseIndex].description = e.target.value;
        }
    });
    exerciseFields.appendChild(descriptionInput);

    return exerciseFields;
}

function addNewExercise(dayIndex) {
    const newExercise = {
        name: "New Exercise",
        sets: 3,
        reps: "10",
        weight: "",
        description: ""
    };
    workoutData[dayIndex].exercises.push(newExercise);
    openExerciseEditor();
}

function removeExercise(dayIndex, exerciseIndex) {
    if (confirm('Are you sure you want to remove this exercise?')) {
        workoutData[dayIndex].exercises.splice(exerciseIndex, 1);
        openExerciseEditor();
    }
}

function saveExercises() {
    saveCustomWorkoutData();
    populateDaySelect();
    alert('Exercises saved successfully.');
    closeExerciseEditor();
    // Reset the current workout
    currentWorkout = workoutData[daySelect.value || 0];
    currentExerciseIndex = 0;
    displayExercise();
}

// Initialize the application
initializeApp();
