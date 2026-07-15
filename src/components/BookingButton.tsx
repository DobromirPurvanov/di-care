import type { ReactNode, CSSProperties, MouseEventHandler } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { openBooking } from '../lib/booking'
import { scrollToTarget } from '../lib/scroll'

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
  /** Допълнителен клик (напр. за затваряне на мобилното меню). */
  onClick?: MouseEventHandler<HTMLButtonElement>
}

// Вариантът задава само цветовете, за да работят hover състоянията чрез Tailwind.
const VARIANT: Record<Variant, string> = {
  primary: 'bg-[#c8a05e] text-[#0c1614] font-medium hover:bg-[#ddbd82]',
  ghost:
    'border border-[rgba(242,237,226,0.45)] text-[#f2ede2] hover:border-[#c8a05e] hover:bg-[rgba(200,160,94,0.1)] hover:text-[#ddbd82]',
  link: 'text-[rgba(242,237,226,0.85)] hover:text-[#ddbd82]',
}

/**
 * Отваря Cal.com popup при клик. Скриптът на Cal се зарежда чак при първия
 * клик (освен ако потребителят е приел всички бисквитки — тогава е зареден
 * предварително от App). Ако Cal е недостъпен (блокер/офлайн), водим
 * потребителя към контактната форма като резервен път.
 */
export default function BookingButton({
  service,
  variant = 'primary',
  className = '',
  style,
  children,
  onClick,
  ...rest
}: Props) {
  const navigate = useNavigate()
  const onHome = useLocation().pathname === '/'

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick?.(e)
    const opened = openBooking(service)
    if (!opened) {
      // Резервен път: контактната форма (телефон + съобщение).
      if (onHome) scrollToTarget('#contact')
      else navigate('/', { state: { scrollTo: '#contact' } })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`items-center justify-center gap-2 rounded-full transition-all duration-300 cursor-pointer ${VARIANT[variant]} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </button>
  )
}
