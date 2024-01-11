"use client";

// TODO: Type the d3 code correctly.
// @ts-ignore
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import type { Molecule, Universe, MoleculeStructureType } from "@/app/page";

const tpsa = [-10, 200];
const wlogp = [-4, 8];

export default function BoiledEgg({
  molecules,
  hia,
  bbb,
  onBrush,
}: {
  molecules: Molecule[];
  hia: Universe[];
  bbb: Universe[];
  onBrush: (value: MoleculeStructureType[] | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Molecule[]>(molecules);

  useEffect(() => {
    const empty = d3.select(containerRef.current).select("svg").empty();

    if (!empty) {
      return;
    }

    // Specify the chart’s dimensions.
    const width = 928;
    const height = 600;
    const marginTop = 25;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    // Create the horizontal (x) scale, positioning N/A values on the left margin.
    const x = d3
      .scaleLinear()
      .domain(tpsa)
      .nice()
      .range([marginLeft, width - marginRight])
      .unknown(marginLeft);

    // Create the vertical (y) scale, positioning N/A values on the bottom margin.
    const y = d3
      .scaleLinear()
      .domain(wlogp)
      .nice()
      .range([height - marginBottom, marginTop])
      .unknown(height - marginBottom);

    // Create the area generator.
    const area = d3
      .area()
      .x((d: Universe) => x(d["TPSA"]))
      .y0((d: Universe) => y(d["WLOGP"]))
      .y1(0);

    // Create the SVG container.
    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .property("value", []);

    // Append the axes.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width - marginRight)
      .attr("y", -4)
      .attr("stroke", "none")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text("TPSA (Å²)");

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr("stroke", "none")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text("WLOGP");

    // Append the white area.
    svg
      .append("path")
      .attr("d", area(hia))
      .style("fill", "#FFFFFF")
      .style("fill-opacity", "0.7");

    // Append the yolk.
    svg
      .append("g")
      .append("path")
      .attr("d", area(bbb))
      .style("fill", "#FFD700")
      .style("fill-opacity", "0.5");

    // Plot molecules as dots.
    const dot = svg
      .append("g")
      .attr("fill", "#62A6CD")
      .attr("stroke", "#62A6CD")
      .style("fill-opacity", "0.5")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr(
        "transform",
        (d: Molecule) => `translate(${x(d["TPSA"])},${y(d["WLOGP"])})`,
      )
      .attr("r", 4);

    // Define the brush.
    svg.call(
      d3
        .brush()
        .on(
          "start brush end",
          ({ selection }: { selection: [number[], number[]] }) => {
            let value = [];

            if (selection) {
              const [[x0, y0], [x1, y1]] = selection;
              value = dot
                .style("fill-opacity", ".5")
                .filter(
                  (d: Molecule) =>
                    x0 <= x(d["TPSA"]) &&
                    x(d["TPSA"]) < x1 &&
                    y0 <= y(d["WLOGP"]) &&
                    y(d["WLOGP"]) < y1,
                )
                .style("fill-opacity", "1")

                .data();
              onBrush(value);
            } else {
              onBrush(null);
              dot.style("fill-opacity", "0.5");
            }
          },
        ),
    );
  }, [onBrush, bbb, data, hia]);

  return (
    <div
      className="flex justify-center"
      ref={containerRef}
      style={{ height: 500 }}
    />
  );
}
