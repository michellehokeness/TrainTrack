import logo from '../assets/TrainTrack-logo.svg';

function Hero({
  thisWeekMiles = 0,
  nextMilestone = 10,
  currentMilestone = 0,
  revealedMilestone = 0,
  isLaunching = false,
  showLandedReward = false,
  rewardImage = null,
  milestoneGallery = [],
}) {
  return (
    <header className="hero">
      <div className="container hero-layout">
        <div className="hero-left">
          <img
            src={logo}
            alt="TrainTrack logo"
            className="hero-logo"
          />
          <h1>
            TrainTrack <span className="eyebrow">DASHBOARD</span>
          </h1>
          <p className="hero-subtitle">
            TrainTrack lets you log your miles and strength workouts and
            celebrates your progress with a fun surprise every time your weekly
            mileage hits a NEW 10-mile milestone in a single week.
          </p>
          <span className="hero-milestone-strip">
            {milestoneGallery.length > 0 ? (
              milestoneGallery.map((item) => (
                <img
                  key={item.milestone}
                  src={item.image}
                  alt={`${item.milestone}-mile weekly milestone`}
                  className="hero-milestone-thumb"
                />
              ))
            ) : (
              <span className="hero-milestone-empty">
                Weekly milestone images will appear here.
              </span>
            )}
          </span>
        </div>

        <div className="hero-right">
          <div className="hero-week-card">
            <div className="hero-week-label">This Week</div>
            <div className="hero-week-value">{thisWeekMiles.toFixed(1)}</div>
            <div className="hero-week-note">miles</div>

            <div className="hero-week-meta">
              {isLaunching ? (
                <span className="unlock-message">Rocket launch in progress</span>
              ) : revealedMilestone >= 10 ? (
                <span>Unlocked: {revealedMilestone} mile reward</span>
              ) : currentMilestone >= 10 ? (
                <span>Reward incoming...</span>
              ) : (
                <span>Next milestone: {nextMilestone}</span>
              )}
            </div>

            <div className="hero-animation">
              {isLaunching ? (
                <div className="milestone-placeholder">Incoming reward...</div>
              ) : showLandedReward && revealedMilestone >= 10 && rewardImage ? (
                <div className="reward-home">
                  <img
                    src={rewardImage}
                    alt={`${revealedMilestone}-mile milestone reward`}
                  />
                </div>
              ) : (
                <div className="milestone-placeholder">Milestone reward zone</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;
