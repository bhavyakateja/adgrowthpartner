"use client";

export function ResetCookieButton() {
  return (
    <button
      type="button"
      onClick={() => {
        localStorage.removeItem("agp.cookie-consent");
        location.reload();
      }}
      className="label-mono mt-12 bg-ink px-7 py-4 text-cream transition-colors hover:bg-sunset hover:text-ink"
    >
      Reset cookie preference
    </button>
  );
}
