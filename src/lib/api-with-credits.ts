/**
 * Utility function to make API calls and automatically update credits
 * This function extracts the remaining credits from the response header
 * and updates the credits context
 */

export async function apiWithCreditsUpdate(
  url: string,
  options: RequestInit = {},
  onCreditsUpdate?: (credits: number) => void
): Promise<Response> {
  const response = await fetch(url, options);

  // Extract remaining credits from response header
  const remainingCredits = response.headers.get("X-Remaining-Credits");

  // Update credits if header is present
  if (remainingCredits !== null && onCreditsUpdate) {
    const credits = parseInt(remainingCredits, 10);
    if (!isNaN(credits)) {
      onCreditsUpdate(credits);
    }
  }

  return response;
}
