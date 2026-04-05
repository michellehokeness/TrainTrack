import SummaryCard from './SummaryCard';

function SummarySection({ workouts = [] }) {
  const totalWorkoutCount = workouts.length;

  const totalMiles = workouts.reduce((sum, workout) => {
    return sum + Number(workout.distance || 0);
  }, 0);

  const longestWorkout = workouts.reduce((max, workout) => {
    return Math.max(max, Number(workout.distance || 0));
  }, 0);

  const getLocalDate = (dateString) => {
    if (!dateString) return null;
    return new Date(`${dateString}T00:00:00`);
  };

  const getTimeOfDayOrder = (timeOfDay) => {
    if (timeOfDay === 'AM') return 1;
    if (timeOfDay === 'Noon') return 2;
    if (timeOfDay === 'PM') return 3;
    return 0;
  };

  let mostRecentWorkout = '—';

  if (workouts.length > 0) {
    const latest = [...workouts].sort((a, b) => {
      const dateDiff = getLocalDate(b.date) - getLocalDate(a.date);
      if (dateDiff !== 0) return dateDiff;
      return getTimeOfDayOrder(b.timeOfDay) - getTimeOfDayOrder(a.timeOfDay);
    })[0];

    mostRecentWorkout = latest.type;
  }

  return (
    <section className="summary-grid" aria-label="Training summary">
      <SummaryCard
        title="Total Workouts"
        value={totalWorkoutCount}
        note="All saved training entries"
      />

      <SummaryCard
        title="Total Miles"
        value={totalMiles.toFixed(1)}
        note="Distance across all entries"
        className="totalMiles"
      />

      <SummaryCard
        title="Longest Workout"
        value={longestWorkout.toFixed(1)}
        note="Highest distance recorded"
      />

      <SummaryCard
        title="Most Recent"
        value={mostRecentWorkout}
        note="Latest entry by date"
      />
    </section>
  );
}

export default SummarySection;