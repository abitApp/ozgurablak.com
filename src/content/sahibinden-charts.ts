export type SahibindenImpactPoint = {
  date: string;
  label: string;
  value: number;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Monthly points 06/2014 → 05/2015; yellow series rises 25 → 60. */
function buildMobileShareSeries(): SahibindenImpactPoint[] {
  const points: SahibindenImpactPoint[] = [];
  const startYear = 2014;
  const startMonth = 5; // June (0-indexed)
  const months = 12; // 06/2014 … 05/2015

  for (let i = 0; i < months; i++) {
    const d = new Date(startYear, startMonth + i, 1);
    const t = i / (months - 1);
    const value = Math.round(lerp(25, 60, t) * 10) / 10;
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    points.push({
      date: `${year}-${pad(month)}-01`,
      label: `${pad(month)}/${year}`,
      value,
    });
  }

  return points;
}

export const sahibindenImpactChart = {
  id: "sahibinden-mobile" as const,
  title: "Mobile ad postings",
  platform: "iOS & Android",
  metric: "Share index",
  yMin: 10,
  yMax: 100,
  yTick: 10,
  lineColor: "#F2C94C",
  data: buildMobileShareSeries(),
};

export type SahibindenChartId = typeof sahibindenImpactChart.id;
