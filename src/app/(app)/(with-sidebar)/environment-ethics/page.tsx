import Breadcrumbs from "~/components/Breadcrumbs"

export default function EnvironmentEthicsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <h1 className="text-3xl font-bold mb-6">Environment & Ethics</h1>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mt-4 mb-2">Local Ecosystem</h2>
        <p>
          Morgan Bay is home to a diverse coastal ecosystem, featuring unique flora and fauna adapted to the sea cliff
          environment. The area is characterized by dolerite cliffs set on shale bands, creating a varied and
          interesting geological landscape.
        </p>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Environmental Impact</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Stay on established trails and avoid creating new paths to minimize erosion.</li>
          <li>Pack out all trash, including organic waste.</li>
          <li>Respect wildlife and plant life. Avoid disturbing nesting birds or damaging vegetation.</li>
          <li>Use existing anchors where available and minimize the placement of new fixed gear.</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Access and Respect</h2>
        <p>
          While many climbing areas are on public land, some may cross private property. Always respect landowners'
          rights and any posted signs or restrictions. Be courteous to local residents and other visitors.
        </p>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Safety Considerations</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Be aware of tide times and sea conditions, especially when climbing on lower sections.</li>
          <li>Watch for loose rock and always wear a helmet.</li>
          <li>Be cautious of slippery grass when approaching crags, especially when wet.</li>
          <li>Bring adequate water and sun protection.</li>
        </ul>
      </div>
    </div>
  )
}

