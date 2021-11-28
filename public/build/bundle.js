
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }

    var _ = {
      $(selector) {
        if (typeof selector === "string") {
          return document.querySelector(selector);
        }
        return selector;
      },
      extend(...args) {
        return Object.assign(...args);
      },
      cumulativeOffset(element) {
        let top = 0;
        let left = 0;

        do {
          top += element.offsetTop || 0;
          left += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);

        return {
          top: top,
          left: left
        };
      },
      directScroll(element) {
        return element && element !== document && element !== document.body;
      },
      scrollTop(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollTop = value) : element.scrollTop;
        } else {
          return inSetter
            ? (document.documentElement.scrollTop = document.body.scrollTop = value)
            : window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;
        }
      },
      scrollLeft(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollLeft = value) : element.scrollLeft;
        } else {
          return inSetter
            ? (document.documentElement.scrollLeft = document.body.scrollLeft = value)
            : window.pageXOffset ||
                document.documentElement.scrollLeft ||
                document.body.scrollLeft ||
                0;
        }
      }
    };

    const defaultOptions = {
      container: "body",
      duration: 500,
      delay: 0,
      offset: 0,
      easing: cubicInOut,
      onStart: noop,
      onDone: noop,
      onAborting: noop,
      scrollX: false,
      scrollY: true
    };

    const _scrollTo = options => {
      let {
        offset,
        duration,
        delay,
        easing,
        x=0,
        y=0,
        scrollX,
        scrollY,
        onStart,
        onDone,
        container,
        onAborting,
        element
      } = options;

      if (typeof offset === "function") {
        offset = offset();
      }

      var cumulativeOffsetContainer = _.cumulativeOffset(container);
      var cumulativeOffsetTarget = element
        ? _.cumulativeOffset(element)
        : { top: y, left: x };

      var initialX = _.scrollLeft(container);
      var initialY = _.scrollTop(container);

      var targetX =
        cumulativeOffsetTarget.left - cumulativeOffsetContainer.left + offset;
      var targetY =
        cumulativeOffsetTarget.top - cumulativeOffsetContainer.top + offset;

      var diffX = targetX - initialX;
    	var diffY = targetY - initialY;

      let scrolling = true;
      let started = false;
      let start_time = now() + delay;
      let end_time = start_time + duration;

      function scrollToTopLeft(element, top, left) {
        if (scrollX) _.scrollLeft(element, left);
        if (scrollY) _.scrollTop(element, top);
      }

      function start(delayStart) {
        if (!delayStart) {
          started = true;
          onStart(element, {x, y});
        }
      }

      function tick(progress) {
        scrollToTopLeft(
          container,
          initialY + diffY * progress,
          initialX + diffX * progress
        );
      }

      function stop() {
        scrolling = false;
      }

      loop(now => {
        if (!started && now >= start_time) {
          start(false);
        }

        if (started && now >= end_time) {
          tick(1);
          stop();
          onDone(element, {x, y});
        }

        if (!scrolling) {
          onAborting(element, {x, y});
          return false;
        }
        if (started) {
          const p = now - start_time;
          const t = 0 + 1 * easing(p / duration);
          tick(t);
        }

        return true;
      });

      start(delay);

      tick(0);

      return stop;
    };

    const proceedOptions = options => {
    	let opts = _.extend({}, defaultOptions, options);
      opts.container = _.$(opts.container);
      opts.element = _.$(opts.element);
      return opts;
    };

    const scrollContainerHeight = containerElement => {
      if (
        containerElement &&
        containerElement !== document &&
        containerElement !== document.body
      ) {
        return containerElement.scrollHeight - containerElement.offsetHeight;
      } else {
        let body = document.body;
        let html = document.documentElement;

        return Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
      }
    };

    const setGlobalOptions = options => {
    	_.extend(defaultOptions, options || {});
    };

    const scrollTo = options => {
      return _scrollTo(proceedOptions(options));
    };

    const scrollToBottom = options => {
      options = proceedOptions(options);

      return _scrollTo(
        _.extend(options, {
          element: null,
          y: scrollContainerHeight(options.container)
        })
      );
    };

    const scrollToTop = options => {
      options = proceedOptions(options);

      return _scrollTo(
        _.extend(options, {
          element: null,
          y: 0
        })
      );
    };

    const makeScrollToAction = scrollToFunc => {
      return (node, options) => {
        let current = options;
        const handle = e => {
          e.preventDefault();
          scrollToFunc(
            typeof current === "string" ? { element: current } : current
          );
        };
        node.addEventListener("click", handle);
        node.addEventListener("touchstart", handle);
        return {
          update(options) {
            current = options;
          },
          destroy() {
            node.removeEventListener("click", handle);
            node.removeEventListener("touchstart", handle);
          }
        };
      };
    };

    const scrollto = makeScrollToAction(scrollTo);
    const scrolltotop = makeScrollToAction(scrollToTop);
    const scrolltobottom = makeScrollToAction(scrollToBottom);

    var animateScroll = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setGlobalOptions: setGlobalOptions,
        scrollTo: scrollTo,
        scrollToBottom: scrollToBottom,
        scrollToTop: scrollToTop,
        makeScrollToAction: makeScrollToAction,
        scrollto: scrollto,
        scrolltotop: scrolltotop,
        scrolltobottom: scrolltobottom
    });

    /* src\Components\TopButton.svelte generated by Svelte v3.43.1 */
    const file$5 = "src\\Components\\TopButton.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let a;
    	let p;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			p = element("p");
    			p.textContent = "To Top 🡪";
    			attr_dev(p, "class", "svelte-14ixmth");
    			add_location(p, file$5, 5, 52, 153);
    			attr_dev(a, "class", "svelte-14ixmth");
    			add_location(a, file$5, 5, 4, 105);
    			attr_dev(div, "id", "top-button");
    			attr_dev(div, "class", "svelte-14ixmth");
    			add_location(div, file$5, 4, 0, 78);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, p);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopButton', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => scrollToTop();
    	$$self.$capture_state = () => ({ animateScroll });
    	return [click_handler];
    }

    class TopButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopButton",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\Components\Footer.svelte generated by Svelte v3.43.1 */
    const file$4 = "src\\Components\\Footer.svelte";

    // (11:8) {#if top_button_present}
    function create_if_block$3(ctx) {
    	let div;
    	let topbutton;
    	let current;
    	topbutton = new TopButton({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(topbutton.$$.fragment);
    			attr_dev(div, "class", "to-top svelte-hlllun");
    			add_location(div, file$4, 11, 12, 530);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(topbutton, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(topbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(11:8) {#if top_button_present}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let div;
    	let a0;
    	let t0;
    	let a1;
    	let t1;
    	let a2;
    	let t2;
    	let current;
    	let if_block = /*top_button_present*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			a0 = element("a");
    			t0 = space();
    			a1 = element("a");
    			t1 = space();
    			a2 = element("a");
    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "href", "https://github.com/RossMcIlvaine");
    			attr_dev(a0, "class", "fab fa-github svelte-hlllun");
    			add_location(a0, file$4, 7, 8, 173);
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "href", "https://www.linkedin.com/in/ross-mcilvaine-95355a16b/");
    			attr_dev(a1, "class", "fab fa-linkedin svelte-hlllun");
    			add_location(a1, file$4, 8, 8, 268);
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "href", "https://www.instagram.com/rossmcilvaine/");
    			attr_dev(a2, "class", "fab fa-instagram svelte-hlllun");
    			add_location(a2, file$4, 9, 8, 386);
    			attr_dev(div, "class", "socials svelte-hlllun");
    			add_location(div, file$4, 6, 4, 142);
    			attr_dev(main, "class", "footer svelte-hlllun");
    			add_location(main, file$4, 5, 0, 115);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, a0);
    			append_dev(div, t0);
    			append_dev(div, a1);
    			append_dev(div, t1);
    			append_dev(div, a2);
    			append_dev(div, t2);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*top_button_present*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*top_button_present*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	let { top_button_present = true } = $$props;
    	const writable_props = ['top_button_present'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('top_button_present' in $$props) $$invalidate(0, top_button_present = $$props.top_button_present);
    	};

    	$$self.$capture_state = () => ({ TopButton, top_button_present });

    	$$self.$inject_state = $$props => {
    		if ('top_button_present' in $$props) $$invalidate(0, top_button_present = $$props.top_button_present);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [top_button_present];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { top_button_present: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get top_button_present() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top_button_present(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\HalfScreen.svelte generated by Svelte v3.43.1 */

    const file$3 = "src\\Components\\HalfScreen.svelte";
    const get_info_slot_changes_1 = dirty => ({});
    const get_info_slot_context_1 = ctx => ({});
    const get_photo_slot_changes = dirty => ({});
    const get_photo_slot_context = ctx => ({});
    const get_section_title_slot_changes_1 = dirty => ({});
    const get_section_title_slot_context_1 = ctx => ({});
    const get_section_title_slot_changes = dirty => ({});
    const get_section_title_slot_context = ctx => ({});
    const get_info_slot_changes = dirty => ({});
    const get_info_slot_context = ctx => ({});

    // (21:4) {:else}
    function create_else_block(ctx) {
    	let div0;
    	let t;
    	let div1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "half1 svelte-48gmio");
    			add_location(div0, file$3, 21, 8, 627);
    			attr_dev(div1, "class", "half2 svelte-48gmio");
    			add_location(div1, file$3, 24, 8, 674);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(21:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (13:60) 
    function create_if_block_1(ctx) {
    	let div0;
    	let t0;
    	let div0_class_value;
    	let t1;
    	let div1;
    	let div1_class_value;
    	let current;
    	const section_title_slot_template = /*#slots*/ ctx[2]["section-title"];
    	const section_title_slot = create_slot(section_title_slot_template, ctx, /*$$scope*/ ctx[1], get_section_title_slot_context_1);
    	const photo_slot_template = /*#slots*/ ctx[2].photo;
    	const photo_slot = create_slot(photo_slot_template, ctx, /*$$scope*/ ctx[1], get_photo_slot_context);
    	const info_slot_template = /*#slots*/ ctx[2].info;
    	const info_slot = create_slot(info_slot_template, ctx, /*$$scope*/ ctx[1], get_info_slot_context_1);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if (section_title_slot) section_title_slot.c();
    			t0 = space();
    			if (photo_slot) photo_slot.c();
    			t1 = space();
    			div1 = element("div");
    			if (info_slot) info_slot.c();
    			attr_dev(div0, "class", div0_class_value = "half1 " + /*block_type*/ ctx[0] + " svelte-48gmio");
    			add_location(div0, file$3, 13, 8, 370);
    			attr_dev(div1, "class", div1_class_value = "half2 " + /*block_type*/ ctx[0] + " svelte-48gmio");
    			add_location(div1, file$3, 17, 8, 517);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);

    			if (section_title_slot) {
    				section_title_slot.m(div0, null);
    			}

    			append_dev(div0, t0);

    			if (photo_slot) {
    				photo_slot.m(div0, null);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);

    			if (info_slot) {
    				info_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (section_title_slot) {
    				if (section_title_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						section_title_slot,
    						section_title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(section_title_slot_template, /*$$scope*/ ctx[1], dirty, get_section_title_slot_changes_1),
    						get_section_title_slot_context_1
    					);
    				}
    			}

    			if (photo_slot) {
    				if (photo_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						photo_slot,
    						photo_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(photo_slot_template, /*$$scope*/ ctx[1], dirty, get_photo_slot_changes),
    						get_photo_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*block_type*/ 1 && div0_class_value !== (div0_class_value = "half1 " + /*block_type*/ ctx[0] + " svelte-48gmio")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (info_slot) {
    				if (info_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						info_slot,
    						info_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(info_slot_template, /*$$scope*/ ctx[1], dirty, get_info_slot_changes_1),
    						get_info_slot_context_1
    					);
    				}
    			}

    			if (!current || dirty & /*block_type*/ 1 && div1_class_value !== (div1_class_value = "half2 " + /*block_type*/ ctx[0] + " svelte-48gmio")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section_title_slot, local);
    			transition_in(photo_slot, local);
    			transition_in(info_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section_title_slot, local);
    			transition_out(photo_slot, local);
    			transition_out(info_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (section_title_slot) section_title_slot.d(detaching);
    			if (photo_slot) photo_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (info_slot) info_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(13:60) ",
    		ctx
    	});

    	return block;
    }

    // (6:4) {#if block_type=='default'}
    function create_if_block$2(ctx) {
    	let div0;
    	let t;
    	let div1;
    	let current;
    	const info_slot_template = /*#slots*/ ctx[2].info;
    	const info_slot = create_slot(info_slot_template, ctx, /*$$scope*/ ctx[1], get_info_slot_context);
    	const section_title_slot_template = /*#slots*/ ctx[2]["section-title"];
    	const section_title_slot = create_slot(section_title_slot_template, ctx, /*$$scope*/ ctx[1], get_section_title_slot_context);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if (info_slot) info_slot.c();
    			t = space();
    			div1 = element("div");
    			if (section_title_slot) section_title_slot.c();
    			attr_dev(div0, "class", "half2 svelte-48gmio");
    			add_location(div0, file$3, 6, 8, 131);
    			attr_dev(div1, "class", "half1 svelte-48gmio");
    			add_location(div1, file$3, 9, 8, 215);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);

    			if (info_slot) {
    				info_slot.m(div0, null);
    			}

    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);

    			if (section_title_slot) {
    				section_title_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (info_slot) {
    				if (info_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						info_slot,
    						info_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(info_slot_template, /*$$scope*/ ctx[1], dirty, get_info_slot_changes),
    						get_info_slot_context
    					);
    				}
    			}

    			if (section_title_slot) {
    				if (section_title_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						section_title_slot,
    						section_title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(section_title_slot_template, /*$$scope*/ ctx[1], dirty, get_section_title_slot_changes),
    						get_section_title_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info_slot, local);
    			transition_in(section_title_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(info_slot, local);
    			transition_out(section_title_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (info_slot) info_slot.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			if (section_title_slot) section_title_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(6:4) {#if block_type=='default'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let main_class_value;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*block_type*/ ctx[0] == 'default') return 0;
    		if (/*block_type*/ ctx[0] == 'resume' || /*block_type*/ ctx[0] == 'contact') return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", main_class_value = "" + (null_to_empty(/*block_type*/ ctx[0]) + " svelte-48gmio"));
    			add_location(main, file$3, 4, 0, 63);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}

    			if (!current || dirty & /*block_type*/ 1 && main_class_value !== (main_class_value = "" + (null_to_empty(/*block_type*/ ctx[0]) + " svelte-48gmio"))) {
    				attr_dev(main, "class", main_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HalfScreen', slots, ['info','section-title','photo']);
    	let { block_type = 'default' } = $$props;
    	const writable_props = ['block_type'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HalfScreen> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('block_type' in $$props) $$invalidate(0, block_type = $$props.block_type);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ block_type });

    	$$self.$inject_state = $$props => {
    		if ('block_type' in $$props) $$invalidate(0, block_type = $$props.block_type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [block_type, $$scope, slots];
    }

    class HalfScreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { block_type: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HalfScreen",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get block_type() {
    		throw new Error("<HalfScreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block_type(value) {
    		throw new Error("<HalfScreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\InfoBlock.svelte generated by Svelte v3.43.1 */

    const file$2 = "src\\Components\\InfoBlock.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (10:12) {#if items_present}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*items*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 8) {
    				each_value = /*items*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(10:12) {#if items_present}",
    		ctx
    	});

    	return block;
    }

    // (11:16) {#each items as item}
    function create_each_block$1(ctx) {
    	let li;
    	let t_value = /*item*/ ctx[7] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-1bg21aj");
    			add_location(li, file$2, 11, 20, 282);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 8 && t_value !== (t_value = /*item*/ ctx[7] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(11:16) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let div0;
    	let h3;
    	let t0;
    	let t1;
    	let ul;
    	let t2;
    	let div1;
    	let img;
    	let img_src_value;
    	let t3;
    	let h40;
    	let t4;
    	let t5;
    	let h41;
    	let t6;
    	let if_block = /*items_present*/ ctx[6] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			h3 = element("h3");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			ul = element("ul");
    			if (if_block) if_block.c();
    			t2 = space();
    			div1 = element("div");
    			img = element("img");
    			t3 = space();
    			h40 = element("h4");
    			t4 = text(/*location*/ ctx[1]);
    			t5 = space();
    			h41 = element("h4");
    			t6 = text(/*date*/ ctx[2]);
    			attr_dev(h3, "class", "svelte-1bg21aj");
    			add_location(h3, file$2, 7, 8, 157);
    			add_location(ul, file$2, 8, 8, 184);
    			attr_dev(div0, "class", "text svelte-1bg21aj");
    			add_location(div0, file$2, 6, 4, 129);
    			attr_dev(img, "alt", /*alt*/ ctx[4]);
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[5])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1bg21aj");
    			add_location(img, file$2, 17, 8, 402);
    			attr_dev(h40, "class", "svelte-1bg21aj");
    			add_location(h40, file$2, 18, 8, 429);
    			attr_dev(h41, "class", "svelte-1bg21aj");
    			add_location(h41, file$2, 19, 8, 458);
    			attr_dev(div1, "class", "info svelte-1bg21aj");
    			add_location(div1, file$2, 16, 4, 374);
    			attr_dev(main, "class", "svelte-1bg21aj");
    			add_location(main, file$2, 5, 0, 117);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t0);
    			append_dev(div0, t1);
    			append_dev(div0, ul);
    			if (if_block) if_block.m(ul, null);
    			append_dev(main, t2);
    			append_dev(main, div1);
    			append_dev(div1, img);
    			append_dev(div1, t3);
    			append_dev(div1, h40);
    			append_dev(h40, t4);
    			append_dev(div1, t5);
    			append_dev(div1, h41);
    			append_dev(h41, t6);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (/*items_present*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(ul, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*alt*/ 16) {
    				attr_dev(img, "alt", /*alt*/ ctx[4]);
    			}

    			if (dirty & /*src*/ 32 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[5])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*location*/ 2) set_data_dev(t4, /*location*/ ctx[1]);
    			if (dirty & /*date*/ 4) set_data_dev(t6, /*date*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InfoBlock', slots, []);
    	let { title, location, date, items, alt, src } = $$props;
    	let { items_present = true } = $$props;
    	const writable_props = ['title', 'location', 'date', 'items', 'alt', 'src', 'items_present'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InfoBlock> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('location' in $$props) $$invalidate(1, location = $$props.location);
    		if ('date' in $$props) $$invalidate(2, date = $$props.date);
    		if ('items' in $$props) $$invalidate(3, items = $$props.items);
    		if ('alt' in $$props) $$invalidate(4, alt = $$props.alt);
    		if ('src' in $$props) $$invalidate(5, src = $$props.src);
    		if ('items_present' in $$props) $$invalidate(6, items_present = $$props.items_present);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		location,
    		date,
    		items,
    		alt,
    		src,
    		items_present
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('location' in $$props) $$invalidate(1, location = $$props.location);
    		if ('date' in $$props) $$invalidate(2, date = $$props.date);
    		if ('items' in $$props) $$invalidate(3, items = $$props.items);
    		if ('alt' in $$props) $$invalidate(4, alt = $$props.alt);
    		if ('src' in $$props) $$invalidate(5, src = $$props.src);
    		if ('items_present' in $$props) $$invalidate(6, items_present = $$props.items_present);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, location, date, items, alt, src, items_present];
    }

    class InfoBlock extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			title: 0,
    			location: 1,
    			date: 2,
    			items: 3,
    			alt: 4,
    			src: 5,
    			items_present: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InfoBlock",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<InfoBlock> was created without expected prop 'title'");
    		}

    		if (/*location*/ ctx[1] === undefined && !('location' in props)) {
    			console.warn("<InfoBlock> was created without expected prop 'location'");
    		}

    		if (/*date*/ ctx[2] === undefined && !('date' in props)) {
    			console.warn("<InfoBlock> was created without expected prop 'date'");
    		}

    		if (/*items*/ ctx[3] === undefined && !('items' in props)) {
    			console.warn("<InfoBlock> was created without expected prop 'items'");
    		}

    		if (/*alt*/ ctx[4] === undefined && !('alt' in props)) {
    			console.warn("<InfoBlock> was created without expected prop 'alt'");
    		}

    		if (/*src*/ ctx[5] === undefined && !('src' in props)) {
    			console.warn("<InfoBlock> was created without expected prop 'src'");
    		}
    	}

    	get title() {
    		throw new Error("<InfoBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<InfoBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get location() {
    		throw new Error("<InfoBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set location(value) {
    		throw new Error("<InfoBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get date() {
    		throw new Error("<InfoBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<InfoBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<InfoBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<InfoBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		throw new Error("<InfoBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<InfoBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get src() {
    		throw new Error("<InfoBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<InfoBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items_present() {
    		throw new Error("<InfoBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items_present(value) {
    		throw new Error("<InfoBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Skill.svelte generated by Svelte v3.43.1 */

    const file$1 = "src\\Components\\Skill.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    const get_desc_slot_changes = dirty => ({});
    const get_desc_slot_context = ctx => ({});
    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});

    // (12:4) {#if skill=='programming'}
    function create_if_block(ctx) {
    	let ul;
    	let each_value = /*list_items*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-1un42ad");
    			add_location(ul, file$1, 12, 8, 274);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*list_items*/ 1) {
    				each_value = /*list_items*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(12:4) {#if skill=='programming'}",
    		ctx
    	});

    	return block;
    }

    // (14:12) {#each list_items as item}
    function create_each_block(ctx) {
    	let li;
    	let t_value = /*item*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-1un42ad");
    			add_location(li, file$1, 14, 16, 336);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*list_items*/ 1 && t_value !== (t_value = /*item*/ ctx[4] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(14:12) {#each list_items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let main_class_value;
    	let current;
    	const icon_slot_template = /*#slots*/ ctx[3].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[2], get_icon_slot_context);
    	const desc_slot_template = /*#slots*/ ctx[3].desc;
    	const desc_slot = create_slot(desc_slot_template, ctx, /*$$scope*/ ctx[2], get_desc_slot_context);
    	let if_block = /*skill*/ ctx[1] == 'programming' && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			if (icon_slot) icon_slot.c();
    			t0 = space();
    			div1 = element("div");
    			if (desc_slot) desc_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "icon svelte-1un42ad");
    			add_location(div0, file$1, 5, 4, 96);
    			attr_dev(div1, "class", "text svelte-1un42ad");
    			add_location(div1, file$1, 8, 4, 167);
    			attr_dev(main, "class", main_class_value = "" + (null_to_empty(/*skill*/ ctx[1]) + " svelte-1un42ad"));
    			add_location(main, file$1, 4, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);

    			if (icon_slot) {
    				icon_slot.m(div0, null);
    			}

    			append_dev(main, t0);
    			append_dev(main, div1);

    			if (desc_slot) {
    				desc_slot.m(div1, null);
    			}

    			append_dev(main, t1);
    			if (if_block) if_block.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[2], dirty, get_icon_slot_changes),
    						get_icon_slot_context
    					);
    				}
    			}

    			if (desc_slot) {
    				if (desc_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						desc_slot,
    						desc_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(desc_slot_template, /*$$scope*/ ctx[2], dirty, get_desc_slot_changes),
    						get_desc_slot_context
    					);
    				}
    			}

    			if (/*skill*/ ctx[1] == 'programming') {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*skill*/ 2 && main_class_value !== (main_class_value = "" + (null_to_empty(/*skill*/ ctx[1]) + " svelte-1un42ad"))) {
    				attr_dev(main, "class", main_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			transition_in(desc_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot, local);
    			transition_out(desc_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (icon_slot) icon_slot.d(detaching);
    			if (desc_slot) desc_slot.d(detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skill', slots, ['icon','desc']);
    	let { list_items, skill = 'default' } = $$props;
    	const writable_props = ['list_items', 'skill'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skill> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('list_items' in $$props) $$invalidate(0, list_items = $$props.list_items);
    		if ('skill' in $$props) $$invalidate(1, skill = $$props.skill);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ list_items, skill });

    	$$self.$inject_state = $$props => {
    		if ('list_items' in $$props) $$invalidate(0, list_items = $$props.list_items);
    		if ('skill' in $$props) $$invalidate(1, skill = $$props.skill);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [list_items, skill, $$scope, slots];
    }

    class Skill extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { list_items: 0, skill: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skill",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*list_items*/ ctx[0] === undefined && !('list_items' in props)) {
    			console.warn("<Skill> was created without expected prop 'list_items'");
    		}
    	}

    	get list_items() {
    		throw new Error("<Skill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list_items(value) {
    		throw new Error("<Skill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skill() {
    		throw new Error("<Skill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skill(value) {
    		throw new Error("<Skill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.43.1 */
    const file = "src\\App.svelte";

    // (20:3) 
    function create_section_title_slot_2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "ABOUT ME";
    			attr_dev(h1, "id", "about");
    			attr_dev(h1, "slot", "section-title");
    			attr_dev(h1, "class", "svelte-i5zuvk");
    			add_location(h1, file, 19, 3, 811);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_section_title_slot_2.name,
    		type: "slot",
    		source: "(20:3) ",
    		ctx
    	});

    	return block;
    }

    // (21:3) 
    function create_photo_slot(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*Profilesrc*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Profile Picture");
    			attr_dev(img, "slot", "photo");
    			attr_dev(img, "class", "svelte-i5zuvk");
    			add_location(img, file, 20, 3, 865);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_photo_slot.name,
    		type: "slot",
    		source: "(21:3) ",
    		ctx
    	});

    	return block;
    }

    // (32:6) 
    function create_icon_slot_4(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa fa-code svelte-i5zuvk");
    			attr_dev(i, "slot", "icon");
    			add_location(i, file, 31, 6, 1653);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot_4.name,
    		type: "slot",
    		source: "(32:6) ",
    		ctx
    	});

    	return block;
    }

    // (33:6) 
    function create_desc_slot_4(ctx) {
    	let div;
    	let h5;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			h5.textContent = "Programming";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Five+ years of technical coding experience in a variety of languages and platforms including:";
    			attr_dev(h5, "class", "skill-title svelte-i5zuvk");
    			add_location(h5, file, 33, 7, 1744);
    			attr_dev(p, "class", "skill-desc svelte-i5zuvk");
    			add_location(p, file, 34, 7, 1793);
    			attr_dev(div, "class", "skill-text svelte-i5zuvk");
    			attr_dev(div, "slot", "desc");
    			add_location(div, file, 32, 6, 1699);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_desc_slot_4.name,
    		type: "slot",
    		source: "(33:6) ",
    		ctx
    	});

    	return block;
    }

    // (39:6) 
    function create_icon_slot_3(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa fa-microphone svelte-i5zuvk");
    			attr_dev(i, "slot", "icon");
    			add_location(i, file, 38, 6, 1963);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot_3.name,
    		type: "slot",
    		source: "(39:6) ",
    		ctx
    	});

    	return block;
    }

    // (40:6) 
    function create_desc_slot_3(ctx) {
    	let div;
    	let h5;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			h5.textContent = "Communication";
    			t1 = space();
    			p = element("p");
    			p.textContent = "I am easy to get along with and enjoy meeting new people, but that doesn't mean I won't voice concerns when they present themselves.";
    			attr_dev(h5, "class", "skill-title svelte-i5zuvk");
    			add_location(h5, file, 40, 7, 2060);
    			attr_dev(p, "class", "skill-desc svelte-i5zuvk");
    			add_location(p, file, 41, 7, 2111);
    			attr_dev(div, "class", "skill-text svelte-i5zuvk");
    			attr_dev(div, "slot", "desc");
    			add_location(div, file, 39, 6, 2015);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_desc_slot_3.name,
    		type: "slot",
    		source: "(40:6) ",
    		ctx
    	});

    	return block;
    }

    // (46:6) 
    function create_icon_slot_2(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa fa-object-group svelte-i5zuvk");
    			attr_dev(i, "slot", "icon");
    			add_location(i, file, 45, 6, 2320);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot_2.name,
    		type: "slot",
    		source: "(46:6) ",
    		ctx
    	});

    	return block;
    }

    // (47:6) 
    function create_desc_slot_2(ctx) {
    	let div;
    	let h5;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			h5.textContent = "Design";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Passion for creating experiences that look great and work well. Focus is on a quality user experience and accesible solutions.";
    			attr_dev(h5, "class", "skill-title svelte-i5zuvk");
    			add_location(h5, file, 47, 7, 2419);
    			attr_dev(p, "class", "skill-desc svelte-i5zuvk");
    			add_location(p, file, 48, 7, 2463);
    			attr_dev(div, "class", "skill-text svelte-i5zuvk");
    			attr_dev(div, "slot", "desc");
    			add_location(div, file, 46, 6, 2374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_desc_slot_2.name,
    		type: "slot",
    		source: "(47:6) ",
    		ctx
    	});

    	return block;
    }

    // (53:6) 
    function create_icon_slot_1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa fa-folder-open svelte-i5zuvk");
    			attr_dev(i, "slot", "icon");
    			add_location(i, file, 52, 6, 2666);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot_1.name,
    		type: "slot",
    		source: "(53:6) ",
    		ctx
    	});

    	return block;
    }

    // (54:6) 
    function create_desc_slot_1(ctx) {
    	let div;
    	let h5;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			h5.textContent = "Organization";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Keeping an organized workspace makes for more efficient work. I like to make plans to keep myself moving forward.";
    			attr_dev(h5, "class", "skill-title svelte-i5zuvk");
    			add_location(h5, file, 54, 7, 2764);
    			attr_dev(p, "class", "skill-desc svelte-i5zuvk");
    			add_location(p, file, 55, 7, 2814);
    			attr_dev(div, "class", "skill-text svelte-i5zuvk");
    			attr_dev(div, "slot", "desc");
    			add_location(div, file, 53, 6, 2719);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_desc_slot_1.name,
    		type: "slot",
    		source: "(54:6) ",
    		ctx
    	});

    	return block;
    }

    // (60:6) 
    function create_icon_slot(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fa fa-graduation-cap svelte-i5zuvk");
    			attr_dev(i, "slot", "icon");
    			add_location(i, file, 59, 6, 3004);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot.name,
    		type: "slot",
    		source: "(60:6) ",
    		ctx
    	});

    	return block;
    }

    // (61:6) 
    function create_desc_slot(ctx) {
    	let div;
    	let h5;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			h5.textContent = "Quick Learner";
    			t1 = space();
    			p = element("p");
    			p.textContent = "There is no skill that cannot be learned through enough time and effort. When put in an unfamiliar position, I am quick to teach myself the concepts necessary to excel.";
    			attr_dev(h5, "class", "skill-title svelte-i5zuvk");
    			add_location(h5, file, 61, 7, 3105);
    			attr_dev(p, "class", "skill-desc svelte-i5zuvk");
    			add_location(p, file, 62, 7, 3156);
    			attr_dev(div, "class", "skill-text svelte-i5zuvk");
    			attr_dev(div, "slot", "desc");
    			add_location(div, file, 60, 6, 3060);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_desc_slot.name,
    		type: "slot",
    		source: "(61:6) ",
    		ctx
    	});

    	return block;
    }

    // (22:3) 
    function create_info_slot_2(ctx) {
    	let div1;
    	let h20;
    	let t1;
    	let infoblock;
    	let t2;
    	let h21;
    	let t4;
    	let div0;
    	let skill0;
    	let t5;
    	let skill1;
    	let t6;
    	let skill2;
    	let t7;
    	let skill3;
    	let t8;
    	let skill4;
    	let current;

    	infoblock = new InfoBlock({
    			props: {
    				title: "University of Notre Dame",
    				location: "Notre Dame, IN",
    				date: "Graduation Date: May 2022",
    				alt: "University of Notre Dame Logo",
    				src: /*NDsrc*/ ctx[2],
    				items: [
    					"Pursuing Bachelor of Science in Computer Engineering",
    					"GPA: 3.8",
    					"Dean's List: Fall 2019, Fall 2020, Spring 2021",
    					"Relevant Courses: Data Structures, Electric Circuit Analysis, Operating Systems, Data Science, Electronics, Systems Programming, Database Concepts, Computer Architecture, Cryptography, Logic Design, Discrete Mathematics, Introduction to Embedded Systems"
    				]
    			},
    			$$inline: true
    		});

    	skill0 = new Skill({
    			props: {
    				skill: "programming",
    				list_items: /*list_items*/ ctx[6],
    				$$slots: {
    					desc: [create_desc_slot_4],
    					icon: [create_icon_slot_4]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	skill1 = new Skill({
    			props: {
    				$$slots: {
    					desc: [create_desc_slot_3],
    					icon: [create_icon_slot_3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	skill2 = new Skill({
    			props: {
    				$$slots: {
    					desc: [create_desc_slot_2],
    					icon: [create_icon_slot_2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	skill3 = new Skill({
    			props: {
    				$$slots: {
    					desc: [create_desc_slot_1],
    					icon: [create_icon_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	skill4 = new Skill({
    			props: {
    				$$slots: {
    					desc: [create_desc_slot],
    					icon: [create_icon_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Education";
    			t1 = space();
    			create_component(infoblock.$$.fragment);
    			t2 = space();
    			h21 = element("h2");
    			h21.textContent = "Skills";
    			t4 = space();
    			div0 = element("div");
    			create_component(skill0.$$.fragment);
    			t5 = space();
    			create_component(skill1.$$.fragment);
    			t6 = space();
    			create_component(skill2.$$.fragment);
    			t7 = space();
    			create_component(skill3.$$.fragment);
    			t8 = space();
    			create_component(skill4.$$.fragment);
    			attr_dev(h20, "class", "svelte-i5zuvk");
    			add_location(h20, file, 22, 4, 953);
    			attr_dev(h21, "class", "svelte-i5zuvk");
    			add_location(h21, file, 28, 4, 1557);
    			attr_dev(div0, "class", "skills svelte-i5zuvk");
    			add_location(div0, file, 29, 4, 1578);
    			attr_dev(div1, "slot", "info");
    			add_location(div1, file, 21, 3, 930);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h20);
    			append_dev(div1, t1);
    			mount_component(infoblock, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, h21);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			mount_component(skill0, div0, null);
    			append_dev(div0, t5);
    			mount_component(skill1, div0, null);
    			append_dev(div0, t6);
    			mount_component(skill2, div0, null);
    			append_dev(div0, t7);
    			mount_component(skill3, div0, null);
    			append_dev(div0, t8);
    			mount_component(skill4, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const skill0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				skill0_changes.$$scope = { dirty, ctx };
    			}

    			skill0.$set(skill0_changes);
    			const skill1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				skill1_changes.$$scope = { dirty, ctx };
    			}

    			skill1.$set(skill1_changes);
    			const skill2_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				skill2_changes.$$scope = { dirty, ctx };
    			}

    			skill2.$set(skill2_changes);
    			const skill3_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				skill3_changes.$$scope = { dirty, ctx };
    			}

    			skill3.$set(skill3_changes);
    			const skill4_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				skill4_changes.$$scope = { dirty, ctx };
    			}

    			skill4.$set(skill4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infoblock.$$.fragment, local);
    			transition_in(skill0.$$.fragment, local);
    			transition_in(skill1.$$.fragment, local);
    			transition_in(skill2.$$.fragment, local);
    			transition_in(skill3.$$.fragment, local);
    			transition_in(skill4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infoblock.$$.fragment, local);
    			transition_out(skill0.$$.fragment, local);
    			transition_out(skill1.$$.fragment, local);
    			transition_out(skill2.$$.fragment, local);
    			transition_out(skill3.$$.fragment, local);
    			transition_out(skill4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(infoblock);
    			destroy_component(skill0);
    			destroy_component(skill1);
    			destroy_component(skill2);
    			destroy_component(skill3);
    			destroy_component(skill4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_info_slot_2.name,
    		type: "slot",
    		source: "(22:3) ",
    		ctx
    	});

    	return block;
    }

    // (119:3) 
    function create_section_title_slot_1(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "EXPERIENCE";
    			attr_dev(h1, "id", "experience");
    			attr_dev(h1, "slot", "section-title");
    			attr_dev(h1, "class", "svelte-i5zuvk");
    			add_location(h1, file, 118, 3, 5276);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_section_title_slot_1.name,
    		type: "slot",
    		source: "(119:3) ",
    		ctx
    	});

    	return block;
    }

    // (120:3) 
    function create_info_slot_1(ctx) {
    	let div;
    	let infoblock0;
    	let t0;
    	let infoblock1;
    	let t1;
    	let infoblock2;
    	let current;

    	infoblock0 = new InfoBlock({
    			props: {
    				title: "Marketing Site Development",
    				location: "Rochester, NY (Remote)",
    				date: "June 2021 - August 2021",
    				alt: "Tattle Inc Logo",
    				src: /*Tattlesrc*/ ctx[3],
    				items: [
    					"Launched marketing website redesign from scratch using HTML, CSS, and Javascript inside a Svelte application",
    					"Created and managed backend for form submission using AWS DynamoDB, Lambda, and API Gateway",
    					"Communicated closely with UI/UX designer and other engineers to build site to design specifications",
    					"Worked alongside engineering team in Scrumban development environment",
    					"Showcased website advancement to wider organization in multiple team demonstrations"
    				]
    			},
    			$$inline: true
    		});

    	infoblock1 = new InfoBlock({
    			props: {
    				title: "Campus Wayzz Mobile Application",
    				location: "Notre Dame, IN",
    				date: "Spring 2021",
    				alt: "Campus Wayzz Logo",
    				src: /*CWsrc*/ ctx[4],
    				items: [
    					"Designed UI/UX for campus mapping application",
    					"Built frontend screens for app from scratch using JavaScript and the JavaScript React library",
    					"Linked user profile information to backend MongoDB database"
    				]
    			},
    			$$inline: true
    		});

    	infoblock2 = new InfoBlock({
    			props: {
    				title: "Tweet Classification",
    				location: "Notre Dame, IN",
    				date: "Fall 2020",
    				alt: "Twitter Logo",
    				src: /*Twittersrc*/ ctx[5],
    				items: [
    					"Collaborated with team members to identify a twitter user’s political affiliation using twitter data",
    					"Assembled relevant datasets and produced cleaned data sets for ease of use in modeling",
    					"Incorporated decision tree algorithms for tweet classification using Python"
    				]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(infoblock0.$$.fragment);
    			t0 = space();
    			create_component(infoblock1.$$.fragment);
    			t1 = space();
    			create_component(infoblock2.$$.fragment);
    			attr_dev(div, "slot", "info");
    			add_location(div, file, 119, 3, 5337);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(infoblock0, div, null);
    			append_dev(div, t0);
    			mount_component(infoblock1, div, null);
    			append_dev(div, t1);
    			mount_component(infoblock2, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infoblock0.$$.fragment, local);
    			transition_in(infoblock1.$$.fragment, local);
    			transition_in(infoblock2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infoblock0.$$.fragment, local);
    			transition_out(infoblock1.$$.fragment, local);
    			transition_out(infoblock2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(infoblock0);
    			destroy_component(infoblock1);
    			destroy_component(infoblock2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_info_slot_1.name,
    		type: "slot",
    		source: "(120:3) ",
    		ctx
    	});

    	return block;
    }

    // (142:3) 
    function create_section_title_slot(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "CONTACT ME";
    			attr_dev(h1, "id", "contact");
    			attr_dev(h1, "slot", "section-title");
    			attr_dev(h1, "class", "svelte-i5zuvk");
    			add_location(h1, file, 141, 3, 6972);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_section_title_slot.name,
    		type: "slot",
    		source: "(142:3) ",
    		ctx
    	});

    	return block;
    }

    // (143:3) 
    function create_info_slot(ctx) {
    	let div1;
    	let div0;
    	let h2;
    	let t1;
    	let h30;
    	let t3;
    	let h40;
    	let t5;
    	let h41;
    	let t7;
    	let h31;
    	let t9;
    	let footer;
    	let current;

    	footer = new Footer({
    			props: { top_button_present: false },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Ross McIlvaine";
    			t1 = space();
    			h30 = element("h3");
    			h30.textContent = "You Can Reach Me Here:";
    			t3 = space();
    			h40 = element("h4");
    			h40.textContent = "rossmcilvaine@gmail.com";
    			t5 = space();
    			h41 = element("h4");
    			h41.textContent = "111 North St Peter St - South Bend, IN 46617";
    			t7 = space();
    			h31 = element("h3");
    			h31.textContent = "Or Check Out My Socials:";
    			t9 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(h2, "class", "svelte-i5zuvk");
    			add_location(h2, file, 144, 5, 7085);
    			attr_dev(h30, "class", "svelte-i5zuvk");
    			add_location(h30, file, 145, 5, 7115);
    			attr_dev(h40, "class", "svelte-i5zuvk");
    			add_location(h40, file, 146, 5, 7153);
    			attr_dev(h41, "class", "svelte-i5zuvk");
    			add_location(h41, file, 147, 5, 7192);
    			attr_dev(h31, "class", "svelte-i5zuvk");
    			add_location(h31, file, 148, 5, 7252);
    			attr_dev(div0, "class", "contact-box svelte-i5zuvk");
    			add_location(div0, file, 143, 4, 7053);
    			attr_dev(div1, "slot", "info");
    			add_location(div1, file, 142, 3, 7030);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			append_dev(div0, h30);
    			append_dev(div0, t3);
    			append_dev(div0, h40);
    			append_dev(div0, t5);
    			append_dev(div0, h41);
    			append_dev(div0, t7);
    			append_dev(div0, h31);
    			append_dev(div1, t9);
    			mount_component(footer, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_info_slot.name,
    		type: "slot",
    		source: "(143:3) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t3;
    	let h2;
    	let a0;
    	let t5;
    	let a1;
    	let t7;
    	let a2;
    	let t9;
    	let div0;
    	let halfscreen0;
    	let t10;
    	let div1;
    	let halfscreen1;
    	let t11;
    	let div2;
    	let halfscreen2;
    	let current;

    	halfscreen0 = new HalfScreen({
    			props: {
    				block_type: 'resume',
    				$$slots: {
    					info: [create_info_slot_2],
    					photo: [create_photo_slot],
    					"section-title": [create_section_title_slot_2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	halfscreen1 = new HalfScreen({
    			props: {
    				$$slots: {
    					info: [create_info_slot_1],
    					"section-title": [create_section_title_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	halfscreen2 = new HalfScreen({
    			props: {
    				block_type: 'contact',
    				$$slots: {
    					info: [create_info_slot],
    					"section-title": [create_section_title_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = `Hello, I'm ${/*name*/ ctx[0]}!`;
    			t3 = space();
    			h2 = element("h2");
    			a0 = element("a");
    			a0.textContent = "ABOUT ME";
    			t5 = text(" / ");
    			a1 = element("a");
    			a1.textContent = "EXPERIENCE";
    			t7 = text(" / ");
    			a2 = element("a");
    			a2.textContent = "CONTACT ME";
    			t9 = space();
    			div0 = element("div");
    			create_component(halfscreen0.$$.fragment);
    			t10 = space();
    			div1 = element("div");
    			create_component(halfscreen1.$$.fragment);
    			t11 = space();
    			div2 = element("div");
    			create_component(halfscreen2.$$.fragment);
    			attr_dev(h1, "class", "svelte-i5zuvk");
    			add_location(h1, file, 15, 1, 582);
    			attr_dev(a0, "href", "#about-block");
    			add_location(a0, file, 16, 5, 616);
    			attr_dev(a1, "href", "#experience-block");
    			add_location(a1, file, 16, 43, 654);
    			attr_dev(a2, "href", "#contact-block");
    			add_location(a2, file, 16, 88, 699);
    			attr_dev(h2, "class", "svelte-i5zuvk");
    			add_location(h2, file, 16, 1, 612);
    			attr_dev(div0, "id", "about-block");
    			add_location(div0, file, 17, 1, 746);
    			attr_dev(div1, "id", "experience-block");
    			add_location(div1, file, 116, 1, 5228);
    			attr_dev(div2, "id", "contact-block");
    			add_location(div2, file, 139, 1, 6904);
    			attr_dev(main, "class", "svelte-i5zuvk");
    			add_location(main, file, 14, 0, 573);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t3);
    			append_dev(main, h2);
    			append_dev(h2, a0);
    			append_dev(h2, t5);
    			append_dev(h2, a1);
    			append_dev(h2, t7);
    			append_dev(h2, a2);
    			append_dev(main, t9);
    			append_dev(main, div0);
    			mount_component(halfscreen0, div0, null);
    			append_dev(main, t10);
    			append_dev(main, div1);
    			mount_component(halfscreen1, div1, null);
    			append_dev(main, t11);
    			append_dev(main, div2);
    			mount_component(halfscreen2, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const halfscreen0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				halfscreen0_changes.$$scope = { dirty, ctx };
    			}

    			halfscreen0.$set(halfscreen0_changes);
    			const halfscreen1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				halfscreen1_changes.$$scope = { dirty, ctx };
    			}

    			halfscreen1.$set(halfscreen1_changes);
    			const halfscreen2_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				halfscreen2_changes.$$scope = { dirty, ctx };
    			}

    			halfscreen2.$set(halfscreen2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(halfscreen0.$$.fragment, local);
    			transition_in(halfscreen1.$$.fragment, local);
    			transition_in(halfscreen2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(halfscreen0.$$.fragment, local);
    			transition_out(halfscreen1.$$.fragment, local);
    			transition_out(halfscreen2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(halfscreen0);
    			destroy_component(halfscreen1);
    			destroy_component(halfscreen2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let name = "Ross McIlvaine";
    	let Profilesrc = './images/ProfilePic.jpg';
    	let NDsrc = './images/ND.png';
    	let Tattlesrc = './images/tattle_logo.png';
    	let CWsrc = './images/CW_logo.JPG';
    	let Twittersrc = './images/twitter.png';
    	let list_items = ['C/C++', 'Python', 'SQL', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'AWS'];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Footer,
    		HalfScreen,
    		InfoBlock,
    		Skill,
    		name,
    		Profilesrc,
    		NDsrc,
    		Tattlesrc,
    		CWsrc,
    		Twittersrc,
    		list_items
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('Profilesrc' in $$props) $$invalidate(1, Profilesrc = $$props.Profilesrc);
    		if ('NDsrc' in $$props) $$invalidate(2, NDsrc = $$props.NDsrc);
    		if ('Tattlesrc' in $$props) $$invalidate(3, Tattlesrc = $$props.Tattlesrc);
    		if ('CWsrc' in $$props) $$invalidate(4, CWsrc = $$props.CWsrc);
    		if ('Twittersrc' in $$props) $$invalidate(5, Twittersrc = $$props.Twittersrc);
    		if ('list_items' in $$props) $$invalidate(6, list_items = $$props.list_items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, Profilesrc, NDsrc, Tattlesrc, CWsrc, Twittersrc, list_items];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
