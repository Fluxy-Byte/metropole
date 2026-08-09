export function HouseLocationMap({
  latitude,
  longitude,
  address,
}: {
  latitude: number | null;
  longitude: number | null;
  address: string;
}) {
  if (latitude === null || longitude === null) return null;

  const src = `https://www.google.com/maps?q=${latitude},${longitude}&hl=pt-BR&z=15&output=embed`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <iframe
        title={`Localização de ${address}`}
        src={src}
        width="100%"
        height="320"
        loading="lazy"
        className="border-0"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
