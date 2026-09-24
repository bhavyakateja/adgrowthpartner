import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { ResetCookieButton } from "@/components/site/ResetCookieButton";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy — Ad Growth Partner",
  description:
    "How Ad Growth Partner uses cookies to deliver, improve, and secure our website experience.",
  openGraph: {
    title: "Cookie Policy — Ad Growth Partner",
    description: "Our approach to cookies and privacy.",
  },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="[EDITABLE CONTENT]"
      intro="We keep cookies to a minimum: the ones needed to make the site work, and optional ones that tell us which articles people actually read."
      sections={[
        {
          heading: "Essential cookies",
          body: [
            "These remember your language choice and your cookie preference. The site cannot work correctly without them, so they are always set.",
          ],
        },
        {
          heading: "Analytics cookies",
          body: [
            "Optional. They record anonymous page views so we can see what is useful and what isn't. They are only set if you accept them. [EDITABLE CONTENT]",
          ],
        },
        {
          heading: "Changing your choice",
          body: [
            "Use the button below to clear your stored preference; the cookie banner will appear again on your next page view. You can also clear cookies in your browser settings at any time.",
          ],
        },
        {
          heading: "Questions",
          body: [`Anything unclear? Write to ${SITE.email}.`],
        },
      ]}
    >
      <ResetCookieButton />
    </LegalPage>
  );
}