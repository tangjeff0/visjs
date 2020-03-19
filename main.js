/* globals vis, document */

const NODES = [
    { id: "hacker",            type: "identity", },
    { id: "hustler",           type: "identity"},
    { id: "Block & Jerry's",   type: "project" },
    { id: "V A P O R D O C S", type: "project" },
    { id: "Ken's Shine",       type: "project" },
    { id: "powerlifting.ai",   type: "project", shape: "circularImage", image: "images/powerlifting_ai.png"  },
    { id: "Tesla",             type: "company", shape: "circularImage", image: "images/tesla.jpg" },
    { id: "GroupRaise",        type: "company", shape: "circularImage", image: "images/groupraise.png" },
    { id: "LiftIgniter",       type: "company", shape: "circularImage", image: "images/liftigniter.webp"   },
    { id: "Strata Labs",       type: "company" },
    { id: "Microsoft",         type: "company", shape: "circularImage", image: "images/msft.png"  },
]

const EDGES = [
    { from: "hustler", to: "Ken's Shine" },
    { from: "hacker",  to: "Ken's Shine" },
    { from: "hacker",  to: "Block & Jerry's" },
    { from: "hacker",  to: "V A P O R D O C S" },
    { from: "hacker",  to: "powerlifting.ai" },
    { from: "hustler", to: "powerlifting.ai" },
    { from: "hustler", to: "Tesla" },
    { from: "hustler", to: "GroupRaise" },
    { from: "hacker",  to: "LiftIgniter" },
    { from: "hacker",  to: "Strata Labs" },
    { from: "hacker",  to: "Microsoft" },
];

const TYPES = {
  "identity": true,
  "project": true,
  "company": true,
}

// takes in a list of nodes and converts to a DataView
function make_nodes(nodes) {
  // size of the node proportional to how many edges it has, FROM and TO
  // there are many ways to size a node
  const count_edges = (node, edges) =>
      edges.filter(e => e.from === node.id).length +
      edges.filter(e => e.to === node.id).length

  // the "title" property takes a string OR an html element to render as a tooltip
  // when hovering over a node. each node has it's own custom HTML element, with the id
  const get_html = (node) => Array.from(document.getElementsByClassName("tooltip"))
  .filter(elem => elem.id == node.id)[0]

  const dataset = new vis.DataSet(nodes
    .map(n => Object.assign(n, {label: n.id}))
    .map(n => Object.assign(n, {value: count_edges(n, EDGES)}))
    .map(n => Object.assign(n, {title: get_html(n)})))

  const filter = (node) => TYPES[node.type] === true
  return new vis.DataView(dataset, { filter })
}

function attachListener(elements, view) {
  Array.from(elements).forEach(x => x.addEventListener('change', e => {
    const { value, checked } = e.target
    TYPES[value] = checked
    view.refresh()
  }))
}

const nodes = make_nodes(NODES)
attachListener(document.getElementsByClassName("checkbox"), nodes)


function startNetwork(nodes, edges) {
  const network = document.getElementById('network');
  const data = { nodes, edges }
  const options = {
    configure: {
      container: document.getElementById('configure'),
    },
    nodes: {
      shape: 'dot',
      scaling: {
        label: {
          enabled: true,
          min: 12,
          max: 30,
        }
      },
      title: "asd...",
      // chosen: {
      //   node: true
      // },
      color: {
        highlight: {
          border: 'red',
          background: 'red',
        },
        hover: {
          border: 'black',
          background: 'black',
        },
      }
      // shadow: {
      // }
    },
    edges: {
      arrows: {
        to: {
          enabled: true,
        }
      }
    },
    interaction: {
      hover: true
    }
  }
  return new vis.Network(network, data, options);
}

startNetwork(nodes, EDGES)