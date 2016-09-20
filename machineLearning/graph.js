class Graph {
  constructor(v) {
      this.vertices = v;
      this.edges = 0;
      this.adj = [];
      for (var i = 0; i < this.vertices; ++i) {
        this.adj[i] = [];
        this.adj[i].push("");
      }

  }
  addEdge(v,w) {
    this.adj[v].push(w);
    this.adj[w].push(v);
    this.edges++;
  }
  showGraph() {
    let data = ''
      for (var i = 0; i < this.vertices; ++i) {
        data+= (i + " -> ");
        for (var j = 0; j < this.vertices; ++j) {
          if (this.adj[i][j] != undefined) {
            data+= (this.adj[i][j] + ' ');
          }
        }
      data+= '\n';
    }
    console.log(data)
  }
}

module.exports = Graph;
