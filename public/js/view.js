let self = null;

class D3Graph {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.svg = d3.select('body').append('svg')
            .attr("height", this.height)
            .attr("width", this.width);
        this.g = this.svg.append("g")
            .attr("class", "everything");
        this.zoom_handler = d3.zoom()
            .on("zoom", () => this.g.attr("transform", d3.event.transform));
        this.zoom_handler(this.svg);
        this.group2color = d3.scaleOrdinal(d3.schemeCategory10);
        this.selection = null;
        self = this;
    }

    draw_graph(node_list, edge_list) {

        this.simulation = d3.forceSimulation(node_list)
            .velocityDecay(0.1)
            .force("x", d3.forceX(this.width / 2).strength(.05))
            .force("y", d3.forceY(this.height / 2).strength(.05))
            .force("link", d3.forceLink(edge_list).id(d => d.id))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));

        this.svg.append("svg:defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
            .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        this.link = this.g.append("g")
            .selectAll("line")
            .data(edge_list)
            .join("line")
            .attr("class", "link")
            .attr("stroke-width", d => Math.sqrt(d.value))
            .attr("marker-end", "url(#end)")
            .attr("source", d => d.source.id)
            .attr("target", d => d.target.id);

        this.node = this.g.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(node_list)
            .enter().append("g");
        this.circles = this.node.append("circle")
            .attr("r", d => 3 + d.num_incoming)
            .attr("fill", d => this.group2color(d.group))
            .on("mouseover", this.handleMouseOver)
            .on("mouseout", this.handleMouseOut)
            .on("click", this.handleClick);
        this.lables = this.node.append("text")
            .classed("node_labels", true)
            .text(d => d.id);
        this.node.append("title").text(d => d.id);

        this.simulation.on("tick", () => {
            this.link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            this.node.attr("cx", d => d.x)
                .attr("cy", d => d.y);
            this.lables.attr("x", d => d.x + 5)
                .attr("y", d => d.y + 2.5);
            this.circles.attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });
        return this.svg;
    }

    highlightElement(elm) {
        const circleUnderMouse = elm;
        d3.selectAll('circle').transition().style('opacity', function () {
            if (circleUnderMouse === null) {
                return 0.8;
            } else if (this === circleUnderMouse) {
                return 0.8;
            } else {
                return 0.3;
            }
        });
        d3.selectAll('line').transition().style('opacity', function (l) {
            if (circleUnderMouse === null) {
                return 0.9;
            } else if (circleUnderMouse.__data__.id === l.source.id || circleUnderMouse.__data__.id === l.target.id) {
                return 0.9;
            } else {
                return 0.2;
            }
        });
    }

    labelClusterCenter(text, clusterId) {
        let count = 0, x = 0.0, y = 0.0;
        d3.selectAll('circle')
            .each(function (d) {
                if (d.group === clusterId) {
                    x += d.x;
                    y += d.y;
                    count++;
                }
            });
        this.g.append('text')
            .attr('id', 'clusterLabel' + clusterId)
            .attr('class', 'clusterLabel')
            .attr('x', x / count).attr('y', y / count)
            .text(text);
        console.log('Cluster center: ', x / count, y / count);
    }

    handleMouseOut(d, i) {
        if (self.selection == null)
            self.highlightElement(null);
    }

    handleMouseOver(d, i) {
        if (self.selection == null)
            self.highlightElement(this);
    }

    handleClick(d, i) {
        console.log('Click', i);
        if (self.selection === this) {
            self.selection = null;
            self.highlightElement(null);
        } else if (self.selection === null || self.selection !== this) {
            self.selection = this;
            self.highlightElement(this);
            show_details(this.__data__.id);
        }
    }


}
