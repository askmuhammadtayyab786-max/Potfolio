// Decorative atom: three tilted elliptical orbits, each carrying an electron.
const orbits = [
  { angle: 0, duration: 7, offset: 0 },
  { angle: 60, duration: 9, offset: 2.4 },
  { angle: 120, duration: 8, offset: 5.1 },
]

const orbitPath = 'M10,200 a190,62 0 1,0 380,0 a190,62 0 1,0 -380,0'

export function AtomOrbits({ className = '' }: { className?: string }) {
  return (
    <svg className={`atom-orbits ${className}`} viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      {orbits.map((orbit) => (
        <g key={orbit.angle} transform={`rotate(${orbit.angle} 200 200)`}>
          <ellipse className="atom-ring" cx="200" cy="200" rx="190" ry="62" />
          <circle className="atom-electron" r="5.5">
            <animateMotion dur={`${orbit.duration}s`} begin={`-${orbit.offset}s`} repeatCount="indefinite" path={orbitPath} />
          </circle>
          <circle className="atom-electron atom-electron-trail" r="3">
            <animateMotion dur={`${orbit.duration}s`} begin={`-${orbit.offset + orbit.duration - 0.18}s`} repeatCount="indefinite" path={orbitPath} />
          </circle>
        </g>
      ))}
    </svg>
  )
}
