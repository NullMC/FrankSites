import {
  FaHtml5, FaCss3Alt, FaBootstrap, FaReact, FaPython,
  FaJava, FaPhp, FaDatabase
} from 'react-icons/fa';
import { IoLogoJavascript } from 'react-icons/io5';
import { RiTailwindCssFill } from 'react-icons/ri';
import { FaNfcSymbol } from 'react-icons/fa6';
import { technologies } from '../content.js';

// Keep labels and order in one place: the existing portfolio content.
const icons = {
  HTML5: FaHtml5,
  CSS3: FaCss3Alt,
  JavaScript: IoLogoJavascript,
  Bootstrap: FaBootstrap,
  React: FaReact,
  'Tailwind CSS': RiTailwindCssFill,
  Python: FaPython,
  Java: FaJava,
  PHP: FaPhp,
  MySQL: FaDatabase,
  'IoT & NFC': FaNfcSymbol
};

function TechItem({ name }) {
  const Icon = icons[name];

  return (
    <li className="tech-marquee-item">
      {Icon && <Icon className="tech-marquee-icon" aria-hidden="true" focusable="false" />}
      <span>{name}</span>
    </li>
  );
}

export default function TechScroller() {
  return (
    <div className="tech-marquee" role="region" aria-label="Stack tecnico"
      aria-roledescription="scorrimento automatico" tabIndex={0}>
      <div className="tech-marquee-track">
        <ul className="tech-marquee-group">
          {technologies.map((name) => <TechItem key={name} name={name} />)}
        </ul>
        {/* Second equal-width group makes the CSS loop seamless. */}
        <ul className="tech-marquee-group" aria-hidden="true">
          {technologies.map((name) => <TechItem key={name} name={name} />)}
        </ul>
      </div>
    </div>
  );
}
