"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  MARKETS,
  MARKET_COLORS,
  phoenixCharts,
  type MarketKey,
  type PhoenixChartId,
} from "@/content/vodafone-charts";

type AppRatingsChartProps = {
  chartId: PhoenixChartId;
};

/** Non-IE series + legend (both iOS & Android charts) */
const SECONDARY_OPACITY = 0.5;

function ticks(max: number, step: number) {
  const values: number[] = [];
  for (let v = 0; v <= max + 1e-9; v += step) {
    values.push(Math.round(v * 10) / 10);
  }
  return values;
}

function hexToRgba(hex: string, alpha: number) {
  const raw = hex.replace("#", "");
  const n =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  const r = Number.parseInt(n.slice(0, 2), 16);
  const g = Number.parseInt(n.slice(2, 4), 16);
  const b = Number.parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function AppRatingsChart({ chartId }: AppRatingsChartProps) {
  const chart = phoenixCharts[chartId];

  return (
    <figure className="flex w-full shrink-0 flex-col overflow-hidden rounded-xl border border-white/[0.12] bg-[#16110e]/50 text-ink shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-2 md:px-6 md:pt-6">
        <div className="self-start">
          <h4 className="mb-1 text-sm font-normal leading-none tracking-tight text-ink">
            {chart.title}
          </h4>
        </div>
        <p className="self-start text-sm leading-none text-ink-muted">
          {chart.platform}
        </p>
      </div>

      <div className="relative px-2 pb-2 md:px-3">
        <p className="absolute top-1/2 left-1 z-10 origin-center -translate-y-1/2 -rotate-90 text-[0.7rem] font-normal tracking-wide text-ink uppercase">
          {chart.metric}
        </p>

        <div className="h-[240px] w-full pl-6 sm:h-[280px] md:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chart.data}
              margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="0"
                vertical
              />
              <XAxis
                dataKey="label"
                interval="preserveStartEnd"
                minTickGap={18}
                tick={{ fill: "#9a8d82", fontSize: 9 }}
                tickMargin={6}
                angle={-90}
                textAnchor="end"
                height={70}
                axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.12)" }}
              />
              <YAxis
                domain={[0, chart.yMax]}
                ticks={ticks(chart.yMax, chart.yTick)}
                tick={{ fill: "#9a8d82", fontSize: 11 }}
                width={36}
                axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.12)" }}
              />
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.18)" }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const ie = payload.find((item) => item.dataKey === "IE");
                  if (!ie || ie.value == null || Number.isNaN(Number(ie.value))) {
                    return null;
                  }
                  return (
                    <div className="rounded-[10px] border border-white/12 bg-[#1c1713]/92 px-3 py-2 text-xs text-ink shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                      <p className="mb-1 text-ink-muted">{label}</p>
                      <p style={{ color: MARKET_COLORS.IE }}>
                        IE : {Number(ie.value).toFixed(1)}
                      </p>
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={40}
                content={() => (
                  <ul className="mt-1 flex list-none flex-wrap items-center justify-center gap-x-4 gap-y-1 p-0 text-xs">
                    {MARKETS.map((market) => {
                      const isIe = market === "IE";
                      const color = isIe
                        ? MARKET_COLORS.IE
                        : hexToRgba(MARKET_COLORS[market], SECONDARY_OPACITY);
                      return (
                        <li
                          key={market}
                          className="inline-flex items-center gap-1.5"
                        >
                          <span
                            className="inline-block h-px w-3"
                            style={{ backgroundColor: color }}
                            aria-hidden
                          />
                          <span style={{ color }}>{market}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              />
              {MARKETS.map((market) => {
                const isIeDots = market === "IE";
                const color = MARKET_COLORS[market as MarketKey];
                const stroke = isIeDots
                  ? "transparent"
                  : hexToRgba(color, SECONDARY_OPACITY);
                return (
                  <Line
                    key={market}
                    type="linear"
                    dataKey={market}
                    name={market}
                    stroke={stroke}
                    strokeWidth={isIeDots ? 0 : 1.5}
                    strokeOpacity={1}
                    legendType="none"
                    dot={
                      isIeDots
                        ? {
                            r: 3.5,
                            strokeWidth: 0,
                            fill: MARKET_COLORS.IE,
                            fillOpacity: 1,
                          }
                        : false
                    }
                    activeDot={
                      isIeDots
                        ? {
                            r: 5.5,
                            fill: MARKET_COLORS.IE,
                            fillOpacity: 1,
                            stroke: "#16110e",
                            strokeWidth: 2,
                          }
                        : false
                    }
                    connectNulls={false}
                    isAnimationActive
                    animationDuration={700}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </figure>
  );
}
