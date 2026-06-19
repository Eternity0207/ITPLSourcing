import Link from "next/link";
import { FOOTER_LINKS, SITE } from "@/data/site";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="section-padding">
        <div className="container-main grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#ff9933]">
              Main Menu
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.main.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 transition-colors hover:text-[#ff9933]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#ff9933]">
              Our Service
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 transition-colors hover:text-[#ff9933]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#ff9933]">
              Our Solutions
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.solutions.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 transition-colors hover:text-[#ff9933]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#ff9933]">
              Contact Us
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9933]" />
                <a href={`mailto:${SITE.email}`} className="hover:text-[#ff9933]">
                  {SITE.email}
                </a>
              </p>
              <p className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9933]" />
                <span>
                  <a href={`tel:${SITE.phoneIntl.replace(/\s/g, "")}`} className="hover:text-[#ff9933]">
                    {SITE.phoneIntl}
                  </a>
                  <br />
                  <span className="text-xs text-gray-400">(Call from outside India)</span>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9933]" />
                <span>
                  <a href={`tel:${SITE.phoneIndia.replace(/\s/g, "")}`} className="hover:text-[#ff9933]">
                    {SITE.phoneIndia}
                  </a>
                  <br />
                  <span className="text-xs text-gray-400">(Call from India)</span>
                </span>
              </p>
            </div>

            <h3 className="mb-2 mt-6 text-sm font-bold uppercase tracking-wider text-[#ff9933]">
              Working Hours
            </h3>
            <div className="text-sm text-gray-300">
              <p>{SITE.workingHours.weekdays}</p>
              <p>{SITE.workingHours.saturday}</p>
              <p className="text-xs text-gray-400">({SITE.workingHours.timezone})</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 px-4 py-4 text-center text-sm text-gray-400">
        Copyright {new Date().getFullYear()} | All Rights Reserved | Powered by {SITE.legalName}
      </div>
    </footer>
  );
}
