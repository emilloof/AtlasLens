import DeletedImageRecovery from "@/component/deletedImageRecovery";

export default async function RecoverPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params;
  return <DeletedImageRecovery albumId={albumId} />;
}
