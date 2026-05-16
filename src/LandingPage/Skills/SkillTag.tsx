import { motion } from 'framer-motion'

interface SkillTagProps {
  skill: string
}

export default function SkillTag({ skill }: SkillTagProps) {
  return (
    <motion.div
      className="skill-tag"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {skill}
    </motion.div>
  )
}
