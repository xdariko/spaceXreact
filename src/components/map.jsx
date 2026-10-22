import * as d3 from "d3";
import * as Geo from "../geo.json";
import { useRef, useEffect } from "react";

function Map(props) {
    const width = 1000;
    const height = 600;
    const margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 100
    };
    const containerRef = useRef(null);
    useEffect(() => {
        d3.select(containerRef.current).selectAll("*").remove();
        const svg = d3.select(containerRef.current).append("svg");
        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

        const projection = d3.geoMercator()
            .scale(70)
            .center([0, 20])
            .translate([width / 2 - margin.left, height / 2 - margin.top]);
        const g = svg.append("g");

        g.selectAll("path")
            .data(Geo.features)
            .enter()
            .append("path")
            .attr("class", "topo")
            .attr("d", d3.geoPath().projection(projection))
            .style("opacity", .7)

        g.selectAll("circle")
            .data(props.launchpads)
            .enter()
            .append("circle")
            .attr("class", "launchpad")
            .attr("cx", d => projection([d.longitude, d.latitude])[0])
            .attr("cy", d => projection([d.longitude, d.latitude])[1])
            .attr("r", 4)
            .append("title")
            .text(d => `${d.name}\n${d.location}`)

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', function (event) {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);
    }, [props.launchpads]);

    useEffect(() => {
        d3.select(containerRef.current).selectAll(".launchpad")
            .classed("active", d => d.id === props.activePad)
            .filter(d => d.id === props.activePad)
            .raise();
    }, [props.activePad]);

    return (
        <div className="mapContainer map" ref={containerRef}>
        </div>
    )
}

export { Map }
