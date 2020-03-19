/* globals vis, document */

const NODES = [
    { id: "hacker",            type: "identity", shape: "circularImage", image: "images/nerd.png"},
    { id: "hustler",           type: "identity", shape: "circularImage", image: "images/sunglasses.png"},
    { id: "Block & Jerry's",   type: "project", shape: "circularImage", image: "images/cherry-garcia.png"},
    { id: "V A P O R D O C S", type: "project", shape: "circularImage", image: "images/waves.gif" },
    { id: "Ken's Shine",       type: "project", shape: "circularImage", image: "images/shoe.jpg" },
    { id: "powerlifting.ai",   type: "project", shape: "circularImage", image: "images/powerlifting_ai.png"},
    { id: "Tesla",             type: "company", shape: "circularImage", image: "images/tesla.jpg" },
    { id: "GroupRaise",        type: "company", shape: "circularImage", image: "images/groupraise.png"},
    { id: "LiftIgniter",       type: "company", shape: "circularImage", image: "images/liftigniter.webp"},
    { id: "Strata Labs",       type: "company", shape: "circularImage", image: "images/strata.png"},
    { id: "Microsoft",         type: "company", shape: "circularImage", image: "images/msft.png"},
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
]

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

  const dataset = new vis.DataSet(nodes
    .map(n => Object.assign(n, {label: n.id}))
    .map(n => Object.assign(n, {value: count_edges(n, EDGES)})))

  const filter = (node) => TYPES[node.type] === true
  return new vis.DataView(dataset, { filter })
}

function attachListener(elements, view) {
  Array.from(elements).forEach(x =>
    x.addEventListener('change', e => {
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
    // configure: { container: document.getElementById('configure'), },
    nodes: {
      shape: 'dot',
      scaling: {
        min: 20,
        max: 50,
        label: {
          enabled: true,
          min: 15,
          max: 30,
        }
      },
      title: "",
      // chosen: {
      //   node: true
      // },
      color: {
        // border: 'transparent',
        background: 'transparent',
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
      hover: true,
      tooltipDelay: 0,
    }
  }
  return new vis.Network(network, data, options);
}


const addListeners = (network) => {

  const canvas = document.getElementsByTagName('canvas')[0]

  let node

  const resetCss = () => {
    node.style.visibility = 'hidden'
    canvas.style.filter = ''
  }

  const showTooltip = ({ node: node_id, event }) => {
    const { clientX: left, clientY: top } = event
    node = document.getElementById(node_id)
    node.style.left = left + 'px'
    node.style.top = top + 'px'
    node.style.visibility = 'visible'
    canvas.style.filter = 'blur(1px)'
  }

  network.on("hidePopup", resetCss)
  network.on("hoverNode", showTooltip)

}

const network = startNetwork(nodes, EDGES)
addListeners(network)