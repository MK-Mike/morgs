import Link from "next/link";
import Breadcrumbs from "~/components/Breadcrumbs";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs />
      <h1 className="mb-6 text-3xl font-bold">About Morgan Bay Climbing</h1>
      <div className="space-y-6">
        <p>
          {`Morgan Bay is South Africa's only developed sea cliff climbing area,
          offering a unique blend of traditional climbing routes set against the
          backdrop of the stunning Eastern Cape coastline. With over 600 trad
          lines and a handful of sport routes(all of which are currently in the
          process of being re-bolted with Titanium glue-ins thanks to the huge
          donations from Gavin Voorwerg and ongoing work by Willem Van der Spuy
          of Morgan bay Adventures), Morgan Bay provides a diverse range of
          climbing experiences for enthusiasts of all levels.`}
        </p>
        <p>
          {`The climbing is spread across 5 headlands, each with its own character
          and challenges. From wave-cut platforms and sheer cliffs to spires and
          stacks of Dolerite, climbers can enjoy a variety of climbing styles on
          differing formations. There's something for every style of climber
          including off-widths and splitter cracks, slabs and crimpy faces, and
          not to mention some shorter multi-pitch routes, Morgs has everything
          you could think to ask for in a climbing destination.`}
        </p>
        <h2 className="mb-2 mt-4 text-2xl font-semibold">
          Best Seasons for Climbing
        </h2>
        <p>
          {`Morgan Bay offers year-round climbing opportunities. With the driest
          months being from May to August. When low rainfall and mild
          temperatures combine, the winter months are the best time to plan a
          trip to avoid the rain. Summer's (December to February) are generally
          hot in the mornings, with cool refreshing ocean breezes picking up
          early afternoon and cooling the crags make climbing comfortable.
          Unfortunately, summer is also the wet season with rains falling about
          40% of the time. The rock dries fairly fast after a drizzle but may
          take up to a day or two to dry sufficiently to climb if there have
          been a few days of rain.`}
        </p>
        <h2 className="mb-2 mt-4 text-2xl font-semibold">History</h2>
        <p>
          Climbing in Morgan Bay has a rich history dating back several decades.
          Pioneers like Dave and Barbara Freer opened many of the prominent trad
          lines in the 1980s and 90s with Derek the monster Marshall, Allan
          Luck, Craig Bester, Gavin Peckham, Ruben Snyman, Tyson Baars, Garvin
          Jacobs and Dirk van der Walt all having opened multiple new routes
          since then. Continuous development by local and visiting climbers has
          expanded the number and variety of routes available and turned Morgan
          bay into the premier climbing destination that it is today.
        </p>
        <h2 className="mb-2 mt-4 text-2xl font-semibold">
          Access and Logistics
        </h2>
        <p>
          Morgan Bay is located about 90 km from East London towards Mthatha on
          the N2. Most climbing areas are accessible via short walks from
          parking areas on top of the headlands. Some sectors (such as the
          wave-cut platforms and sea stacks) require low tide and calm sea
          conditions for safe access. Always check tide tables and weather
          forecasts before planning your climbs.
        </p>
        <p>
          There is a small shop in Morgan Bay for provisions should you have
          forgotten any of the necessities, as well as a larger more suitably
          stocked Savemore in Kei Mouth, the next village over. Kei Mouth also
          has a petrol station.
        </p>
        <h2 className="mb-2 mt-4 text-2xl font-semibold text-sky-400">
          Acknowldgements
        </h2>
        <p className="text-sky-100">
          This project is only possible because of the hard work and time put in
          by Derek “The Monster” Marshal (legend of Eastern Cape Climbing) who
          was the first person to put together an amalgamated climbing guide for
          Morgan Bay. Basing his work off of MCSA climbing journals and his
          wealth of hands-on experience in the area, the majority of the
          development in Morgan bay is due to his unwavering efforts and love
          for the area and the sport of outdoor climbing. We are deeply thankful
          for his time and effort.
        </p>
        <p>
          Further acknowledgement needs to be made to Mike Kent, who did the
          majority of the leg work for this guide and whose passion for the
          sport of climbing is matched only by his stoke to explore and find new
          places to climb in the Transkei.
        </p>
        <h2 className="mb-2 mt-4 text-2xl font-semibold">Useful Links</h2>
        <div>
          {`Here's a list of websites which may be helpful in planning your trip:`}
          <p className="mt-2">
            <Link href="https://morganbay.co.za/" target="_blank">
              https://morganbay.co.za/
            </Link>
          </p>
          <p className="mt-2">
            <Link href="https://www.morganbayadventures.co.za/" target="_blank">
              https://www.morganbayadventures.co.za/
            </Link>
          </p>
          <p className="mt-2">
            <Link
              href="https://www.easterncaperockclimbing.co.za/"
              target="_blank"
            >
              https://www.easterncaperockclimbing.co.za/
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
