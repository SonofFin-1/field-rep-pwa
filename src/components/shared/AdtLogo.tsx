interface AdtLogoProps {
  size?: number
  className?: string
}

export function AdtLogo({ size = 40, className = '' }: AdtLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Blue Octagon */}
      <polygon
        points="29.3,0 70.7,0 100,29.3 100,70.7 70.7,100 29.3,100 0,70.7 0,29.3"
        fill="#0061AA"
      />
      {/* ADT Text - styled to match official logo */}
      <g fill="white">
        {/* Letter A with triangle cutout */}
        <path d="
          M18,70
          L32,30
          L42,30
          L56,70
          L47,70
          L44,62
          L30,62
          L27,70
          Z
          M33,55
          L41,55
          L37,42
          Z
        " fillRule="evenodd" />
        {/* Letter D */}
        <path d="
          M52,30
          L65,30
          C75,30 81,38 81,50
          C81,62 75,70 65,70
          L52,70
          Z
          M60,38
          L60,62
          L64,62
          C70,62 73,58 73,50
          C73,42 70,38 64,38
          Z
        " fillRule="evenodd" />
        {/* Letter T */}
        <path d="
          M67,30
          L95,30
          L95,38
          L85,38
          L85,70
          L77,70
          L77,38
          L67,38
          Z
        " />
      </g>
    </svg>
  )
}
