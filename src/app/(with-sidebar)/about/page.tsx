import Breadcrumbs from "~/components/Breadcrumbs"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <h1 className="text-3xl font-bold mb-6">About Morgan Bay Climbing</h1>
      <div className="space-y-6">
        <p>
          Morgan Bay is South Africa's largest sea cliff climbing area, offering a unique blend of traditional climbing
          routes set against the backdrop of the stunning Eastern Cape coastline. With over 600 trad lines and a handful
          of sport routes, Morgan Bay provides a diverse range of climbing experiences for enthusiasts of all levels.
        </p>
        <p>
          The climbing areas are spread across several headlands, each with its own character and challenges. From the
          wave-cut platforms of the 1st Headland to the imposing Needle Wall on the 5th Headland, climbers can enjoy a
          variety of rock types and formations.
        </p>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Best Seasons for Climbing</h2>
        <p>
          Morgan Bay offers year-round climbing opportunities. Winter (June to August) has low rainfall and mild
          temperatures, making it ideal for climbing, although condensation can be an issue. Summer (December to
          February) can be hot, but sea breezes and shaded crags make climbing comfortable. The best conditions often
          occur during the shoulder seasons of spring and autumn.
        </p>
        <h2 className="text-2xl font-semibold mt-4 mb-2">History</h2>
        <p>
          Climbing in Morgan Bay has a rich history dating back several decades. Pioneers like Dave and Barbara Freer
          opened many of the prominent trad lines in the 1980s. Since then, continuous development by local and visiting
          climbers has expanded the number and variety of routes available.
        </p>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Access and Logistics</h2>
        <p>
          Morgan Bay is located about 90km from East London. Most climbing areas are accessible via short walks from
          parking areas on the headlands. Some sectors require low tide and calm sea conditions for safe access. Always
          check tide tables and weather forecasts before planning your climbs.
        </p>
      </div>
    </div>
  )
}

