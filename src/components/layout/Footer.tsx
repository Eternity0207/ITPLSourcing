import Link from "next/link";
import { FOOTER_LINKS, POINTS_OF_CONTACT, SITE } from "@/data/site";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-footer text-white">
      <div className="section-padding">
        <div className="container-main grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
              Main Menu
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.main.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
              Our Service
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
              Our Solutions
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.solutions.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">
              Contact Us
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <a href={`mailto:${SITE.email}`} className="hover:text-primary">
                    {SITE.email}
                  </a>
                  <br />
                  <span className="text-xs text-gray-400">For all inquiries and details</span>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {SITE.address}
              </p>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Points of contact</p>
                {POINTS_OF_CONTACT.map((poc) => (
                  <p key={poc.phone} className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      <span className="font-medium text-gray-200">{poc.name}</span>
                      <br />
                      <a href={`tel:${poc.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                        {poc.phone}
                      </a>
                    </span>
                  </p>
                ))}
              </div>
            </div>

            <h3 className="mb-2 mt-6 text-sm font-bold uppercase tracking-wider text-primary">
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

      <div className="border-t border-primary/20 px-4 py-4 text-center text-sm text-gray-400">
        Copyright {new Date().getFullYear()} | All Rights Reserved | Powered by {SITE.legalName}
      </div>
    </footer>
  );
}
