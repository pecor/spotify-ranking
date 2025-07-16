import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

interface FooterProps {
  onLogout: () => void;
}

const currentYear = new Date().getFullYear();

const Footer: React.FC<FooterProps> = ({ onLogout }) => (
  <footer className="app-footer">
    <button onClick={onLogout} className="footer-logout-btn">
      Wyloguj się
    </button>
    <div className="footer-links">
      <a href="https://open.spotify.com/user/oz5hcfl8n7cvmzmg7u65z1aaq?si=065a511715744139" target="_blank" rel="noopener noreferrer" title="Spotify">
        <FontAwesomeIcon icon={faSpotify} size="2x"/>
      </a>
      <a href="https://github.com/pecor" target="_blank" rel="noopener noreferrer" title="GitHub">
        <FontAwesomeIcon icon={faGithub} size="2x"/>
      </a>
      {/* <a href="https://instagram.com/pecor777" target="_blank" rel="noopener noreferrer" title="Instagram">
        <FontAwesomeIcon icon={faInstagram} size="2x"/>
      </a> */}
    </div>
    <span className="footer-copyright">
      ©{currentYear} Filip Pecyna
    </span>
  </footer>
);

export default Footer;