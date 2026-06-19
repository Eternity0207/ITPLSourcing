import { Building2, Search, Warehouse, Camera } from "lucide-react";
import Link from "next/link";
import { VALUE_ADDED } from "@/data/site";

const ICONS: Record<string, React.ElementType> = {
  "building-2": Building2,
  search: Search,
  warehouse: Warehouse,
  camera: Camera,
};

export default function ValueAdded() {
  return (
    <section className="section-padding bg-[#f0f4ff]">
      <div className="container-main">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[#333] md:text-3xl">
            Value-added services
          </h2>
          <p className="text-[#7a7a7a]">
            Additional services to streamline operations and save costs.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_ADDED.map((service) => {
            const Icon = ICONS[service.icon] || Building2;
            return (
              <div
                key={service.title}
                className="rounded-2xl bg-white p-6 text-center shadow-md transition-transform hover:-translate-y-1"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f4ff]">
                  <Icon className="h-7 w-7 text-[#ff9933]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#333]">
                  {service.title}
                </h3>
                <p className="text-sm text-[#7a7a7a]">{service.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/extra-service" className="btn-primary">
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
}
