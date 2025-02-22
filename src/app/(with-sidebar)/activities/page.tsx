import Breadcrumbs from "~/components/Breadcrumbs"

export default function ActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <h1 className="text-3xl font-bold mb-6">Activities in Morgan Bay</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Beach Activities</h2>
          <p>
            Morgan Bay boasts a beautiful beach perfect for swimming, surfing, and long walks. The estuary is great for
            kids to play and swim safely.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Fishing</h2>
          <p>
            Excellent bass fishing is available in the local dam. The estuary and sea shore also offer great fishing
            opportunities with a variety of species.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Hiking</h2>
          <p>
            There are numerous hiking trails in the area, offering beautiful coastal views and opportunities for bird
            watching and wildlife spotting.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Nature and Wildlife</h2>
          <p>
            The area is rich in biodiversity. Bird watching is popular, and you might spot dolphins frolicking in the
            waves from the cliffs.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Photography</h2>
          <p>
            The dramatic sea cliffs, beautiful beach, and diverse wildlife offer endless opportunities for photography
            enthusiasts.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Nearby Attractions</h2>
          <p>
            The nearby town of Kei Mouth offers additional amenities and attractions. The area is also rich in cultural
            history, with opportunities to learn about local Xhosa culture.
          </p>
        </div>
      </div>
    </div>
  )
}

