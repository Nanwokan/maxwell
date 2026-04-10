import { MessageCircle } from 'lucide-react';

import { sanitizeWhatsAppPhone } from '@/lib/safe-link';

type WhatsAppButtonProps = {
  phoneNumber?: string;
  clubName?: string;
};

const WhatsAppButton = ({
  phoneNumber = '2250100290505',
  clubName = 'Association Sportive Maxwell Fae',
}: WhatsAppButtonProps) => {
  const safePhoneNumber = sanitizeWhatsAppPhone(phoneNumber);
  if (!safePhoneNumber) {
    return null;
  }

  const message = encodeURIComponent(
    `Bonjour, je souhaite avoir des informations sur ${clubName}.`
  );

  return (
    <a
      href={`https://wa.me/${safePhoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed right-6 bottom-6 z-[200] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-300 hover:scale-110"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <MessageCircle className="text-white" size={28} fill="white" />

      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#0B0F17] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Discuter sur WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
