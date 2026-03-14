"use client";

import { useEffect } from "react";
import { LuxuryStatusPage } from "@/components/luxury-status-page";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Global route error:", error);
  }, [error]);

  return (
    <LuxuryStatusPage
      eyebrow="Unexpected Interruption"
      title="The itinerary needs a fresh refresh."
      description="Something unexpected interrupted this page. You can retry the request or return to the collection overview."
      primaryHref="/"
      primaryLabel="Back to Homepage"
      secondaryHref="/inquiry?entity=general&id=GENERAL&name=Reservation%20Support"
      secondaryLabel="Contact Support"
    >
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-full border border-[#c9b189] bg-[#efe3d2] px-6 py-3 text-sm font-bold tracking-[0.08em] text-[#5c472f] transition hover:bg-[#e7d6bb]"
        >
          Retry This Page
        </button>
    </LuxuryStatusPage>
  );
}
