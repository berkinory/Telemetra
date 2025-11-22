export async function getCountryFromIP(ip: string): Promise<string | null> {
  try {
    if (
      ip === '127.0.0.1' ||
      ip === 'localhost' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('172.')
    ) {
      return null;
    }

    const token = process.env.IPINFO_TOKEN;
    if (!token) {
      return null;
    }

    const response = await fetch(
      `https://api.ipinfo.io/lite/${ip}/country?token=${token}`
    );

    if (!response.ok) {
      return null;
    }

    const country = (await response.text()).trim();

    return country || null;
  } catch {
    return null;
  }
}
