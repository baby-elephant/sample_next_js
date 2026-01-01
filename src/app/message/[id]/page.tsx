import MessageDetails from "../MessageDetails";

export default async function MessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MessageDetails id={id} />;
}

