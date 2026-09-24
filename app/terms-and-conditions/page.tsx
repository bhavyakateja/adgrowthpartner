import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions — Ad Growth Partner",
  description:
    "The terms that apply when you use the Ad Growth Partner website.",
  openGraph: {
    title: "Terms & Conditions — Ad Growth Partner",
    description: "Terms of use for this website.",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="[EDITABLE CONTENT]"
      intro="These terms apply to your use of this website. By browsing it or sending us an enquiry, you accept them."
      sections={[
        {
          heading: "Use of this site",
          body: [
            "You may view and share the content here for your own reference. You may not republish it commercially, present it as your own, or use it to train models without our written permission.",
          ],
        },
        {
          heading: "Content and accuracy",
          body: [
            "We keep this site accurate and current, but nothing on it is a commitment, quotation or professional advice. Any engagement between us is governed by a separate signed agreement. [EDITABLE CONTENT]",
          ],
        },
        {
          heading: "Intellectual property",
          body: [
            "All copy, design, code and imagery on this site belong to us or our clients and remain protected. Case study material is published with the relevant permissions.",
          ],
        },
        {
          heading: "Liability",
          body: [
            "We are not liable for losses arising from decisions made on the basis of content published here, to the extent permitted by law.",
          ],
        },
        {
          heading: "Contact",
          body: [
            `Questions about these terms can go to ${SITE.email}.`,
          ],
        },
      ]}
    />
  );
}