import { getSectorsAndIds } from "@/server/models/sectors";
import { createRoute } from "@/server/models/routes";
import { NewRouteForm } from "~/components/NewRouteForm";

type SectorAndId = {
  id: number;
  name: string;
};

const sectors: SectorAndId[] = await getSectorsAndIds();

export default function NewRoutePage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center">
      <h1 className="mb-6 pt-6 text-3xl font-bold">Add New Route</h1>
      <div className="mb-4 text-2xl">
        <NewRouteForm
          sectorAndId={sectors}
          onSaveAction={createRoute}
        ></NewRouteForm>
      </div>
    </div>
  );
}
