import { Phone, MessageSquare, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContactActionsProps {
  phone: string
  email: string
  className?: string
  showPhone?: boolean
  showText?: boolean
  showEmail?: boolean
}

export function ContactActions({
  phone,
  email,
  className,
  showPhone = true,
  showText = true,
  showEmail = true,
}: ContactActionsProps) {
  // Format phone for tel: link
  const phoneNumber = phone.replace(/\D/g, '')

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showPhone && (
        <a
          href={`tel:${phoneNumber}`}
          className="p-2 rounded-full hover:bg-[#F0F5F7] transition-colors"
          aria-label="Call"
        >
          <Phone className="w-4 h-4 text-[#778188]" />
        </a>
      )}
      {showText && (
        <a
          href={`sms:${phoneNumber}`}
          className="p-2 rounded-full hover:bg-[#F0F5F7] transition-colors"
          aria-label="Message"
        >
          <MessageSquare className="w-4 h-4 text-[#778188]" />
        </a>
      )}
      {showEmail && (
        <a
          href={`mailto:${email}`}
          className="p-2 rounded-full hover:bg-[#F0F5F7] transition-colors"
          aria-label="Email"
        >
          <Mail className="w-4 h-4 text-[#778188]" />
        </a>
      )}
    </div>
  )
}
