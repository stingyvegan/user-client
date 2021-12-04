/**
 * Get a short version of the given UUID.
 * @param uuid The UUID to shorten.
 */
export default function shortenUuid(uuid: string) {
  return uuid.substring(uuid.length - 8, uuid.length);
}
