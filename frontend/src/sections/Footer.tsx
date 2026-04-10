import { Facebook, Mail, Music2 } from 'lucide-react';

import { navigateToAdminRoute } from '../lib/app-route';
import {
  defaultPublicHomepageData,
  type PublicSiteSettings,
} from '../lib/public-content';
import { sanitizeAnchorOrLink, sanitizeExternalUrl } from '../lib/safe-link';

type FooterProps = {
  settings?: PublicSiteSettings;
};

type FooterSocialLink = {
  icon: typeof Facebook;
  href: string;
  label: string;
};

const Footer = ({ settings = defaultPublicHomepageData.settings }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const brandLabel = settings.clubName.replace(/^Association Sportive\s+/i, '').toUpperCase();

  const footerLinks = {
    club: [
      { label: 'Le Centre', href: '#le-centre' },
      { label: 'Categories', href: '#categories' },
      { label: 'Equipe', href: '#equipe' },
      { label: 'Galerie', href: '#galerie' },
    ],
    pratique: [
      { label: 'Inscription', href: '#inscription' },
      { label: 'Contact', href: '#contact' },
      { label: "Journee d'entrainement", href: '#journee' },
    ],
    legal: settings.legalLinks,
  };

  const socialLinks = [
    settings.facebookUrl
      ? { icon: Facebook, href: sanitizeExternalUrl(settings.facebookUrl), label: 'Facebook' }
      : null,
    settings.tiktokUrl
      ? { icon: Music2, href: sanitizeExternalUrl(settings.tiktokUrl), label: 'TikTok' }
      : null,
    settings.email
      ? { icon: Mail, href: sanitizeExternalUrl(`mailto:${settings.email}`), label: 'Email' }
      : null,
  ]
    .filter((social): social is FooterSocialLink & { href: string | null } => social !== null)
    .filter((social): social is FooterSocialLink => social.href !== null);

  const legalLinks = footerLinks.legal
    .map((link) => ({
      ...link,
      safeUrl: sanitizeAnchorOrLink(link.url, ''),
    }))
    .filter((link) => link.safeUrl !== '');

  return (
    <footer className="relative z-[130] bg-[#121A26] py-12 lg:py-16">
      <div className="px-8 lg:px-[8vw]">
        <div className="mb-12 flex flex-col border-b border-white/5 pb-12 lg:mb-0 lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 flex items-center gap-3 lg:mb-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
              <span className="text-xl font-bold text-[#0B0F17]">{settings.clubShortName}</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-white">{brandLabel}</span>
              <span className="text-xs text-[#A9B3C2]">{settings.tagline}</span>
            </div>
          </div>

          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B0F17] text-[#A9B3C2] transition-colors hover:bg-accent/10 hover:text-accent"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div className="mb-12 grid grid-cols-2 gap-8 pt-12 lg:grid-cols-3">
          <div>
            <h4 className="mb-4 font-semibold text-white">Le Club</h4>
            <ul className="space-y-2">
              {footerLinks.club.map((link) => (
                <li key={link.label}>
                  <a
                    href={sanitizeAnchorOrLink(link.href, '#')}
                    className="text-sm text-[#A9B3C2] transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Pratique</h4>
            <ul className="space-y-2">
              {footerLinks.pratique.map((link) => (
                <li key={link.label}>
                  <a
                    href={sanitizeAnchorOrLink(link.href, '#')}
                    className="text-sm text-[#A9B3C2] transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="mb-4 font-semibold text-white">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={`${link.label}-${link.safeUrl}`}>
                  <a
                    href={link.safeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#A9B3C2] transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#A9B3C2]">
            © {currentYear} {settings.clubName}. Tous droits reserves.
          </p>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              type="button"
              onClick={navigateToAdminRoute}
              className="text-xs font-medium text-[#A9B3C2] transition-colors hover:text-accent"
            >
              Accès admin
            </button>
            <p className="text-xs text-[#A9B3C2]">Crée par Nanwokan Ouattara</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
