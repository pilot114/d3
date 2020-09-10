<template>
      <svg
        :viewBox="viewBox"
        :id="uniqId"
      >
        <g>
          <!-- переиспользуемые стрелочки -->
          <defs>
            <marker id="arrowhead" viewBox="-0 -5 10 10" refX="18" refY="0" orient="auto" markerWidth="13" markerHeight="13" xoverflow="visible">
              <path d="M 0,-3 L 10 ,0 L 0,3" fill="#999" style="stroke: none;"></path>
            </marker>
          </defs>
        </g>
      </svg>
</template>

<script>
    import * as d3 from "d3";

    export default {
        name: 'Graph',
        components: {},
        props: {
            h: {
                type: Number,
            },
            w: {
                type: Number,
            },
        },

        computed: {
          uniqId() {
              return 'graph' + this._uid;
          },
          nodes() {
            return new Array(100).fill(0).map((x, i) => {
              return {
                  id: i,
                  group: Math.round(Math.random()*9),
                  name: "test",
                }
            });
          },
          links() {
            return new Array(100).fill(0).map(() => {
              return {
                source: Math.round(Math.random()*49),
                target: Math.round(Math.random()*49),
              }
            });
          },
          width() {
            return this.w || 1000;
          },
          height() {
            let aspect = window.innerHeight / window.innerWidth;
            return this.h || Math.round(aspect * this.width) - 160;
          },
          viewBox() {
            return [0, 0, this.width, this.height];
          },
        },

        mounted() {
            this.chart();
        },
        methods: {
            chart() {
                let links = this.links;
                let nodes = this.nodes;

                // function boxingForce() {
                //     let xExtent = [10, this.width-10];
                //     let yExtent = [10, this.height-10];
                //     for (let node of nodes) {
                //         node.x = Math.max(xExtent[0], Math.min(xExtent[1], node.x));
                //         node.y = Math.max(yExtent[0], Math.min(yExtent[1], node.y));
                //     }
                // }

                const simulation = d3.forceSimulation(nodes)
                    .force("link", d3.forceLink(links).id(d => d.id).distance(100).iterations(10))
                    .force("charge", d3.forceManyBody().strength(-100))
                    .force("center", d3.forceCenter(this.width / 2, this.height / 2))
                    // чтобы не разбегались
                    .force("x", d3.forceX())
                    .force("y", d3.forceY())
                    // .force("bounds", boxingForce);
                    // .velocityDecay(0.5);

                simulation.on("tick", () => {
                    link
                        .attr("x1", d => d.source.x)
                        .attr("y1", d => d.source.y)
                        .attr("x2", d => d.target.x)
                        .attr("y2", d => d.target.y);
                    node
                        .attr("fill", d => {
                          return colorScale(d.group);
                          // return colorScale(Math.round(Math.random()*10))
                        })
                        .attr("x", d => d.x - 10)
                        .attr("y", d => d.y - 10);
                    text
                        .attr("x", d => d.x - 10)
                        .attr("y", d => d.y - 10);
                });

                const pane = d3.select('#' + this.uniqId)
                    // fluent способ передать svg в функцию зума
                    .call(
                      d3.zoom()
                      .extent([[0, 0], [this.width, this.height]])
                      .scaleExtent([0.1, 5])
                      .on("zoom", ({transform}) => { pane.attr("transform", transform) })
                    ).select('g');

                const link = pane.append("g")
                    .selectAll("line")
                    .data(links)
                    .join("line")
                    .attr("stroke", "#999")
                    .attr("stroke-opacity", 0.6)
                    .attr('marker-end', 'url(#arrowhead)');

                const group = pane.append("g")
                    .selectAll("g")
                    .data(nodes)
                    .join("g");

                let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

                const node = group.append("rect")
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 1.5)
                    .attr("width", 20)
                    .attr("height", 20)
                    .attr("fill", d => colorScale(d.group))
                    .call(this.drag(simulation));

                const text = group.append("text")
                    .attr("color", "#FFF")
                    .text(d => d.name);
            },
            drag(simulation) {

                function dragstarted(event, d) {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }

                function dragged(event, d) {
                    d.fx = event.x;
                    d.fy = event.y;
                }

                function dragended(event, d) {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                    // simulation.stop();
                }

                return d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended);
            },
        }
    }
</script>