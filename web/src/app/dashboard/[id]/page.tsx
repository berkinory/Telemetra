type DashboardAppPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DashboardAppPage({
  params,
}: DashboardAppPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h1 className="font-bold text-4xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">App ID: {id}</p>
      </div>
    </div>
  );
}
