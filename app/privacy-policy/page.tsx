import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy — Ad Growth Partner",
  description:
    "How Ad Growth Partner collects, uses and protects personal information.",
  openGraph: {
    title: "Privacy Policy — Ad Growth Partner",
    description: "Our approach to personal data.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="[EDITABLE CONTENT]"
      intro="This policy explains what personal information we collect when you use this website or contact us, why we collect it, and what you can ask us to do with it."
      sections={[
        {
          heading: "What we collect",
          body: [
            "When you send an enquiry or apply for a role, we collect the details you give us: your name, organisation, email address, phone number, location and the message itself.",
            "We also collect basic technical information such as pages viewed and approximate location, used only to understand how the site is performing.",
          ],
        },
        {
          heading: "Why we use it",
          body: [
            "To reply to your enquiry, assess an application, and keep a record of our correspondence. We do not sell personal information, and we do not share it with third parties for their own marketing.",
          ],
        },
        {
          heading: "How long we keep it",
          body: [
            "Enquiries and applications are retained for as long as they are commercially relevant, and then deleted. [EDITABLE CONTENT]",
          ],
        },
        {
          heading: "Your rights",
          body: [
            `You can ask us for a copy of the information we hold about you, ask us to correct it, or ask us to delete it. Write to ${SITE.email} and we will respond.`,
          ],
        },
        {
          heading: "Security",
          body: [
            "Information submitted through this site is transmitted over an encrypted connection and stored in access-controlled systems.",
          ],
        },
      ]}
    />
  );
}