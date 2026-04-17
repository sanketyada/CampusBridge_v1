import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaGithub } from 'react-icons/fa';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { title: 'Home', path: '/' },
      { title: 'Events', path: '/events' },
      { title: 'Roadmaps', path: '/roadmaps' },
      { title: 'AI Bot', path: '/ai-bot' },
    ],
    resources: [
      { title: 'Resource Library', path: '/resources' },
      { title: 'Community Feed', path: '/community' },
      { title: 'Documentation', path: '#' },
      { title: 'Help Center', path: '#' },
    ],
    company: [
      { title: 'About Us', path: '#' },
      { title: 'Careers', path: '#' },
      { title: 'Privacy Policy', path: '#' },
      { title: 'Terms of Service', path: '#' },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-xl font-semibold tracking-tight mb-6 block">
              Campus<span className="text-blue-600">Bridge</span>
            </Link>
            <p className="text-gray-500 max-w-sm mb-8">
              Empowering students in Tier 2/3 colleges with discovery, roadmaps, and AI-powered mentorship to bridge the opportunity gap.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<FaLinkedin size={20} />} href="#" />
              <SocialIcon icon={<FaGithub size={20} />} href="#" />
              <SocialIcon icon={<FaFacebook size={20} />} href="#" />
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Platform</h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link) => (
                <li key={link.title}>
                  <Link to={link.path} className="text-gray-500 hover:text-blue-600 transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Resources</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.title}>
                  <Link to={link.path} className="text-gray-500 hover:text-blue-600 transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-500">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <span>Navi Mumbai, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-blue-600 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-blue-600 shrink-0" />
                <span>support@campusbridge.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} CampusBridge. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-blue-600 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;
