const STORAGE_KEY = 'strideStoryWorkouts';

    const workoutForm = document.getElementById('workoutForm');
    const workoutDate = document.getElementById('workoutDate');
    const workoutType = document.getElementById('workoutType');
    const distance = document.getElementById('distance');
    const duration = document.getElementById('duration');
    const effort = document.getElementById('effort');
    const locationField = document.getElementById('location');
    const notes = document.getElementById('notes');
    const workoutList = document.getElementById('workoutList');
    const searchInput = document.getElementById('searchInput');
    const filterType = document.getElementById('filterType');
    const sortBy = document.getElementById('sortBy');
    const formHeading = document.getElementById('formHeading');
    const submitButton = document.getElementById('submitButton');
    const cancelEditButton = document.getElementById('cancelEditButton');
    const formStatus = document.getElementById('formStatus');

    const totalWorkouts = document.getElementById('totalWorkouts');
    const totalMiles = document.getElementById('totalMiles');
    const longestWorkout = document.getElementById('longestWorkout');
    const recentWorkout = document.getElementById('recentWorkout');

    let workouts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let editingId = null;

    function saveToLocalStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
    }

    function formatDisplayDate(dateString) {
      if (!dateString) return 'No date';
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }

    function setStatus(message) {
      formStatus.textContent = message;
    }

    function clearForm() {
      workoutForm.reset();
      editingId = null;
      formHeading.textContent = 'Add Workout';
      submitButton.textContent = 'Save Workout';
      setStatus('');
    }

    function fillForm(workout) {
      workoutDate.value = workout.date;
      workoutType.value = workout.type;
      distance.value = workout.distance;
      duration.value = workout.duration;
      effort.value = workout.effort;
      locationField.value = workout.location || '';
      notes.value = workout.notes || '';
      editingId = workout.id;
      formHeading.textContent = 'Edit Workout';
      submitButton.textContent = 'Update Workout';
      setStatus('Editing selected workout.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteWorkout(id) {
      const confirmed = window.confirm('Delete this workout?');
      if (!confirmed) return;

      workouts = workouts.filter((workout) => workout.id !== id);
      saveToLocalStorage();

      if (editingId === id) {
        clearForm();
      }

      renderAll();
    }

    function getFilteredWorkouts() {
      const searchTerm = searchInput.value.trim().toLowerCase();
      const selectedType = filterType.value;
      const sortValue = sortBy.value;

      let filtered = [...workouts].filter((workout) => {
        const matchesType = selectedType === 'All' || workout.type === selectedType;
        const haystack = `${workout.notes} ${workout.location} ${workout.type}`.toLowerCase();
        const matchesSearch = haystack.includes(searchTerm);
        return matchesType && matchesSearch;
      });

      filtered.sort((a, b) => {
        if (sortValue === 'oldest') {
          return new Date(a.date) - new Date(b.date);
        }
        if (sortValue === 'distanceHigh') {
          return Number(b.distance) - Number(a.distance);
        }
        if (sortValue === 'distanceLow') {
          return Number(a.distance) - Number(b.distance);
        }
        return new Date(b.date) - new Date(a.date);
      });

      return filtered;
    }

    function renderSummary() {
      totalWorkouts.textContent = workouts.length;

      const miles = workouts.reduce((sum, workout) => sum + Number(workout.distance || 0), 0);
      totalMiles.textContent = miles.toFixed(1);

      const longest = workouts.reduce((max, workout) => Math.max(max, Number(workout.distance || 0)), 0);
      longestWorkout.textContent = longest.toFixed(1);

      if (workouts.length === 0) {
        recentWorkout.textContent = '—';
        return;
      }

      const latest = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      recentWorkout.textContent = latest.type;
    }

    function renderWorkouts() {
      const filteredWorkouts = getFilteredWorkouts();

      if (filteredWorkouts.length === 0) {
        workoutList.innerHTML = `
          <div class="empty-state">
            <h3>No workouts found</h3>
            <p>Try changing your search or filter, or add your first workout entry.</p>
          </div>
        `;
        return;
      }

      workoutList.innerHTML = filteredWorkouts
        .map((workout) => {
          return `
            <article class="workout-card">
              <div class="workout-top">
                <div>
                  <h3 class="workout-title">${workout.type}</h3>
                  <p class="workout-date">${formatDisplayDate(workout.date)}${workout.location ? ' · <span class="location-badge">' + workout.location + '</span>' : ''}
</p>
                </div>
                <span class="badge">${workout.effort}</span>
              </div>

              <div class="meta-grid">
                <div class="meta-box">
                  <div class="meta-label">Distance</div>
                  <div class="meta-value">${Number(workout.distance).toFixed(1)} mi</div>
                </div>
                <div class="meta-box">
                  <div class="meta-label">Duration</div>
                  <div class="meta-value">${workout.duration}</div>
                </div>
                <div class="meta-box">
                  <div class="meta-label">Effort</div>
                  <div class="meta-value">${workout.effort}</div>
                </div>
              </div>

              <p class="notes">${workout.notes ? workout.notes : 'No notes added for this workout.'}</p>

              <div class="workout-actions">
                <button class="btn-edit" data-id="${workout.id}" data-action="edit">Edit</button>
                <button class="btn-delete" data-id="${workout.id}" data-action="delete">Delete</button>
              </div>
            </article>
          `;
        })
        .join('');
    }

    function renderAll() {
      renderSummary();
      renderWorkouts();
    }

    workoutForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const workoutData = {
        id: editingId || Date.now(),
        date: workoutDate.value,
        type: workoutType.value,
        distance: Number(distance.value),
        duration: duration.value.trim(),
        effort: effort.value,
        location: locationField.value.trim(),
        notes: notes.value.trim()
      };

      if (editingId) {
        workouts = workouts.map((workout) =>
          workout.id === editingId ? workoutData : workout
        );
        setStatus('Workout updated successfully.');
      } else {
        workouts.push(workoutData);
        setStatus('Workout saved successfully.');
      }

      saveToLocalStorage();
      clearForm();
      renderAll();
    });

    cancelEditButton.addEventListener('click', clearForm);

    workoutList.addEventListener('click', function (event) {
      const button = event.target.closest('button');
      if (!button) return;

      const id = Number(button.dataset.id);
      const action = button.dataset.action;
      const workout = workouts.find((item) => item.id === id);
      if (!workout) return;

      if (action === 'edit') {
        fillForm(workout);
      }

      if (action === 'delete') {
        deleteWorkout(id);
      }
    });

    [searchInput, filterType, sortBy].forEach((element) => {
      element.addEventListener('input', renderWorkouts);
      element.addEventListener('change', renderWorkouts);
    });

    renderAll();