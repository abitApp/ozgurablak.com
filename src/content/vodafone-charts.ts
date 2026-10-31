export type MarketKey = "DE" | "ES" | "IE" | "IT" | "GR" | "UK";

export type AppRatingPoint = {
  date: string;
  label: string;
  DE?: number | null;
  ES?: number | null;
  IE?: number | null;
  IT?: number | null;
  GR?: number | null;
  UK?: number | null;
};

/** Tuned for dark project-card surfaces */
export const MARKET_COLORS: Record<MarketKey, string> = {
  DE: "#FFFFFF",
  ES: "#D4A574",
  IE: "#F2C94C",
  IT: "#B794F4",
  GR: "#308453",
  UK: "#826076",
};

export const MARKETS: MarketKey[] = ["DE", "ES", "IE", "IT", "GR", "UK"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatLabel(d: Date) {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)}`;
}

function iso(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function weeksBetween(start: Date, end: Date) {
  const dates: Date[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 7);
  }
  return dates;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

/** Approximate weekly series reconstructed from the Phoenix weekly-activities slides. */
function buildSeries(
  start: Date,
  end: Date,
  sample: (index: number, total: number, date: Date) => Omit<AppRatingPoint, "date" | "label">,
): AppRatingPoint[] {
  const dates = weeksBetween(start, end);
  const total = Math.max(1, dates.length - 1);
  return dates.map((date, index) => {
    const values = sample(index, total, date);
    return {
      date: iso(date),
      label: formatLabel(date),
      ...values,
    };
  });
}

export const phoenixIosRatings: AppRatingPoint[] = buildSeries(
  new Date(2022, 10, 16),
  new Date(2023, 10, 8),
  (index, total) => {
    const t = index / total;
    const DE = round1(3.75 + Math.sin(index * 0.35) * 0.05);
    const ES = round1(lerp(3.1, 3.85, Math.min(1, t * 1.15)));
    const IE = round1(
      t < 0.12
        ? lerp(2.6, 2.75, t / 0.12)
        : t < 0.45
          ? lerp(2.75, 4.05, (t - 0.12) / 0.33)
          : lerp(4.05, 4.1, (t - 0.45) / 0.55),
    );
    const IT = round1(3.5 + Math.sin(index * 0.2) * 0.03);
    const GR =
      t < 0.55
        ? null
        : t < 0.62
          ? 3.0
          : round1(lerp(3.0, 2.6, Math.min(1, (t - 0.62) / 0.12)));
    const UK = round1(4.3 + Math.sin(index * 0.25) * 0.05);
    return { DE, ES, IE, IT, GR, UK };
  },
);

export const phoenixAndroidRatings: AppRatingPoint[] = buildSeries(
  new Date(2022, 10, 9),
  new Date(2023, 10, 8),
  (index, total, date) => {
    const t = index / total;
    let DE = 4.35;
    if (t < 0.12) DE = lerp(4.4, 3.85, t / 0.12);
    else if (t < 0.28) DE = lerp(3.85, 4.45, (t - 0.12) / 0.16);
    else DE = 4.1 + Math.sin(index * 0.4) * 0.15;
    DE = round1(clamp(DE, 3.8, 4.5));

    const ES = round1(4.15 + Math.sin(index * 0.22) * 0.1);
    const IE = round1(
      t < 0.15
        ? 1.35 + Math.sin(index * 0.5) * 0.08
        : t < 0.45
          ? lerp(1.4, 3.65, (t - 0.15) / 0.3)
          : lerp(3.65, 3.75, (t - 0.45) / 0.55),
    );
    const IT = round1(lerp(3.15, 3.8, t));
    const grStart = new Date(2023, 4, 24);
    const GR = date < grStart ? null : 5.0;
    const UK = round1(4.35 + Math.sin(index * 0.18) * 0.08);
    return { DE, ES, IE, IT, GR, UK };
  },
);

export type PhoenixChartId = "phoenix-ios" | "phoenix-android";

export const phoenixCharts: Record<
  PhoenixChartId,
  {
    id: PhoenixChartId;
    title: string;
    product: string;
    platform: string;
    metric: string;
    yMax: number;
    yTick: number;
    footer: string;
    data: AppRatingPoint[];
  }
> = {
  "phoenix-ios": {
    id: "phoenix-ios",
    title: "Weekly Activities",
    product: "Phoenix",
    platform: "iOS",
    metric: "App ratings",
    yMax: 5,
    yTick: 0.5,
    footer: "15  |  Insert Confidentiality level  |  8 November 2023",
    data: phoenixIosRatings,
  },
  "phoenix-android": {
    id: "phoenix-android",
    title: "Weekly Activities",
    product: "Phoenix",
    platform: "Android",
    metric: "App ratings",
    yMax: 6,
    yTick: 1,
    footer: "14  |  Insert Confidentiality level  |  8 November 2023",
    data: phoenixAndroidRatings,
  },
};
