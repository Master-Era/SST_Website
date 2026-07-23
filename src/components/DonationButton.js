import { Link } from "react-router-dom";
import "./DonationButton.css";

function DonationButton() {
  return (
    <Link className="donation-side-button" to="/donation" aria-label="Open donation page">
      Donation
    </Link>
  );
}

export default DonationButton;
