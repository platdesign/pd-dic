'use strict';

const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const PARAMS = /^(async\s+)?function\*?\s*[\w$]*\(([^\)]*)\)\s*\{|^(async\s+)?\(([^\)]*)\)\s*=>|^(async\s)?(\w*)\s+=>|^(async\s+)?\*?\w+\(([^\)]*)\)/m

// |^(async\s)?\(([^\)]*)\)\s+=>|^(async\s)?(\w*)\s+=>

function getParams(fn) {

  fn = fn.toString();

  // Remove comments
  fn = fn.replace(COMMENTS, '');

  // Remove whitespace
  fn = fn.replace(/\s+/mg, ' ');

  // match params regex
  let args = fn.match(PARAMS);

  let params;
  if(args[0]) {
    params = args[2] || args[4] || args[6] || args[8] || '';
  }

  // split, trim and filter params
  return params.split(',').map(p => p.trim()).filter(Boolean);
}



/**
 * [annotate description]
 * @param  {Function} fn  [description]
 * @param  {[type]}   key [description]
 * @return {[type]}       [description]
 */
function annotate(fn, key) {


	if(fn[key]) {
		return fn;
	} else {

   let params = getParams(fn);

		fn[key] = params;
		return fn;

	}

}



function tsort(edges) {
  var nodes   = {}, // hash: stringified id of the node => { id: id, afters: lisf of ids }
      sorted  = [], // sorted list of IDs ( returned value )
      visited = {}; // hash: id of already visited node => true

  var Node = function(id) {
    this.id = id;
    this.afters = [];
  }

  // 1. build data structures
  edges.forEach(function(v) {
    var from = v[0], to = v[1];
    if (!nodes[from]) nodes[from] = new Node(from);
    if (!nodes[to]) nodes[to]     = new Node(to);
    nodes[from].afters.push(to);
  });

  // 2. topological sort
  Object.keys(nodes).forEach(function visit(idstr, ancestors) {
    var node = nodes[idstr],
        id   = node.id;

    // if already exists, do nothing
    if (visited[idstr]) return;

    if (!Array.isArray(ancestors)) ancestors = [];

    ancestors.push(id);

    visited[idstr] = true;

    node.afters.forEach(function(afterID) {
      if (ancestors.indexOf(afterID) >= 0)  // if already in ancestors, a closed chain exists.
        throw new Error('closed chain : ' +  afterID + ' is in ' + id);

      visit(afterID.toString(), ancestors.map(function(v) { return v })); // recursive call
    });

    sorted.unshift(id);
  });

  return sorted;
}





module.exports = {
  getParams,
	annotate,
	tsort
};
