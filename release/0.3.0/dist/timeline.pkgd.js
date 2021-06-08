/*
Copyright (c) 2019 Daybrush
name: @scenejs/timeline
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/scenejs-timeline.git
version: 0.3.0
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Timeline = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics(d, b);
    };

    function __extends(d, b) {
      extendStatics(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
      __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign.apply(this, arguments);
    };

    var VNode = function VNode() {};

    var options = {};

    var stack = [];

    var EMPTY_CHILDREN = [];

    function h(nodeName, attributes) {
    	var children = EMPTY_CHILDREN,
    	    lastSimple,
    	    child,
    	    simple,
    	    i;
    	for (i = arguments.length; i-- > 2;) {
    		stack.push(arguments[i]);
    	}
    	if (attributes && attributes.children != null) {
    		if (!stack.length) stack.push(attributes.children);
    		delete attributes.children;
    	}
    	while (stack.length) {
    		if ((child = stack.pop()) && child.pop !== undefined) {
    			for (i = child.length; i--;) {
    				stack.push(child[i]);
    			}
    		} else {
    			if (typeof child === 'boolean') child = null;

    			if (simple = typeof nodeName !== 'function') {
    				if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
    			}

    			if (simple && lastSimple) {
    				children[children.length - 1] += child;
    			} else if (children === EMPTY_CHILDREN) {
    				children = [child];
    			} else {
    				children.push(child);
    			}

    			lastSimple = simple;
    		}
    	}

    	var p = new VNode();
    	p.nodeName = nodeName;
    	p.children = children;
    	p.attributes = attributes == null ? undefined : attributes;
    	p.key = attributes == null ? undefined : attributes.key;

    	if (options.vnode !== undefined) options.vnode(p);

    	return p;
    }

    function extend(obj, props) {
      for (var i in props) {
        obj[i] = props[i];
      }return obj;
    }

    function applyRef(ref, value) {
      if (ref) {
        if (typeof ref == 'function') ref(value);else ref.current = value;
      }
    }

    var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

    var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

    var items = [];

    function enqueueRender(component) {
    	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
    		(options.debounceRendering || defer)(rerender);
    	}
    }

    function rerender() {
    	var p;
    	while (p = items.pop()) {
    		if (p._dirty) renderComponent(p);
    	}
    }

    function isSameNodeType(node, vnode, hydrating) {
    	if (typeof vnode === 'string' || typeof vnode === 'number') {
    		return node.splitText !== undefined;
    	}
    	if (typeof vnode.nodeName === 'string') {
    		return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
    	}
    	return hydrating || node._componentConstructor === vnode.nodeName;
    }

    function isNamedNode(node, nodeName) {
    	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
    }

    function getNodeProps(vnode) {
    	var props = extend({}, vnode.attributes);
    	props.children = vnode.children;

    	var defaultProps = vnode.nodeName.defaultProps;
    	if (defaultProps !== undefined) {
    		for (var i in defaultProps) {
    			if (props[i] === undefined) {
    				props[i] = defaultProps[i];
    			}
    		}
    	}

    	return props;
    }

    function createNode(nodeName, isSvg) {
    	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
    	node.normalizedNodeName = nodeName;
    	return node;
    }

    function removeNode(node) {
    	var parentNode = node.parentNode;
    	if (parentNode) parentNode.removeChild(node);
    }

    function setAccessor(node, name, old, value, isSvg) {
    	if (name === 'className') name = 'class';

    	if (name === 'key') ; else if (name === 'ref') {
    		applyRef(old, null);
    		applyRef(value, node);
    	} else if (name === 'class' && !isSvg) {
    		node.className = value || '';
    	} else if (name === 'style') {
    		if (!value || typeof value === 'string' || typeof old === 'string') {
    			node.style.cssText = value || '';
    		}
    		if (value && typeof value === 'object') {
    			if (typeof old !== 'string') {
    				for (var i in old) {
    					if (!(i in value)) node.style[i] = '';
    				}
    			}
    			for (var i in value) {
    				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
    			}
    		}
    	} else if (name === 'dangerouslySetInnerHTML') {
    		if (value) node.innerHTML = value.__html || '';
    	} else if (name[0] == 'o' && name[1] == 'n') {
    		var useCapture = name !== (name = name.replace(/Capture$/, ''));
    		name = name.toLowerCase().substring(2);
    		if (value) {
    			if (!old) node.addEventListener(name, eventProxy, useCapture);
    		} else {
    			node.removeEventListener(name, eventProxy, useCapture);
    		}
    		(node._listeners || (node._listeners = {}))[name] = value;
    	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
    		try {
    			node[name] = value == null ? '' : value;
    		} catch (e) {}
    		if ((value == null || value === false) && name != 'spellcheck') node.removeAttribute(name);
    	} else {
    		var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));

    		if (value == null || value === false) {
    			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
    		} else if (typeof value !== 'function') {
    			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
    		}
    	}
    }

    function eventProxy(e) {
    	return this._listeners[e.type](options.event && options.event(e) || e);
    }

    var mounts = [];

    var diffLevel = 0;

    var isSvgMode = false;

    var hydrating = false;

    function flushMounts() {
    	var c;
    	while (c = mounts.shift()) {
    		if (options.afterMount) options.afterMount(c);
    		if (c.componentDidMount) c.componentDidMount();
    	}
    }

    function diff(dom, vnode, context, mountAll, parent, componentRoot) {
    	if (!diffLevel++) {
    		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

    		hydrating = dom != null && !('__preactattr_' in dom);
    	}

    	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

    	if (parent && ret.parentNode !== parent) parent.appendChild(ret);

    	if (! --diffLevel) {
    		hydrating = false;

    		if (!componentRoot) flushMounts();
    	}

    	return ret;
    }

    function idiff(dom, vnode, context, mountAll, componentRoot) {
    	var out = dom,
    	    prevSvgMode = isSvgMode;

    	if (vnode == null || typeof vnode === 'boolean') vnode = '';

    	if (typeof vnode === 'string' || typeof vnode === 'number') {
    		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
    			if (dom.nodeValue != vnode) {
    				dom.nodeValue = vnode;
    			}
    		} else {
    			out = document.createTextNode(vnode);
    			if (dom) {
    				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
    				recollectNodeTree(dom, true);
    			}
    		}

    		out['__preactattr_'] = true;

    		return out;
    	}

    	var vnodeName = vnode.nodeName;
    	if (typeof vnodeName === 'function') {
    		return buildComponentFromVNode(dom, vnode, context, mountAll);
    	}

    	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

    	vnodeName = String(vnodeName);
    	if (!dom || !isNamedNode(dom, vnodeName)) {
    		out = createNode(vnodeName, isSvgMode);

    		if (dom) {
    			while (dom.firstChild) {
    				out.appendChild(dom.firstChild);
    			}
    			if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

    			recollectNodeTree(dom, true);
    		}
    	}

    	var fc = out.firstChild,
    	    props = out['__preactattr_'],
    	    vchildren = vnode.children;

    	if (props == null) {
    		props = out['__preactattr_'] = {};
    		for (var a = out.attributes, i = a.length; i--;) {
    			props[a[i].name] = a[i].value;
    		}
    	}

    	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
    		if (fc.nodeValue != vchildren[0]) {
    			fc.nodeValue = vchildren[0];
    		}
    	} else if (vchildren && vchildren.length || fc != null) {
    			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
    		}

    	diffAttributes(out, vnode.attributes, props);

    	isSvgMode = prevSvgMode;

    	return out;
    }

    function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
    	var originalChildren = dom.childNodes,
    	    children = [],
    	    keyed = {},
    	    keyedLen = 0,
    	    min = 0,
    	    len = originalChildren.length,
    	    childrenLen = 0,
    	    vlen = vchildren ? vchildren.length : 0,
    	    j,
    	    c,
    	    f,
    	    vchild,
    	    child;

    	if (len !== 0) {
    		for (var i = 0; i < len; i++) {
    			var _child = originalChildren[i],
    			    props = _child['__preactattr_'],
    			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
    			if (key != null) {
    				keyedLen++;
    				keyed[key] = _child;
    			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
    				children[childrenLen++] = _child;
    			}
    		}
    	}

    	if (vlen !== 0) {
    		for (var i = 0; i < vlen; i++) {
    			vchild = vchildren[i];
    			child = null;

    			var key = vchild.key;
    			if (key != null) {
    				if (keyedLen && keyed[key] !== undefined) {
    					child = keyed[key];
    					keyed[key] = undefined;
    					keyedLen--;
    				}
    			} else if (min < childrenLen) {
    					for (j = min; j < childrenLen; j++) {
    						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
    							child = c;
    							children[j] = undefined;
    							if (j === childrenLen - 1) childrenLen--;
    							if (j === min) min++;
    							break;
    						}
    					}
    				}

    			child = idiff(child, vchild, context, mountAll);

    			f = originalChildren[i];
    			if (child && child !== dom && child !== f) {
    				if (f == null) {
    					dom.appendChild(child);
    				} else if (child === f.nextSibling) {
    					removeNode(f);
    				} else {
    					dom.insertBefore(child, f);
    				}
    			}
    		}
    	}

    	if (keyedLen) {
    		for (var i in keyed) {
    			if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
    		}
    	}

    	while (min <= childrenLen) {
    		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
    	}
    }

    function recollectNodeTree(node, unmountOnly) {
    	var component = node._component;
    	if (component) {
    		unmountComponent(component);
    	} else {
    		if (node['__preactattr_'] != null) applyRef(node['__preactattr_'].ref, null);

    		if (unmountOnly === false || node['__preactattr_'] == null) {
    			removeNode(node);
    		}

    		removeChildren(node);
    	}
    }

    function removeChildren(node) {
    	node = node.lastChild;
    	while (node) {
    		var next = node.previousSibling;
    		recollectNodeTree(node, true);
    		node = next;
    	}
    }

    function diffAttributes(dom, attrs, old) {
    	var name;

    	for (name in old) {
    		if (!(attrs && attrs[name] != null) && old[name] != null) {
    			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
    		}
    	}

    	for (name in attrs) {
    		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
    			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    		}
    	}
    }

    var recyclerComponents = [];

    function createComponent(Ctor, props, context) {
    	var inst,
    	    i = recyclerComponents.length;

    	if (Ctor.prototype && Ctor.prototype.render) {
    		inst = new Ctor(props, context);
    		Component.call(inst, props, context);
    	} else {
    		inst = new Component(props, context);
    		inst.constructor = Ctor;
    		inst.render = doRender;
    	}

    	while (i--) {
    		if (recyclerComponents[i].constructor === Ctor) {
    			inst.nextBase = recyclerComponents[i].nextBase;
    			recyclerComponents.splice(i, 1);
    			return inst;
    		}
    	}

    	return inst;
    }

    function doRender(props, state, context) {
    	return this.constructor(props, context);
    }

    function setComponentProps(component, props, renderMode, context, mountAll) {
    	if (component._disable) return;
    	component._disable = true;

    	component.__ref = props.ref;
    	component.__key = props.key;
    	delete props.ref;
    	delete props.key;

    	if (typeof component.constructor.getDerivedStateFromProps === 'undefined') {
    		if (!component.base || mountAll) {
    			if (component.componentWillMount) component.componentWillMount();
    		} else if (component.componentWillReceiveProps) {
    			component.componentWillReceiveProps(props, context);
    		}
    	}

    	if (context && context !== component.context) {
    		if (!component.prevContext) component.prevContext = component.context;
    		component.context = context;
    	}

    	if (!component.prevProps) component.prevProps = component.props;
    	component.props = props;

    	component._disable = false;

    	if (renderMode !== 0) {
    		if (renderMode === 1 || options.syncComponentUpdates !== false || !component.base) {
    			renderComponent(component, 1, mountAll);
    		} else {
    			enqueueRender(component);
    		}
    	}

    	applyRef(component.__ref, component);
    }

    function renderComponent(component, renderMode, mountAll, isChild) {
    	if (component._disable) return;

    	var props = component.props,
    	    state = component.state,
    	    context = component.context,
    	    previousProps = component.prevProps || props,
    	    previousState = component.prevState || state,
    	    previousContext = component.prevContext || context,
    	    isUpdate = component.base,
    	    nextBase = component.nextBase,
    	    initialBase = isUpdate || nextBase,
    	    initialChildComponent = component._component,
    	    skip = false,
    	    snapshot = previousContext,
    	    rendered,
    	    inst,
    	    cbase;

    	if (component.constructor.getDerivedStateFromProps) {
    		state = extend(extend({}, state), component.constructor.getDerivedStateFromProps(props, state));
    		component.state = state;
    	}

    	if (isUpdate) {
    		component.props = previousProps;
    		component.state = previousState;
    		component.context = previousContext;
    		if (renderMode !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
    			skip = true;
    		} else if (component.componentWillUpdate) {
    			component.componentWillUpdate(props, state, context);
    		}
    		component.props = props;
    		component.state = state;
    		component.context = context;
    	}

    	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
    	component._dirty = false;

    	if (!skip) {
    		rendered = component.render(props, state, context);

    		if (component.getChildContext) {
    			context = extend(extend({}, context), component.getChildContext());
    		}

    		if (isUpdate && component.getSnapshotBeforeUpdate) {
    			snapshot = component.getSnapshotBeforeUpdate(previousProps, previousState);
    		}

    		var childComponent = rendered && rendered.nodeName,
    		    toUnmount,
    		    base;

    		if (typeof childComponent === 'function') {

    			var childProps = getNodeProps(rendered);
    			inst = initialChildComponent;

    			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
    				setComponentProps(inst, childProps, 1, context, false);
    			} else {
    				toUnmount = inst;

    				component._component = inst = createComponent(childComponent, childProps, context);
    				inst.nextBase = inst.nextBase || nextBase;
    				inst._parentComponent = component;
    				setComponentProps(inst, childProps, 0, context, false);
    				renderComponent(inst, 1, mountAll, true);
    			}

    			base = inst.base;
    		} else {
    			cbase = initialBase;

    			toUnmount = initialChildComponent;
    			if (toUnmount) {
    				cbase = component._component = null;
    			}

    			if (initialBase || renderMode === 1) {
    				if (cbase) cbase._component = null;
    				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
    			}
    		}

    		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
    			var baseParent = initialBase.parentNode;
    			if (baseParent && base !== baseParent) {
    				baseParent.replaceChild(base, initialBase);

    				if (!toUnmount) {
    					initialBase._component = null;
    					recollectNodeTree(initialBase, false);
    				}
    			}
    		}

    		if (toUnmount) {
    			unmountComponent(toUnmount);
    		}

    		component.base = base;
    		if (base && !isChild) {
    			var componentRef = component,
    			    t = component;
    			while (t = t._parentComponent) {
    				(componentRef = t).base = base;
    			}
    			base._component = componentRef;
    			base._componentConstructor = componentRef.constructor;
    		}
    	}

    	if (!isUpdate || mountAll) {
    		mounts.push(component);
    	} else if (!skip) {

    		if (component.componentDidUpdate) {
    			component.componentDidUpdate(previousProps, previousState, snapshot);
    		}
    		if (options.afterUpdate) options.afterUpdate(component);
    	}

    	while (component._renderCallbacks.length) {
    		component._renderCallbacks.pop().call(component);
    	}if (!diffLevel && !isChild) flushMounts();
    }

    function buildComponentFromVNode(dom, vnode, context, mountAll) {
    	var c = dom && dom._component,
    	    originalComponent = c,
    	    oldDom = dom,
    	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
    	    isOwner = isDirectOwner,
    	    props = getNodeProps(vnode);
    	while (c && !isOwner && (c = c._parentComponent)) {
    		isOwner = c.constructor === vnode.nodeName;
    	}

    	if (c && isOwner && (!mountAll || c._component)) {
    		setComponentProps(c, props, 3, context, mountAll);
    		dom = c.base;
    	} else {
    		if (originalComponent && !isDirectOwner) {
    			unmountComponent(originalComponent);
    			dom = oldDom = null;
    		}

    		c = createComponent(vnode.nodeName, props, context);
    		if (dom && !c.nextBase) {
    			c.nextBase = dom;

    			oldDom = null;
    		}
    		setComponentProps(c, props, 1, context, mountAll);
    		dom = c.base;

    		if (oldDom && dom !== oldDom) {
    			oldDom._component = null;
    			recollectNodeTree(oldDom, false);
    		}
    	}

    	return dom;
    }

    function unmountComponent(component) {
    	if (options.beforeUnmount) options.beforeUnmount(component);

    	var base = component.base;

    	component._disable = true;

    	if (component.componentWillUnmount) component.componentWillUnmount();

    	component.base = null;

    	var inner = component._component;
    	if (inner) {
    		unmountComponent(inner);
    	} else if (base) {
    		if (base['__preactattr_'] != null) applyRef(base['__preactattr_'].ref, null);

    		component.nextBase = base;

    		removeNode(base);
    		recyclerComponents.push(component);

    		removeChildren(base);
    	}

    	applyRef(component.__ref, null);
    }

    function Component(props, context) {
    	this._dirty = true;

    	this.context = context;

    	this.props = props;

    	this.state = this.state || {};

    	this._renderCallbacks = [];
    }

    extend(Component.prototype, {
    	setState: function setState(state, callback) {
    		if (!this.prevState) this.prevState = this.state;
    		this.state = extend(extend({}, this.state), typeof state === 'function' ? state(this.state, this.props) : state);
    		if (callback) this._renderCallbacks.push(callback);
    		enqueueRender(this);
    	},
    	forceUpdate: function forceUpdate(callback) {
    		if (callback) this._renderCallbacks.push(callback);
    		renderComponent(this, 2);
    	},
    	render: function render() {}
    });

    function render(vnode, parent, merge) {
      return diff(merge, vnode, {}, false, parent, false);
    }

    /*
    Copyright (c) 2018 Daybrush
    @name: @daybrush/utils
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/utils
    @version 0.10.5
    */
    /**
    * get string "object"
    * @memberof Consts
    * @example
    import {OBJECT} from "@daybrush/utils";

    console.log(OBJECT); // "object"
    */

    var OBJECT = "object";
    /**
    * get string "undefined"
    * @memberof Consts
    * @example
    import {UNDEFINED} from "@daybrush/utils";

    console.log(UNDEFINED); // "undefined"
    */

    var UNDEFINED = "undefined";
    var OPEN_CLOSED_CHARACTER = ["\"", "'", "\\\"", "\\'"];

    /**
    * @namespace
    * @name Utils
    */

    /**
     * Returns the inner product of two numbers(`a1`, `a2`) by two criteria(`b1`, `b2`).
     * @memberof Utils
     * @param - The first number
     * @param - The second number
     * @param - The first number to base on the inner product
     * @param - The second number to base on the inner product
     * @return - Returns the inner product
    import { dot } from "@daybrush/utils";

    console.log(dot(0, 15, 2, 3)); // 6
    console.log(dot(5, 15, 2, 3)); // 9
    console.log(dot(5, 15, 1, 1)); // 10
     */

    function dot(a1, a2, b1, b2) {
      return (a1 * b2 + a2 * b1) / (b1 + b2);
    }
    /**
    * Check the type that the value is undefined.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {boolean} true if the type is correct, false otherwise
    * @example
    import {isUndefined} from "@daybrush/utils";

    console.log(isUndefined(undefined)); // true
    console.log(isUndefined("")); // false
    console.log(isUndefined(1)); // false
    console.log(isUndefined(null)); // false
    */

    function isUndefined(value) {
      return typeof value === UNDEFINED;
    }
    /**
    * Check the type that the value is object.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isObject} from "@daybrush/utils";

    console.log(isObject({})); // true
    console.log(isObject(undefined)); // false
    console.log(isObject("")); // false
    console.log(isObject(null)); // false
    */

    function isObject(value) {
      return value && typeof value === OBJECT;
    }

    function findClosed(closedCharacter, texts, index, length) {
      for (var i = index; i < length; ++i) {
        var character = texts[i].trim();

        if (character === closedCharacter) {
          return i;
        }

        var nextIndex = i;

        if (character === "(") {
          nextIndex = findClosed(")", texts, i + 1, length);
        } else if (OPEN_CLOSED_CHARACTER.indexOf(character) > -1) {
          nextIndex = findClosed(character, texts, i + 1, length);
        }

        if (nextIndex === -1) {
          break;
        }

        i = nextIndex;
      }

      return -1;
    }

    function splitText(text, separator) {
      var regexText = "(\\s*" + (separator || ",") + "\\s*|\\(|\\)|\"|'|\\\\\"|\\\\'|\\s+)";
      var regex = new RegExp(regexText, "g");
      var texts = text.split(regex).filter(Boolean);
      var length = texts.length;
      var values = [];
      var tempValues = [];

      for (var i = 0; i < length; ++i) {
        var character = texts[i].trim();
        var nextIndex = i;

        if (character === "(") {
          nextIndex = findClosed(")", texts, i + 1, length);
        } else if (character === ")") {
          throw new Error("invalid format");
        } else if (OPEN_CLOSED_CHARACTER.indexOf(character) > -1) {
          nextIndex = findClosed(character, texts, i + 1, length);
        } else if (character === separator) {
          if (tempValues.length) {
            values.push(tempValues.join(""));
            tempValues = [];
          }

          continue;
        }

        if (nextIndex === -1) {
          nextIndex = length - 1;
        }

        tempValues.push(texts.slice(i, nextIndex + 1).join(""));
        i = nextIndex;
      }

      if (tempValues.length) {
        values.push(tempValues.join(""));
      }

      return values;
    }
    /**
    * divide text by comma.
    * @memberof Utils
    * @param {string} text - text to divide
    * @return {Array} divided texts
    * @example
    import {splitComma} from "@daybrush/utils";

    console.log(splitComma("a,b,c,d,e,f,g"));
    // ["a", "b", "c", "d", "e", "f", "g"]
    console.log(splitComma("'a,b',c,'d,e',f,g"));
    // ["'a,b'", "c", "'d,e'", "f", "g"]
    */

    function splitComma(text) {
      // divide comma(,)
      // "[^"]*"|'[^']*'
      return splitText(text, ",");
    }
    /**
    * Date.now() method
    * @memberof CrossBrowser
    * @return {number} milliseconds
    * @example
    import {now} from "@daybrush/utils";

    console.log(now()); // 12121324241(milliseconds)
    */

    function now() {
      return Date.now ? Date.now() : new Date().getTime();
    }
    /**
    * Returns the index of the first element in the array that satisfies the provided testing function.
    * @function
    * @memberof CrossBrowser
    * @param - The array `findIndex` was called upon.
    * @param - A function to execute on each value in the array until the function returns true, indicating that the satisfying element was found.
    * @param - Returns defaultIndex if not found by the function.
    * @example
    import { findIndex } from "@daybrush/utils";

    findIndex([{a: 1}, {a: 2}, {a: 3}, {a: 4}], ({ a }) => a === 2); // 1
    */

    function findIndex(arr, callback, defaultIndex) {
      if (defaultIndex === void 0) {
        defaultIndex = -1;
      }

      var length = arr.length;

      for (var i = 0; i < length; ++i) {
        if (callback(arr[i], i, arr)) {
          return i;
        }
      }

      return defaultIndex;
    }
    /**
    * Returns the value of the first element in the array that satisfies the provided testing function.
    * @function
    * @memberof CrossBrowser
    * @param - The array `find` was called upon.
    * @param - A function to execute on each value in the array,
    * @param - Returns defalutValue if not found by the function.
    * @example
    import { find } from "@daybrush/utils";

    find([{a: 1}, {a: 2}, {a: 3}, {a: 4}], ({ a }) => a === 2); // {a: 2}
    */

    function find(arr, callback, defalutValue) {
      var index = findIndex(arr, callback);
      return index > -1 ? arr[index] : defalutValue;
    }
    /**
    * Checks if the specified class value exists in the element's class attribute.
    * @memberof DOM
    * @param element - target
    * @param className - the class name to search
    * @return {boolean} return false if the class is not found.
    * @example
    import {hasClass} from "@daybrush/utils";

    console.log(hasClass(element, "start")); // true or false
    */

    function hasClass(element, className) {
      if (element.classList) {
        return element.classList.contains(className);
      }

      return !!element.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
    }
    /**
    * Sets up a function that will be called whenever the specified event is delivered to the target
    * @memberof DOM
    * @param - event target
    * @param - A case-sensitive string representing the event type to listen for.
    * @param - The object which receives a notification (an object that implements the Event interface) when an event of the specified type occurs
    * @param - An options object that specifies characteristics about the event listener. The available options are:
    * @example
    import {addEvent} from "@daybrush/utils";

    addEvent(el, "click", e => {
      console.log(e);
    });
    */

    function addEvent(el, type, listener, options) {
      el.addEventListener(type, listener, options);
    }
    /**
    * removes from the EventTarget an event listener previously registered with EventTarget.addEventListener()
    * @memberof DOM
    * @param - event target
    * @param - A case-sensitive string representing the event type to listen for.
    * @param - The EventListener function of the event handler to remove from the event target.
    * @example
    import {addEvent, removeEvent} from "@daybrush/utils";
    const listener = e => {
      console.log(e);
    };
    addEvent(el, "click", listener);
    removeEvent(el, "click", listener);
    */

    function removeEvent(el, type, listener) {
      el.removeEventListener(type, listener);
    }

    /*
    Copyright (c) NAVER Corp.
    name: @egjs/component
    license: MIT
    author: NAVER Corp.
    repository: https://github.com/naver/egjs-component
    version: 2.2.2
    */
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator,
          m = s && o[s],
          i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    /*
     * Copyright (c) 2015 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */

    function isUndefined$1(value) {
      return typeof value === "undefined";
    }
    /**
     * A class used to manage events in a component
     * @ko 컴포넌트의 이벤트을 관리할 수 있게 하는 클래스
     * @alias eg.Component
     */


    var Component$1 =
    /*#__PURE__*/
    function () {
      /**
       * @support {"ie": "7+", "ch" : "latest", "ff" : "latest",  "sf" : "latest", "edge" : "latest", "ios" : "7+", "an" : "2.1+ (except 3.x)"}
       */
      function Component() {
        /**
         * @deprecated
         * @private
         */
        this.options = {};
        this._eventHandler = {};
      }
      /**
       * Triggers a custom event.
       * @ko 커스텀 이벤트를 발생시킨다
       * @param {string} eventName The name of the custom event to be triggered <ko>발생할 커스텀 이벤트의 이름</ko>
       * @param {object} customEvent Event data to be sent when triggering a custom event <ko>커스텀 이벤트가 발생할 때 전달할 데이터</ko>
       * @param {any[]} restParam Additional parameters when triggering a custom event <ko>커스텀 이벤트가 발생할 때 필요시 추가적으로 전달할 데이터</ko>
       * @return Indicates whether the event has occurred. If the stop() method is called by a custom event handler, it will return false and prevent the event from occurring. <a href="https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F">Ref</a> <ko>이벤트 발생 여부. 커스텀 이벤트 핸들러에서 stop() 메서드를 호출하면 'false'를 반환하고 이벤트 발생을 중단한다. <a href="https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F">참고</a></ko>
       * @example
       * ```
       * class Some extends eg.Component {
       *   some(){
       *     if(this.trigger("beforeHi")){ // When event call to stop return false.
       *       this.trigger("hi");// fire hi event.
       *     }
       *   }
       * }
       *
       * const some = new Some();
       * some.on("beforeHi", (e) => {
       *   if(condition){
       *     e.stop(); // When event call to stop, `hi` event not call.
       *   }
       * });
       * some.on("hi", (e) => {
       *   // `currentTarget` is component instance.
       *   console.log(some === e.currentTarget); // true
       * });
       * // If you want to more know event design. You can see article.
       * // https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F
       * ```
       */


      var __proto = Component.prototype;

      __proto.trigger = function (eventName) {
        var _this = this;

        var params = [];

        for (var _i = 1; _i < arguments.length; _i++) {
          params[_i - 1] = arguments[_i];
        }

        var handlerList = this._eventHandler[eventName] || [];
        var hasHandlerList = handlerList.length > 0;

        if (!hasHandlerList) {
          return true;
        }

        var customEvent = params[0] || {};
        var restParams = params.slice(1); // If detach method call in handler in first time then handler list calls.

        handlerList = handlerList.concat();
        var isCanceled = false; // This should be done like this to pass previous tests

        customEvent.eventType = eventName;

        customEvent.stop = function () {
          isCanceled = true;
        };

        customEvent.currentTarget = this;
        var arg = [customEvent];

        if (restParams.length >= 1) {
          arg = arg.concat(restParams);
        }

        handlerList.forEach(function (handler) {
          handler.apply(_this, arg);
        });
        return !isCanceled;
      };
      /**
       * Executed event just one time.
       * @ko 이벤트가 한번만 실행된다.
       * @param {string} eventName The name of the event to be attached <ko>등록할 이벤트의 이름</ko>
       * @param {function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
       * @return An instance of a component itself<ko>컴포넌트 자신의 인스턴스</ko>
       * @example
       * ```
       * class Some extends eg.Component {
       * hi() {
       *   alert("hi");
       * }
       * thing() {
       *   this.once("hi", this.hi);
       * }
       *
       * var some = new Some();
       * some.thing();
       * some.trigger("hi");
       * // fire alert("hi");
       * some.trigger("hi");
       * // Nothing happens
       * ```
       */


      __proto.once = function (eventName, handlerToAttach) {
        var _this = this;

        if (typeof eventName === "object" && isUndefined$1(handlerToAttach)) {
          var eventHash = eventName;

          for (var key in eventHash) {
            this.once(key, eventHash[key]);
          }

          return this;
        } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
          var listener_1 = function () {
            var args = [];

            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }

            handlerToAttach.apply(_this, args);

            _this.off(eventName, listener_1);
          };

          this.on(eventName, listener_1);
        }

        return this;
      };
      /**
       * Checks whether an event has been attached to a component.
       * @ko 컴포넌트에 이벤트가 등록됐는지 확인한다.
       * @param {string} eventName The name of the event to be attached <ko>등록 여부를 확인할 이벤트의 이름</ko>
       * @return {boolean} Indicates whether the event is attached. <ko>이벤트 등록 여부</ko>
       * @example
       * ```
       * class Some extends eg.Component {
       *   some() {
       *     this.hasOn("hi");// check hi event.
       *   }
       * }
       * ```
       */


      __proto.hasOn = function (eventName) {
        return !!this._eventHandler[eventName];
      };
      /**
       * Attaches an event to a component.
       * @ko 컴포넌트에 이벤트를 등록한다.
       * @param {string} eventName The name of the event to be attached <ko>등록할 이벤트의 이름</ko>
       * @param {function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
       * @return An instance of a component itself<ko>컴포넌트 자신의 인스턴스</ko>
       * @example
       * ```
       * class Some extends eg.Component {
       *   hi() {
       *     console.log("hi");
       *   }
       *   some() {
       *     this.on("hi",this.hi); //attach event
       *   }
       * }
       * ```
       */


      __proto.on = function (eventName, handlerToAttach) {
        if (typeof eventName === "object" && isUndefined$1(handlerToAttach)) {
          var eventHash = eventName;

          for (var name in eventHash) {
            this.on(name, eventHash[name]);
          }

          return this;
        } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
          var handlerList = this._eventHandler[eventName];

          if (isUndefined$1(handlerList)) {
            this._eventHandler[eventName] = [];
            handlerList = this._eventHandler[eventName];
          }

          handlerList.push(handlerToAttach);
        }

        return this;
      };
      /**
       * Detaches an event from the component.
       * @ko 컴포넌트에 등록된 이벤트를 해제한다
       * @param {string} eventName The name of the event to be detached <ko>해제할 이벤트의 이름</ko>
       * @param {function} handlerToDetach The handler function of the event to be detached <ko>해제할 이벤트의 핸들러 함수</ko>
       * @return An instance of a component itself <ko>컴포넌트 자신의 인스턴스</ko>
       * @example
       * ```
       * class Some extends eg.Component {
       *   hi() {
       *     console.log("hi");
       *   }
       *   some() {
       *     this.off("hi",this.hi); //detach event
       *   }
       * }
       * ```
       */


      __proto.off = function (eventName, handlerToDetach) {
        var e_1, _a; // Detach all event handlers.


        if (isUndefined$1(eventName)) {
          this._eventHandler = {};
          return this;
        } // Detach all handlers for eventname or detach event handlers by object.


        if (isUndefined$1(handlerToDetach)) {
          if (typeof eventName === "string") {
            delete this._eventHandler[eventName];
            return this;
          } else {
            var eventHash = eventName;

            for (var name in eventHash) {
              this.off(name, eventHash[name]);
            }

            return this;
          }
        } // Detach single event handler


        var handlerList = this._eventHandler[eventName];

        if (handlerList) {
          var idx = 0;

          try {
            for (var handlerList_1 = __values(handlerList), handlerList_1_1 = handlerList_1.next(); !handlerList_1_1.done; handlerList_1_1 = handlerList_1.next()) {
              var handlerFunction = handlerList_1_1.value;

              if (handlerFunction === handlerToDetach) {
                handlerList.splice(idx, 1);
                break;
              }

              idx++;
            }
          } catch (e_1_1) {
            e_1 = {
              error: e_1_1
            };
          } finally {
            try {
              if (handlerList_1_1 && !handlerList_1_1.done && (_a = handlerList_1.return)) _a.call(handlerList_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        }

        return this;
      };
      /**
       * Version info string
       * @ko 버전정보 문자열
       * @name VERSION
       * @static
       * @example
       * eg.Component.VERSION;  // ex) 2.0.0
       * @memberof eg.Component
       */


      Component.VERSION = "2.2.2";
      return Component;
    }();

    /*
    Copyright (c) Daybrush
    name: keycon
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/keycon.git
    version: 0.5.0
    */

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    /* global Reflect, Promise */
    var extendStatics$1 = function (d, b) {
      extendStatics$1 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics$1(d, b);
    };

    function __extends$1(d, b) {
      extendStatics$1(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function createCommonjsModule(fn, module) {
      return module = {
        exports: {}
      }, fn(module, module.exports), module.exports;
    }

    var keycode = createCommonjsModule(function (module, exports) {
    // Source: http://jsfiddle.net/vWx8V/
    // http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes

    /**
     * Conenience method returns corresponding value for given keyName or keyCode.
     *
     * @param {Mixed} keyCode {Number} or keyName {String}
     * @return {Mixed}
     * @api public
     */

    function keyCode(searchInput) {
      // Keyboard Events
      if (searchInput && 'object' === typeof searchInput) {
        var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode;
        if (hasKeyCode) searchInput = hasKeyCode;
      }

      // Numbers
      if ('number' === typeof searchInput) return names[searchInput]

      // Everything else (cast to string)
      var search = String(searchInput);

      // check codes
      var foundNamedKey = codes[search.toLowerCase()];
      if (foundNamedKey) return foundNamedKey

      // check aliases
      var foundNamedKey = aliases[search.toLowerCase()];
      if (foundNamedKey) return foundNamedKey

      // weird character?
      if (search.length === 1) return search.charCodeAt(0)

      return undefined
    }

    /**
     * Compares a keyboard event with a given keyCode or keyName.
     *
     * @param {Event} event Keyboard event that should be tested
     * @param {Mixed} keyCode {Number} or keyName {String}
     * @return {Boolean}
     * @api public
     */
    keyCode.isEventKey = function isEventKey(event, nameOrCode) {
      if (event && 'object' === typeof event) {
        var keyCode = event.which || event.keyCode || event.charCode;
        if (keyCode === null || keyCode === undefined) { return false; }
        if (typeof nameOrCode === 'string') {
          // check codes
          var foundNamedKey = codes[nameOrCode.toLowerCase()];
          if (foundNamedKey) { return foundNamedKey === keyCode; }

          // check aliases
          var foundNamedKey = aliases[nameOrCode.toLowerCase()];
          if (foundNamedKey) { return foundNamedKey === keyCode; }
        } else if (typeof nameOrCode === 'number') {
          return nameOrCode === keyCode;
        }
        return false;
      }
    };

    exports = module.exports = keyCode;

    /**
     * Get by name
     *
     *   exports.code['enter'] // => 13
     */

    var codes = exports.code = exports.codes = {
      'backspace': 8,
      'tab': 9,
      'enter': 13,
      'shift': 16,
      'ctrl': 17,
      'alt': 18,
      'pause/break': 19,
      'caps lock': 20,
      'esc': 27,
      'space': 32,
      'page up': 33,
      'page down': 34,
      'end': 35,
      'home': 36,
      'left': 37,
      'up': 38,
      'right': 39,
      'down': 40,
      'insert': 45,
      'delete': 46,
      'command': 91,
      'left command': 91,
      'right command': 93,
      'numpad *': 106,
      'numpad +': 107,
      'numpad -': 109,
      'numpad .': 110,
      'numpad /': 111,
      'num lock': 144,
      'scroll lock': 145,
      'my computer': 182,
      'my calculator': 183,
      ';': 186,
      '=': 187,
      ',': 188,
      '-': 189,
      '.': 190,
      '/': 191,
      '`': 192,
      '[': 219,
      '\\': 220,
      ']': 221,
      "'": 222
    };

    // Helper aliases

    var aliases = exports.aliases = {
      'windows': 91,
      '⇧': 16,
      '⌥': 18,
      '⌃': 17,
      '⌘': 91,
      'ctl': 17,
      'control': 17,
      'option': 18,
      'pause': 19,
      'break': 19,
      'caps': 20,
      'return': 13,
      'escape': 27,
      'spc': 32,
      'spacebar': 32,
      'pgup': 33,
      'pgdn': 34,
      'ins': 45,
      'del': 46,
      'cmd': 91
    };

    /*!
     * Programatically add the following
     */

    // lower case chars
    for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32;

    // numbers
    for (var i = 48; i < 58; i++) codes[i - 48] = i;

    // function keys
    for (i = 1; i < 13; i++) codes['f'+i] = i + 111;

    // numpad keys
    for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96;

    /**
     * Get by code
     *
     *   exports.name[13] // => 'Enter'
     */

    var names = exports.names = exports.title = {}; // title for backward compat

    // Create reverse mapping
    for (i in codes) names[codes[i]] = i;

    // Add aliases
    for (var alias in aliases) {
      codes[alias] = aliases[alias];
    }
    });
    var keycode_1 = keycode.code;
    var keycode_2 = keycode.codes;
    var keycode_3 = keycode.aliases;
    var keycode_4 = keycode.names;
    var keycode_5 = keycode.title;

    /*
    Copyright (c) 2018 Daybrush
    @name: @daybrush/utils
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/utils
    @version 0.10.0
    */
    /**
    * get string "string"
    * @memberof Consts
    * @example
    import {STRING} from "@daybrush/utils";

    console.log(STRING); // "string"
    */

    var STRING = "string";
    /**
    * Check the type that the value is isArray.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isArray} from "@daybrush/utils";

    console.log(isArray([])); // true
    console.log(isArray({})); // false
    console.log(isArray(undefined)); // false
    console.log(isArray(null)); // false
    */

    function isArray(value) {
      return Array.isArray(value);
    }
    /**
    * Check the type that the value is string.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isString} from "@daybrush/utils";

    console.log(isString("1234")); // true
    console.log(isString(undefined)); // false
    console.log(isString(1)); // false
    console.log(isString(null)); // false
    */

    function isString(value) {
      return typeof value === STRING;
    }
    /**
    * Sets up a function that will be called whenever the specified event is delivered to the target
    * @memberof DOM
    * @param - event target
    * @param - A case-sensitive string representing the event type to listen for.
    * @param - The object which receives a notification (an object that implements the Event interface) when an event of the specified type occurs
    * @param - An options object that specifies characteristics about the event listener. The available options are:
    * @example
    import {addEvent} from "@daybrush/utils";

    addEvent(el, "click", e => {
      console.log(e);
    });
    */

    function addEvent$1(el, type, listener, options) {
      el.addEventListener(type, listener, options);
    }

    var codeData = {
      "+": "plus",
      "left command": "meta",
      "right command": "meta"
    };
    var keysSort = {
      shift: 1,
      ctrl: 2,
      alt: 3,
      meta: 4
    };
    /**
     * @memberof KeyController
     */

    function getKey(keyCode) {
      var key = keycode_4[keyCode] || "";

      for (var name in codeData) {
        key = key.replace(name, codeData[name]);
      }

      return key.replace(/\s/g, "");
    }
    /**
     * @memberof KeyController
     */

    function getCombi(e, key) {
      if (key === void 0) {
        key = getKey(e.keyCode);
      }

      var keys = [e.shiftKey && "shift", e.ctrlKey && "ctrl", e.altKey && "alt", e.metaKey && "meta"];
      keys.indexOf(key) === -1 && keys.push(key);
      return keys.filter(Boolean);
    }

    function getArrangeCombi(keys) {
      var arrangeKeys = keys.slice();
      arrangeKeys.sort(function (prev, next) {
        var prevScore = keysSort[prev] || 5;
        var nextScore = keysSort[next] || 5;
        return prevScore - nextScore;
      });
      return arrangeKeys;
    }

    var globalKeyController;
    /**
     */

    var KeyController =
    /*#__PURE__*/
    function (_super) {
      __extends$1(KeyController, _super);
      /**
       *
       */


      function KeyController(container) {
        if (container === void 0) {
          container = window;
        }

        var _this = _super.call(this) || this;
        /**
         */


        _this.ctrlKey = false;
        /**
         */

        _this.altKey = false;
        /**
         *
         */

        _this.shiftKey = false;
        /**
         *
         */

        _this.metaKey = false;

        _this.clear = function () {
          _this.ctrlKey = false;
          _this.altKey = false;
          _this.shiftKey = false;
          _this.metaKey = false;
          return _this;
        };

        _this.keydownEvent = function (e) {
          _this.triggerEvent("keydown", e);
        };

        _this.keyupEvent = function (e) {
          _this.triggerEvent("keyup", e);
        };

        addEvent$1(container, "blur", _this.clear);
        addEvent$1(container, "keydown", _this.keydownEvent);
        addEvent$1(container, "keyup", _this.keyupEvent);
        return _this;
      }

      var __proto = KeyController.prototype;
      Object.defineProperty(KeyController, "global", {
        /**
         */
        get: function () {
          return globalKeyController || (globalKeyController = new KeyController());
        },
        enumerable: true,
        configurable: true
      });
      /**
       *
       */

      __proto.keydown = function (comb, callback) {
        return this.addEvent("keydown", comb, callback);
      };
      /**
       *
       */


      __proto.offKeydown = function (comb, callback) {
        return this.removeEvent("keydown", comb, callback);
      };
      /**
       *
       */


      __proto.offKeyup = function (comb, callback) {
        return this.removeEvent("keyup", comb, callback);
      };
      /**
       *
       */


      __proto.keyup = function (comb, callback) {
        return this.addEvent("keyup", comb, callback);
      };

      __proto.addEvent = function (type, comb, callback) {
        if (isArray(comb)) {
          this.on(type + "." + getArrangeCombi(comb).join("."), callback);
        } else if (isString(comb)) {
          this.on(type + "." + comb, callback);
        } else {
          this.on(type, comb);
        }

        return this;
      };

      __proto.removeEvent = function (type, comb, callback) {
        if (isArray(comb)) {
          this.off(type + "." + getArrangeCombi(comb).join("."), callback);
        } else if (isString(comb)) {
          this.off(type + "." + comb, callback);
        } else {
          this.off(type, comb);
        }

        return this;
      };

      __proto.triggerEvent = function (type, e) {
        this.ctrlKey = e.ctrlKey;
        this.shiftKey = e.shiftKey;
        this.altKey = e.altKey;
        this.metaKey = e.metaKey;
        var key = getKey(e.keyCode);
        var isToggle = key === "ctrl" || key === "shift" || key === "meta" || key === "alt";
        var param = {
          key: key,
          isToggle: isToggle,
          inputEvent: e,
          keyCode: e.keyCode,
          ctrlKey: e.ctrlKey,
          altKey: e.altKey,
          shiftKey: e.shiftKey,
          metaKey: e.metaKey
        };
        this.trigger(type, param);
        this.trigger(type + "." + key, param);
        var combi = getCombi(e, key);
        combi.length > 1 && this.trigger(type + "." + combi.join("."), param);
      };

      return KeyController;
    }(Component$1);

    /*
    Copyright (c) 2018 Daybrush
    @name: @daybrush/utils
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/utils
    @version 1.4.0
    */
    /**
    * Date.now() method
    * @memberof CrossBrowser
    * @return {number} milliseconds
    * @example
    import {now} from "@daybrush/utils";

    console.log(now()); // 12121324241(milliseconds)
    */

    function now$1() {
      return Date.now ? Date.now() : new Date().getTime();
    }
    /**
    * Sets up a function that will be called whenever the specified event is delivered to the target
    * @memberof DOM
    * @param - event target
    * @param - A case-sensitive string representing the event type to listen for.
    * @param - The object which receives a notification (an object that implements the Event interface) when an event of the specified type occurs
    * @param - An options object that specifies characteristics about the event listener. The available options are:
    * @example
    import {addEvent} from "@daybrush/utils";

    addEvent(el, "click", e => {
      console.log(e);
    });
    */

    function addEvent$2(el, type, listener, options) {
      el.addEventListener(type, listener, options);
    }
    /**
    * removes from the EventTarget an event listener previously registered with EventTarget.addEventListener()
    * @memberof DOM
    * @param - event target
    * @param - A case-sensitive string representing the event type to listen for.
    * @param - The EventListener function of the event handler to remove from the event target.
    * @example
    import {addEvent, removeEvent} from "@daybrush/utils";
    const listener = e => {
      console.log(e);
    };
    addEvent(el, "click", listener);
    removeEvent(el, "click", listener);
    */

    function removeEvent$1(el, type, listener) {
      el.removeEventListener(type, listener);
    }

    /*
    Copyright (c) 2019 Daybrush
    name: @daybrush/drag
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/drag.git
    version: 0.19.3
    */

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    var __assign$1 = function () {
      __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign$1.apply(this, arguments);
    };

    function getRad(pos1, pos2) {
      var distX = pos2[0] - pos1[0];
      var distY = pos2[1] - pos1[1];
      var rad = Math.atan2(distY, distX);
      return rad >= 0 ? rad : rad + Math.PI * 2;
    }
    function getRotatiion(touches) {
      return getRad([touches[0].clientX, touches[0].clientY], [touches[1].clientX, touches[1].clientY]) / Math.PI * 180;
    }
    function getPinchDragPosition(clients, prevClients, startClients, startPinchClients) {
      var nowCenter = getAverageClient(clients);
      var prevCenter = getAverageClient(prevClients);
      var startCenter = getAverageClient(startPinchClients);
      var pinchClient = plueClient(startPinchClients[0], minusClient(nowCenter, startCenter));
      var pinchPrevClient = plueClient(startPinchClients[0], minusClient(prevCenter, startCenter));
      return getPosition(pinchClient, pinchPrevClient, startClients[0]);
    }
    function isMultiTouch(e) {
      return e.touches && e.touches.length >= 2;
    }
    function getPositionEvent(e) {
      if (e.touches) {
        return getClients(e.touches);
      } else {
        return [getClient(e)];
      }
    }
    function getPosition(client, prevClient, startClient) {
      var clientX = client.clientX,
          clientY = client.clientY;
      var prevX = prevClient.clientX,
          prevY = prevClient.clientY;
      var startX = startClient.clientX,
          startY = startClient.clientY;
      var deltaX = clientX - prevX;
      var deltaY = clientY - prevY;
      var distX = clientX - startX;
      var distY = clientY - startY;
      return {
        clientX: clientX,
        clientY: clientY,
        deltaX: deltaX,
        deltaY: deltaY,
        distX: distX,
        distY: distY
      };
    }
    function getDist(clients) {
      return Math.sqrt(Math.pow(clients[0].clientX - clients[1].clientX, 2) + Math.pow(clients[0].clientY - clients[1].clientY, 2));
    }
    function getPositions(clients, prevClients, startClients) {
      return clients.map(function (client, i) {
        return getPosition(client, prevClients[i], startClients[i]);
      });
    }
    function getClients(touches) {
      var length = Math.min(touches.length, 2);
      var clients = [];

      for (var i = 0; i < length; ++i) {
        clients.push(getClient(touches[i]));
      }

      return clients;
    }
    function getClient(e) {
      return {
        clientX: e.clientX,
        clientY: e.clientY
      };
    }
    function getAverageClient(clients) {
      if (clients.length === 1) {
        return clients[0];
      }

      return {
        clientX: (clients[0].clientX + clients[1].clientX) / 2,
        clientY: (clients[0].clientY + clients[1].clientY) / 2
      };
    }
    function plueClient(client1, client2) {
      return {
        clientX: client1.clientX + client2.clientX,
        clientY: client1.clientY + client2.clientY
      };
    }
    function minusClient(client1, client2) {
      return {
        clientX: client1.clientX - client2.clientX,
        clientY: client1.clientY - client2.clientY
      };
    }

    var INPUT_TAGNAMES = ["textarea", "input"];
    /**
     * You can set up drag events in any browser.
     */

    var Dragger =
    /*#__PURE__*/
    function () {
      /**
       *
       */
      function Dragger(targets, options) {
        var _this = this;

        if (options === void 0) {
          options = {};
        }

        this.options = {};
        this.flag = false;
        this.pinchFlag = false;
        this.datas = {};
        this.isDrag = false;
        this.isPinch = false;
        this.isMouse = false;
        this.isTouch = false;
        this.prevClients = [];
        this.startClients = [];
        this.movement = 0;
        this.startPinchClients = [];
        this.startDistance = 0;
        this.customDist = [0, 0];
        this.targets = [];
        this.prevTime = 0;
        this.isDouble = false;
        this.startRotate = 0;
        /**
         * @method
         */

        this.onDragStart = function (e, isTrusted) {
          if (isTrusted === void 0) {
            isTrusted = true;
          }

          if (!_this.flag && e.cancelable === false) {
            return;
          }

          var _a = _this.options,
              container = _a.container,
              pinchOutside = _a.pinchOutside,
              dragstart = _a.dragstart,
              preventRightClick = _a.preventRightClick,
              preventDefault = _a.preventDefault,
              checkInput = _a.checkInput;
          var isTouch = _this.isTouch;

          if (!_this.flag) {
            var activeElement = document.activeElement;
            var target = e.target;
            var tagName = target.tagName.toLowerCase();
            var hasInput = INPUT_TAGNAMES.indexOf(tagName) > -1;
            var hasContentEditable = target.isContentEditable;

            if (hasInput || hasContentEditable) {
              if (checkInput || activeElement === target) {
                // force false or already focused.
                return false;
              }

              if (activeElement && hasContentEditable && activeElement.isContentEditable && activeElement.contains(target)) {
                return false;
              }
            } else if ((preventDefault || e.type === "touchstart") && activeElement) {
              var activeTagName = activeElement.tagName;

              if (activeElement.isContentEditable || INPUT_TAGNAMES.indexOf(activeTagName) > -1) {
                activeElement.blur();
              }
            }
          }

          var timer = 0;

          if (!_this.flag && isTouch && pinchOutside) {
            timer = setTimeout(function () {
              addEvent$2(container, "touchstart", _this.onDragStart, {
                passive: false
              });
            });
          }

          if (_this.flag && isTouch && pinchOutside) {
            removeEvent$1(container, "touchstart", _this.onDragStart);
          }

          if (isMultiTouch(e)) {
            clearTimeout(timer);

            if (!_this.flag && e.touches.length !== e.changedTouches.length) {
              return;
            }

            if (!_this.pinchFlag) {
              _this.onPinchStart(e);
            }
          }

          if (_this.flag) {
            return;
          }

          var clients = _this.startClients[0] ? _this.startClients : getPositionEvent(e);
          _this.customDist = [0, 0];
          _this.flag = true;
          _this.isDrag = false;
          _this.startClients = clients;
          _this.prevClients = clients;
          _this.datas = {};
          _this.movement = 0;
          var position = getPosition(clients[0], _this.prevClients[0], _this.startClients[0]);

          if (preventRightClick && (e.which === 3 || e.button === 2)) {
            clearTimeout(timer);

            _this.initDrag();

            return false;
          }

          var result = dragstart && dragstart(__assign$1({
            type: "dragstart",
            datas: _this.datas,
            inputEvent: e,
            isTrusted: isTrusted
          }, position));

          if (result === false) {
            clearTimeout(timer);

            _this.initDrag();
          }

          _this.isDouble = now$1() - _this.prevTime < 200;
          _this.flag && preventDefault && e.preventDefault();
        };

        this.onDrag = function (e, isScroll) {
          if (!_this.flag) {
            return;
          }

          var clients = getPositionEvent(e);

          if (_this.pinchFlag) {
            _this.onPinch(e, clients);
          }

          var result = _this.move([0, 0], e, clients);

          if (!result || !result.deltaX && !result.deltaY) {
            return;
          }

          var drag = _this.options.drag;
          drag && drag(__assign$1({}, result, {
            isScroll: !!isScroll,
            inputEvent: e
          }));
        };

        this.onDragEnd = function (e) {
          if (!_this.flag) {
            return;
          }

          var _a = _this.options,
              dragend = _a.dragend,
              pinchOutside = _a.pinchOutside,
              container = _a.container;

          if (_this.isTouch && pinchOutside) {
            removeEvent$1(container, "touchstart", _this.onDragStart);
          }

          if (_this.pinchFlag) {
            _this.onPinchEnd(e);
          }

          _this.flag = false;
          var prevClients = _this.prevClients;
          var startClients = _this.startClients;
          var position = _this.pinchFlag ? getPinchDragPosition(prevClients, prevClients, startClients, _this.startPinchClients) : getPosition(prevClients[0], prevClients[0], startClients[0]);
          var currentTime = now$1();
          var isDouble = !_this.isDrag && _this.isDouble;
          _this.prevTime = _this.isDrag || isDouble ? 0 : currentTime;
          _this.startClients = [];
          _this.prevClients = [];
          dragend && dragend(__assign$1({
            type: "dragend",
            datas: _this.datas,
            isDouble: isDouble,
            isDrag: _this.isDrag,
            inputEvent: e
          }, position));
        };

        var elements = [].concat(targets);
        this.options = __assign$1({
          checkInput: false,
          container: elements.length > 1 ? window : elements[0],
          preventRightClick: true,
          preventDefault: true,
          pinchThreshold: 0,
          events: ["touch", "mouse"]
        }, options);
        var _a = this.options,
            container = _a.container,
            events = _a.events;
        this.isTouch = events.indexOf("touch") > -1;
        this.isMouse = events.indexOf("mouse") > -1;
        this.customDist = [0, 0];
        this.targets = elements;

        if (this.isMouse) {
          elements.forEach(function (el) {
            addEvent$2(el, "mousedown", _this.onDragStart);
          });
          addEvent$2(container, "mousemove", this.onDrag);
          addEvent$2(container, "mouseup", this.onDragEnd);
          addEvent$2(container, "contextmenu", this.onDragEnd);
        }

        if (this.isTouch) {
          var passive_1 = {
            passive: false
          };
          elements.forEach(function (el) {
            addEvent$2(el, "touchstart", _this.onDragStart, passive_1);
          });
          addEvent$2(container, "touchmove", this.onDrag, passive_1);
          addEvent$2(container, "touchend", this.onDragEnd, passive_1);
          addEvent$2(container, "touchcancel", this.onDragEnd, passive_1);
        }
      }
      /**
       *
       */


      var __proto = Dragger.prototype;

      __proto.isDragging = function () {
        return this.isDrag;
      };
      /**
       *
       */


      __proto.isFlag = function () {
        return this.flag;
      };
      /**
       *
       */


      __proto.isPinchFlag = function () {
        return this.pinchFlag;
      };
      /**
       *
       */


      __proto.isPinching = function () {
        return this.isPinch;
      };
      /**
       *
       */


      __proto.scrollBy = function (deltaX, deltaY, e, isCallDrag) {
        if (isCallDrag === void 0) {
          isCallDrag = true;
        }

        if (!this.flag) {
          return;
        }

        this.startClients.forEach(function (client) {
          client.clientX -= deltaX;
          client.clientY -= deltaY;
        });
        this.prevClients.forEach(function (client) {
          client.clientX -= deltaX;
          client.clientY -= deltaY;
        });
        isCallDrag && this.onDrag(e, true);
      };

      __proto.move = function (_a, inputEvent, clients) {
        var deltaX = _a[0],
            deltaY = _a[1];

        if (clients === void 0) {
          clients = this.prevClients;
        }

        var customDist = this.customDist;
        var prevClients = this.prevClients;
        var startClients = this.startClients;
        var position = this.pinchFlag ? getPinchDragPosition(clients, prevClients, startClients, this.startPinchClients) : getPosition(clients[0], prevClients[0], startClients[0]);
        customDist[0] += deltaX;
        customDist[1] += deltaY;
        position.deltaX += deltaX;
        position.deltaY += deltaY;
        var positionDeltaX = position.deltaX,
            positionDeltaY = position.deltaY;
        position.distX += customDist[0];
        position.distY += customDist[1];
        this.movement += Math.sqrt(positionDeltaX * positionDeltaX + positionDeltaY * positionDeltaY);
        this.prevClients = clients;
        this.isDrag = true;
        return __assign$1({
          type: "drag",
          datas: this.datas
        }, position, {
          movement: this.movement,
          isDrag: this.isDrag,
          isPinch: this.isPinch,
          isScroll: false,
          inputEvent: inputEvent
        });
      };

      __proto.onPinchStart = function (e) {
        var _a, _b;

        var _c = this.options,
            pinchstart = _c.pinchstart,
            pinchThreshold = _c.pinchThreshold;

        if (this.isDrag && this.movement > pinchThreshold) {
          return;
        }

        var pinchClients = getClients(e.changedTouches);
        this.pinchFlag = true;

        (_a = this.startClients).push.apply(_a, pinchClients);

        (_b = this.prevClients).push.apply(_b, pinchClients);

        this.startDistance = getDist(this.prevClients);
        this.startPinchClients = this.prevClients.slice();

        if (!pinchstart) {
          return;
        }

        var startClients = this.prevClients;
        var startAverageClient = getAverageClient(startClients);
        var centerPosition = getPosition(startAverageClient, startAverageClient, startAverageClient);
        this.startRotate = getRotatiion(startClients);
        pinchstart(__assign$1({
          type: "pinchstart",
          datas: this.datas,
          angle: this.startRotate,
          touches: getPositions(startClients, startClients, startClients)
        }, centerPosition, {
          inputEvent: e
        }));
      };

      __proto.onPinch = function (e, clients) {
        if (!this.flag || !this.pinchFlag || clients.length < 2) {
          return;
        }

        this.isPinch = true;
        var pinch = this.options.pinch;

        if (!pinch) {
          return;
        }

        var prevClients = this.prevClients;
        var startClients = this.startClients;
        var centerPosition = getPosition(getAverageClient(clients), getAverageClient(prevClients), getAverageClient(startClients));
        var angle = getRotatiion(clients);
        var distance = getDist(clients);
        pinch(__assign$1({
          type: "pinch",
          datas: this.datas,
          movement: this.movement,
          angle: angle,
          rotation: angle - this.startRotate,
          touches: getPositions(clients, prevClients, startClients),
          scale: distance / this.startDistance,
          distance: distance
        }, centerPosition, {
          inputEvent: e
        }));
      };

      __proto.onPinchEnd = function (e) {
        if (!this.flag || !this.pinchFlag) {
          return;
        }

        var isPinch = this.isPinch;
        this.isPinch = false;
        this.pinchFlag = false;
        var pinchend = this.options.pinchend;

        if (!pinchend) {
          return;
        }

        var prevClients = this.prevClients;
        var startClients = this.startClients;
        var centerPosition = getPosition(getAverageClient(prevClients), getAverageClient(prevClients), getAverageClient(startClients));
        pinchend(__assign$1({
          type: "pinchend",
          datas: this.datas,
          isPinch: isPinch,
          touches: getPositions(prevClients, prevClients, startClients)
        }, centerPosition, {
          inputEvent: e
        }));
        this.isPinch = false;
        this.pinchFlag = false;
      };

      __proto.triggerDragStart = function (e) {
        this.onDragStart(e, false);
      };
      /**
       *
       */


      __proto.unset = function () {
        var _this = this;

        var targets = this.targets;
        var container = this.options.container;

        if (this.isMouse) {
          targets.forEach(function (target) {
            removeEvent$1(target, "mousedown", _this.onDragStart);
          });
          removeEvent$1(container, "mousemove", this.onDrag);
          removeEvent$1(container, "mouseup", this.onDragEnd);
          removeEvent$1(container, "contextmenu", this.onDragEnd);
        }

        if (this.isTouch) {
          targets.forEach(function (target) {
            removeEvent$1(target, "touchstart", _this.onDragStart);
          });
          removeEvent$1(container, "touchstart", this.onDragStart);
          removeEvent$1(container, "touchmove", this.onDrag);
          removeEvent$1(container, "touchend", this.onDragEnd);
          removeEvent$1(container, "touchcancel", this.onDragEnd);
        }
      };

      __proto.initDrag = function () {
        this.startClients = [];
        this.prevClients = [];
        this.flag = false;
      };

      return Dragger;
    }();

    /*
    Copyright (c) 2019 Daybrush
    name: preact-timeline
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/scenejs-timeline.git
    version: 0.3.1
    */

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics$2 = function(d, b) {
        extendStatics$2 = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics$2(d, b);
    };

    function __extends$2(d, b) {
        extendStatics$2(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign$2 = function() {
        __assign$2 = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign$2.apply(this, arguments);
    };

    var ELEMENTS = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr circle clipPath defs ellipse g image line linearGradient mask path pattern polygon polyline radialGradient rect stop svg text tspan'.split(
    	' '
    );

    var REACT_ELEMENT_TYPE = (typeof Symbol !== 'undefined' && Symbol.for && Symbol.for('react.element')) || 0xeac7;

    var COMPONENT_WRAPPER_KEY =
    	typeof Symbol !== 'undefined' && Symbol.for ? Symbol.for('__preactCompatWrapper') : '__preactCompatWrapper';

    // don't autobind these methods since they already have guaranteed context.
    var AUTOBIND_BLACKLIST = {
    	constructor: 1,
    	render: 1,
    	shouldComponentUpdate: 1,
    	componentWillReceiveProps: 1,
    	componentWillUpdate: 1,
    	componentDidUpdate: 1,
    	componentWillMount: 1,
    	componentDidMount: 1,
    	componentWillUnmount: 1,
    	componentDidUnmount: 1
    };

    var CAMEL_PROPS = /^(?:accent|alignment|arabic|baseline|cap|clip|color|fill|flood|font|glyph|horiz|marker|overline|paint|stop|strikethrough|stroke|text|underline|unicode|units|v|vector|vert|word|writing|x)[A-Z]/;

    var BYPASS_HOOK = {};

    /*global process*/
    var DEV = false;
    try {
    	DEV = process.env.NODE_ENV !== 'production';
    }
    catch (e) { }

    // make react think we're react.
    var VNode$1 = h('a', null).constructor;
    VNode$1.prototype.$$typeof = REACT_ELEMENT_TYPE;
    VNode$1.prototype.preactCompatUpgraded = false;
    VNode$1.prototype.preactCompatNormalized = false;

    Object.defineProperty(VNode$1.prototype, 'type', {
    	get: function() {
    		return this.nodeName;
    	},
    	set: function(v) {
    		this.nodeName = v;
    	},
    	configurable: true
    });

    Object.defineProperty(VNode$1.prototype, 'props', {
    	get: function() {
    		return this.attributes;
    	},
    	set: function(v) {
    		this.attributes = v;
    	},
    	configurable: true
    });

    var oldEventHook = options.event;
    options.event = function (e) {
    	if (oldEventHook) { e = oldEventHook(e); }
    	e.persist = Object;
    	e.nativeEvent = e;
    	return e;
    };

    var oldVnodeHook = options.vnode;
    options.vnode = function (vnode) {
    	if (!vnode.preactCompatUpgraded) {
    		vnode.preactCompatUpgraded = true;

    		var tag = vnode.nodeName,
    			attrs = (vnode.attributes = vnode.attributes == null ? {} : extend$1({}, vnode.attributes));

    		if (typeof tag === 'function') {
    			if (tag[COMPONENT_WRAPPER_KEY] === true || (tag.prototype && 'isReactComponent' in tag.prototype)) {
    				if (vnode.children && String(vnode.children) === '') { vnode.children = undefined; }
    				if (vnode.children) { attrs.children = vnode.children; }

    				if (!vnode.preactCompatNormalized) {
    					normalizeVNode(vnode);
    				}
    				handleComponentVNode(vnode);
    			}
    		}
    		else {
    			if (vnode.children && String(vnode.children) === '') { vnode.children = undefined; }
    			if (vnode.children) { attrs.children = vnode.children; }

    			if (attrs.defaultValue) {
    				if (!attrs.value && attrs.value !== 0) {
    					attrs.value = attrs.defaultValue;
    				}
    				delete attrs.defaultValue;
    			}

    			handleElementVNode(vnode, attrs);
    		}
    	}

    	if (oldVnodeHook) { oldVnodeHook(vnode); }
    };

    function handleComponentVNode(vnode) {
    	var tag = vnode.nodeName,
    		a = vnode.attributes;

    	vnode.attributes = {};
    	if (tag.defaultProps) { extend$1(vnode.attributes, tag.defaultProps); }
    	if (a) { extend$1(vnode.attributes, a); }
    }

    function handleElementVNode(vnode, a) {
    	var shouldSanitize, attrs, i;
    	if (a) {
    		for (i in a) { if ((shouldSanitize = CAMEL_PROPS.test(i))) { break; } }
    		if (shouldSanitize) {
    			attrs = vnode.attributes = {};
    			for (i in a) {
    				if (a.hasOwnProperty(i)) {
    					attrs[CAMEL_PROPS.test(i) ? i.replace(/([A-Z0-9])/, '-$1').toLowerCase() : i] = a[i];
    				}
    			}
    		}
    	}
    }

    var ARR = [];

    /** Track current render() component for ref assignment */
    var currentComponent;

    function createFactory(type) {
    	return createElement.bind(null, type);
    }

    var DOM = {};
    for (var i = ELEMENTS.length; i--;) {
    	DOM[ELEMENTS[i]] = createFactory(ELEMENTS[i]);
    }

    function upgradeToVNodes(arr, offset) {
    	for (var i = offset || 0; i < arr.length; i++) {
    		var obj = arr[i];
    		if (Array.isArray(obj)) {
    			upgradeToVNodes(obj);
    		}
    		else if (
    			obj &&
    			typeof obj === 'object' &&
    			!isValidElement(obj) &&
    			((obj.props && obj.type) || (obj.attributes && obj.nodeName) || obj.children)
    		) {
    			arr[i] = createElement(obj.type || obj.nodeName, obj.props || obj.attributes, obj.children);
    		}
    	}
    }

    function isStatelessComponent(c) {
    	return typeof c === 'function' && !(c.prototype && c.prototype.render);
    }

    // wraps stateless functional components in a PropTypes validator
    function wrapStatelessComponent(WrappedComponent) {
    	return createClass({
    		displayName: WrappedComponent.displayName || WrappedComponent.name,
    		render: function() {
    			return WrappedComponent(this.props, this.context);
    		}
    	});
    }

    function statelessComponentHook(Ctor) {
    	var Wrapped = Ctor[COMPONENT_WRAPPER_KEY];
    	if (Wrapped) { return Wrapped === true ? Ctor : Wrapped; }

    	Wrapped = wrapStatelessComponent(Ctor);

    	Object.defineProperty(Wrapped, COMPONENT_WRAPPER_KEY, { configurable: true, value: true });
    	Wrapped.displayName = Ctor.displayName;
    	Wrapped.propTypes = Ctor.propTypes;
    	Wrapped.defaultProps = Ctor.defaultProps;

    	Object.defineProperty(Ctor, COMPONENT_WRAPPER_KEY, { configurable: true, value: Wrapped });

    	return Wrapped;
    }

    function createElement() {
    	var args = [], len = arguments.length;
    	while ( len-- ) args[ len ] = arguments[ len ];

    	upgradeToVNodes(args, 2);
    	return normalizeVNode(h.apply(void 0, args));
    }

    function normalizeVNode(vnode) {
    	vnode.preactCompatNormalized = true;

    	applyClassName(vnode);

    	if (isStatelessComponent(vnode.nodeName)) {
    		vnode.nodeName = statelessComponentHook(vnode.nodeName);
    	}

    	var ref = vnode.attributes.ref,
    		type = ref && typeof ref;
    	if (currentComponent && (type === 'string' || type === 'number')) {
    		vnode.attributes.ref = createStringRefProxy(ref, currentComponent);
    	}

    	applyEventNormalization(vnode);

    	return vnode;
    }

    function isValidElement(element) {
    	return element && (element instanceof VNode$1 || element.$$typeof === REACT_ELEMENT_TYPE);
    }

    function createStringRefProxy(name, component) {
    	return (
    		component._refProxies[name] ||
    		(component._refProxies[name] = function (resolved) {
    			if (component && component.refs) {
    				component.refs[name] = resolved;
    				if (resolved === null) {
    					delete component._refProxies[name];
    					component = null;
    				}
    			}
    		})
    	);
    }

    function applyEventNormalization(ref) {
    	var nodeName = ref.nodeName;
    	var attributes = ref.attributes;

    	if (!attributes || typeof nodeName !== 'string') { return; }
    	var props = {};
    	for (var i in attributes) {
    		props[i.toLowerCase()] = i;
    	}
    	if (props.ondoubleclick) {
    		attributes.ondblclick = attributes[props.ondoubleclick];
    		delete attributes[props.ondoubleclick];
    	}
    	// for *textual inputs* (incl textarea), normalize `onChange` -> `onInput`:
    	if (
    		props.onchange &&
    		(nodeName === 'textarea' || (nodeName.toLowerCase() === 'input' && !/^fil|che|rad/i.test(attributes.type)))
    	) {
    		var normalized = props.oninput || 'oninput';
    		if (!attributes[normalized]) {
    			attributes[normalized] = multihook([attributes[normalized], attributes[props.onchange]]);
    			delete attributes[props.onchange];
    		}
    	}
    }

    function applyClassName(vnode) {
    	var a = vnode.attributes || (vnode.attributes = {});
    	classNameDescriptor.enumerable = 'className' in a;
    	if (a.className) { a.class = a.className; }
    	Object.defineProperty(a, 'className', classNameDescriptor);
    }

    var classNameDescriptor = {
    	configurable: true,
    	get: function() {
    		return this.class;
    	},
    	set: function(v) {
    		this.class = v;
    	}
    };

    function extend$1(base, props) {
    	var arguments$1 = arguments;

    	for (var i = 1, obj = (void 0); i < arguments.length; i++) {
    		if ((obj = arguments$1[i])) {
    			for (var key in obj) {
    				if (obj.hasOwnProperty(key)) {
    					base[key] = obj[key];
    				}
    			}
    		}
    	}
    	return base;
    }

    function shallowDiffers(a, b) {
    	for (var i in a) { if (!(i in b)) { return true; } }
    	for (var i$1 in b) { if (a[i$1] !== b[i$1]) { return true; } }
    	return false;
    }

    function findDOMNode(component) {
    	return (component && (component.base || (component.nodeType === 1 && component))) || null;
    }

    function F() { }

    function createClass(obj) {
    	function cl(props, context) {
    		bindAll(this);
    		Component$1$1.call(this, props, context, BYPASS_HOOK);
    		newComponentHook.call(this, props, context);
    	}

    	obj = extend$1({ constructor: cl }, obj);

    	// We need to apply mixins here so that getDefaultProps is correctly mixed
    	if (obj.mixins) {
    		applyMixins(obj, collateMixins(obj.mixins));
    	}
    	if (obj.statics) {
    		extend$1(cl, obj.statics);
    	}
    	if (obj.propTypes) {
    		cl.propTypes = obj.propTypes;
    	}
    	if (obj.defaultProps) {
    		cl.defaultProps = obj.defaultProps;
    	}
    	if (obj.getDefaultProps) {
    		cl.defaultProps = obj.getDefaultProps.call(cl);
    	}

    	F.prototype = Component$1$1.prototype;
    	cl.prototype = extend$1(new F(), obj);

    	cl.displayName = obj.displayName || 'Component';

    	return cl;
    }

    // Flatten an Array of mixins to a map of method name to mixin implementations
    function collateMixins(mixins) {
    	var keyed = {};
    	for (var i = 0; i < mixins.length; i++) {
    		var mixin = mixins[i];
    		for (var key in mixin) {
    			if (mixin.hasOwnProperty(key) && typeof mixin[key] === 'function') {
    				(keyed[key] || (keyed[key] = [])).push(mixin[key]);
    			}
    		}
    	}
    	return keyed;
    }

    // apply a mapping of Arrays of mixin methods to a component prototype
    function applyMixins(proto, mixins) {
    	for (var key in mixins)
    		{ if (mixins.hasOwnProperty(key)) {
    			proto[key] = multihook(
    				mixins[key].concat(proto[key] || ARR),
    				key === 'getDefaultProps' || key === 'getInitialState' || key === 'getChildContext'
    			);
    		} }
    }

    function bindAll(ctx) {
    	for (var i in ctx) {
    		var v = ctx[i];
    		if (typeof v === 'function' && !v.__bound && !AUTOBIND_BLACKLIST.hasOwnProperty(i)) {
    			(ctx[i] = v.bind(ctx)).__bound = true;
    		}
    	}
    }

    function callMethod(ctx, m, args) {
    	if (typeof m === 'string') {
    		m = ctx.constructor.prototype[m];
    	}
    	if (typeof m === 'function') {
    		return m.apply(ctx, args);
    	}
    }

    function multihook(hooks, skipDuplicates) {
    	return function () {
    		var arguments$1 = arguments;
    		var this$1 = this;

    		var ret;
    		for (var i = 0; i < hooks.length; i++) {
    			var r = callMethod(this$1, hooks[i], arguments$1);

    			if (skipDuplicates && r != null) {
    				if (!ret) { ret = {}; }
    				for (var key in r)
    					{ if (r.hasOwnProperty(key)) {
    						ret[key] = r[key];
    					} }
    			}
    			else if (typeof r !== 'undefined') { ret = r; }
    		}
    		return ret;
    	};
    }

    function newComponentHook(props, context) {
    	propsHook.call(this, props, context);
    	this.componentWillReceiveProps = multihook([
    		propsHook,
    		this.componentWillReceiveProps || 'componentWillReceiveProps'
    	]);
    	this.render = multihook([propsHook, beforeRender, this.render || 'render', afterRender]);
    }

    function propsHook(props, context) {
    	if (!props) { return; }

    	// React annoyingly special-cases single children, and some react components are ridiculously strict about this.
    	var c = props.children;
    	if (
    		c &&
    		Array.isArray(c) &&
    		c.length === 1 &&
    		(typeof c[0] === 'string' || typeof c[0] === 'function' || c[0] instanceof VNode$1)
    	) {
    		props.children = c[0];

    		// but its totally still going to be an Array.
    		if (props.children && typeof props.children === 'object') {
    			props.children.length = 1;
    			props.children[0] = props.children;
    		}
    	}

    	// add proptype checking
    	if (DEV) {
    		var ctor = typeof this === 'function' ? this : this.constructor,
    			propTypes = this.propTypes || ctor.propTypes;
    		var displayName = this.displayName || ctor.name;
    	}
    }

    function beforeRender(props) {
    	currentComponent = this;
    }

    function afterRender() {
    	if (currentComponent === this) {
    		currentComponent = null;
    	}
    }

    function Component$1$1(props, context, opts) {
    	Component.call(this, props, context);
    	this.state = this.getInitialState ? this.getInitialState() : {};
    	this.refs = {};
    	this._refProxies = {};
    	if (opts !== BYPASS_HOOK) {
    		newComponentHook.call(this, props, context);
    	}
    }
    extend$1((Component$1$1.prototype = new Component()), {
    	constructor: Component$1$1,

    	isReactComponent: {},

    	replaceState: function(state, callback) {
    		var this$1 = this;

    		this.setState(state, callback);
    		for (var i in this$1.state) {
    			if (!(i in state)) {
    				delete this$1.state[i];
    			}
    		}
    	},

    	getDOMNode: function() {
    		return this.base;
    	},

    	isMounted: function() {
    		return !!this.base;
    	}
    });

    function PureComponent(props, context) {
    	Component$1$1.call(this, props, context);
    }
    F.prototype = Component$1$1.prototype;
    PureComponent.prototype = new F();
    PureComponent.prototype.isPureReactComponent = true;
    PureComponent.prototype.shouldComponentUpdate = function (props, state) {
    	return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
    };

    /*
    Copyright (c) 2019 Daybrush
    name: framework-utils
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/framework-utils.git
    version: 0.2.1
    */
    function prefixNames(prefix) {
      var classNames = [];

      for (var _i = 1; _i < arguments.length; _i++) {
        classNames[_i - 1] = arguments[_i];
      }

      return classNames.map(function (className) {
        return className.split(" ").map(function (name) {
          return name ? "" + prefix + name : "";
        }).join(" ");
      }).join(" ");
    }
    function prefixCSS(prefix, css) {
      return css.replace(/\.([^{,\s\d.]+)/g, "." + prefix + "$1");
    }
    /* react */

    function ref(target, name) {
      return function (e) {
        e && (target[name] = e);
      };
    }
    function refs(target, name, i) {
      return function (e) {
        e && (target[name][i] = e);
      };
    }

    /*
    Copyright (c) 2016 Daybrush
    name: scenejs
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/scenejs.git
    version: 1.5.0
    */
    function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

      for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

      return r;
    }

    var _a;
    var TIMING_FUNCTION = "animation-timing-function";
    var ROLES = {
      transform: {},
      filter: {},
      attribute: {},
      html: true
    };
    var FIXED = (_a = {}, _a[TIMING_FUNCTION] = true, _a.contents = true, _a.html = true, _a);
    var DURATION = "duration";
    var FILL_MODE = "fillMode";
    var DIRECTION = "direction";
    var ITERATION_COUNT = "iterationCount";
    var DELAY = "delay";
    var EASING = "easing";
    var PLAY_SPEED = "playSpeed";
    var EASING_NAME = "easingName";
    var ITERATION_TIME = "iterationTime";
    var PLAY_STATE = "playState";
    /**
    * @typedef {Object} AnimatorState The Animator options. Properties used in css animation.
    * @property {number} [duration] The duration property defines how long an animation should take to complete one cycle.
    * @property {"none"|"forwards"|"backwards"|"both"} [fillMode] The fillMode property specifies a style for the element when the animation is not playing (before it starts, after it ends, or both).
    * @property {"infinite"|number} [iterationCount] The iterationCount property specifies the number of times an animation should be played.
    * @property {array|function} [easing] The easing(timing-function) specifies the speed curve of an animation.
    * @property {number} [delay] The delay property specifies a delay for the start of an animation.
    * @property {"normal"|"reverse"|"alternate"|"alternate-reverse"} [direction] The direction property defines whether an animation should be played forwards, backwards or in alternate cycles.
    */

    var setters = ["id", ITERATION_COUNT, DELAY, FILL_MODE, DIRECTION, PLAY_SPEED, DURATION, PLAY_SPEED, ITERATION_TIME, PLAY_STATE];

    var getters = __spreadArrays(setters, [EASING, EASING_NAME]);

    /*
    Copyright (c) 2019 Daybrush
    name: react-pure-props
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/pure-props/tree/master/react-pure-props
    version: 0.1.5
    */

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    /* global Reflect, Promise */
    var extendStatics$1$1 = function (d, b) {
      extendStatics$1$1 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics$1$1(d, b);
    };

    function __extends$2$1(d, b) {
      extendStatics$1$1(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    //

    var shallowequal = function shallowEqual(objA, objB, compare, compareContext) {
      var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

      if (ret !== void 0) {
        return !!ret;
      }

      if (objA === objB) {
        return true;
      }

      if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
        return false;
      }

      var keysA = Object.keys(objA);
      var keysB = Object.keys(objB);

      if (keysA.length !== keysB.length) {
        return false;
      }

      var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

      // Test for A's keys different from B.
      for (var idx = 0; idx < keysA.length; idx++) {
        var key = keysA[idx];

        if (!bHasOwnProperty(key)) {
          return false;
        }

        var valueA = objA[key];
        var valueB = objB[key];

        ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

        if (ret === false || (ret === void 0 && valueA !== valueB)) {
          return false;
        }
      }

      return true;
    };

    var PureProps =
    /*#__PURE__*/
    function (_super) {
      __extends$2$1(PureProps, _super);

      function PureProps() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = PureProps.prototype;

      __proto.shouldComponentUpdate = function (prevProps, prevState) {
        return prevState !== this.state || !shallowequal(prevProps, this.props);
      };

      return PureProps;
    }(Component$1$1);

    /*
    Copyright (c) 2019 Daybrush
    name: react-css-styler
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/css-styler/tree/master/react-css-styler
    version: 0.4.1
    */

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    /* global Reflect, Promise */
    var extendStatics$2$1 = function (d, b) {
      extendStatics$2$1 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics$2$1(d, b);
    };

    function __extends$3(d, b) {
      extendStatics$2$1(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign$1$1 = function () {
      __assign$1$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign$1$1.apply(this, arguments);
    };
    function __rest(s, e) {
      var t = {};

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
    }

    function hash(str) {
      var hash = 5381,
          i    = str.length;

      while(i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
      }

      /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
       * integers. Since we want the results to be always positive, convert the
       * signed int to an unsigned by doing an unsigned bitshift. */
      return hash >>> 0;
    }

    var stringHash = hash;

    function getHash(str) {
      return stringHash(str).toString(36);
    }
    function injectStyle(className, css) {
      var style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.innerHTML = css.replace(/([^}{]*){/mg, function (all, selector) {
        return splitComma(selector).map(function (subSelector) {
          if (subSelector.indexOf(":global") > -1) {
            return subSelector.replace(/\:global/g, "");
          } else if (subSelector.indexOf(":host") > -1) {
            return "" + subSelector.replace(/\:host/g, "." + className);
          }

          return "." + className + " " + subSelector;
        }).join(", ") + "{";
      });
      (document.head || document.body).appendChild(style);
      return style;
    }

    function styled(Tag, css) {
      var injectClassName = "rCS" + getHash(css);
      var injectCount = 0;
      var injectElement;
      return (
        /*#__PURE__*/
        function (_super) {
          __extends$3(Styler, _super);

          function Styler(props) {
            return _super.call(this, props) || this;
          }

          Styler.prototype.render = function () {
            var _a = this.props,
                className = _a.className,
                attributes = __rest(_a, ["className"]);

            return createElement(Tag, __assign$1$1({
              className: className + " " + injectClassName
            }, attributes));
          };

          Styler.prototype.componentDidMount = function () {
            if (injectCount === 0) {
              injectElement = injectStyle(injectClassName, css);
            }

            ++injectCount;
          };

          Styler.prototype.componentWillUnmount = function () {
            --injectCount;

            if (injectCount === 0 && injectElement) {
              injectElement.parentNode.removeChild(injectElement);
            }
          };

          Styler.prototype.getElement = function () {
            return this.element || (this.element = findDOMNode(this));
          };

          return Styler;
        }(Component$1$1)
      );
    }

    /*
    Copyright (c) 2019 Daybrush
    name: react-scenejs-timeline
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/scenejs-timeline.git
    version: 0.3.2
    */

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    /* global Reflect, Promise */
    var extendStatics$3 = function (d, b) {
      extendStatics$3 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics$3(d, b);
    };

    function __extends$4(d, b) {
      extendStatics$3(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign$2$1 = function () {
      __assign$2$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign$2$1.apply(this, arguments);
    };
    function __rest$1(s, e) {
      var t = {};

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
      return t;
    }

    var PREFIX = "scenejs-editor-";
    var CSS = prefixCSS(PREFIX, "\n{\n    position: relative;\n    width: 100%;\n    font-size: 0;\n    background: #000;\n    display: flex;\n    flex-direction: column;\n}\n* {\n    font-family: sans-serif;\n    box-sizing: border-box;\n    color: #fff;\n}\n.header-area, .scroll-area {\n   width: 100%;\n   position: relative;\n  display: flex;\n  -webkit-align-items: flex-start;\n  align-items: flex-start;\n}\n.header-area {\n  position: relative;\n  z-index: 10;\n  top: 0;\n  height: 30px;\n  min-height: 30px;\n}\n.header-area .keyframes {\n  padding: 0px;\n}\n.header-area .properties-area,\n.header-area .keyframes-area,\n.header-area .values-area,\n.header-area .keyframes-scroll-area {\n    height: 100%;\n}\n.header-area .keyframes-scroll-area {\n    overflow: hidden;\n}\n.header-area .property, .header-area .value, .header-area .keyframes {\n  height: 100%;\n}\n.header-area .property {\n    line-height: 30px;\n}\n.value .add {\n    text-align: center;\n    color: #fff;\n    line-height: 30px;\n    font-weight: bold;\n    font-size: 20px;\n    cursor: pointer;\n}\n.header-area .keyframes-area::-webkit-scrollbar {\n    display: none;\n}\n.header-area .keyframe-cursor {\n    position: absolute;\n    border-top: 10px solid #4af;\n    border-left: 6px solid transparent;\n    border-right: 6px solid transparent;\n    width: 0;\n    height: 0;\n    bottom: 0;\n    top: auto;\n    background: none;\n    cursor: pointer;\n}\n.control-area .keyframes {\n    padding-left: 10px;\n}\n.play-control-area {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n}\n.play-control-area .control {\n    position: relative;\n    display: inline-block;\n    vertical-align: middle;\n    color: white;\n    margin: 0px 15px;\n    cursor: pointer;\n}\n.play {\n    border-left: 14px solid white;\n    border-top: 8px solid transparent;\n    border-bottom: 8px solid transparent;\n}\n.pause {\n    border-left: 4px solid #fff;\n    border-right: 4px solid #fff;\n    width: 14px;\n    height: 16px;\n}\n.prev {\n    border-right: 10px solid white;\n    border-top: 6px solid transparent;\n    border-bottom: 6px solid transparent;\n}\n.prev:before {\n    position: absolute;\n    content: \"\";\n    width: 3px;\n    height: 10px;\n    top: 0;\n    right: 100%;\n    transform: translate(0, -50%);\n    background: white;\n}\n.next {\n    border-left: 10px solid white;\n    border-top: 6px solid transparent;\n    border-bottom: 6px solid transparent;\n}\n.next:before {\n    position: absolute;\n    content: \"\";\n    width: 3px;\n    height: 10px;\n    top: 0;\n    transform: translate(0, -50%);\n    background: white;\n}\n.keytime {\n  position: relative;\n  display: inline-block;\n  height: 100%;\n  font-size: 13px;\n  font-weight: bold;\n  color: #777;\n}\n.keytime:last-child {\n  max-width: 0px;\n}\n.keytime span {\n  position: absolute;\n  line-height: 1;\n  bottom: 12px;\n  display: inline-block;\n  transform: translate(-50%);\n  color: #eee;\n}\n.keytime .graduation {\n  position: absolute;\n  bottom: 0;\n  width: 1px;\n  height: 10px;\n  background: #666;\n  transform: translate(-50%);\n}\n.keytime .graduation.half {\n  left: 50%;\n  height: 7px;\n}\n.keytime .graduation.quarter {\n  left: 25%;\n  height: 5px;\n}\n.keytime .graduation.quarter3 {\n  left: 75%;\n  height: 5px;\n}\n.scroll-area {\n  position: relative;\n  width: 100%;\n  height: calc(100% - 60px);\n  overflow: auto;\n}\n.properties-area, .keyframes-area, .values-area {\n  display: inline-block;\n  position: relative;\n  font-size: 16px;\n  overflow: auto;\n}\n\n.properties-area::-webkit-scrollbar, .keyframes-area::-webkit-scrollbar {\n    display: none;\n}\n.properties-area {\n  width: 30%;\n  max-width: 200px;\n  box-sizing: border-box;\n}\n.values-area {\n    width: 50px;\n    min-width: 50px;\n    display: inline-block;\n    border-right: 1px solid #666;\n    box-sizing: border-box;\n}\n.value input {\n    appearance: none;\n    -webkit-appearance: none;\n    outline: none;\n    position: relative;\n    display: block;\n    width: 100%;\n    height: 100%;\n    background: transparent;\n    color: #4af;\n    font-weight: bold;\n    background: none;\n    border: 0;\n    box-sizing: border-box;\n    text-align: center;\n}\n.value {\n\n}\n:host.alt .value input {\n    cursor: ew-resize;\n}\n.value[data-object=\"1\"] input {\n    display: none;\n}\n.properties-scroll-area {\n  display: inline-block;\n  min-width: 100%;\n}\n.keyframes-area {\n  flex: 1;\n}\n.keyframes-scroll-area {\n  position: relative;\n  min-width: 300px;\n}\n.keyframes, .property, .value {\n  position: relative;\n  height: 30px;\n  line-height: 30px;\n  border-bottom: 1px solid #555;\n  box-sizing: border-box;\n  white-space: nowrap;\n  background: rgba(90, 90, 90, 0.7);\n  z-index: 1;\n}\n\n.property {\n  padding-left: 10px;\n  box-sizing: border-box;\n  font-size: 13px;\n  font-weight: bold;\n  color: #eee;\n}\n.property .remove {\n    position: absolute;\n    display: inline-block;\n    cursor: pointer;\n    width: 18px;\n    height: 18px;\n    top: 0;\n    bottom: 0;\n    right: 10px;\n    margin: auto;\n    border-radius: 50%;\n    border: 2px solid #fff;\n    vertical-align: middle;\n    display: none;\n    margin-left: 10px;\n    box-sizing: border-box;\n}\n.property .remove:before, .property .remove:after {\n    position: absolute;\n    content: \"\";\n    width: 8px;\n    height: 2px;\n    border-radius: 1px;\n    background: #fff;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    margin: auto;\n}\n.property .remove:before {\n    transform: rotate(45deg);\n}\n.property .remove:after {\n    transform: rotate(-45deg);\n}\n.property:hover .remove {\n    display: inline-block;\n}\n\n[data-item=\"1\"], [data-item=\"1\"] .add {\n    height: 30px;\n    line-height: 30px;\n}\n.time-area {\n    position: absolute;\n    top: 0;\n    left: 10px;\n    font-size: 13px;\n    color: #4af;\n    line-height: 30px;\n    font-weight: bold;\n    height: 100%;\n    line-height: 30px;\n    border: 0;\n    background: transparent;\n    outline: 0;\n}\n.time-area:after {\n    content: \"s\";\n}\n.property .arrow {\n    position: relative;\n    display: inline-block;\n    width: 20px;\n    height: 25px;\n    cursor: pointer;\n    vertical-align: middle;\n}\n.property .arrow:after {\n    content: \"\";\n    position: absolute;\n    top: 0;\n    right: 0;\n    left: 0;\n    bottom: 0;\n    margin: auto;\n    width: 0;\n    height: 0;\n    border-top: 6px solid #eee;\n    border-left: 4px solid transparent;\n    border-right: 4px solid transparent;\n}\n.property[data-fold=\"1\"] .arrow:after {\n    border-top: 4px solid transparent;\n    border-bottom: 4px solid transparent;\n    border-right: 0;\n    border-left: 6px solid #eee;\n}\n.property[data-object=\"0\"] .arrow {\n    display: none;\n}\n.property.fold, .keyframes.fold, .value.fold {\n    display: none;\n}\n.property.select, .value.select, .keyframes.select {\n    background: rgba(120, 120, 120, 0.7);\n}\n.keyframes {\n\n}\n.keyframe-delay {\n  position: absolute;\n  top: 3px;\n  bottom: 3px;\n  left: 0;\n  background: #4af;\n  opacity: 0.2;\n  z-index: 0;\n}\n.keyframe-group {\n    position: absolute;\n    top: 3px;\n    bottom: 3px;\n    left: 0;\n    background: #4af;\n    opacity: 0.6;\n    border: 1px solid rgba(0, 0, 0, 0.2);\n    border-left-color: rgba(255, 255, 255, 0.2);\n    border-top-color: rgba(255, 255, 255, 0.2);\n    z-index: 0;\n}\n.keyframe-line {\n  position: absolute;\n  height: 8px;\n  top: 0;\n  bottom: 0;\n  margin: auto;\n  background: #666;\n  z-index: 0;\n}\n.keyframe {\n  position: absolute;\n  font-size: 0px;\n  width: 12px;\n  height: 12px;\n  top: 0px;\n  bottom: 0px;\n  margin: auto;\n  background: #fff;\n  border: 2px solid #383838;\n  border-radius: 2px;\n  box-sizing: border-box;\n  transform: translate(-50%) rotate(45deg);\n  z-index: 1;\n  cursor: pointer;\n}\n.keyframe[data-no=\"1\"] {\n    opacity: 0.2;\n}\n.select .keyframe {\n    border-color: #555;\n}\n.keyframe.select {\n    background: #4af;\n}\n.keyframes-container, .line-area {\n  position: relative;\n  width: calc(100% - 30px);\n  left: 15px;\n  height: 100%;\n}\n.line-area {\n  position: absolute;\n  top: 0;\n  z-index: 0;\n}\n.keyframe-cursor {\n  position: absolute;\n  top: 0;\n  z-index: 1;\n  background: #4af;\n  width: 1px;\n  height: 100%;\n  left: 15px;\n  transform: translate(-50%);\n}\n.scroll-area .keyframe-cursor {\n  pointer-events: none;\n}\n.division-line {\n  position: absolute;\n  background: #333;\n  width: 1px;\n  height: 100%;\n  transform: translate(-50%);\n}\n");
    var DIRECTION$1 = "direction";
    var ITERATION_COUNT$1 = "iterationCount";
    var DELAY$1 = "delay";
    var PLAY_SPEED$1 = "playSpeed";
    var ALTERNATE = "alternate";
    var REVERSE = "reverse";
    var ALTERNATE_REVERSE = "alternate-reverse";
    var INFINITE = "infinite";

    function numberFormat(num, count, isRight) {
      var length = ("" + num).length;
      var arr = [];

      if (isRight) {
        arr.push(num);
      }

      for (var i = length; i < count; ++i) {
        arr.push(0);
      }

      if (!isRight) {
        arr.push(num);
      }

      return arr.join("");
    }
    function keys(value) {
      var arr = [];

      for (var name in value) {
        arr.push(name);
      }

      return arr;
    }
    function toValue(value) {
      if (isObject(value)) {
        if (Array.isArray(value)) {
          return "[" + value.join(", ") + "]";
        }

        return "{" + keys(value).map(function (k) {
          return k + ": " + toValue(value[k]);
        }).join(", ") + "}";
      }

      return value;
    }
    function flatObject(obj, newObj) {
      if (newObj === void 0) {
        newObj = {};
      }

      for (var name in obj) {
        var value = obj[name];

        if (isObject(value)) {
          var nextObj = flatObject(isFrame(value) ? value.get() : value);

          for (var nextName in nextObj) {
            newObj[name + "///" + nextName] = nextObj[nextName];
          }
        } else {
          newObj[name] = value;
        }
      }

      return newObj;
    }
    function getTarget(target, conditionCallback) {
      var parentTarget = target;

      while (parentTarget && parentTarget !== document.body) {
        if (conditionCallback(parentTarget)) {
          return parentTarget;
        }

        parentTarget = parentTarget.parentNode;
      }

      return null;
    }
    function hasClass$1(target, className) {
      return hasClass(target, "" + PREFIX + className);
    }
    function isScene(value) {
      return value && !!value.constructor.prototype.getItem;
    }
    function isFrame(value) {
      return value && !!value.constructor.prototype.toCSS;
    }
    function findElementIndexByPosition(elements, pos) {
      return findIndex(elements, function (el) {
        var box = el.getBoundingClientRect();
        var top = box.top;
        var bottom = top + box.height;
        return top <= pos && pos < bottom;
      });
    }
    function prefix() {
      var classNames = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        classNames[_i] = arguments[_i];
      }

      return prefixNames.apply(void 0, [PREFIX].concat(classNames));
    }
    function checkFolded(foldedInfo, names) {
      var index = findIndex(names, function (name, i) {
        return foldedInfo[names.slice(0, i + 1).join("///") + "///"];
      });

      if (index > -1) {
        if (index === names.length - 1) {
          return 2;
        }

        return 1;
      } else {
        return 0;
      }
    }
    function fold(target, foldedProperty, isNotUpdate) {
      var id = foldedProperty + "///";
      var foldedInfo = target.state.foldedInfo;
      foldedInfo[id] = !foldedInfo[id];

      if (!isNotUpdate) {
        target.setState({
          foldedInfo: __assign$2$1({}, foldedInfo)
        });
      }
    }

    var ElementComponent =
    /*#__PURE__*/
    function (_super) {
      __extends$4(ElementComponent, _super);

      function ElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = ElementComponent.prototype;

      __proto.getElement = function () {
        return this.element || (this.element = findDOMNode(this));
      };

      return ElementComponent;
    }(PureComponent);

    var TimeArea =
    /*#__PURE__*/
    function (_super) {
      __extends$4(TimeArea, _super);

      function TimeArea() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = TimeArea.prototype;

      __proto.render = function () {
        return createElement("input", {
          className: prefix("time-area")
        });
      };

      __proto.componentDidMount = function () {
        var _this = this;

        new KeyController(this.getElement()).keydown(function (e) {
          !e.isToggle && e.inputEvent.stopPropagation();
        }).keyup(function (e) {
          !e.isToggle && e.inputEvent.stopPropagation();
        }).keyup("enter", function () {
          // go to time
          var value = _this.getElement().value;

          var result = /(\d+):(\d+):(\d+)/g.exec(value);

          if (!result) {
            return;
          }

          var minute = parseFloat(result[1]);
          var second = parseFloat(result[2]);
          var milisecond = parseFloat("0." + result[3]);
          var time = minute * 60 + second + milisecond;

          _this.props.timeline.setTime(time);
        });
      };

      return TimeArea;
    }(ElementComponent);

    var ControlArea =
    /*#__PURE__*/
    function (_super) {
      __extends$4(ControlArea, _super);

      function ControlArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.state = {
          isPlay: false
        };

        _this.play = function () {
          _this.setState({
            isPlay: true
          });
        };

        _this.pause = function () {
          _this.setState({
            isPlay: false
          });
        };

        _this.togglePlay = function () {
          _this.props.timeline.togglePlay();
        };

        _this.prev = function () {
          _this.props.timeline.prev();
        };

        _this.next = function () {
          _this.props.timeline.next();
        };

        _this.unselect = function () {
          _this.props.timeline.select("", -1);
        };

        return _this;
      }

      var __proto = ControlArea.prototype;

      __proto.render = function () {
        var timeline = this.props.timeline;
        return createElement("div", {
          className: prefix("control-area header-area")
        }, createElement("div", {
          className: prefix("properties-area"),
          onClick: this.unselect
        }, createElement("div", {
          className: prefix("property")
        })), createElement("div", {
          className: prefix("values-area")
        }, createElement("div", {
          className: prefix("value")
        })), createElement("div", {
          className: prefix("keyframes-area")
        }, createElement("div", {
          className: prefix("keyframes")
        }, createElement(TimeArea, {
          ref: ref(this, "timeArea"),
          timeline: timeline
        }), createElement("div", {
          className: prefix("play-control-area")
        }, createElement("div", {
          className: prefix("control prev"),
          onClick: this.prev
        }), createElement("div", {
          className: prefix("control " + (this.state.isPlay ? "pause" : "play")),
          onClick: this.togglePlay
        }), createElement("div", {
          className: prefix("control next"),
          onClick: this.next
        })))));
      };

      __proto.componentDidMount = function () {
        this.initScene(this.props.scene);
      };

      __proto.componentDidUpdate = function (prevProps) {
        if (prevProps.scene !== this.props.scene) {
          this.initScene(this.props.scene);
          this.releaseScene(prevProps.scene);
        }
      };

      __proto.componentWillUnmount = function () {
        this.releaseScene(this.props.scene);
      };

      __proto.initScene = function (scene) {
        if (!scene) {
          return;
        }

        scene.on({
          play: this.play,
          paused: this.pause
        });
      };

      __proto.releaseScene = function (scene) {
        if (!scene) {
          return;
        }

        scene.off("play", this.play);
        scene.off("paused", this.pause);
      };

      return ControlArea;
    }(ElementComponent);

    var KeyframeCursor =
    /*#__PURE__*/
    function (_super) {
      __extends$4(KeyframeCursor, _super);

      function KeyframeCursor() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = KeyframeCursor.prototype;

      __proto.render = function () {
        return createElement("div", {
          className: prefix("keyframe-cursor")
        });
      };

      return KeyframeCursor;
    }(ElementComponent);

    var KeytimesArea =
    /*#__PURE__*/
    function (_super) {
      __extends$4(KeytimesArea, _super);

      function KeytimesArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.onWheel = function (e) {
          var timeline = _this.props.timeline;
          var delta = e.deltaY;
          timeline.setZoom(timeline.getZoom() + delta / 5000);
          !e.deltaX && e.preventDefault();
        };

        return _this;
      }

      var __proto = KeytimesArea.prototype;

      __proto.renderKeytimes = function () {
        var maxTime = this.props.maxTime;
        var keytimes = [];

        for (var time = 0; time <= maxTime; ++time) {
          keytimes.push(createElement("div", {
            key: time,
            "data-time": time,
            className: prefix("keytime"),
            style: {
              width: 100 / maxTime + "%"
            }
          }, createElement("span", null, time), createElement("div", {
            className: prefix("graduation start")
          }), createElement("div", {
            className: prefix("graduation quarter")
          }), createElement("div", {
            className: prefix("graduation half")
          }), createElement("div", {
            className: prefix("graduation quarter3")
          })));
        }

        return keytimes;
      };

      __proto.render = function () {
        var _a = this.props,
            maxTime = _a.maxTime,
            maxDuration = _a.maxDuration,
            zoom = _a.zoom;
        return createElement("div", {
          className: prefix("keytimes-area keyframes-area")
        }, createElement("div", {
          className: prefix("keyframes-scroll-area"),
          ref: ref(this, "scrollAreaElement"),
          style: {
            minWidth: 50 * maxTime + "px",
            width: Math.min(maxDuration ? maxTime / maxDuration : 1, 2) * zoom * 100 + "%"
          }
        }, createElement("div", {
          className: prefix("keytimes keyframes")
        }, createElement("div", {
          className: prefix("keyframes-container")
        }, this.renderKeytimes()), createElement(KeyframeCursor, {
          ref: ref(this, "cursor")
        }))));
      };

      __proto.componentDidMount = function () {
        var _this = this;

        addEvent(this.getElement(), "wheel", this.onWheel);
        this.dragger = new Dragger(this.cursor.getElement(), {
          dragstart: function (_a) {
            var inputEvent = _a.inputEvent;
            inputEvent.stopPropagation();
          },
          drag: function (_a) {
            var clientX = _a.clientX;

            _this.props.timeline.move(clientX);
          },
          container: window
        });
      };

      __proto.componentWillUnmount = function () {
        removeEvent(this.getElement(), "wheel", this.onWheel);
        this.dragger.unset();
      };

      return KeytimesArea;
    }(ElementComponent);

    var HeaderArea =
    /*#__PURE__*/
    function (_super) {
      __extends$4(HeaderArea, _super);

      function HeaderArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.openDialog = function () {
          _this.props.timeline.openDialog();
        };

        return _this;
      }

      var __proto = HeaderArea.prototype;

      __proto.render = function () {
        var _a = this.props,
            timelineInfo = _a.timelineInfo,
            maxTime = _a.maxTime,
            maxDuration = _a.maxDuration,
            zoom = _a.zoom,
            timeline = _a.timeline;
        return createElement("div", {
          className: prefix("header-area")
        }, createElement("div", {
          className: prefix("properties-area")
        }, createElement("div", {
          className: prefix("property")
        }, "Name")), createElement("div", {
          className: prefix("values-area")
        }, createElement("div", {
          className: prefix("value")
        }, createElement("div", {
          className: prefix("add"),
          onClick: this.openDialog
        }, "+"))), createElement(KeytimesArea, {
          ref: ref(this, "keytimesArea"),
          timeline: timeline,
          timelineInfo: timelineInfo,
          maxDuration: maxDuration,
          maxTime: maxTime,
          zoom: zoom
        }));
      };

      return HeaderArea;
    }(ElementComponent);

    var Keyframe =
    /*#__PURE__*/
    function (_super) {
      __extends$4(Keyframe, _super);

      function Keyframe() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = Keyframe.prototype;

      __proto.render = function () {
        var _a = this.props,
            time = _a.time,
            value = _a.value,
            maxTime = _a.maxTime,
            selected = _a.selected;
        return createElement("div", {
          className: prefix("keyframe" + (selected ? " select" : "")),
          "data-time": time,
          style: {
            left: time / maxTime * 100 + "%"
          }
        }, time, " ", value);
      };

      return Keyframe;
    }(ElementComponent);

    var KeyframeGroup =
    /*#__PURE__*/
    function (_super) {
      __extends$4(KeyframeGroup, _super);

      function KeyframeGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = KeyframeGroup.prototype;

      __proto.render = function () {
        var _a = this.props,
            time = _a.time,
            nextTime = _a.nextTime,
            maxTime = _a.maxTime,
            selected = _a.selected;
        return createElement("div", {
          className: prefix("keyframe-group" + (selected ? " select" : "")),
          "data-time": time,
          style: {
            left: time / maxTime * 100 + "%",
            width: (nextTime - time) / maxTime * 100 + "%"
          }
        });
      };

      return KeyframeGroup;
    }(PureComponent);

    var KeyframeDelay =
    /*#__PURE__*/
    function (_super) {
      __extends$4(KeyframeDelay, _super);

      function KeyframeDelay() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = KeyframeDelay.prototype;

      __proto.render = function () {
        var _a = this.props,
            time = _a.time,
            nextTime = _a.nextTime,
            maxTime = _a.maxTime;
        return createElement("div", {
          className: prefix("keyframe-delay"),
          style: {
            left: time / maxTime * 100 + "%",
            width: (nextTime - time) / maxTime * 100 + "%"
          }
        });
      };

      return KeyframeDelay;
    }(PureComponent);

    var KeyframeLine =
    /*#__PURE__*/
    function (_super) {
      __extends$4(KeyframeLine, _super);

      function KeyframeLine() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = KeyframeLine.prototype;

      __proto.render = function () {
        var _a = this.props,
            time = _a.time,
            nextTime = _a.nextTime,
            maxTime = _a.maxTime;
        return createElement("div", {
          className: prefix("keyframe-line"),
          style: {
            left: time / maxTime * 100 + "%",
            width: (nextTime - time) / maxTime * 100 + "%"
          }
        });
      };

      return KeyframeLine;
    }(PureComponent);

    var Keyframes =
    /*#__PURE__*/
    function (_super) {
      __extends$4(Keyframes, _super);

      function Keyframes() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = Keyframes.prototype;

      __proto.render = function () {
        var _a = this.props,
            id = _a.id,
            propertiesInfo = _a.propertiesInfo,
            selected = _a.selected,
            folded = _a.folded;
        return createElement("div", {
          className: prefix("keyframes" + (folded === 1 ? " fold" : "") + (selected ? " select" : "")),
          "data-item": propertiesInfo.isItem ? "1" : "0",
          "data-id": id
        }, createElement("div", {
          className: prefix("keyframes-container")
        }, this.renderList()));
      };

      __proto.renderList = function () {
        var _a = this.props,
            propertiesInfo = _a.propertiesInfo,
            maxTime = _a.maxTime,
            selected = _a.selected,
            selectedTime = _a.selectedTime;
        var item = propertiesInfo.item,
            frames = propertiesInfo.frames,
            properties = propertiesInfo.properties;
        var isItScene = isScene(item);
        var duration = item.getDuration();
        var keyframes = [];
        var keyframeGroups = [];
        var keyframeDelays = [];
        var keyframeLines = [];
        var length = frames.length;
        var hasProperties = properties.length;
        var startIndex = 0;

        if (length >= 2 && !hasProperties) {
          var delayedIndex = 0;

          for (var i = 1; i < length; ++i) {
            var iterationTime = frames[i][1];

            if (frames[i - 1][1] === iterationTime && (iterationTime === 0 || iterationTime === duration)) {
              delayedIndex = i;
            } else {
              break;
            }
          }

          var index = findIndex(frames, function (_a) {
            var value = _a[2];
            return !isUndefined(value);
          });
          startIndex = Math.min(length - 2, Math.max(delayedIndex, index));
          var startFrame = frames[startIndex];
          var endFrame = frames[length - 1];
          var time = startFrame[0];
          var nextTime = endFrame[0];
          keyframeGroups.push(createElement(KeyframeGroup, {
            key: "group",
            selected: selected && time <= selectedTime && selectedTime <= nextTime,
            time: time,
            nextTime: nextTime,
            maxTime: maxTime
          }));
        }

        frames.forEach(function (_a, i) {
          var time = _a[0],
              iterationTime = _a[1],
              value = _a[2];
          var valueText = toValue(value);

          if (frames[i + 1]) {
            var _b = frames[i + 1],
                nextTime = _b[0],
                nextIterationTime = _b[1];

            if (iterationTime === 0 && nextIterationTime === 0 || iterationTime === duration && nextIterationTime === duration) {
              keyframeDelays.push(createElement(KeyframeDelay, {
                key: "delay" + time + "," + nextTime,
                id: "-1",
                time: time,
                nextTime: nextTime,
                maxTime: maxTime
              }));
            }
          }

          if (i === 0 && time === 0 && iterationTime === 0 && isUndefined(value) && !hasProperties) {
            return;
          }

          if (frames[i + 1]) {
            var _c = frames[i + 1],
                nextTime = _c[0],
                nextValue = _c[2];
            var nextValueText = toValue(nextValue);

            if (!isItScene && !isUndefined(value) && !isUndefined(nextValue) && valueText !== nextValueText && hasProperties) {
              keyframeLines.push(createElement(KeyframeLine, {
                key: "line" + keyframeLines.length,
                time: time,
                id: time + "," + nextTime,
                nextTime: nextTime,
                maxTime: maxTime
              }));
            }
          }

          if (isItScene || i < startIndex) {
            return;
          }

          keyframes.push(createElement(Keyframe, {
            key: "keyframe" + i,
            selected: selected && time === selectedTime,
            time: time,
            value: valueText,
            maxTime: maxTime
          }));
        });
        return keyframeGroups.concat(keyframes, keyframeDelays, keyframeLines);
      };

      return Keyframes;
    }(ElementComponent);

    var KeyframeLine$1 =
    /*#__PURE__*/
    function (_super) {
      __extends$4(KeyframeLine, _super);

      function KeyframeLine() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = KeyframeLine.prototype;

      __proto.render = function () {
        var maxTime = this.props.maxTime;
        var lines = [];

        for (var time = 0; time <= maxTime; ++time) {
          lines.push(createElement("div", {
            key: time,
            className: prefix("division-line"),
            style: {
              left: 100 / maxTime * time + "%"
            }
          }));
        }

        return createElement("div", {
          className: prefix("line-area")
        }, lines);
      };

      return KeyframeLine;
    }(PureComponent);

    var KeyframesArea =
    /*#__PURE__*/
    function (_super) {
      __extends$4(KeyframesArea, _super);

      function KeyframesArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.keyframesList = [];
        _this.state = {
          foldedInfo: {}
        };

        _this.onWheel = function (e) {
          if (!KeyController.global.altKey) {
            return;
          }

          e.preventDefault();
          var delta = e.deltaY;
          var timeline = _this.props.timeline;
          timeline.setZoom(timeline.getZoom() + delta / 5000);
        };

        return _this;
      }

      var __proto = KeyframesArea.prototype;

      __proto.render = function () {
        var _a = this.props,
            timelineInfo = _a.timelineInfo,
            maxTime = _a.maxTime,
            maxDuration = _a.maxDuration,
            zoom = _a.zoom,
            selectedProperty = _a.selectedProperty,
            selectedTime = _a.selectedTime;
        var foldedInfo = this.state.foldedInfo;
        var width = Math.min(maxDuration ? maxTime / maxDuration : 1, 2);
        var keyframesList = [];
        this.keyframesList = [];

        for (var key in timelineInfo) {
          var propertiesInfo = timelineInfo[key];
          var selected = key === selectedProperty;
          var folded = checkFolded(foldedInfo, propertiesInfo.keys);
          keyframesList.push(createElement(Keyframes, {
            ref: refs(this, "keyframesList", keyframesList.length),
            selected: selected,
            folded: folded,
            selectedTime: selectedTime,
            key: key,
            id: key,
            propertiesInfo: propertiesInfo,
            maxTime: maxTime
          }));
        }

        return createElement("div", {
          className: prefix("keyframes-area"),
          onWheel: this.onWheel
        }, createElement("div", {
          className: prefix("keyframes-scroll-area"),
          ref: ref(this, "scrollAreaElement"),
          style: {
            minWidth: 50 * maxTime + "px",
            width: width * zoom * 100 + "%"
          }
        }, keyframesList.concat([createElement(KeyframeCursor, {
          key: "cursor",
          ref: ref(this, "cursor")
        }), createElement(KeyframeLine$1, {
          maxTime: maxTime,
          key: "lines"
        })])));
      };

      return KeyframesArea;
    }(ElementComponent);

    var Property =
    /*#__PURE__*/
    function (_super) {
      __extends$4(Property, _super);

      function Property() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.onClick = function (e) {
          var target = e.target;

          if (hasClass$1(target, "arrow")) {
            _this.onClickArrow();
          } else if (hasClass$1(target, "remove")) {
            _this.onClickRemove();
          } else {
            var _a = _this.props,
                timeline = _a.timeline,
                id = _a.id;
            timeline.select(id);
          }
        };

        _this.onClickArrow = function () {
          var _a = _this.props,
              id = _a.id,
              timeline = _a.timeline,
              scrollArea = _a.scrollArea,
              index = _a.index;
          timeline.select(id);
          scrollArea.fold(index);
        };

        _this.onClickRemove = function () {
          var _a = _this.props,
              propertiesInfo = _a.propertiesInfo,
              timeline = _a.timeline;
          var isItem = propertiesInfo.isItem,
              parentItem = propertiesInfo.parentItem,
              targetItem = propertiesInfo.item,
              properties = propertiesInfo.properties;

          if (isItem) {
            var targetName_1 = null;
            parentItem.forEach(function (item, name) {
              if (item === targetItem) {
                targetName_1 = name;
                return;
              }
            });

            if (targetName_1 != null) {
              parentItem.removeItem(targetName_1);
            }
          } else {
            var times = targetItem.times;
            times.forEach(function (time) {
              var _a;

              (_a = targetItem).remove.apply(_a, [time].concat(properties));
            });
          }

          timeline.select("", -1, true);
          timeline.update();
        };

        return _this;
      }

      var __proto = Property.prototype;

      __proto.render = function () {
        var _a = this.props,
            id = _a.id,
            selected = _a.selected,
            folded = _a.folded,
            _b = _a.propertiesInfo,
            propertyNames = _b.keys,
            isItem = _b.isItem,
            isParent = _b.isParent;
        var length = propertyNames.length;
        var name = propertyNames[length - 1];
        return createElement("div", {
          className: prefix("property" + (folded === 1 ? " fold" : "") + (selected ? " select" : "")),
          onClick: this.onClick,
          "data-id": id,
          "data-name": name,
          "data-object": isParent ? 1 : 0,
          "data-item": isItem ? 1 : 0,
          "data-fold": folded === 2 ? 1 : 0,
          style: {
            paddingLeft: 10 + (length - 1) * 20 + "px"
          }
        }, createElement("div", {
          className: prefix("arrow")
        }), createElement("span", null, name), createElement("div", {
          className: prefix("remove")
        }));
      };

      return Property;
    }(ElementComponent);

    var PropertiesArea =
    /*#__PURE__*/
    function (_super) {
      __extends$4(PropertiesArea, _super);

      function PropertiesArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.properties = [];
        _this.state = {
          foldedInfo: {}
        };
        return _this;
      }

      var __proto = PropertiesArea.prototype;

      __proto.render = function () {
        var _a = this.props,
            timelineInfo = _a.timelineInfo,
            selectedProperty = _a.selectedProperty,
            timeline = _a.timeline,
            scrollArea = _a.scrollArea;
        var foldedInfo = this.state.foldedInfo;
        var properties = [];
        this.properties = [];
        var index = -1;

        for (var id in timelineInfo) {
          var propertiesInfo = timelineInfo[id];
          var selected = selectedProperty === id;
          var folded = checkFolded(foldedInfo, propertiesInfo.keys);
          ++index;
          properties.push(createElement(Property, {
            ref: refs(this, "properties", index),
            timeline: timeline,
            scrollArea: scrollArea,
            selected: selected,
            folded: folded,
            key: id,
            id: id,
            index: index,
            propertiesInfo: propertiesInfo
          }));
        }

        return createElement("div", {
          className: prefix("properties-area")
        }, createElement("div", {
          className: prefix("properties-scroll-area")
        }, properties));
      };

      return PropertiesArea;
    }(ElementComponent);

    var Value =
    /*#__PURE__*/
    function (_super) {
      __extends$4(Value, _super);

      function Value() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.add = function () {
          var _a = _this.props,
              _b = _a.propertiesInfo,
              item = _b.item,
              properties = _b.properties,
              timeline = _a.timeline;
          timeline.openDialog(item, properties);
        };

        return _this;
      }

      var __proto = Value.prototype;

      __proto.render = function () {
        var _a = this.props,
            id = _a.id,
            selected = _a.selected,
            folded = _a.folded,
            _b = _a.propertiesInfo,
            isItem = _b.isItem,
            isParent = _b.isParent;
        return createElement("div", {
          className: prefix("value" + (folded === 1 ? " fold" : "") + (selected ? " select" : "")),
          "data-id": id,
          "data-object": isParent ? 1 : 0,
          "data-item": isItem ? 1 : 0
        }, this.renderValue());
      };

      __proto.renderValue = function () {
        var isParent = this.props.propertiesInfo.isParent;

        if (isParent) {
          return createElement("div", {
            className: prefix("add"),
            onClick: this.add
          }, "+");
        } else {
          return createElement("input", {
            ref: ref(this, "inputElement")
          });
        }
      };

      return Value;
    }(ElementComponent);

    var ValuesArea =
    /*#__PURE__*/
    function (_super) {
      __extends$4(ValuesArea, _super);

      function ValuesArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.values = [];
        _this.state = {
          foldedInfo: {}
        };
        return _this;
      }

      var __proto = ValuesArea.prototype;

      __proto.render = function () {
        var _a = this.props,
            timelineInfo = _a.timelineInfo,
            selectedProperty = _a.selectedProperty,
            timeline = _a.timeline;
        var foldedInfo = this.state.foldedInfo;
        var values = [];
        this.values = [];

        for (var id in timelineInfo) {
          var propertiesInfo = timelineInfo[id];
          var selected = selectedProperty === id;
          var folded = checkFolded(foldedInfo, propertiesInfo.keys);
          values.push(createElement(Value, {
            ref: refs(this, "values", values.length),
            timeline: timeline,
            key: id,
            folded: folded,
            selected: selected,
            id: id,
            propertiesInfo: propertiesInfo
          }));
        }

        return createElement("div", {
          className: prefix("values-area")
        }, values);
      };

      __proto.componentDidMount = function () {
        var _this = this;

        var element = this.getElement();
        var dragTarget;
        var dragTargetValue;
        element.addEventListener("focusout", function (e) {
          _this.props.timeline.setTime();
        });
        this.dragger = new Dragger(element, {
          container: window,
          dragstart: function (e) {
            dragTarget = e.inputEvent.target;
            dragTargetValue = dragTarget.value;

            if (!KeyController.global.altKey || !getTarget(dragTarget, function (el) {
              return el.nodeName === "INPUT";
            })) {
              return false;
            }
          },
          drag: function (e) {
            var nextValue = dragTargetValue.replace(/-?\d+/g, function (num) {
              return "" + (parseFloat(num) + Math.round(e.distX / 2));
            });
            dragTarget.value = nextValue;
          },
          dragend: function (e) {
            _this.edit(dragTarget, dragTarget.value);
          }
        });
        this.keycon = new KeyController(element).keydown(function (e) {
          !e.isToggle && e.inputEvent.stopPropagation();
        }).keyup(function (e) {
          !e.isToggle && e.inputEvent.stopPropagation();
        }).keyup("enter", function (e) {
          var target = e.inputEvent.target;

          _this.edit(target, target.value);
        }).keyup("esc", function (e) {
          var target = e.inputEvent.target;
          target.blur();
        });
      };

      __proto.componentWillUnmount = function () {
        this.dragger.unset();
        this.keycon.off();
      };

      __proto.edit = function (target, value) {
        var parentEl = getTarget(target, function (el) {
          return hasClass$1(el, "value");
        });

        if (!parentEl) {
          return;
        }

        var index = findIndex(this.values, function (v) {
          return v.getElement() === parentEl;
        });

        if (index === -1) {
          return;
        }

        this.props.timeline.editKeyframe(index, value);
      };

      return ValuesArea;
    }(ElementComponent);

    var ScrollArea =
    /*#__PURE__*/
    function (_super) {
      __extends$4(ScrollArea, _super);

      function ScrollArea() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = ScrollArea.prototype;

      __proto.render = function () {
        var _a = this.props,
            zoom = _a.zoom,
            maxDuration = _a.maxDuration,
            maxTime = _a.maxTime,
            timelineInfo = _a.timelineInfo,
            selectedProperty = _a.selectedProperty,
            selectedTime = _a.selectedTime,
            timeline = _a.timeline;
        return createElement("div", {
          className: prefix("scroll-area")
        }, createElement(PropertiesArea, {
          ref: ref(this, "propertiesArea"),
          timeline: timeline,
          scrollArea: this,
          timelineInfo: timelineInfo,
          selectedProperty: selectedProperty
        }), createElement(ValuesArea, {
          ref: ref(this, "valuesArea"),
          timeline: timeline,
          timelineInfo: timelineInfo,
          selectedProperty: selectedProperty
        }), createElement(KeyframesArea, {
          ref: ref(this, "keyframesArea"),
          timeline: timeline,
          zoom: zoom,
          maxDuration: maxDuration,
          timelineInfo: timelineInfo,
          maxTime: maxTime,
          selectedProperty: selectedProperty,
          selectedTime: selectedTime
        }));
      };

      __proto.componentDidMount = function () {
        this.foldAll();
      };

      __proto.foldAll = function () {
        var _this = this; // fold all


        this.propertiesArea.properties.forEach(function (property, i) {
          var isParent = property.props.propertiesInfo.isParent;

          if (isParent) {
            _this.fold(i);
          }
        });
      };

      __proto.fold = function (index, isNotUpdate) {
        var selectedProperty = this.propertiesArea.properties[index];
        var foldedId = selectedProperty.props.id;
        fold(this.propertiesArea, foldedId, isNotUpdate);
        fold(this.valuesArea, foldedId, isNotUpdate);
        fold(this.keyframesArea, foldedId, isNotUpdate);
      };

      return ScrollArea;
    }(ElementComponent);

    var prevTime = 0;
    var prevX = -1;
    var prevY = -1;
    function dblCheck(isDrag, e, clientX, clientY, callback) {
      var currentTime = now();

      if (!isDrag) {
        if (prevX === clientX && prevY === clientY && currentTime - prevTime <= 500) {
          callback(e, clientX, clientY);
        }

        prevX = clientX;
        prevY = clientY;
        prevTime = currentTime;
      }
    }

    var MAXIMUM = 1000000;
    function toFixed(num) {
      return Math.round(num * MAXIMUM) / MAXIMUM;
    }
    function addEntry(entries, time, keytime) {
      var prevEntry = entries[entries.length - 1];
      (!prevEntry || prevEntry[0] !== time || prevEntry[1] !== keytime) && entries.push([toFixed(time), toFixed(keytime)]);
    }
    function getEntries(times, states) {
      if (!times.length) {
        return [];
      }

      var entries = times.map(function (time) {
        return [time, time];
      });
      var nextEntries = [];
      var firstEntry = entries[0];

      if (firstEntry[0] !== 0 && states[states.length - 1][DELAY$1]) {
        entries.unshift([0, 0]);
      }

      states.forEach(function (state) {
        var iterationCount = state[ITERATION_COUNT$1];
        var delay = state[DELAY$1];
        var playSpeed = state[PLAY_SPEED$1];
        var direction = state[DIRECTION$1];
        var intCount = Math.ceil(iterationCount);
        var currentDuration = entries[entries.length - 1][0];
        var length = entries.length;
        var lastTime = currentDuration * iterationCount;

        for (var i = 0; i < intCount; ++i) {
          var isReverse = direction === REVERSE || direction === ALTERNATE && i % 2 || direction === ALTERNATE_REVERSE && !(i % 2);

          for (var j = 0; j < length; ++j) {
            var entry = entries[isReverse ? length - j - 1 : j];
            var time = entry[1];
            var currentTime = currentDuration * i + (isReverse ? currentDuration - entry[0] : entry[0]);
            var prevEntry = entries[isReverse ? length - j : j - 1];

            if (currentTime > lastTime) {
              if (j !== 0) {
                var prevTime = currentDuration * i + (isReverse ? currentDuration - prevEntry[0] : prevEntry[0]);
                var divideTime = dot(prevEntry[1], time, lastTime - prevTime, currentTime - lastTime);
                addEntry(nextEntries, (delay + currentDuration * iterationCount) / playSpeed, divideTime);
              }

              break;
            } else if (currentTime === lastTime && nextEntries.length && nextEntries[nextEntries.length - 1][0] === lastTime + delay) {
              break;
            }

            addEntry(nextEntries, (delay + currentTime) / playSpeed, time);
          }
        } // delay time


        delay && nextEntries.unshift([0, nextEntries[0][1]]);
        entries = nextEntries;
        nextEntries = [];
      });
      return entries;
    }
    function getFiniteEntries(times, states) {
      var infiniteIndex = findIndex(states, function (state) {
        return state[ITERATION_COUNT$1] === INFINITE;
      }, states.length - 1) + 1;
      return getEntries(times, states.slice(0, infiniteIndex));
    }
    function getItemInfo(timelineInfo, items, names, item) {
      item.update();
      var times = item.times.slice();
      var originalDuration = item.getDuration();
      !item.getFrame(0) && times.unshift(0);
      !item.getFrame(originalDuration) && times.push(originalDuration);
      var states = items.slice(1).map(function (animator) {
        return animator.state;
      }).reverse();
      var entries = getFiniteEntries(times, states);
      var parentItem = items[items.length - 2];

      (function getPropertyInfo(itemNames) {
        var properties = [];

        for (var _i = 1; _i < arguments.length; _i++) {
          properties[_i - 1] = arguments[_i];
        }

        var frames = [];
        var isParent = isObject(itemNames);
        var isItem = properties.length === 0;
        entries.forEach(function (_a) {
          var time = _a[0],
              iterationTime = _a[1];
          var value = item.get.apply(item, [iterationTime].concat(properties));

          if (isUndefined(value) && properties.length) {
            return;
          }

          frames.push([time, iterationTime, value]);
        });
        var keys = names.concat(properties);
        var key = keys.join("///");

        if (key) {
          timelineInfo[key] = {
            key: key,
            keys: keys,
            parentItem: parentItem,
            isParent: isParent,
            isItem: isItem,
            item: item,
            names: names,
            properties: properties,
            frames: frames
          };
        }

        if (isParent) {
          for (var property in itemNames) {
            getPropertyInfo.apply(void 0, [itemNames[property]].concat(properties, [property]));
          }
        }
      })(item.names);
    }
    function getTimelineInfo(scene) {
      var timelineInfo = {};

      (function sceneForEach() {
        var items = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          items[_i] = arguments[_i];
        }

        var length = items.length;
        var lastItem = items[length - 1];
        var names = items.slice(1).map(function (item) {
          return item.getId();
        });

        if (isScene(lastItem)) {
          if (names.length) {
            var key = names.join("///");
            var times = [0, lastItem.getDuration()];
            var entries = getFiniteEntries(times, items.slice(1).map(function (animator) {
              return animator.state;
            }).reverse());
            var frames_1 = [];
            entries.forEach(function (_a) {
              var time = _a[0],
                  iterationTime = _a[1];
              frames_1.push([time, iterationTime, iterationTime]);
            });
            timelineInfo[key] = {
              key: key,
              keys: names,
              isItem: true,
              isParent: true,
              parentItem: items[length - 2],
              item: lastItem,
              names: [],
              properties: [],
              frames: frames_1
            };
          }

          lastItem.forEach(function (item) {
            sceneForEach.apply(void 0, items.concat([item]));
          });
        } else {
          getItemInfo(timelineInfo, items, names, lastItem);
        }
      })(scene);

      return timelineInfo;
    }

    var TimelineElement = styled("div", CSS);

    var Timeline =
    /*#__PURE__*/
    function (_super) {
      __extends$4(Timeline, _super);

      function Timeline(props) {
        var _this = _super.call(this, props) || this;

        _this.values = {};
        _this.state = {
          alt: false,
          zoom: 1,
          maxDuration: 0,
          maxTime: 0,
          timelineInfo: {},
          selectedProperty: "",
          selectedTime: -1,
          selectedItem: null,
          init: false,
          updateTime: false
        };
        _this.keyMap = {
          keydown: {
            alt: function () {
              _this.setState({
                alt: true
              });
            },
            space: function (_a) {
              var inputEvent = _a.inputEvent;
              inputEvent.preventDefault();
            },
            left: function () {
              _this.prev();
            },
            right: function () {
              _this.context();
            }
          },
          keyup: {
            alt: function () {
              _this.setState({
                alt: false
              });
            },
            esc: function () {
              _this.finish();
            },
            backspace: function () {
              _this.removeKeyframe(_this.state.selectedProperty);
            },
            space: function () {
              _this.togglePlay();
            }
          }
        };

        _this.update = function (isInit) {
          if (isInit === void 0) {
            isInit = false;
          }

          var scene = _this.props.scene;

          if (!scene) {
            return;
          }

          var maxDuration = Math.ceil(scene.getDuration());
          var maxTime = Math.max(_this.state.maxTime, maxDuration);
          var currentMaxTime = _this.state.maxTime;
          var zoom = _this.state.zoom;
          var nextZoomScale = currentMaxTime > 1 ? maxTime / currentMaxTime : 1;
          var nextZoom = Math.max(1, zoom * nextZoomScale);

          _this.setState({
            timelineInfo: getTimelineInfo(scene),
            maxTime: maxTime,
            maxDuration: maxDuration,
            updateTime: true,
            init: isInit,
            zoom: nextZoom
          });
        };

        _this.prev = function () {
          var scene = _this.props.scene;
          scene && _this.setTime(scene.getTime() - 0.05);
        };

        _this.finish = function () {
          var scene = _this.props.scene;
          scene && scene.finish();
        };

        _this.togglePlay = function () {
          var scene = _this.props.scene;

          if (!scene) {
            return;
          }

          if (scene.getPlayState() === "running") {
            scene.pause();
          } else {
            scene.play();
          }
        };

        _this.getDistTime = function (distX, rect) {
          if (rect === void 0) {
            rect = _this.scrollArea.keyframesArea.scrollAreaElement.getBoundingClientRect();
          }

          var scrollAreaWidth = rect.width - 30;
          var percentage = Math.min(scrollAreaWidth, distX) / scrollAreaWidth;
          var time = _this.state.maxTime * percentage;
          return Math.round(time * 20) / 20;
        };

        _this.getTime = function (clientX) {
          var rect = _this.scrollArea.keyframesArea.scrollAreaElement.getBoundingClientRect();

          var scrollAreaX = rect.left + 15;
          var x = Math.max(clientX - scrollAreaX, 0);
          return _this.getDistTime(x, rect);
        };

        _this.animate = function (e) {
          var time = e.time;
          var minute = numberFormat(Math.floor(time / 60), 2);
          var second = numberFormat(Math.floor(time % 60), 2);
          var milisecond = numberFormat(Math.floor(time % 1 * 100), 3, true);

          _this.moveCursor(time);

          _this.setInputs(flatObject(e.frames || e.frame.get()));

          _this.controlArea.timeArea.getElement().value = minute + ":" + second + ":" + milisecond;
        };

        _this.onBlur = function () {
          if (_this.state.alt === true) {
            _this.setState({
              alt: false
            });
          }
        };

        _this.state = __assign$2$1({}, _this.state, _this.initScene(_this.props.scene, false));
        return _this;
      }

      var __proto = Timeline.prototype;

      __proto.render = function () {
        var _a = this.props,
            scene = _a.scene,
            className = _a.className,
            keyboard = _a.keyboard,
            onSelect = _a.onSelect,
            attributes = __rest$1(_a, ["scene", "className", "keyboard", "onSelect"]);

        var _b = this.state,
            zoom = _b.zoom,
            alt = _b.alt,
            maxDuration = _b.maxDuration,
            maxTime = _b.maxTime,
            timelineInfo = _b.timelineInfo,
            selectedProperty = _b.selectedProperty,
            selectedTime = _b.selectedTime;
        return createElement(TimelineElement, __assign$2$1({
          className: prefix("timeline" + (alt ? " alt" : "")) + (className ? " " + className : "")
        }, attributes), createElement(ControlArea, {
          ref: ref(this, "controlArea"),
          scene: scene,
          timeline: this
        }), createElement(HeaderArea, {
          ref: ref(this, "headerArea"),
          timeline: this,
          maxDuration: maxDuration,
          zoom: zoom,
          maxTime: maxTime,
          timelineInfo: timelineInfo
        }), createElement(ScrollArea, {
          ref: ref(this, "scrollArea"),
          timeline: this,
          maxDuration: maxDuration,
          zoom: zoom,
          maxTime: maxTime,
          selectedProperty: selectedProperty,
          selectedTime: selectedTime,
          timelineInfo: timelineInfo
        }));
      };

      __proto.componentDidMount = function () {
        this.initWheelZoom();
        this.initScroll();
        this.initDragKeyframes();
        this.initKeyController();
      };

      __proto.componentDidUpdate = function (prevProps) {
        var scene = this.props.scene;
        var state = this.state;

        if (state.init) {
          state.init = false;
          this.scrollArea.foldAll();
        }

        if (prevProps.scene !== scene) {
          this.releaseScene(prevProps.scene);
          this.setState(this.initScene(scene, true));
        }

        if (state.updateTime) {
          state.updateTime = false;
          this.setTime();
        }
      };

      __proto.componentWillUnmount = function () {
        this.draggers.forEach(function (dragger) {
          dragger.unset();
        });
        this.pinchDragger.unset();
        var keycon = KeyController.global;
        var keyMap = this.keyMap;
        var keydownMap = keyMap.keydown;
        var keyupMap = keyMap.keyup;
        removeEvent(window, "blur", this.onBlur);
        keycon.offKeydown("alt", keydownMap.alt).offKeyup("alt", keyupMap.alt);

        if (this.props.keyboard) {
          keycon.offKeydown("space", keydownMap.space).offKeydown("left", keydownMap.left).offKeydown("right", keydownMap.right).offKeyup("backspace", keyupMap.backspace).offKeyup("esc", keyupMap.esc).offKeyup("space", keyupMap.space);
        }
      };

      __proto.next = function () {
        var scene = this.props.scene;
        scene && this.setTime(scene.getTime() + 0.05);
      };

      __proto.selectItem = function (scene) {
        var _a = this.state,
            timelineInfo = _a.timelineInfo,
            selectedTime = _a.selectedTime;

        for (var name in timelineInfo) {
          var info = timelineInfo[name];

          if (info.item === scene) {
            this.select(info.key, selectedTime);
            break;
          }
        }
      };

      __proto.select = function (property, time, isNotUpdate) {
        if (time === void 0) {
          time = -1;
        }

        var activeElement = document.activeElement;

        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }

        var scene = this.props.scene;

        if (!scene) {
          return;
        }

        scene.pause();
        var state = this.state;
        var prevSelectedProperty = state.selectedProperty,
            prevSelectedTime = state.selectedTime,
            prevSelectedItem = state.selectedItem,
            timelineInfo = state.timelineInfo;
        var propertiesInfo = timelineInfo[property];
        var selectedItem = property ? propertiesInfo.item : this.props.scene;
        var selectedName = property ? propertiesInfo.names.join("///") : "";

        if (this.props.onSelect) {
          this.props.onSelect({
            selectedItem: selectedItem,
            selectedName: selectedName,
            selectedProperty: property,
            selectedTime: time,
            prevSelectedProperty: prevSelectedProperty,
            prevSelectedTime: prevSelectedTime,
            prevSelectedItem: prevSelectedItem
          });
        }

        if (isNotUpdate) {
          state.selectedProperty = property;
          state.selectedTime = time;
          state.selectedItem = selectedItem;
        } else {
          this.setState({
            selectedProperty: property,
            selectedTime: time,
            selectedItem: selectedItem
          });
        }
      };

      __proto.editKeyframe = function (index, value) {
        var propertiesInfo = this.scrollArea.propertiesArea.properties[index].props.propertiesInfo;
        var isObjectData = propertiesInfo.isParent;

        if (isObjectData) {
          return;
        }

        var item = propertiesInfo.item;
        var properties = propertiesInfo.properties;
        item.set.apply(item, [item.getIterationTime()].concat(properties, [value]));
        this.update();
      };

      __proto.setTime = function (time) {
        var scene = this.props.scene;

        if (!scene) {
          return;
        }

        var direction = scene.getDirection();
        scene.pause();

        if (isUndefined(time)) {
          time = scene.getTime();
        }

        if (direction === "normal" || direction === "alternate") {
          scene.setTime(time);
        } else {
          scene.setTime(scene.getDuration() - time);
        }
      };

      __proto.setZoom = function (zoom) {
        this.setState({
          zoom: Math.max(zoom, 1)
        });
      };

      __proto.getZoom = function () {
        return this.state.zoom;
      };

      __proto.getValues = function () {
        return this.values;
      };

      __proto.openDialog = function (item, properties) {
        if (item === void 0) {
          item = this.props.scene;
        }

        if (properties === void 0) {
          properties = [];
        }

        if (!this.props.scene) {
          return;
        }

        if (isScene(item)) {
          this.newItem(item);
        } else {
          this.newProperty(item, properties);
        }
      };

      __proto.move = function (clientX) {
        this.setTime(this.getTime(clientX));
      };

      __proto.newItem = function (scene) {
        var name = prompt("Add Item");

        if (!name) {
          return;
        }

        scene.newItem(name);
        this.update();
      };

      __proto.newProperty = function (item, properties) {
        var property = prompt("Add Property");

        if (!property) {
          return;
        }

        var roles = ROLES;
        var nextProperties = properties.concat([property]);
        var isRole = nextProperties.every(function (name) {
          if (isObject(roles[name])) {
            roles = roles[name];
            return true;
          }

          return false;
        });
        item.set.apply(item, [item.getIterationTime()].concat(nextProperties, [isRole ? {} : ""]));
        this.update();
      };

      __proto.moveCursor = function (time) {
        var maxTime = this.state.maxTime;
        var px = 15 - 30 * time / maxTime;
        var percent = 100 * time / maxTime;
        var left = "calc(" + percent + "% + " + px + "px)";
        this.scrollArea.keyframesArea.cursor.getElement().style.left = left;
        this.headerArea.keytimesArea.cursor.getElement().style.left = left;
      };

      __proto.setInputs = function (obj) {
        this.values = obj;
        var valuesArea = this.scrollArea.valuesArea.getElement();

        for (var name in obj) {
          var input = valuesArea.querySelector("[data-id=\"" + name + "\"] input");

          if (input) {
            input.value = obj[name];
          }
        }
      };

      __proto.removeKeyframe = function (property) {
        var propertiesInfo = this.state.timelineInfo[property];

        if (!property || !propertiesInfo || isScene(propertiesInfo.item)) {
          return;
        }

        var properties = propertiesInfo.properties;
        var item = propertiesInfo.item;
        item.remove.apply(item, [item.getIterationTime()].concat(properties));
        this.update();
      };

      __proto.addKeyframe = function (index, time) {
        var keyframesList = this.scrollArea.keyframesArea.keyframesList;
        var id = keyframesList[index].props.id;
        this.select(id, time);
        var inputElement = this.scrollArea.valuesArea.values[index].inputElement;

        if (inputElement) {
          this.editKeyframe(index, inputElement.value);
        }
      };

      __proto.initScene = function (scene, isInit) {
        if (!scene) {
          return {
            timelineInfo: {},
            maxTime: 0,
            maxDuration: 0,
            zoom: 1,
            init: false
          };
        }

        scene.finish();
        scene.on("animate", this.animate);
        var duration = Math.ceil(scene.getDuration());
        return {
          timelineInfo: getTimelineInfo(scene),
          maxTime: duration,
          maxDuration: duration,
          zoom: 1,
          init: isInit || false
        };
      };

      __proto.releaseScene = function (scene) {
        if (!scene) {
          return;
        }

        scene.off("animate", this.animate);
      };

      __proto.initWheelZoom = function () {
        var _this = this;

        var keyframesArea = this.scrollArea.keyframesArea.getElement();
        this.pinchDragger = new Dragger(keyframesArea, {
          pinchstart: function (_a) {
            var datas = _a.datas;
            datas.zoom = _this.state.zoom;
          },
          pinch: function (_a) {
            var scale = _a.scale,
                datas = _a.datas;
            console.log("SCALE", scale);

            _this.setZoom(datas.zoom * scale);
          }
        });
      };

      __proto.initScroll = function () {
        var isScrollKeyframe = false;
        var headerKeyframesArea = this.headerArea.keytimesArea.getElement();
        var scrollKeyframesArea = this.scrollArea.keyframesArea.getElement();
        headerKeyframesArea.addEventListener("scroll", function () {
          if (isScrollKeyframe) {
            isScrollKeyframe = false;
          } else {
            isScrollKeyframe = true;
            scrollKeyframesArea.scrollLeft = headerKeyframesArea.scrollLeft;
          }
        });
        scrollKeyframesArea.addEventListener("scroll", function (e) {
          if (isScrollKeyframe) {
            isScrollKeyframe = false;
          } else {
            isScrollKeyframe = true;
            headerKeyframesArea.scrollLeft = scrollKeyframesArea.scrollLeft;
          }
        });
      };

      __proto.selectByKeyframe = function (keyframeElement) {
        var keyframesElement = keyframeElement.parentElement.parentElement;
        var time = parseFloat(keyframeElement.getAttribute("data-time") || "0");
        var id = keyframesElement.getAttribute("data-id") || "";
        this.setTime(time);
        this.select(id, time);
      };

      __proto.initDragKeyframes = function () {
        var _this = this;

        var click = function (e, clientX, clientY) {
          var time = _this.getTime(clientX);

          var list = _this.scrollArea.keyframesArea.keyframesList;
          var index = findElementIndexByPosition(list.map(function (keyframes) {
            return keyframes.getElement();
          }), clientY);

          _this.setTime(time);

          index > -1 && _this.select(list[index].props.id, time);
          e.preventDefault();
        };

        var dblclick = function (e, clientX, clientY) {
          var list = _this.scrollArea.keyframesArea.keyframesList;
          var index = findElementIndexByPosition(list.map(function (keyframes) {
            return keyframes.getElement();
          }), clientY);

          if (index === -1) {
            return;
          }

          _this.addKeyframe(index, _this.getTime(clientX));
        };

        var keytimesScrollArea = this.headerArea.keytimesArea.scrollAreaElement;
        var keyframesScrollArea = this.scrollArea.keyframesArea.scrollAreaElement;
        var dragItem;
        var dragDelay = 0;
        var dragTarget;
        this.draggers = [keytimesScrollArea, keyframesScrollArea].map(function (element) {
          return new Dragger(element, {
            container: window,
            dragstart: function (_a) {
              var clientX = _a.clientX,
                  inputEvent = _a.inputEvent;
              var inputTarget = inputEvent.target;
              var keyframeTarget = getTarget(inputTarget, function (el) {
                return hasClass$1(el, "keyframe");
              });

              if (keyframeTarget) {
                _this.selectByKeyframe(keyframeTarget);

                return false;
              }

              dragTarget = getTarget(inputTarget, function (el) {
                return hasClass$1(el, "keyframe-group");
              });

              if (dragTarget) {
                var properties = _this.scrollArea.propertiesArea.properties;
                var keyframesElement = getTarget(dragTarget, function (el) {
                  return hasClass$1(el, "keyframes");
                });
                var id_1 = keyframesElement.getAttribute("data-id");
                var property = find(properties, function (p) {
                  return p.props.id === id_1;
                });
                var propertiesInfo = property.props.propertiesInfo;
                dragItem = propertiesInfo.item;
                dragDelay = dragItem.getDelay();
              }
            },
            drag: function (_a) {
              var distX = _a.distX,
                  deltaX = _a.deltaX,
                  deltaY = _a.deltaY,
                  inputEvent = _a.inputEvent;

              if (dragTarget && dragItem) {
                var nextDelay = Math.max(dragDelay + _this.getDistTime(distX), 0);

                if (dragItem.getDelay() !== nextDelay) {
                  dragItem.setDelay(nextDelay);

                  _this.update();
                }
              } else {
                _this.scrollArea.keyframesArea.getElement().scrollLeft -= deltaX;
                _this.scrollArea.getElement().scrollTop -= deltaY;
                inputEvent.preventDefault();
              }
            },
            dragend: function (_a) {
              var isDrag = _a.isDrag,
                  clientX = _a.clientX,
                  clientY = _a.clientY,
                  inputEvent = _a.inputEvent;
              dragTarget = null;
              dragItem = null;
              dragDelay = 0;
              !isDrag && click(inputEvent, clientX, clientY);
              dblCheck(isDrag, inputEvent, clientX, clientY, dblclick);
            }
          });
        });
      };

      __proto.initKeyController = function () {
        addEvent(window, "blur", this.onBlur);
        var keycon = KeyController.global;
        var keyMap = this.keyMap;
        var keydownMap = keyMap.keydown;
        var keyupMap = keyMap.keyup;
        keycon.keydown("alt", keydownMap.alt).keyup("alt", keyupMap.alt);

        if (this.props.keyboard) {
          keycon.keydown("space", keydownMap.space).keydown("left", keydownMap.left).keydown("right", keydownMap.right).keyup("backspace", keyupMap.backspace).keyup("esc", keyupMap.esc).keyup("space", keyupMap.space);
        }
      };

      Timeline.defaultProps = {
        keyboard: true,
        onSelect: function () {}
      };
      return Timeline;
    }(PureProps);

    var Timeline$1 =
    /*#__PURE__*/
    function (_super) {
      __extends$2(Timeline$1, _super);

      function Timeline$1() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = Timeline$1.prototype;

      __proto.render = function () {
        var _this = this;

        return h(Timeline, __assign$2({}, this.props, {
          ref: function (e) {
            _this.timeline = e;
          }
        }));
      };

      __proto.update = function (isInit) {
        this.timeline.update(isInit);
      };

      __proto.prev = function () {
        this.timeline.prev();
      };

      __proto.next = function () {
        this.timeline.next();
      };

      __proto.finish = function () {
        this.timeline.finish();
      };

      __proto.togglePlay = function () {
        this.timeline.togglePlay();
      };

      return Timeline$1;
    }(Component);

    var Timeline$2 =
    /*#__PURE__*/
    function (_super) {
      __extends(Timeline, _super);

      function Timeline(scene, parentElement, options) {
        if (options === void 0) {
          options = {};
        }

        var _this = _super.call(this) || this;

        _this.onSelect = function (e) {
          _this.trigger("select", e);
        };

        var element = document.createElement("div");
        render(h(Timeline$1, __assign({
          ref: function (e) {
            e && (_this.timelineArea = e);
          },
          keyboard: true
        }, options, {
          scene: scene,
          onSelect: _this.onSelect
        })), element);
        parentElement.appendChild(element.children[0]);
        return _this;
      }

      var __proto = Timeline.prototype;

      __proto.update = function (isInit) {
        this.timelineArea.update(isInit);
      };

      return Timeline;
    }(Component$1);

    return Timeline$2;

})));
//# sourceMappingURL=timeline.pkgd.js.map
