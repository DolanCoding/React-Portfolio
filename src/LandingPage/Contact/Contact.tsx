import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "./Contact.css";

const VP = { once: false, amount: 0.05 };
const ease = [0.34, 1.56, 0.64, 1] as const;

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
      <motion.div
        className="contact-container"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: 0.65, delay: 0.1, ease }}
      >
        <motion.h2
          className="contact-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.8, delay: 0.15, ease }}
        >
          Get In Touch
        </motion.h2>

        <motion.p
          className="contact-subtitle"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.55, delay: 0.25, ease }}
        >
          Have a project in mind? Let's create something amazing together.
        </motion.p>

        <motion.div
          className="contact-cta"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          viewport={VP}
          transition={{ duration: 0.55, delay: 0.3, ease }}
        >
          <a href={`mailto:${email}`} className="contact-email">
            {email}
          </a>
        </motion.div>

        <motion.div
          className="contact-socials"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VP}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          {socials.map((social, i) => (
            <motion.a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              viewport={VP}
              transition={{ duration: 0.55, delay: 0.35 + i * 0.05, ease }}
            >
              <FontAwesomeIcon icon={social.icon} />
              {social.label}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
