import Modal from "@/app/_components/Modal";
import MessagePage from "../../[id]/page";

export default async function InterceptedMessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Modal title={`Message #${id}`}>
      <MessagePage params={params} />
    </Modal>
  );
}
