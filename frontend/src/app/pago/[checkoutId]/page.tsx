import { DatafastPaymentWidget } from "./widget";

export default async function DatafastPaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ checkoutId: string }>;
  searchParams: Promise<{ creditType?: string; installments?: string }>;
}) {
  const { checkoutId } = await params;
  const { creditType, installments } = await searchParams;

  return (
    <DatafastPaymentWidget
      checkoutId={checkoutId}
      creditType={creditType}
      installments={installments ? Number(installments) : undefined}
    />
  );
}
