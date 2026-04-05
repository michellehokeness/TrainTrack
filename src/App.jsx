import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import SummarySection from './components/SummarySection';
import WorkoutForm from './components/WorkoutForm';
import WorkoutHistory from './components/WorkoutHistory';
import Footer from './components/Footer';

import rocket1 from './assets/rocket-1.png';
import rocket2 from './assets/rocket-2.png';
import rocket3 from './assets/rocket-3.png';
import ship1 from './assets/spaceship-1.png';
import ship2 from './assets/spaceship-2.png';
import ship3 from './assets/spaceship-3.png';

const getLocalDate = (dateString) => {
  if (!dateString) return null;
  return new Date(`${dateString}T00:00:00`);
};

const getStartOfWeek = (date) => {
  const localDate = new Date(date);
  const day = localDate.getDay();
  const diff = localDate.getDate() - day;
  return new Date(localDate.getFullYear(), localDate.getMonth(), diff);
};

const getWeekMiles = (workouts, referenceDate = new Date()) => {
  const startOfWeek = getStartOfWeek(referenceDate);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return workouts.reduce((sum, workout) => {
    if (workout.isStrengthOnly) return sum;

    const workoutDate = getLocalDate(workout.date);

    if (workoutDate >= startOfWeek && workoutDate < endOfWeek) {
      return sum + Number(workout.distance || 0);
    }

    return sum;
  }, 0);
};

const getMilestoneFromMiles = (miles) => Math.floor(miles / 10) * 10;

function App() {
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('traintrack-workouts');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchRewardImage, setLaunchRewardImage] = useState(null);
  const [revealedMilestone, setRevealedMilestone] = useState(() =>
    getMilestoneFromMiles(
      getWeekMiles(
        (() => {
          const saved = localStorage.getItem('traintrack-workouts');
          return saved ? JSON.parse(saved) : [];
        })()
      )
    )
  );
  useEffect(() => {
    localStorage.setItem('traintrack-workouts', JSON.stringify(workouts));
  }, [workouts]);

  const thisWeekMiles = getWeekMiles(workouts);
  const currentMilestone = getMilestoneFromMiles(thisWeekMiles);
  const nextMilestone =
    thisWeekMiles < 10 ? 10 : Math.ceil(thisWeekMiles / 10) * 10;

  const getRewardImage = (milestone) => {
    if (milestone >= 60) return ship3;
    if (milestone >= 50) return ship2;
    if (milestone >= 40) return ship1;
    if (milestone >= 30) return rocket3;
    if (milestone >= 20) return rocket2;
    if (milestone >= 10) return rocket1;
    return null;
  };

  const displayedMilestone = isLaunching
    ? revealedMilestone
    : Math.min(revealedMilestone, currentMilestone);
  const hasLandedReward = !isLaunching && displayedMilestone >= 10;

  const launchReward = (milestone) => {
    const rewardImage = getRewardImage(milestone);

    if (!rewardImage) return;

    setIsLaunching(true);
    setLaunchRewardImage(rewardImage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    window.setTimeout(() => {
      setRevealedMilestone(milestone);
      setIsLaunching(false);
      setLaunchRewardImage(null);
    }, 2200);
  };

  const addWorkout = (newWorkout) => {
    setWorkouts((prev) => [...prev, newWorkout]);
  };

  const updateWorkout = (updatedWorkout) => {
    setWorkouts((prev) =>
      prev.map((workout) =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      )
    );
    setEditingWorkout(null);
  };

  const handleWorkoutSaved = (savedWorkout, { isEditing }) => {
    const previousWorkouts = workouts;
    const nextWorkouts = isEditing
      ? previousWorkouts.map((workout) =>
          workout.id === savedWorkout.id ? savedWorkout : workout
        )
      : [...previousWorkouts, savedWorkout];

    const previousMilestone = getMilestoneFromMiles(getWeekMiles(previousWorkouts));
    const nextUnlockedMilestone = getMilestoneFromMiles(getWeekMiles(nextWorkouts));

    if (nextUnlockedMilestone > previousMilestone) {
      launchReward(nextUnlockedMilestone);
    }
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
  };

  const cancelEditWorkout = () => {
    setEditingWorkout(null);
  };

  const deleteWorkout = (id) => {
    setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
  };

  return (
    <>
      {isLaunching && launchRewardImage ? (
        <div className="viewport-rocket" aria-hidden="true">
          <img src={launchRewardImage} alt="" />
        </div>
      ) : null}

      <Hero
        thisWeekMiles={thisWeekMiles}
        nextMilestone={nextMilestone}
        currentMilestone={currentMilestone}
        revealedMilestone={displayedMilestone}
        isLaunching={isLaunching}
        showLandedReward={hasLandedReward}
        rewardImage={getRewardImage(displayedMilestone)}
      />

      <main className="container main-grid">
        <SummarySection workouts={workouts} milestones={{}} />

        <section className="content-grid">
          <WorkoutForm
            key={editingWorkout ? editingWorkout.id : 'new-workout'}
            onAddWorkout={addWorkout}
            onUpdateWorkout={updateWorkout}
            editingWorkout={editingWorkout}
            onCancelEdit={cancelEditWorkout}
            onSaveWorkout={handleWorkoutSaved}
          />
          <WorkoutHistory
            workouts={workouts}
            onEditWorkout={handleEditWorkout}
            onDeleteWorkout={deleteWorkout}
          />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default App;
