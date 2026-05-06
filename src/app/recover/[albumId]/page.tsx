import DeletedImageRecovery from "@/component/deletedImageRecovery";

export default function RecoverPage({ params }: { params: { albumId: string } }) {
  return <DeletedImageRecovery albumId={params.albumId} />;
}
