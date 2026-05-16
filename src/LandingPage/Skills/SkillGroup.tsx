import { motion } from 'framer-motion'
import SkillTag from './SkillTag'

interface SkillGroupProps {
  category: string
  skills: string[]
  index?: number
}

export default function SkillGroup({ category, skills, index = 0 }: SkillGroupProps) {
  return (
    <motion.div
      className="skill-group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <h3 className="skill-category">{category}</h3>
      <div className="skill-tags">
        {skills.map((skill) => (
          <SkillTag key={skill} skill={skill} />
        ))}
      </div>
    </motion.div>
  )
}
