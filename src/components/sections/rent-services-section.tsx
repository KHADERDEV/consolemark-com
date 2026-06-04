import Image from "next/image";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function RentServicesSection() {
  return (
    <section
      id="rent-services"
      className="bg-white px-4 py-16 text-black sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 sm:gap-16 lg:gap-20">
        <header className="text-center">
          <h2 className="font-lilita text-4xl leading-none tracking-normal text-black sm:text-5xl lg:text-6xl">
            {siteConfig.rentServices.title}
          </h2>
        </header>

        <div className="flex flex-col gap-16 sm:gap-20">
          {siteConfig.rentServices.items.map((item) => {
            const imageFirst = item.imageSide === "left";

            return (
              <article
                key={item.image}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                <div
                  className={cn(
                    "flex flex-col justify-center",
                    imageFirst && "lg:order-2",
                  )}
                >
                  <p className="font-lilita max-w-xl text-3xl leading-tight tracking-normal text-black sm:text-4xl lg:text-5xl">
                    {item.text}
                  </p>
                </div>

                <div
                  className={cn(
                    "relative mx-auto w-full max-w-xl",
                    imageFirst && "lg:order-1",
                  )}
                >
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    width={760}
                    height={560}
                    sizes="(min-width: 1024px) 44vw, 92vw"
                    draggable={false}
                    className="h-auto w-full object-contain"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
