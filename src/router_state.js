/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PRIMARY_OUTLET } from './shared';
import { UrlSegment, equalSegments } from './url_tree';
import { merge, shallowEqual, shallowEqualArrays } from './utils/collection';
import { Tree, TreeNode } from './utils/tree';
/**
 *
 *
 * ```
 * class MyComponent {
 *   constructor(router: Router) {
 *     const state: RouterState = router.routerState;
 *     const root: ActivatedRoute = state.root;
 *     const child = root.firstChild;
 *     const id: Observable<string> = child.params.map(p => p.id);
 *     //...
 *   }
 * }
 * ```
 *
 * RouterState is a tree of activated routes. Every node in this tree knows about the "consumed" URL
 * segments,
 * the extracted parameters, and the resolved data.
 *
 * See {\@link ActivatedRoute} for more information.
 *
 */
export class RouterState extends Tree {
    /**
     * @param {?} root
     * @param {?} snapshot
     */
    constructor(root, snapshot) {
        super(root);
        this.snapshot = snapshot;
        setRouterStateSnapshot(this, root);
    }
    /**
     * @return {?}
     */
    toString() { return this.snapshot.toString(); }
}
function RouterState_tsickle_Closure_declarations() {
    /**
     * The current snapshot of the router state
     * @type {?}
     */
    RouterState.prototype.snapshot;
}
/**
 * @param {?} urlTree
 * @param {?} rootComponent
 * @return {?}
 */
export function createEmptyState(urlTree, rootComponent) {
    const /** @type {?} */ snapshot = createEmptyStateSnapshot(urlTree, rootComponent);
    const /** @type {?} */ emptyUrl = new BehaviorSubject([new UrlSegment('', {})]);
    const /** @type {?} */ emptyParams = new BehaviorSubject({});
    const /** @type {?} */ emptyData = new BehaviorSubject({});
    const /** @type {?} */ emptyQueryParams = new BehaviorSubject({});
    const /** @type {?} */ fragment = new BehaviorSubject('');
    const /** @type {?} */ activated = new ActivatedRoute(emptyUrl, emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, snapshot.root);
    activated.snapshot = snapshot.root;
    return new RouterState(new TreeNode(activated, []), snapshot);
}
/**
 * @param {?} urlTree
 * @param {?} rootComponent
 * @return {?}
 */
export function createEmptyStateSnapshot(urlTree, rootComponent) {
    const /** @type {?} */ emptyParams = {};
    const /** @type {?} */ emptyData = {};
    const /** @type {?} */ emptyQueryParams = {};
    const /** @type {?} */ fragment = '';
    const /** @type {?} */ activated = new ActivatedRouteSnapshot([], emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, null, urlTree.root, -1, {});
    return new RouterStateSnapshot('', new TreeNode(activated, []));
}
/**
 * outlet.
 * An `ActivatedRoute` can also be used to traverse the router state tree.
 *
 *
 * ```
 * class MyComponent {
 *   constructor(route: ActivatedRoute) {
 *     const id: Observable<string> = route.params.map(p => p.id);
 *     const url: Observable<string> = route.url.map(segments => segments.join(''));
 *     // route.data includes both `data` and `resolve`
 *     const user = route.data.map(d => d.user);
 *   }
 * }
 * ```
 *
 */
export class ActivatedRoute {
    /**
     * @param {?} url
     * @param {?} params
     * @param {?} queryParams
     * @param {?} fragment
     * @param {?} data
     * @param {?} outlet
     * @param {?} component
     * @param {?} futureSnapshot
     */
    constructor(url, params, queryParams, fragment, data, outlet, component, futureSnapshot) {
        this.url = url;
        this.params = params;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.data = data;
        this.outlet = outlet;
        this.component = component;
        this._futureSnapshot = futureSnapshot;
    }
    /**
     * The configuration used to match this route
     * @return {?}
     */
    get routeConfig() { return this._futureSnapshot.routeConfig; }
    /**
     * The root of the router state
     * @return {?}
     */
    get root() { return this._routerState.root; }
    /**
     * The parent of this route in the router state tree
     * @return {?}
     */
    get parent() { return this._routerState.parent(this); }
    /**
     * The first child of this route in the router state tree
     * @return {?}
     */
    get firstChild() { return this._routerState.firstChild(this); }
    /**
     * The children of this route in the router state tree
     * @return {?}
     */
    get children() { return this._routerState.children(this); }
    /**
     * The path from the root of the router state tree to this route
     * @return {?}
     */
    get pathFromRoot() { return this._routerState.pathFromRoot(this); }
    /**
     * @return {?}
     */
    toString() {
        return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
    }
}
function ActivatedRoute_tsickle_Closure_declarations() {
    /**
     * The current snapshot of this route
     * @type {?}
     */
    ActivatedRoute.prototype.snapshot;
    /** @type {?} */
    ActivatedRoute.prototype._futureSnapshot;
    /** @type {?} */
    ActivatedRoute.prototype._routerState;
    /**
     * An observable of the URL segments matched by this route
     * @type {?}
     */
    ActivatedRoute.prototype.url;
    /**
     * An observable of the matrix parameters scoped to this route
     * @type {?}
     */
    ActivatedRoute.prototype.params;
    /**
     * An observable of the query parameters shared by all the routes
     * @type {?}
     */
    ActivatedRoute.prototype.queryParams;
    /**
     * An observable of the URL fragment shared by all the routes
     * @type {?}
     */
    ActivatedRoute.prototype.fragment;
    /**
     * An observable of the static and resolved data of this route.
     * @type {?}
     */
    ActivatedRoute.prototype.data;
    /**
     * The outlet name of the route. It's a constant
     * @type {?}
     */
    ActivatedRoute.prototype.outlet;
    /** @type {?} */
    ActivatedRoute.prototype.component;
}
/**
 * @param {?} route
 * @return {?}
 */
export function inheritedParamsDataResolve(route) {
    const /** @type {?} */ pathToRoot = route.pathFromRoot;
    let /** @type {?} */ inhertingStartingFrom = pathToRoot.length - 1;
    while (inhertingStartingFrom >= 1) {
        const /** @type {?} */ current = pathToRoot[inhertingStartingFrom];
        const /** @type {?} */ parent = pathToRoot[inhertingStartingFrom - 1];
        // current route is an empty path => inherits its parent's params and data
        if (current.routeConfig && current.routeConfig.path === '') {
            inhertingStartingFrom--;
        }
        else if (!parent.component) {
            inhertingStartingFrom--;
        }
        else {
            break;
        }
    }
    return pathToRoot.slice(inhertingStartingFrom).reduce((res, curr) => {
        const /** @type {?} */ params = merge(res.params, curr.params);
        const /** @type {?} */ data = merge(res.data, curr.data);
        const /** @type {?} */ resolve = merge(res.resolve, curr._resolvedData);
        return { params, data, resolve };
    }, /** @type {?} */ ({ params: {}, data: {}, resolve: {} }));
}
/**
 * outlet
 * at a particular moment in time. ActivatedRouteSnapshot can also be used to traverse the router
 * state tree.
 *
 *
 * ```
 * class MyComponent {
 *   constructor(route: ActivatedRoute) {
 *     const id: string = route.snapshot.params.id;
 *     const url: string = route.snapshot.url.join('');
 *     const user = route.snapshot.data.user;
 *   }
 * }
 * ```
 *
 */
export class ActivatedRouteSnapshot {
    /**
     * @param {?} url
     * @param {?} params
     * @param {?} queryParams
     * @param {?} fragment
     * @param {?} data
     * @param {?} outlet
     * @param {?} component
     * @param {?} routeConfig
     * @param {?} urlSegment
     * @param {?} lastPathIndex
     * @param {?} resolve
     */
    constructor(url, params, queryParams, fragment, data, outlet, component, routeConfig, urlSegment, lastPathIndex, resolve) {
        this.url = url;
        this.params = params;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.data = data;
        this.outlet = outlet;
        this.component = component;
        this._routeConfig = routeConfig;
        this._urlSegment = urlSegment;
        this._lastPathIndex = lastPathIndex;
        this._resolve = resolve;
    }
    /**
     * The configuration used to match this route
     * @return {?}
     */
    get routeConfig() { return this._routeConfig; }
    /**
     * The root of the router state
     * @return {?}
     */
    get root() { return this._routerState.root; }
    /**
     * The parent of this route in the router state tree
     * @return {?}
     */
    get parent() { return this._routerState.parent(this); }
    /**
     * The first child of this route in the router state tree
     * @return {?}
     */
    get firstChild() { return this._routerState.firstChild(this); }
    /**
     * The children of this route in the router state tree
     * @return {?}
     */
    get children() { return this._routerState.children(this); }
    /**
     * The path from the root of the router state tree to this route
     * @return {?}
     */
    get pathFromRoot() { return this._routerState.pathFromRoot(this); }
    /**
     * @return {?}
     */
    toString() {
        const /** @type {?} */ url = this.url.map(segment => segment.toString()).join('/');
        const /** @type {?} */ matched = this._routeConfig ? this._routeConfig.path : '';
        return `Route(url:'${url}', path:'${matched}')`;
    }
}
function ActivatedRouteSnapshot_tsickle_Closure_declarations() {
    /** @type {?} */
    ActivatedRouteSnapshot.prototype._routeConfig;
    /** @type {?} */
    ActivatedRouteSnapshot.prototype._urlSegment;
    /** @type {?} */
    ActivatedRouteSnapshot.prototype._lastPathIndex;
    /** @type {?} */
    ActivatedRouteSnapshot.prototype._resolve;
    /** @type {?} */
    ActivatedRouteSnapshot.prototype._resolvedData;
    /** @type {?} */
    ActivatedRouteSnapshot.prototype._routerState;
    /**
     * The URL segments matched by this route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.url;
    /**
     * The matrix parameters scoped to this route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.params;
    /**
     * The query parameters shared by all the routes
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.queryParams;
    /**
     * The URL fragment shared by all the routes
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.fragment;
    /**
     * The static and resolved data of this route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.data;
    /**
     * The outlet name of the route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.outlet;
    /**
     * The component of the route
     * @type {?}
     */
    ActivatedRouteSnapshot.prototype.component;
}
/**
 *
 *
 * ```
 * class MyComponent {
 *   constructor(router: Router) {
 *     const state: RouterState = router.routerState;
 *     const snapshot: RouterStateSnapshot = state.snapshot;
 *     const root: ActivatedRouteSnapshot = snapshot.root;
 *     const child = root.firstChild;
 *     const id: Observable<string> = child.params.map(p => p.id);
 *     //...
 *   }
 * }
 * ```
 *
 * RouterStateSnapshot is a tree of activated route snapshots. Every node in this tree knows about
 * the "consumed" URL segments, the extracted parameters, and the resolved data.
 *
 */
export class RouterStateSnapshot extends Tree {
    /**
     * @param {?} url
     * @param {?} root
     */
    constructor(url, root) {
        super(root);
        this.url = url;
        setRouterStateSnapshot(this, root);
    }
    /**
     * @return {?}
     */
    toString() { return serializeNode(this._root); }
}
function RouterStateSnapshot_tsickle_Closure_declarations() {
    /**
     * The url from which this snapshot was created
     * @type {?}
     */
    RouterStateSnapshot.prototype.url;
}
/**
 * @param {?} state
 * @param {?} node
 * @return {?}
 */
function setRouterStateSnapshot(state, node) {
    node.value._routerState = state;
    node.children.forEach(c => setRouterStateSnapshot(state, c));
}
/**
 * @param {?} node
 * @return {?}
 */
function serializeNode(node) {
    const /** @type {?} */ c = node.children.length > 0 ? ` { ${node.children.map(serializeNode).join(", ")} } ` : '';
    return `${node.value}${c}`;
}
/**
 * The expectation is that the activate route is created with the right set of parameters.
 * So we push new values into the observables only when they are not the initial values.
 * And we detect that by checking if the snapshot field is set.
 * @param {?} route
 * @return {?}
 */
export function advanceActivatedRoute(route) {
    if (route.snapshot) {
        if (!shallowEqual(route.snapshot.queryParams, route._futureSnapshot.queryParams)) {
            ((route.queryParams)).next(route._futureSnapshot.queryParams);
        }
        if (route.snapshot.fragment !== route._futureSnapshot.fragment) {
            ((route.fragment)).next(route._futureSnapshot.fragment);
        }
        if (!shallowEqual(route.snapshot.params, route._futureSnapshot.params)) {
            ((route.params)).next(route._futureSnapshot.params);
        }
        if (!shallowEqualArrays(route.snapshot.url, route._futureSnapshot.url)) {
            ((route.url)).next(route._futureSnapshot.url);
        }
        if (!equalParamsAndUrlSegments(route.snapshot, route._futureSnapshot)) {
            ((route.data)).next(route._futureSnapshot.data);
        }
        route.snapshot = route._futureSnapshot;
    }
    else {
        route.snapshot = route._futureSnapshot;
        // this is for resolved data
        ((route.data)).next(route._futureSnapshot.data);
    }
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
export function equalParamsAndUrlSegments(a, b) {
    return shallowEqual(a.params, b.params) && equalSegments(a.url, b.url);
}
//# sourceMappingURL=router_state.js.map