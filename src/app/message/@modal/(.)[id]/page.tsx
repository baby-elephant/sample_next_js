import Modal from "@/app/_components/Modal";
import MessageDetails from "@/app/message/MessageDetails";

export default async function InterceptedMessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Modal title={`Message #${id}`}>
      <MessageDetails id={id} />
    </Modal>
  );
}
