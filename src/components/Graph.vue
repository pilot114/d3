<template>
      <svg
        :viewBox="viewBox"
        :id="uniqId"
      >
        <g>
          <!-- переиспользуемые элементы -->
          <defs>
            <!-- стрелочки -->
            <marker id="arrowhead" viewBox="-0 -5 10 10" refX="18" refY="0" orient="auto" markerWidth="13" markerHeight="13" xoverflow="visible">
              <path d="M 0,-3 L 10 ,0 L 0,3" fill="#999" style="stroke: none;"></path>
            </marker>
          </defs>
        </g>
      </svg>
</template>

<script>
    import * as d3 from "d3";

    import Graph from 'javascript-algorithms-and-data-structures/src/data-structures/graph/Graph';
    import GraphVertex from 'javascript-algorithms-and-data-structures/src/data-structures/graph/GraphVertex';
    import GraphEdge from 'javascript-algorithms-and-data-structures/src/data-structures/graph/GraphEdge';

    let simulation = null;

    export default {
        name: 'Graph',
        components: {},
        props: {
          // высота в пикселях
            h: {
                type: Number,
            },
            // ширина в пикселях
            w: {
                type: Number,
            },
            // узлы графа
            nodes: {
                type: Array,
            },
            // рёбра графа
            links: {
                type: Array,
            },
        },

        computed: {
          uniqId() {
              return 'graph' + this._uid;
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

            this.prepareGraph();
        },
        methods: {
            // выгрузка графа в стуктуру для работы с алгоритмами графов
            prepareGraph() {
              const graph = new Graph();

              for(let node of this.nodes) {
                graph.addVertex(new GraphVertex(node.id));
              }
              for(let link of this.links) {
                const edge = new GraphEdge(
                  new GraphVertex(link.source.id),
                  new GraphVertex(link.target.id)
                );
                if(!graph.edges[edge.getKey()]) {
                  graph.addEdge(edge);
                }
              }

              console.log(graph);
            },


            // добавляет физические границы для графа
            addBounds() {
              this.simulation.force("bounds", () => {
                    let xExtent = [10, this.width-10];
                    let yExtent = [10, this.height-10];
                    for (let node of this.nodes) {
                        node.x = Math.max(xExtent[0], Math.min(xExtent[1], node.x));
                        node.y = Math.max(yExtent[0], Math.min(yExtent[1], node.y));
                    }
                });
            },

            // отрисовка графа
            chart() {
                let links = this.links;
                let nodes = this.nodes;

                let nodeWidth = 20;
                let nodeHeight = 20;

                simulation = d3.forceSimulation(nodes)
                    .force("link", d3.forceLink(links).id(d => d.id).distance(100).iterations(10))
                    .force("charge", d3.forceManyBody().strength(-100))
                    .force("center", d3.forceCenter(this.width / 2, this.height / 2))
                    // чтобы не разбегались
                    .force("x", d3.forceX())
                    .force("y", d3.forceY())
                    // чтобы не перекрывались
                    .force("collision", d3.forceCollide(nodeWidth + nodeHeight).strength(1).iterations(100))
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
                        .attr("x", d => d.x - nodeWidth / 2)
                        .attr("y", d => d.y - nodeHeight / 2);
                    text
                        .attr("x", d => d.x - nodeWidth / 2)
                        .attr("y", d => d.y - nodeHeight / 2);
                });

                const pane = d3.select('#' + this.uniqId)
                    // fluent способ передать svg в функцию зума
                    .call(
                      d3.zoom()
                      .extent([[0, 0], [this.width, this.height]])
                      .scaleExtent([0.1, 2])
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
                    .attr("width", nodeWidth)
                    .attr("height", nodeHeight)
                    .attr("fill", d => colorScale(d.group))
                    .call(this.drag());

                const text = group.append("text")
                    .attr("color", "#FFF")
                    .text(d => d.name);
            },

            // перетаскивание узлов графа
            drag() {
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