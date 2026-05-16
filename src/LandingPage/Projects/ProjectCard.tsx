import { motion } from 'framer-motion'

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  link: string
}

export default function ProjectCard({ title, description, tags, link }: ProjectCardProps) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="project-header">
        <h3 className="project-title">{title}</h3>
      </div>
      <p className="project-description">{description}</p>
      <div className="project-tags">
        {tags.map((tag) => (
          <span key={tag} className="project-tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="project-arrow">→</div>
    </motion.a>
  )
}
