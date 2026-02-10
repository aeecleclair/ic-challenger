import { GetCompetitionProductsResponse } from "@/src/api/hyperionComponents";
import { AppModulesSportCompetitionSchemasSportCompetitionPurchaseComplete } from "@/src/api/hyperionSchemas";

export const UserPurchases = ({
  userPurchases,
  products,
}: {
  userPurchases: AppModulesSportCompetitionSchemasSportCompetitionPurchaseComplete[];
  products: GetCompetitionProductsResponse;
}) => {
  return (
    <div className="">
      <h2>Achats</h2>
    </div>
  );
};
