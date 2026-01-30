export async function fetchIcs(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch source calendar");
  }
  return await res.text();
}
