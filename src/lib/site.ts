// One place for site-wide copy and the contact address.
export const SITE = {
  name: "tape_x247",
  tagline: "Underground electronic music from South Asia",
  description:
    "Discover underground electronic music and art made by South Asian artists, at home and in the diaspora.",
  // TODO: "tape_x247.com" is not a valid domain (underscores are not allowed in hostnames).
  // Replace with the real address and every mailto link updates.
  contactEmail: "info@tape_x247.com",
} as const;

export function mailto(subject?: string) {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${SITE.contactEmail}${query}`;
}
