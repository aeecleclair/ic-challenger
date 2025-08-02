"use client";

import { SellerProductList } from "@/src/components/admin/products/SellerProductList";
import { useProducts } from "@/src/hooks/useProducts";
import { useUser } from "@/src/hooks/useUser";
import { useRouter } from "next/navigation";

const SellerTab = () => {
  const { isAdmin } = useUser();
  const { products } = useProducts();
  const router = useRouter();

  if (!isAdmin) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex items-center justify-center p-6 min-w-96">
      {products && <SellerProductList products={products} />}
    </div>
  );
};

export default SellerTab;
