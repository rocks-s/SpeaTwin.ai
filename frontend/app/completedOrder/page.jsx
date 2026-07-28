import { Suspense } from "react";
import CompletedOrderPage from "../../components/completed/CompletedOrderPage";

export default function Page() {
  return (
    <Suspense fallback={<main style={{ padding: "24px" }}>Loading...</main>}>
      <CompletedOrderPage />
    </Suspense>
  );
}
