import logo from '../assets/TrainTrack-logo.svg';
function Footer() {
  return (
    <footer>
      <img src={logo} alt="TrainTrack logo" />
      <p>mhokeness &copy; 2026</p>
      <p className="footer-note">
        Keep showing up. Your future self will thank you.
      </p>
    </footer>
  );
}

export default Footer;
