import { useEffect, useState } from 'react';

const getInitialHours = (editingWorkout) => {
  const total = Number(editingWorkout?.duration || 0);
  return total ? Math.floor(total / 60).toString() : '';
};

const getInitialMinutes = (editingWorkout) => {
  const total = Number(editingWorkout?.duration || 0);
  return total ? (total % 60).toString() : '';
};

function WorkoutForm({
  onAddWorkout,
  onUpdateWorkout,
  editingWorkout,
  onCancelEdit,
  onSaveWorkout,
}) {
  const [workoutDate, setWorkoutDate] = useState(editingWorkout?.date || '');
  const [timeOfDay, setTimeOfDay] = useState(editingWorkout?.timeOfDay || '');
  const [workoutType, setWorkoutType] = useState(
    editingWorkout?.isStrengthOnly ? '' : editingWorkout?.type || ''
  );
  const [distance, setDistance] = useState(
    editingWorkout?.isStrengthOnly ? '' : String(editingWorkout?.distance ?? '')
  );
  const [hours, setHours] = useState(getInitialHours(editingWorkout));
  const [minutes, setMinutes] = useState(getInitialMinutes(editingWorkout));
  const [effort, setEffort] = useState(
    editingWorkout?.isStrengthOnly ? '' : editingWorkout?.effort || ''
  );
  const [location, setLocation] = useState(editingWorkout?.location || '');
  const [notes, setNotes] = useState(editingWorkout?.notes || '');
  const [didStrength, setDidStrength] = useState(
    editingWorkout?.didStrength || 'No'
  );
  const [strengthType, setStrengthType] = useState(
    editingWorkout?.strengthType || ''
  );
  const [strengthNotes, setStrengthNotes] = useState(
    editingWorkout?.strengthNotes || ''
  );
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!status) return;

    const timer = setTimeout(() => {
      setStatus('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [status]);

  const clearForm = () => {
    setWorkoutDate('');
    setTimeOfDay('');
    setWorkoutType('');
    setDistance('');
    setHours('');
    setMinutes('');
    setEffort('');
    setLocation('');
    setNotes('');
    setDidStrength('No');
    setStrengthType('');
    setStrengthNotes('');

    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hoursNum = Number(hours || 0);
    const minutesNum = Number(minutes || 0);
    const totalMinutes = hoursNum * 60 + minutesNum;

    const hasRun = workoutType !== '';
    const hasStrength = didStrength === 'Yes';
    const runDistance = Number(distance || 0);

    if (!workoutDate) {
      setStatus('Please select a date.');
      return;
    }

    if (minutesNum < 0 || minutesNum > 59) {
      setStatus('Minutes must be between 0 and 59.');
      return;
    }

    if (!hasRun && !hasStrength) {
      setStatus('Please enter a running workout or a strength workout.');
      return;
    }

    if (hasRun) {
      if (runDistance <= 0) {
        setStatus('Please enter a distance greater than 0 for your run.');
        return;
      }

      if (totalMinutes <= 0) {
        setStatus('Please enter a duration greater than 0 minutes for your run.');
        return;
      }

      if (!effort) {
        setStatus('Please select an effort for your run.');
        return;
      }
    }

    if (hasStrength && !strengthType) {
      setStatus('Please select which body area you trained.');
      return;
    }

    const newWorkout = {
      id: editingWorkout ? editingWorkout.id : Date.now(),
      date: workoutDate,
      timeOfDay,
      type: hasRun ? workoutType : 'Strength Training',
      distance: hasRun ? runDistance : 0,
      duration: hasRun ? totalMinutes : 0,
      effort: hasRun ? effort : '',
      location: location.trim(),
      notes: notes.trim(),
      didStrength,
      strengthType: hasStrength ? strengthType : '',
      strengthNotes: hasStrength ? strengthNotes.trim() : '',
      isStrengthOnly: !hasRun && hasStrength,
    };

    if (editingWorkout) {
      onUpdateWorkout(newWorkout);
      setStatus('Workout updated successfully.');
    } else {
      onAddWorkout(newWorkout);
      setStatus('Workout saved successfully.');
    }

    if (onSaveWorkout) {
      onSaveWorkout(newWorkout, { isEditing: Boolean(editingWorkout) });
    }

    clearForm();
  };

  const handleStrengthChange = (e) => {
    const value = e.target.value;
    setDidStrength(value);

    if (value === 'No') {
      setStrengthType('');
      setStrengthNotes('');
    }
  };

  return (
    <aside className="card panel workout-panel">
      <h2>{editingWorkout ? 'Edit Workout' : 'Add Workout'}</h2>
      <p className="panel-intro">
        Log your running workout and/or your strength session.
      </p>

      <form onSubmit={handleSubmit}>
        <section className="form-section">
          <h3 className="section-heading">Running Workout</h3>

          <div className="field-row">
            <div className="field-group">
            <label htmlFor="workoutDate">Date</label>
            <input
              type="date"
              id="workoutDate"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
          <label htmlFor="timeOfDay">Time of Day</label>
          <select
            id="timeOfDay"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
          >
            <option value="">Select one</option>
            <option value="AM">AM</option>
            <option value="Noon">Noon</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

          <div className="field-group">
            <label htmlFor="workoutType">Workout Type</label>
            <select
              id="workoutType"
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
            >
              <option value="">Select a workout type</option>
              <option value="Easy Run">Easy Run</option>
              <option value="Long Run">Long Run</option>
              <option value="Threshold">Threshold</option>
              <option value="Intervals">Intervals</option>
              <option value="Recovery Run">Recovery Run</option>
            </select>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label htmlFor="distance">Distance (miles)</label>
              <input
                type="number"
                id="distance"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Duration</label>
              <div className="duration-group">
                <input
                  type="number"
                  id="hours"
                  min="0"
                  placeholder="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
                <span className="duration-label">hr</span>

                <input
                  type="number"
                  id="minutes"
                  min="0"
                  max="59"
                  placeholder="00"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
                <span className="duration-label">min</span>
              </div>
            </div>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label htmlFor="effort">Effort</label>
              <select
                id="effort"
                value={effort}
                onChange={(e) => setEffort(e.target.value)}
              >
                <option value="">Select effort</option>
                <option value="Very Easy">Very Easy</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
                <option value="Very Hard">Very Hard</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                placeholder="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              placeholder="How did the workout feel?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </section>

        <section className="form-section strength-section">
          <h3 className="section-heading">Strength Training</h3>

          <div className="field-row">
            <div className="field-group">
              <label htmlFor="didStrength">Did you strength train?</label>
              <select
                id="didStrength"
                value={didStrength}
                onChange={handleStrengthChange}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="strengthType">Which body?</label>
              <select
                id="strengthType"
                value={strengthType}
                onChange={(e) => setStrengthType(e.target.value)}
                disabled={didStrength !== 'Yes'}
              >
                <option value="">Select one</option>
                <option value="Full Body">Full Body</option>
                <option value="Upper Body">Upper Body</option>
                <option value="Lower Body">Lower Body</option>
                <option value="Core">Core</option>
              </select>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="strengthNotes">Strength Notes</label>
            <textarea
              id="strengthNotes"
              placeholder="What did you work on and for how long?"
              value={strengthNotes}
              onChange={(e) => setStrengthNotes(e.target.value)}
              disabled={didStrength !== 'Yes'}
            />
          </div>
        </section>

        <p className="status">{status}</p>

        <div className="button-row">
          <button type="submit" className="btn-primary">
            {editingWorkout ? 'Update Workout' : 'Save Workout'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={clearForm}
          >
            Clear Form
          </button>
        </div>
      </form>
    </aside>
  );
}

export default WorkoutForm;
