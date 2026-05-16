import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "./Contact.css";

export default function Contact() {
  const email = "sascha.coding2406@gmail.com";
  const socials = [
    { label: "GitHub", url: "https://github.com/DolanCoding", icon: faGithub },
    { label: "LinkedIn", url: "https://linkedin.com", icon: faLinkedin },
    { label: "Discord", url: "https://discord.com/channels/@dolan.coding", icon: faDiscord },
    { label: "Email", url: `mailto:${email}`, icon: faEnvelope },
  ];

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="contact-heading">Get In Touch</h2>
          <p className="contact-subtitle">
            Have a project in mind? Let's create something amazing together.
          </p>

          <div className="contact-cta">
            <a href={`mailto:${email}`} className="contact-email">
              {email}
            </a>
          </div>

          <div className="contact-socials">
            {socials.map((social) => (
              <motion.a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
                whileHover={{ scale: 1.05 }}
              >
                <FontAwesomeIcon icon={social.icon} />
                {social.label}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
