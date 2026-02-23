import Image from 'next/image'

type StampVariant = 'rect' | 'tilted' | 'rough'

type StampBadgeProps = {
  label: string
  variant?: StampVariant
  logo_url?: string | null
}

export default function StampBadge({ label, variant = 'rect', logo_url = null }: StampBadgeProps) {
  return (
    <article className={`stamp-badge stamp-badge--${variant}`}>
      <div className="stamp-badge__inner">
        {logo_url ? (
          <div className="stamp-badge__logo-wrap">
            <Image src={logo_url} alt={label} fill sizes="120px" className="object-contain" />
          </div>
        ) : (
          <span className="stamp-badge__label">{label}</span>
        )}
      </div>
    </article>
  )
}
