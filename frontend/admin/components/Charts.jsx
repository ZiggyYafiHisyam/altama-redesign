import { useState } from "react"

// The two chart forms the analytics page needs, as plain SVG. Both are drawn in a
// fixed viewBox and scaled by the browser, so there is no measuring, no resize
// listener and no charting dependency.
//
// Colours: a single-series bar chart carries no identity, so it wears one brand
// ink. The donut is categorical, and its palette is the validated six-slot order
// (adjacent-pair CVD ΔE 9.1, normal-vision 19.6 on a light surface). Three of the
// six sit under 3:1 against white, which is why the legend always spells out the
// label and the number -- colour is never the only way to read a slice.
const CATEGORICAL = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300"]

const BAR_INK = "#353185"
const BAR_INK_HOVER = "#605BC3"
const GRID = "#e2e8f0"
const AXIS = "#94a3b8"

// Axis ticks on round numbers at roughly the requested count, and a top of scale
// that lands on one -- so the gridlines read as 0/5/10 rather than 0/4.3/8.6.
// Views are whole numbers, hence the step floor of 1.
function niceScale(max, count = 4) {
    if (!Number.isFinite(max) || max <= 0) return { ticks: [0, 1], top: 1 }
    const magnitude = 10 ** Math.floor(Math.log10(max / count || 1))
    const normalised = max / count / magnitude
    const step = Math.max(1, (normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 5 ? 5 : 10) * magnitude)
    const top = Math.ceil(max / step) * step
    const ticks = []
    for (let value = 0; value <= top + 1e-9; value += step) ticks.push(Math.round(value))
    return { ticks, top }
}

// A bar with its top corners rounded and its base square on the axis: the radius
// is clamped so a one-view bar cannot curl into a lens.
function barPath(x, y, width, height, radius = 4) {
    const r = Math.max(0, Math.min(radius, width / 2, height))
    return `M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`
}

function truncate(text, limit) {
    return text.length > limit ? `${text.slice(0, limit - 1)}…` : text
}

// Vertical bars on a measured axis: gridlines behind, ticks at the left, one
// label per column. Built for a dozen or so columns -- past that the caller
// should be slicing a top-N, not shrinking the bars.
export function BarChart({ data, valueLabel = "Views", maxLabel = 16, height = 300 }) {
    const [hover, setHover] = useState(null)

    const WIDTH = 760
    const PAD = { top: 18, right: 12, bottom: 78, left: 52 }
    const plotWidth = WIDTH - PAD.left - PAD.right
    const plotHeight = height - PAD.top - PAD.bottom

    const { ticks, top } = niceScale(Math.max(...data.map((entry) => entry.value), 0))
    const band = plotWidth / Math.max(data.length, 1)
    // 2px of surface between neighbours, and a cap so three bars do not become
    // three billboards.
    const barWidth = Math.max(6, Math.min(band - 10, 64))
    const yOf = (value) => PAD.top + plotHeight - (value / top) * plotHeight

    return (
        <div className="relative">
            <svg
                className="h-auto w-full"
                viewBox={`0 0 ${WIDTH} ${height}`}
                role="img"
                aria-label={`${valueLabel} by page, as a bar chart. The same numbers are in the table below.`}
            >
                {ticks.map((tick) => (
                    <g key={tick}>
                        <line
                            x1={PAD.left}
                            x2={WIDTH - PAD.right}
                            y1={yOf(tick)}
                            y2={yOf(tick)}
                            stroke={tick === 0 ? AXIS : GRID}
                            strokeWidth="1"
                        />
                        <text
                            x={PAD.left - 10}
                            y={yOf(tick) + 4}
                            textAnchor="end"
                            className="fill-slate-400 font-inter text-[11px]"
                        >
                            {tick}
                        </text>
                    </g>
                ))}

                <text
                    transform={`translate(14 ${PAD.top + plotHeight / 2}) rotate(-90)`}
                    textAnchor="middle"
                    className="fill-slate-400 font-inter text-[11px] font-semibold uppercase tracking-wider"
                >
                    {valueLabel}
                </text>

                {data.map((entry, index) => {
                    const x = PAD.left + index * band + (band - barWidth) / 2
                    const y = yOf(entry.value)
                    const isHovered = hover?.index === index
                    return (
                        <g
                            key={entry.label}
                            onMouseEnter={() => setHover({ index, x: x + barWidth / 2, y, entry })}
                            onMouseLeave={() => setHover(null)}
                        >
                            {/* A full-height hit area, so the pointer does not have to
                                find a two-view bar that is four pixels tall. */}
                            <rect
                                x={PAD.left + index * band}
                                y={PAD.top}
                                width={band}
                                height={plotHeight}
                                fill="transparent"
                            />
                            <path
                                d={barPath(x, y, barWidth, PAD.top + plotHeight - y)}
                                fill={isHovered ? BAR_INK_HOVER : BAR_INK}
                            />
                            <text
                                x={x + barWidth / 2}
                                y={y - 7}
                                textAnchor="middle"
                                className="fill-slate-500 font-inter text-[11px] font-semibold"
                            >
                                {entry.value}
                            </text>
                            <text
                                x={0}
                                y={0}
                                transform={`translate(${x + barWidth / 2} ${PAD.top + plotHeight + 14}) rotate(-35)`}
                                textAnchor="end"
                                className="fill-slate-500 font-inter text-[11px]"
                            >
                                {truncate(entry.label, maxLabel)}
                            </text>
                        </g>
                    )
                })}
            </svg>

            {hover && (
                <div
                    className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900/90 px-3 py-2 font-inter text-xs text-white shadow-lg"
                    style={{ left: `${(hover.x / WIDTH) * 100}%`, top: `${(hover.y / height) * 100 - 2}%` }}
                >
                    <p className="font-semibold">{hover.entry.label}</p>
                    <p className="text-white/70">
                        {hover.entry.value} {hover.entry.value === 1 ? "view" : "views"}
                        {hover.entry.share != null && ` · ${hover.entry.share}%`}
                    </p>
                </div>
            )}
        </div>
    )
}

function polar(cx, cy, radius, fraction) {
    // Angles run clockwise from twelve o'clock, which is where a reader starts.
    const angle = fraction * 2 * Math.PI - Math.PI / 2
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]
}

function donutSlice(cx, cy, outer, inner, from, to) {
    const [x1, y1] = polar(cx, cy, outer, from)
    const [x2, y2] = polar(cx, cy, outer, to)
    const [x3, y3] = polar(cx, cy, inner, to)
    const [x4, y4] = polar(cx, cy, inner, from)
    const large = to - from > 0.5 ? 1 : 0
    return `M${x1},${y1} A${outer},${outer} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${inner},${inner} 0 ${large} 0 ${x4},${y4} Z`
}

// Part-to-whole at a glance, capped at six segments by the caller. The legend is
// not decoration: it carries the label and the number for every slice, which is
// what lets the chart be read without relying on the colours.
export function DonutChart({ data, total, centerLabel = "visits" }) {
    const [hover, setHover] = useState(null)
    const SIZE = 220
    const cx = SIZE / 2
    const cy = SIZE / 2
    const outer = 100
    const inner = 60

    // Each slice starts where the ones before it ended, so the fractions are
    // accumulated rather than tracked in a running variable.
    const slices = data.map((entry, index) => {
        const before = data.slice(0, index).reduce((sum, item) => sum + item.value, 0)
        const from = total > 0 ? before / total : 0
        const to = total > 0 ? (before + entry.value) / total : 0
        return { ...entry, from, to, color: CATEGORICAL[index % CATEGORICAL.length] }
    })

    return (
        <div className="flex flex-wrap items-center gap-6">
            <svg
                width={SIZE}
                height={SIZE}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="shrink-0"
                role="img"
                aria-label="Share of visits by source. The same numbers are listed beside the chart."
            >
                {/* One source means one full ring: an arc from 0 to 1 collapses to a
                    point, so it is drawn as a stroked circle instead. */}
                {slices.length === 1 ? (
                    <circle
                        cx={cx}
                        cy={cy}
                        r={(outer + inner) / 2}
                        fill="none"
                        stroke={slices[0].color}
                        strokeWidth={outer - inner}
                    />
                ) : (
                    slices.map((slice) => (
                        <path
                            key={slice.label}
                            d={donutSlice(cx, cy, outer, inner, slice.from, slice.to)}
                            fill={slice.color}
                            // A 2px surface gap between neighbouring fills.
                            stroke="#ffffff"
                            strokeWidth="2"
                            opacity={hover && hover !== slice.label ? 0.45 : 1}
                            onMouseEnter={() => setHover(slice.label)}
                            onMouseLeave={() => setHover(null)}
                        />
                    ))
                )}

                <text
                    x={cx}
                    y={cy - 4}
                    textAnchor="middle"
                    className="fill-slate-900 font-header text-2xl font-semibold"
                >
                    {total}
                </text>
                <text
                    x={cx}
                    y={cy + 15}
                    textAnchor="middle"
                    className="fill-slate-400 font-inter text-[11px] uppercase tracking-wider"
                >
                    {centerLabel}
                </text>
            </svg>

            <ul className="flex min-w-50 flex-1 flex-col gap-2">
                {slices.map((slice) => (
                    <li
                        key={slice.label}
                        className={`flex items-center gap-2.5 rounded-lg px-2 py-1 transition-colors ${
                            hover === slice.label ? "bg-slate-50" : ""
                        }`}
                        onMouseEnter={() => setHover(slice.label)}
                        onMouseLeave={() => setHover(null)}
                    >
                        <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ background: slice.color }}
                        />
                        <span className="min-w-0 flex-1 truncate font-inter text-sm text-slate-600" title={slice.label}>
                            {slice.label}
                        </span>
                        <span className="font-inter text-sm font-semibold text-slate-700">{slice.value}</span>
                        <span className="w-12 text-right font-inter text-xs text-slate-400">
                            {total > 0 ? Math.round((slice.value / total) * 100) : 0}%
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

// The shape of one day: 24 columns, one per hour, on the same measured axis as
// the bar chart above. Quiet hours keep a visible baseline tick so the strip
// reads as a full day rather than as a few floating bars.
export function HourStrip({ hours, height = 150 }) {
    const [hover, setHover] = useState(null)

    const WIDTH = 760
    const PAD = { top: 16, right: 10, bottom: 26, left: 40 }
    const plotWidth = WIDTH - PAD.left - PAD.right
    const plotHeight = height - PAD.top - PAD.bottom
    const { ticks, top } = niceScale(Math.max(...hours.map((entry) => entry.value), 0), 2)
    const band = plotWidth / 24
    const barWidth = band - 4
    const yOf = (value) => PAD.top + plotHeight - (value / top) * plotHeight
    const busiest = hours.reduce((best, entry) => (entry.value > best.value ? entry : best), hours[0])

    return (
        <div className="relative">
            <svg
                className="h-auto w-full"
                viewBox={`0 0 ${WIDTH} ${height}`}
                role="img"
                aria-label="Page views by hour of the day. The visits are listed in the table below."
            >
                {ticks.map((tick) => (
                    <g key={tick}>
                        <line
                            x1={PAD.left}
                            x2={WIDTH - PAD.right}
                            y1={yOf(tick)}
                            y2={yOf(tick)}
                            stroke={tick === 0 ? AXIS : GRID}
                            strokeWidth="1"
                        />
                        <text
                            x={PAD.left - 8}
                            y={yOf(tick) + 4}
                            textAnchor="end"
                            className="fill-slate-400 font-inter text-[10px]"
                        >
                            {tick}
                        </text>
                    </g>
                ))}

                {hours.map((entry) => {
                    const x = PAD.left + entry.hour * band + 2
                    const y = entry.value > 0 ? yOf(entry.value) : PAD.top + plotHeight - 2
                    const isHovered = hover?.hour === entry.hour
                    return (
                        <g
                            key={entry.hour}
                            onMouseEnter={() => setHover({ ...entry, x: x + barWidth / 2, y })}
                            onMouseLeave={() => setHover(null)}
                        >
                            <rect
                                x={PAD.left + entry.hour * band}
                                y={PAD.top}
                                width={band}
                                height={plotHeight}
                                fill="transparent"
                            />
                            <path
                                d={barPath(x, y, barWidth, PAD.top + plotHeight - y, 3)}
                                fill={
                                    entry.value === 0
                                        ? GRID
                                        : isHovered || entry.hour === busiest.hour
                                          ? BAR_INK_HOVER
                                          : BAR_INK
                                }
                            />
                            {entry.hour % 3 === 0 && (
                                <text
                                    x={x + barWidth / 2}
                                    y={PAD.top + plotHeight + 15}
                                    textAnchor="middle"
                                    className="fill-slate-400 font-inter text-[10px]"
                                >
                                    {`${entry.hour}`.padStart(2, "0")}
                                </text>
                            )}
                        </g>
                    )
                })}
            </svg>

            {hover && (
                <div
                    className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900/90 px-3 py-2 font-inter text-xs text-white shadow-lg"
                    style={{ left: `${(hover.x / WIDTH) * 100}%`, top: `${(hover.y / height) * 100 - 2}%` }}
                >
                    <p className="font-semibold">
                        {`${hover.hour}`.padStart(2, "0")}:00 – {`${hover.hour}`.padStart(2, "0")}:59
                    </p>
                    <p className="text-white/70">
                        {hover.value} {hover.value === 1 ? "view" : "views"}
                    </p>
                </div>
            )}
        </div>
    )
}
