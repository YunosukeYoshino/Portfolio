export default function SkillsMarquee() {
  const skills = [
    { text: 'UI/UX Design', highlight: false },
    { text: 'Creative Development', highlight: true },
    { text: 'WebGL', highlight: false },
    { text: 'React / Next.js', highlight: true },
    { text: 'Interaction Design', highlight: false },
  ]

  return (
    <div className="py-16 border-t border-b border-gray-200 bg-white relative z-20 mt-20">
      <div className="marquee-container font-display text-4xl md:text-6xl font-medium text-gray-300/50">
        <div className="marquee-content">
          {[...skills, ...skills].map((skill, index) => (
            <span
              key={`skill-${skill.text}-${index}`}
              className={`mx-12 ${skill.highlight ? 'text-black' : ''}`}
            >
              {skill.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
