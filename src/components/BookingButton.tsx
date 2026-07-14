import type { ReactNode, CSSProperties } from 'react'
import { CAL_LINK, CAL_NAMESPACE, calConfig } from '../lib/booking'

type Variant = 'primary' | 'ghost' | 'link'

interface Props {
  /** Услугата, която да се пренесе в бележките на резервацията (по избор). */
  service?: string
  variant?: Variant
  /** Layout/размер класове за конкретното място (display, padding, tracking…). */
  className?: string
  style?: CSSProperties
  children: ReactNode
  'aria-label'?: string
}

// Вариантът задава само цветовете, за да работят hover състоянията чрез Tailwind.
const VARIANT: Record<Variant, string> = {
  primary: 'bg-[#c8a05e] text-[#0c1614] font-medium hover:bg-[#ddbd82]',
  ghost:
    'border border-[rgba(242,237,226,0.45)] text-[#f2ede2] hover:border-[#c8a05e] hover:bg-[rgba(200,160,94,0.1)] hover:text-[#ddbd82]',
  link: 'text-[rgba(242,237,226,0.85)] hover:text-[#ddbd82]',
}

/**
 * Отваря Cal.com popup при клик (Cal хваща кликовете върху [data-cal-link]
 * след инициализация в App). Един компонент за всички „Запази час" места.
 */
export default function BookingButton({
  service,
  variant = 'primary',
  className = '',
  style,
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-link={CAL_LINK}
      data-cal-config={calConfig(service)}
      className={`items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${VARIANT[variant]} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </button>
  )
}
