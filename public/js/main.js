let g = null;

function main() {
    console.log('Page loaded!');

    let dummy_graph = new Graph();
    dummy_graph = create_dummy_data(dummy_graph, 100, 100, 5);

    console.log(dummy_graph);


    const graph_view = new D3Graph(window.innerWidth * 0.6, window.innerHeight * 0.7);
    graph_view.draw_graph(dummy_graph.nodes, dummy_graph.edges)
    g = graph_view;
}


function create_dummy_data(g, num_nodes, num_edges, num_clusters) {
    for (let i = 0; i < num_nodes; i++) {
        g.add_node(Math.floor(Math.random() * num_clusters), true);
    }

    for (let i = 0; i < num_edges; i++) {
        let src = Math.floor(Math.random() * num_nodes);
        let dst = Math.floor(Math.random() * num_nodes);
        while (src === dst) {
            dst = Math.floor(Math.random() * num_nodes);
        }
        g.add_edge(src, dst);
    }
    return g;
}


window.onload = main;
