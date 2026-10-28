/** Avatar fallback from an email: "jane.doe@x.com" -> "JD", "jane@x.com" -> "J", unusable input -> "?". */
export function getInitials(email: string) {
  const [localPart = ""] = email.split("@");
  const initials = localPart
    .split(/[._+-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "?";
}
