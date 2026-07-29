import { getCompanyProfile } from "@/actions/company-profile-action";

function hslStringToCss(hsl: string): string {
  const normalized = hsl.includes("/") ? hsl.split("/").join(" ") : hsl;
  const parts = normalized.replace(/%/g, "").split(" ");
  const h = parseFloat(parts[0]) || 0;
  let s = parseFloat(parts[1]) || 0;
  let l = parseFloat(parts[2]) || 0;
  const a = parts[3] !== undefined ? parseFloat(parts[3]) : 100;

  s /= 100;
  l /= 100;
  const chroma = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - chroma * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  const hex = `#${f(0)}${f(8)}${f(4)}`;
  if (a < 100) {
    const alphaHex = Math.round((a / 100) * 255)
      .toString(16)
      .padStart(2, "0");
    return hex + alphaHex;
  }
  return hex;
}

export async function ThemeStyles({ children }: { children: React.ReactNode }) {
  const company = await getCompanyProfile();

  const styles: Record<string, string> = {};

  if (company?.primaryColor) {
    const hex = hslStringToCss(company.primaryColor);
    styles["--primarymain"] = hex;
    styles["--color-primarymain"] = hex;
  }
  if (company?.secondaryColor) {
    const hex = hslStringToCss(company.secondaryColor);
    styles["--secondarymain"] = hex;
    styles["--color-secondarymain"] = hex;
  }

  return (
    <div style={styles} className="contents">
      {children}
    </div>
  );
}
