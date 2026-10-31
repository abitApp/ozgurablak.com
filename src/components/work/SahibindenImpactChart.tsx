"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { sahibindenImpactChart } from "@/content/sahibinden-charts";

function ticks(min: number, max: number, step: number) {
  const values: number[] = [];
  for (let v = min; v <= max + 1e-9; v += step) {
    values.push(Math.round(v * 10) / 10);
  }
  return values;
}

/** Sahibinden Impact — fills media panel (no scroll); Vodafone-style chrome. */
export function SahibindenImpactChart() {
  const chart = sahibindenImpactChart;

  return (
    <figure className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-white/[0.12] bg-[#16110e]/50 text-ink shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <div className="flex shrink-0 items-start justify-between gap-4 px-5 pt-4 pb-1 md:px-6 md:pt-5">
        <div className="self-start">
          <h4 className="mb-1 text-sm font-normal leading-none tracking-tight text-ink">
            {chart.title}
          </h4>
        </div>
        <p className="self-start text-sm leading-none text-ink-muted">
          {chart.platform}
        </p>
      </div>

      <div className="relative min-h-0 flex-1 px-2 pb-2 md:px-3">
        <div className="h-full w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chart.data}
              margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="0"
                vertical
              />
              <XAxis
                dataKey="label"
                interval={0}
                tick={{ fill: "#9a8d82", fontSize: 9 }}
                tickMargin={6}
                angle={-90}
                textAnchor="end"
                height={58}
                axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.12)" }}
              />
              <YAxis
                domain={[chart.yMin, chart.yMax]}
                ticks={ticks(chart.yMin, chart.yMax, chart.yTick)}
                tick={{ fill: "#9a8d82", fontSize: 11 }}
                width={36}
                axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.12)" }}
              />
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.18)" }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const point = payload[0];
                  if (
                    point?.value == null ||
                    Number.isNaN(Number(point.value))
                  ) {
                    return null;
                  }
                  return (
                    <div className="rounded-[10px] border border-white/12 bg-[#1c1713]/92 px-3 py-2 text-xs text-ink shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                      <p className="mb-1 text-ink-muted">{label}</p>
                      <p style={{ color: chart.lineColor }}>
                        {Number(point.value).toFixed(1)}
                      </p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                name="Mobile"
                stroke={chart.lineColor}
                strokeWidth={2}
                dot={{
                  r: 3.5,
                  strokeWidth: 0,
                  fill: chart.lineColor,
                }}
                activeDot={{
                  r: 5.5,
                  fill: chart.lineColor,
                  stroke: "#16110e",
                  strokeWidth: 2,
                }}
                isAnimationActive
                animationDuration={900}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </figure>
  );
}
