import Breadcrumbs from "~/components/Breadcrumbs"
import Link from "next/link"

export default function AccommodationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <h1 className="text-3xl font-bold mb-6">Accommodation</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Morgan Bay Hotel</h2>
          <p>
            Offers a variety of accommodation options and includes The Deck, a restaurant with good food and cold beer.
            Ideal for families.
          </p>
          <p>
            Contact: 043-8411062 |{" "}
            <Link href="mailto:info@morganbayhotel.co.za" className="text-blue-500 hover:underline">
              info@morganbayhotel.co.za
            </Link>{" "}
            |{" "}
            <Link
              href="https://morganbayhotel.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              morganbayhotel.co.za
            </Link>
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Double Mouth Nature Reserve</h2>
          <p>
            Offers camping on the beach. Facilities are basic but the location is beautiful. Booking recommended during
            peak seasons.
          </p>
          <p>Contact: 043 736 9909</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Morgan Bay Camp Site</h2>
          <p>Camping next to the lagoon and close to the beach. Great for families.</p>
          <p>Bookings through Morgan Bay Hotel</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Yellowwood Forest</h2>
          <p>
            Offers camping, cottages, and a backpackers in a natural forest setting. Has a coffee shop and restaurant
            with great pizza during high season.
          </p>
          <p>
            Contact: 043-8411598 |{" "}
            <Link href="mailto:info@yellowwoodforest.co.za" className="text-blue-500 hover:underline">
              info@yellowwoodforest.co.za
            </Link>{" "}
            |{" "}
            <Link
              href="https://www.yellowwoodforest.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              yellowwoodforest.co.za
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

