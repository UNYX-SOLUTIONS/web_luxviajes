import type { FC } from "react";

interface ThemePark {
  title: string;
  subtitle: string;
  image: string;
}

interface ThemeParksSectionProps {
  parks: ThemePark[];
}

export const ThemeParksSection: FC<ThemeParksSectionProps> = ({ parks }) => {
  return (
    <section className="bg-neutral-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-neutral-900">
          Parques Tematicos
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {parks.map((park) => (
            <article
              key={park.title}
              className="relative overflow-hidden rounded-2xl"
            >
              <img
                src={park.image}
                alt={park.title}
                className="h-72 w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-neutral-950/75 via-neutral-900/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-sm text-primary-100">{park.subtitle}</p>
                <h3 className="text-3xl font-bold">{park.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
