import { LuxuryStatusPage } from "@/components/luxury-status-page";

export default function NotFound() {
  return (
    <LuxuryStatusPage
      eyebrow="Page Not Found"
      title="This voyage is no longer on the map."
      description="The page you requested could not be found. The listing may have moved, the URL may be incomplete, or the record may no longer be available."
      primaryHref="/"
      primaryLabel="Return to Homepage"
      secondaryHref="/inquiry?entity=general&id=GENERAL&name=Reservation%20Inquiry"
      secondaryLabel="Contact Reservation Team"
    />
  );
}
