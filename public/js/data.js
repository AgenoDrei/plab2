let cur_node_id = 0;

/**
 * IDs are used for adressing of edges, nodes, basically everything
 */
class Graph {
    constructor() {
        this.nodes = [];
        this.edges = [];
        this.clusters = [];
    }

    add_node(group, is_active) {
        let node = new Node(group, is_active);
        let cluster = this.get_cluster(group);
        if (cluster === null) {
            let new_cluster = new Cluster(group);
            new_cluster.members.push(node.id);
            this.clusters.push(new_cluster);
        } else {
            cluster.members.push(node.id);
        }
        this.nodes.push(node)
    }

    add_edge(src, dst) {
        let edge = new Edge(src, dst);
        this.get_node(dst).num_incoming++;
        this.edges.push(edge);
    }

    get_node(node_id) {
        for (let node of this.nodes) {
            if (node.id === node_id)
                return node;
        }
        return null;
    }

    get_cluster(cluster_id) {
        for (let cluster of this.clusters) {
            if (cluster.id === cluster_id)
                return cluster;
        }
        return null;
    }

    toggle_node(node_id) {
        let node = this.get_node(node_id);
        if (node === null)
            return node;
        node.active = !node.active;
    }
}

/**
 * Represents documents
 */
class Node {
    constructor(group, is_active) {
        this.id = cur_node_id++;
        this.group = group;
        this.out = [];
        this.active = is_active;
        this.num_incoming = 0;
    }
}

/**
 * Represents references
 */
class Edge {
    constructor(src_id, dst_id) {
        this.source = src_id;
        this.target = dst_id;
        this.value = 1;
    }
}

class Cluster {
    constructor(cluster_id) {
        this.id = cluster_id;
        this.terms = [];
        this.members = [];
    }
}
