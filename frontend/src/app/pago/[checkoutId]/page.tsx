import { DatafastPaymentWidget } from "./widget";

export default async function DatafastPaymentPage({
  params,
}: {
  params: Promise<{ checkoutId: string }>;
}) {
  const { checkoutId } = await params;

  return <DatafastPaymentWidget checkoutId={checkoutId} />;
}
