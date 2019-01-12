import React, { Component } from "react"
import { line, curveNatural, area } from "d3-shape"
import { scaleLinear } from "d3-scale"

class Graph extends Component {
    render() {
        const { maxPoints = 10, data } = this.props

        // gets the last <maxPoints> points
        let slice =
            data.length > maxPoints ? data.slice(data.length - maxPoints) : data

        // parse data to put undefined points in the right positions
        // so that when drawing the line it interrupts before points with disconnected=true
        let parseSlice = slice =>
            slice.reduce(
                (acc, el) => [
                    ...acc,
                    ...(el[2]
                        ? [el]
                        : [[el[0], el[1], false], [el[0], el[1], true]]),
                ],
                []
            )
        let parsedData = parseSlice(slice)

        const xData = parsedData.map(el => el[0])
        const yData = parsedData.map(el => el[1])

        const domainX = [Math.min(...xData), Math.max(...xData)]
        const rangeX = [40, 410]

        const domainY = [Math.min(...yData), Math.max(...yData)]
        const rangeY = [195, 20] // reversed because the y axis is reversed in SVG

        const scaleX = scaleLinear()
            .domain(domainX)
            .range(rangeX)

        const scaleY = scaleLinear()
            .domain(domainY)
            .range(rangeY)

        const circles = parsedData.map(d => (
            <circle
                cx={scaleX(d[0])}
                cy={scaleY(d[1])}
                r={5}
                fill={"#0057cb"}
                stroke="none"
                key={d}
            />
        ))

        // another slice with an extra point to render the starting bit of the line
        let slicePlus1 =
            data.length > maxPoints
                ? data.slice(data.length - maxPoints - 1)
                : data
        let parsedData2 = parseSlice(slicePlus1)

        const areaD = area()
            .x(d => scaleX(d[0]))
            .y1(d => scaleY(d[1]))
            .y0(() => 225)
            .defined(d => d[2])
            .curve(curveNatural)(parsedData2)

        const lineD = line()
            .x(d => scaleX(d[0]))
            .y(d => scaleY(d[1]))
            .defined(d => d[2])
            .curve(curveNatural)(parsedData2)

        const xTicks = scaleX.ticks(4)
        const yTicks = scaleY.ticks(4)

        const xFormat = scaleX.tickFormat(4)
        const yFormat = scaleY.tickFormat(4)

        return (
            <svg height="230" width="420" fill="none" stroke="black">
                {/* x and y axis ticks and labels */}
                {xTicks.map(tick => (
                    <React.Fragment>
                        <line
                            x1={scaleX(tick)}
                            x2={scaleX(tick)}
                            y1="205"
                            y2="215"
                            stroke="black"
                            key={"xTick" + tick}
                        />
                        <text
                            x={scaleX(tick)}
                            y="225"
                            fontFamily="Verdana"
                            fontSize="10"
                            fill="black"
                            stroke="none"
                            textAnchor="middle"
                            key={"xLabel" + tick}
                        >
                            {xFormat(tick)}
                        </text>
                    </React.Fragment>
                ))}
                {yTicks.map(tick => (
                    <React.Fragment>
                        <line
                            x1="15"
                            x2="415"
                            y1={scaleY(tick)}
                            y2={scaleY(tick)}
                            stroke="lightgray"
                            key={"yTick" + tick}
                        />
                        <text
                            x="25"
                            y={scaleY(tick)}
                            dy="-2"
                            fontFamily="Verdana"
                            fontSize="10"
                            fill="black"
                            stroke="none"
                            textAnchor="end"
                            key={"yLabel" + tick}
                        >
                            {yFormat(tick)}
                        </text>
                    </React.Fragment>
                ))}

                {/* x and y axis */}
                <line
                    x1="5"
                    x2="415"
                    y1="210"
                    y2="210"
                    stroke="black"
                    key="xAxis"
                />
                <line
                    x1="30"
                    x2="30"
                    y1="5"
                    y2="225"
                    stroke="black"
                    key="yAxis"
                />

                {/* curve, area and dots below the curve */}
                <path d={lineD} key="path" stroke="#0057cb" />
                {circles}
            </svg>
        )
    }
}

export default Graph
