module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(622);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 2:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getFirstPage

const getPage = __webpack_require__(22)

function getFirstPage (octokit, link, headers) {
  return getPage(octokit, link, 'first', headers)
}


/***/ }),

/***/ 5:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = octokitValidate;

const validate = __webpack_require__(627);

function octokitValidate(octokit) {
  octokit.hook.before("request", validate.bind(null, octokit));
}


/***/ }),

/***/ 7:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const url = __webpack_require__(835);
const http = __webpack_require__(605);
const https = __webpack_require__(211);
const pm = __webpack_require__(132);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(url.parse(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [HttpCodes.MovedPermanently, HttpCodes.ResourceMoved, HttpCodes.SeeOther, HttpCodes.TemporaryRedirect, HttpCodes.PermanentRedirect];
const HttpResponseRetryCodes = [HttpCodes.BadGateway, HttpCodes.ServiceUnavailable, HttpCodes.GatewayTimeout];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = url.parse(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error("Client has already been disposed.");
        }
        let parsedUrl = url.parse(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = (this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1) ? this._maxRetries + 1 : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response && response.message && response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1
                && this._allowRedirects
                && redirectsRemaining > 0) {
                const redirectUrl = response.message.headers["location"];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = url.parse(redirectUrl);
                if (parsedUrl.protocol == 'https:' && parsedUrl.protocol != parsedRedirectUrl.protocol && !this._allowRedirectDowngrade) {
                    throw new Error("Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.");
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof (data) === 'string') {
            info.options.headers["Content-Length"] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', (sock) => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof (data) === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof (data) !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = url.parse(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port ? parseInt(info.parsedUrl.port) : defaultPort;
        info.options.path = (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers["user-agent"] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach((handler) => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __webpack_require__(252);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    proxyAuth: proxyUrl.auth,
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                },
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, { rejectUnauthorized: false });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = "Failed request: (" + statusCode + ")";
                }
                let err = new Error(msg);
                // attach statusCode and body obj (if available) to the error object
                err['statusCode'] = statusCode;
                if (response.result) {
                    err['result'] = response.result;
                }
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 15:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasLastPage

const deprecate = __webpack_require__(307)
const getPageLinks = __webpack_require__(327)

function hasLastPage (link) {
  deprecate(`octokit.hasLastPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).last
}


/***/ }),

/***/ 16:
/***/ (function(module) {

module.exports = require("tls");

/***/ }),

/***/ 17:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

const VERSION = "1.1.2";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint:
 *
 * - https://developer.github.com/v3/search/#example (key `items`)
 * - https://developer.github.com/v3/checks/runs/#response-3 (key: `check_runs`)
 * - https://developer.github.com/v3/checks/suites/#response-1 (key: `check_suites`)
 * - https://developer.github.com/v3/apps/installations/#list-repositories (key: `repositories`)
 * - https://developer.github.com/v3/apps/installations/#list-installations-for-a-user (key `installations`)
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not. For the exceptions with the namespace, a fallback check for the route
 * paths has to be added in order to normalize the response. We cannot check for the total_count
 * property because it also exists in the response of Get the combined status for a specific ref.
 */
const REGEX = [/^\/search\//, /^\/repos\/[^/]+\/[^/]+\/commits\/[^/]+\/(check-runs|check-suites)([^/]|$)/, /^\/installation\/repositories([^/]|$)/, /^\/user\/installations([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/secrets([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/workflows(\/[^/]+\/runs)?([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/runs(\/[^/]+\/(artifacts|jobs))?([^/]|$)/];
function normalizePaginatedListResponse(octokit, url, response) {
  const path = url.replace(octokit.request.endpoint.DEFAULTS.baseUrl, "");
  const responseNeedsNormalization = REGEX.find(regex => regex.test(path));
  if (!responseNeedsNormalization) return; // keep the additional properties intact as there is currently no other way
  // to retrieve the same information.

  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;

  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }

  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }

  response.data.total_count = totalCount;
  Object.defineProperty(response.data, namespaceKey, {
    get() {
      octokit.log.warn(`[@octokit/paginate-rest] "response.data.${namespaceKey}" is deprecated for "GET ${path}". Get the results directly from "response.data"`);
      return Array.from(data);
    }

  });
}

function iterator(octokit, route, parameters) {
  const options = octokit.request.endpoint(route, parameters);
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      next() {
        if (!url) {
          return Promise.resolve({
            done: true
          });
        }

        return octokit.request({
          method,
          url,
          headers
        }).then(response => {
          normalizePaginatedListResponse(octokit, url, response); // `response.headers.link` format:
          // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
          // sets `url` to undefined if "next" URL is not present or `link` header is not set

          url = ((response.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
          return {
            value: response
          };
        });
      }

    })
  };
}

function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = undefined;
  }

  return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}

function gather(octokit, results, iterator, mapFn) {
  return iterator.next().then(result => {
    if (result.done) {
      return results;
    }

    let earlyExit = false;

    function done() {
      earlyExit = true;
    }

    results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);

    if (earlyExit) {
      return results;
    }

    return gather(octokit, results, iterator, mapFn);
  });
}

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION;

exports.paginateRest = paginateRest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 18:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationRequestError;

const { RequestError } = __webpack_require__(552);

function authenticationRequestError(state, error, options) {
  /* istanbul ignore next */
  if (!error.headers) throw error;

  const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error;
  }

  if (
    error.status === 401 &&
    otpRequired &&
    error.request &&
    error.request.headers["x-github-otp"]
  ) {
    throw new RequestError(
      "Invalid one-time password for two-factor authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  if (typeof state.auth.on2fa !== "function") {
    throw new RequestError(
      "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa();
    })
    .then(oneTimePassword => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(
          { "x-github-otp": oneTimePassword },
          options.headers
        )
      });
      return state.octokit.request(newOptions);
    });
}


/***/ }),

/***/ 19:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var deprecation = __webpack_require__(593);

var endpointsByScope = {
  actions: {
    cancelWorkflowRun: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/cancel"
    },
    createOrUpdateSecretForRepo: {
      method: "PUT",
      params: {
        encrypted_value: {
          type: "string"
        },
        key_id: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/:name"
    },
    createRegistrationToken: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/registration-token"
    },
    createRemoveToken: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/remove-token"
    },
    deleteArtifact: {
      method: "DELETE",
      params: {
        artifact_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
    },
    deleteSecretFromRepo: {
      method: "DELETE",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/:name"
    },
    downloadArtifact: {
      method: "GET",
      params: {
        archive_format: {
          required: true,
          type: "string"
        },
        artifact_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/artifacts/:artifact_id/:archive_format"
    },
    getArtifact: {
      method: "GET",
      params: {
        artifact_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
    },
    getPublicKey: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/public-key"
    },
    getSecret: {
      method: "GET",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/:name"
    },
    getSelfHostedRunner: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        runner_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/:runner_id"
    },
    getWorkflow: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        workflow_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/workflows/:workflow_id"
    },
    getWorkflowJob: {
      method: "GET",
      params: {
        job_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/jobs/:job_id"
    },
    getWorkflowRun: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id"
    },
    listDownloadsForSelfHostedRunnerApplication: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/downloads"
    },
    listJobsForWorkflowRun: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/jobs"
    },
    listRepoWorkflowRuns: {
      method: "GET",
      params: {
        actor: {
          type: "string"
        },
        branch: {
          type: "string"
        },
        event: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["completed", "status", "conclusion"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runs"
    },
    listRepoWorkflows: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/workflows"
    },
    listSecretsForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets"
    },
    listSelfHostedRunnersForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners"
    },
    listWorkflowJobLogs: {
      method: "GET",
      params: {
        job_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/jobs/:job_id/logs"
    },
    listWorkflowRunArtifacts: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/artifacts"
    },
    listWorkflowRunLogs: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/logs"
    },
    listWorkflowRuns: {
      method: "GET",
      params: {
        actor: {
          type: "string"
        },
        branch: {
          type: "string"
        },
        event: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["completed", "status", "conclusion"],
          type: "string"
        },
        workflow_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/workflows/:workflow_id/runs"
    },
    reRunWorkflow: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/rerun"
    },
    removeSelfHostedRunner: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        runner_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/:runner_id"
    }
  },
  activity: {
    checkStarringRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/user/starred/:owner/:repo"
    },
    deleteRepoSubscription: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/subscription"
    },
    deleteThreadSubscription: {
      method: "DELETE",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id/subscription"
    },
    getRepoSubscription: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/subscription"
    },
    getThread: {
      method: "GET",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id"
    },
    getThreadSubscription: {
      method: "GET",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id/subscription"
    },
    listEventsForOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/events/orgs/:org"
    },
    listEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/events"
    },
    listFeeds: {
      method: "GET",
      params: {},
      url: "/feeds"
    },
    listNotifications: {
      method: "GET",
      params: {
        all: {
          type: "boolean"
        },
        before: {
          type: "string"
        },
        page: {
          type: "integer"
        },
        participating: {
          type: "boolean"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/notifications"
    },
    listNotificationsForRepo: {
      method: "GET",
      params: {
        all: {
          type: "boolean"
        },
        before: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        participating: {
          type: "boolean"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/notifications"
    },
    listPublicEvents: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/events"
    },
    listPublicEventsForOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/events"
    },
    listPublicEventsForRepoNetwork: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/networks/:owner/:repo/events"
    },
    listPublicEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/events/public"
    },
    listReceivedEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/received_events"
    },
    listReceivedPublicEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/received_events/public"
    },
    listRepoEvents: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/events"
    },
    listReposStarredByAuthenticatedUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/user/starred"
    },
    listReposStarredByUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/starred"
    },
    listReposWatchedByUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/subscriptions"
    },
    listStargazersForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stargazers"
    },
    listWatchedReposForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/subscriptions"
    },
    listWatchersForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/subscribers"
    },
    markAsRead: {
      method: "PUT",
      params: {
        last_read_at: {
          type: "string"
        }
      },
      url: "/notifications"
    },
    markNotificationsAsReadForRepo: {
      method: "PUT",
      params: {
        last_read_at: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/notifications"
    },
    markThreadAsRead: {
      method: "PATCH",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id"
    },
    setRepoSubscription: {
      method: "PUT",
      params: {
        ignored: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        subscribed: {
          type: "boolean"
        }
      },
      url: "/repos/:owner/:repo/subscription"
    },
    setThreadSubscription: {
      method: "PUT",
      params: {
        ignored: {
          type: "boolean"
        },
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id/subscription"
    },
    starRepo: {
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/user/starred/:owner/:repo"
    },
    unstarRepo: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/user/starred/:owner/:repo"
    }
  },
  apps: {
    addRepoToInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "PUT",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        repository_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/installations/:installation_id/repositories/:repository_id"
    },
    checkAccountIsAssociatedWithAny: {
      method: "GET",
      params: {
        account_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/marketplace_listing/accounts/:account_id"
    },
    checkAccountIsAssociatedWithAnyStubbed: {
      method: "GET",
      params: {
        account_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/marketplace_listing/stubbed/accounts/:account_id"
    },
    checkAuthorization: {
      deprecated: "octokit.apps.checkAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#check-an-authorization",
      method: "GET",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    checkToken: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "POST",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/token"
    },
    createContentAttachment: {
      headers: {
        accept: "application/vnd.github.corsair-preview+json"
      },
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        content_reference_id: {
          required: true,
          type: "integer"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/content_references/:content_reference_id/attachments"
    },
    createFromManifest: {
      headers: {
        accept: "application/vnd.github.fury-preview+json"
      },
      method: "POST",
      params: {
        code: {
          required: true,
          type: "string"
        }
      },
      url: "/app-manifests/:code/conversions"
    },
    createInstallationToken: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "POST",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        permissions: {
          type: "object"
        },
        repository_ids: {
          type: "integer[]"
        }
      },
      url: "/app/installations/:installation_id/access_tokens"
    },
    deleteAuthorization: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "DELETE",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/grant"
    },
    deleteInstallation: {
      headers: {
        accept: "application/vnd.github.gambit-preview+json,application/vnd.github.machine-man-preview+json"
      },
      method: "DELETE",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/app/installations/:installation_id"
    },
    deleteToken: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "DELETE",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/token"
    },
    findOrgInstallation: {
      deprecated: "octokit.apps.findOrgInstallation() has been renamed to octokit.apps.getOrgInstallation() (2019-04-10)",
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/installation"
    },
    findRepoInstallation: {
      deprecated: "octokit.apps.findRepoInstallation() has been renamed to octokit.apps.getRepoInstallation() (2019-04-10)",
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/installation"
    },
    findUserInstallation: {
      deprecated: "octokit.apps.findUserInstallation() has been renamed to octokit.apps.getUserInstallation() (2019-04-10)",
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/installation"
    },
    getAuthenticated: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {},
      url: "/app"
    },
    getBySlug: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        app_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/apps/:app_slug"
    },
    getInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/app/installations/:installation_id"
    },
    getOrgInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/installation"
    },
    getRepoInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/installation"
    },
    getUserInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/installation"
    },
    listAccountsUserOrOrgOnPlan: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        plan_id: {
          required: true,
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/marketplace_listing/plans/:plan_id/accounts"
    },
    listAccountsUserOrOrgOnPlanStubbed: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        plan_id: {
          required: true,
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/marketplace_listing/stubbed/plans/:plan_id/accounts"
    },
    listInstallationReposForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/installations/:installation_id/repositories"
    },
    listInstallations: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/app/installations"
    },
    listInstallationsForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/installations"
    },
    listMarketplacePurchasesForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/marketplace_purchases"
    },
    listMarketplacePurchasesForAuthenticatedUserStubbed: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/marketplace_purchases/stubbed"
    },
    listPlans: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/marketplace_listing/plans"
    },
    listPlansStubbed: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/marketplace_listing/stubbed/plans"
    },
    listRepos: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/installation/repositories"
    },
    removeRepoFromInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "DELETE",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        repository_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/installations/:installation_id/repositories/:repository_id"
    },
    resetAuthorization: {
      deprecated: "octokit.apps.resetAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#reset-an-authorization",
      method: "POST",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    resetToken: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "PATCH",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/token"
    },
    revokeAuthorizationForApplication: {
      deprecated: "octokit.apps.revokeAuthorizationForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-an-authorization-for-an-application",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    revokeGrantForApplication: {
      deprecated: "octokit.apps.revokeGrantForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-a-grant-for-an-application",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/grants/:access_token"
    },
    revokeInstallationToken: {
      headers: {
        accept: "application/vnd.github.gambit-preview+json"
      },
      method: "DELETE",
      params: {},
      url: "/installation/token"
    }
  },
  checks: {
    create: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "POST",
      params: {
        actions: {
          type: "object[]"
        },
        "actions[].description": {
          required: true,
          type: "string"
        },
        "actions[].identifier": {
          required: true,
          type: "string"
        },
        "actions[].label": {
          required: true,
          type: "string"
        },
        completed_at: {
          type: "string"
        },
        conclusion: {
          enum: ["success", "failure", "neutral", "cancelled", "timed_out", "action_required"],
          type: "string"
        },
        details_url: {
          type: "string"
        },
        external_id: {
          type: "string"
        },
        head_sha: {
          required: true,
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        output: {
          type: "object"
        },
        "output.annotations": {
          type: "object[]"
        },
        "output.annotations[].annotation_level": {
          enum: ["notice", "warning", "failure"],
          required: true,
          type: "string"
        },
        "output.annotations[].end_column": {
          type: "integer"
        },
        "output.annotations[].end_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].message": {
          required: true,
          type: "string"
        },
        "output.annotations[].path": {
          required: true,
          type: "string"
        },
        "output.annotations[].raw_details": {
          type: "string"
        },
        "output.annotations[].start_column": {
          type: "integer"
        },
        "output.annotations[].start_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].title": {
          type: "string"
        },
        "output.images": {
          type: "object[]"
        },
        "output.images[].alt": {
          required: true,
          type: "string"
        },
        "output.images[].caption": {
          type: "string"
        },
        "output.images[].image_url": {
          required: true,
          type: "string"
        },
        "output.summary": {
          required: true,
          type: "string"
        },
        "output.text": {
          type: "string"
        },
        "output.title": {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        started_at: {
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs"
    },
    createSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "POST",
      params: {
        head_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites"
    },
    get: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_run_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs/:check_run_id"
    },
    getSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_suite_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/:check_suite_id"
    },
    listAnnotations: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_run_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs/:check_run_id/annotations"
    },
    listForRef: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_name: {
          type: "string"
        },
        filter: {
          enum: ["latest", "all"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/check-runs"
    },
    listForSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_name: {
          type: "string"
        },
        check_suite_id: {
          required: true,
          type: "integer"
        },
        filter: {
          enum: ["latest", "all"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/:check_suite_id/check-runs"
    },
    listSuitesForRef: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        app_id: {
          type: "integer"
        },
        check_name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/check-suites"
    },
    rerequestSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "POST",
      params: {
        check_suite_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/:check_suite_id/rerequest"
    },
    setSuitesPreferences: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "PATCH",
      params: {
        auto_trigger_checks: {
          type: "object[]"
        },
        "auto_trigger_checks[].app_id": {
          required: true,
          type: "integer"
        },
        "auto_trigger_checks[].setting": {
          required: true,
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/preferences"
    },
    update: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "PATCH",
      params: {
        actions: {
          type: "object[]"
        },
        "actions[].description": {
          required: true,
          type: "string"
        },
        "actions[].identifier": {
          required: true,
          type: "string"
        },
        "actions[].label": {
          required: true,
          type: "string"
        },
        check_run_id: {
          required: true,
          type: "integer"
        },
        completed_at: {
          type: "string"
        },
        conclusion: {
          enum: ["success", "failure", "neutral", "cancelled", "timed_out", "action_required"],
          type: "string"
        },
        details_url: {
          type: "string"
        },
        external_id: {
          type: "string"
        },
        name: {
          type: "string"
        },
        output: {
          type: "object"
        },
        "output.annotations": {
          type: "object[]"
        },
        "output.annotations[].annotation_level": {
          enum: ["notice", "warning", "failure"],
          required: true,
          type: "string"
        },
        "output.annotations[].end_column": {
          type: "integer"
        },
        "output.annotations[].end_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].message": {
          required: true,
          type: "string"
        },
        "output.annotations[].path": {
          required: true,
          type: "string"
        },
        "output.annotations[].raw_details": {
          type: "string"
        },
        "output.annotations[].start_column": {
          type: "integer"
        },
        "output.annotations[].start_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].title": {
          type: "string"
        },
        "output.images": {
          type: "object[]"
        },
        "output.images[].alt": {
          required: true,
          type: "string"
        },
        "output.images[].caption": {
          type: "string"
        },
        "output.images[].image_url": {
          required: true,
          type: "string"
        },
        "output.summary": {
          required: true,
          type: "string"
        },
        "output.text": {
          type: "string"
        },
        "output.title": {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        started_at: {
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs/:check_run_id"
    }
  },
  codesOfConduct: {
    getConductCode: {
      headers: {
        accept: "application/vnd.github.scarlet-witch-preview+json"
      },
      method: "GET",
      params: {
        key: {
          required: true,
          type: "string"
        }
      },
      url: "/codes_of_conduct/:key"
    },
    getForRepo: {
      headers: {
        accept: "application/vnd.github.scarlet-witch-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/community/code_of_conduct"
    },
    listConductCodes: {
      headers: {
        accept: "application/vnd.github.scarlet-witch-preview+json"
      },
      method: "GET",
      params: {},
      url: "/codes_of_conduct"
    }
  },
  emojis: {
    get: {
      method: "GET",
      params: {},
      url: "/emojis"
    }
  },
  gists: {
    checkIsStarred: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/star"
    },
    create: {
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        files: {
          required: true,
          type: "object"
        },
        "files.content": {
          type: "string"
        },
        public: {
          type: "boolean"
        }
      },
      url: "/gists"
    },
    createComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments"
    },
    delete: {
      method: "DELETE",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id"
    },
    deleteComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments/:comment_id"
    },
    fork: {
      method: "POST",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/forks"
    },
    get: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id"
    },
    getComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments/:comment_id"
    },
    getRevision: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/:sha"
    },
    list: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/gists"
    },
    listComments: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/gists/:gist_id/comments"
    },
    listCommits: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/gists/:gist_id/commits"
    },
    listForks: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/gists/:gist_id/forks"
    },
    listPublic: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/gists/public"
    },
    listPublicForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/gists"
    },
    listStarred: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/gists/starred"
    },
    star: {
      method: "PUT",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/star"
    },
    unstar: {
      method: "DELETE",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/star"
    },
    update: {
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        files: {
          type: "object"
        },
        "files.content": {
          type: "string"
        },
        "files.filename": {
          type: "string"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id"
    },
    updateComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments/:comment_id"
    }
  },
  git: {
    createBlob: {
      method: "POST",
      params: {
        content: {
          required: true,
          type: "string"
        },
        encoding: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/blobs"
    },
    createCommit: {
      method: "POST",
      params: {
        author: {
          type: "object"
        },
        "author.date": {
          type: "string"
        },
        "author.email": {
          type: "string"
        },
        "author.name": {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.date": {
          type: "string"
        },
        "committer.email": {
          type: "string"
        },
        "committer.name": {
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        parents: {
          required: true,
          type: "string[]"
        },
        repo: {
          required: true,
          type: "string"
        },
        signature: {
          type: "string"
        },
        tree: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/commits"
    },
    createRef: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs"
    },
    createTag: {
      method: "POST",
      params: {
        message: {
          required: true,
          type: "string"
        },
        object: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag: {
          required: true,
          type: "string"
        },
        tagger: {
          type: "object"
        },
        "tagger.date": {
          type: "string"
        },
        "tagger.email": {
          type: "string"
        },
        "tagger.name": {
          type: "string"
        },
        type: {
          enum: ["commit", "tree", "blob"],
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/tags"
    },
    createTree: {
      method: "POST",
      params: {
        base_tree: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tree: {
          required: true,
          type: "object[]"
        },
        "tree[].content": {
          type: "string"
        },
        "tree[].mode": {
          enum: ["100644", "100755", "040000", "160000", "120000"],
          type: "string"
        },
        "tree[].path": {
          type: "string"
        },
        "tree[].sha": {
          allowNull: true,
          type: "string"
        },
        "tree[].type": {
          enum: ["blob", "tree", "commit"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/trees"
    },
    deleteRef: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs/:ref"
    },
    getBlob: {
      method: "GET",
      params: {
        file_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/blobs/:file_sha"
    },
    getCommit: {
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/commits/:commit_sha"
    },
    getRef: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/ref/:ref"
    },
    getTag: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag_sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/tags/:tag_sha"
    },
    getTree: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        recursive: {
          enum: ["1"],
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        tree_sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/trees/:tree_sha"
    },
    listMatchingRefs: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/matching-refs/:ref"
    },
    listRefs: {
      method: "GET",
      params: {
        namespace: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs/:namespace"
    },
    updateRef: {
      method: "PATCH",
      params: {
        force: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs/:ref"
    }
  },
  gitignore: {
    getTemplate: {
      method: "GET",
      params: {
        name: {
          required: true,
          type: "string"
        }
      },
      url: "/gitignore/templates/:name"
    },
    listTemplates: {
      method: "GET",
      params: {},
      url: "/gitignore/templates"
    }
  },
  interactions: {
    addOrUpdateRestrictionsForOrg: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "PUT",
      params: {
        limit: {
          enum: ["existing_users", "contributors_only", "collaborators_only"],
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/interaction-limits"
    },
    addOrUpdateRestrictionsForRepo: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "PUT",
      params: {
        limit: {
          enum: ["existing_users", "contributors_only", "collaborators_only"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/interaction-limits"
    },
    getRestrictionsForOrg: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/interaction-limits"
    },
    getRestrictionsForRepo: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/interaction-limits"
    },
    removeRestrictionsForOrg: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/interaction-limits"
    },
    removeRestrictionsForRepo: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/interaction-limits"
    }
  },
  issues: {
    addAssignees: {
      method: "POST",
      params: {
        assignees: {
          type: "string[]"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/assignees"
    },
    addLabels: {
      method: "POST",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        labels: {
          required: true,
          type: "string[]"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    checkAssignee: {
      method: "GET",
      params: {
        assignee: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/assignees/:assignee"
    },
    create: {
      method: "POST",
      params: {
        assignee: {
          type: "string"
        },
        assignees: {
          type: "string[]"
        },
        body: {
          type: "string"
        },
        labels: {
          type: "string[]"
        },
        milestone: {
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues"
    },
    createComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/comments"
    },
    createLabel: {
      method: "POST",
      params: {
        color: {
          required: true,
          type: "string"
        },
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels"
    },
    createMilestone: {
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        due_on: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones"
    },
    deleteComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    deleteLabel: {
      method: "DELETE",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels/:name"
    },
    deleteMilestone: {
      method: "DELETE",
      params: {
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number"
    },
    get: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number"
    },
    getComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    getEvent: {
      method: "GET",
      params: {
        event_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/events/:event_id"
    },
    getLabel: {
      method: "GET",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels/:name"
    },
    getMilestone: {
      method: "GET",
      params: {
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number"
    },
    list: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        filter: {
          enum: ["assigned", "created", "mentioned", "subscribed", "all"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/issues"
    },
    listAssignees: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/assignees"
    },
    listComments: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/comments"
    },
    listCommentsForRepo: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments"
    },
    listEvents: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/events"
    },
    listEventsForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/events"
    },
    listEventsForTimeline: {
      headers: {
        accept: "application/vnd.github.mockingbird-preview+json"
      },
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/timeline"
    },
    listForAuthenticatedUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        filter: {
          enum: ["assigned", "created", "mentioned", "subscribed", "all"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/user/issues"
    },
    listForOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        filter: {
          enum: ["assigned", "created", "mentioned", "subscribed", "all"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/orgs/:org/issues"
    },
    listForRepo: {
      method: "GET",
      params: {
        assignee: {
          type: "string"
        },
        creator: {
          type: "string"
        },
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        mentioned: {
          type: "string"
        },
        milestone: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues"
    },
    listLabelsForMilestone: {
      method: "GET",
      params: {
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number/labels"
    },
    listLabelsForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels"
    },
    listLabelsOnIssue: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    listMilestonesForRepo: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["due_on", "completeness"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones"
    },
    lock: {
      method: "PUT",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        lock_reason: {
          enum: ["off-topic", "too heated", "resolved", "spam"],
          type: "string"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/lock"
    },
    removeAssignees: {
      method: "DELETE",
      params: {
        assignees: {
          type: "string[]"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/assignees"
    },
    removeLabel: {
      method: "DELETE",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        name: {
          required: true,
          type: "string"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels/:name"
    },
    removeLabels: {
      method: "DELETE",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    replaceLabels: {
      method: "PUT",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        labels: {
          type: "string[]"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    unlock: {
      method: "DELETE",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/lock"
    },
    update: {
      method: "PATCH",
      params: {
        assignee: {
          type: "string"
        },
        assignees: {
          type: "string[]"
        },
        body: {
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        labels: {
          type: "string[]"
        },
        milestone: {
          allowNull: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number"
    },
    updateComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    updateLabel: {
      method: "PATCH",
      params: {
        color: {
          type: "string"
        },
        current_name: {
          required: true,
          type: "string"
        },
        description: {
          type: "string"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels/:current_name"
    },
    updateMilestone: {
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        due_on: {
          type: "string"
        },
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number"
    }
  },
  licenses: {
    get: {
      method: "GET",
      params: {
        license: {
          required: true,
          type: "string"
        }
      },
      url: "/licenses/:license"
    },
    getForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/license"
    },
    list: {
      deprecated: "octokit.licenses.list() has been renamed to octokit.licenses.listCommonlyUsed() (2019-03-05)",
      method: "GET",
      params: {},
      url: "/licenses"
    },
    listCommonlyUsed: {
      method: "GET",
      params: {},
      url: "/licenses"
    }
  },
  markdown: {
    render: {
      method: "POST",
      params: {
        context: {
          type: "string"
        },
        mode: {
          enum: ["markdown", "gfm"],
          type: "string"
        },
        text: {
          required: true,
          type: "string"
        }
      },
      url: "/markdown"
    },
    renderRaw: {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      },
      method: "POST",
      params: {
        data: {
          mapTo: "data",
          required: true,
          type: "string"
        }
      },
      url: "/markdown/raw"
    }
  },
  meta: {
    get: {
      method: "GET",
      params: {},
      url: "/meta"
    }
  },
  migrations: {
    cancelImport: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    },
    deleteArchiveForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/migrations/:migration_id/archive"
    },
    deleteArchiveForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/archive"
    },
    downloadArchiveForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/archive"
    },
    getArchiveForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/migrations/:migration_id/archive"
    },
    getArchiveForOrg: {
      deprecated: "octokit.migrations.getArchiveForOrg() has been renamed to octokit.migrations.downloadArchiveForOrg() (2020-01-27)",
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/archive"
    },
    getCommitAuthors: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/authors"
    },
    getImportProgress: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    },
    getLargeFiles: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/large_files"
    },
    getStatusForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/migrations/:migration_id"
    },
    getStatusForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id"
    },
    listForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/migrations"
    },
    listForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/migrations"
    },
    listReposForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/repositories"
    },
    listReposForUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/:migration_id/repositories"
    },
    mapCommitAuthor: {
      method: "PATCH",
      params: {
        author_id: {
          required: true,
          type: "integer"
        },
        email: {
          type: "string"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/authors/:author_id"
    },
    setLfsPreference: {
      method: "PATCH",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        use_lfs: {
          enum: ["opt_in", "opt_out"],
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/lfs"
    },
    startForAuthenticatedUser: {
      method: "POST",
      params: {
        exclude_attachments: {
          type: "boolean"
        },
        lock_repositories: {
          type: "boolean"
        },
        repositories: {
          required: true,
          type: "string[]"
        }
      },
      url: "/user/migrations"
    },
    startForOrg: {
      method: "POST",
      params: {
        exclude_attachments: {
          type: "boolean"
        },
        lock_repositories: {
          type: "boolean"
        },
        org: {
          required: true,
          type: "string"
        },
        repositories: {
          required: true,
          type: "string[]"
        }
      },
      url: "/orgs/:org/migrations"
    },
    startImport: {
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tfvc_project: {
          type: "string"
        },
        vcs: {
          enum: ["subversion", "git", "mercurial", "tfvc"],
          type: "string"
        },
        vcs_password: {
          type: "string"
        },
        vcs_url: {
          required: true,
          type: "string"
        },
        vcs_username: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    },
    unlockRepoForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        repo_name: {
          required: true,
          type: "string"
        }
      },
      url: "/user/migrations/:migration_id/repos/:repo_name/lock"
    },
    unlockRepoForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        repo_name: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/repos/:repo_name/lock"
    },
    updateImport: {
      method: "PATCH",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        vcs_password: {
          type: "string"
        },
        vcs_username: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    }
  },
  oauthAuthorizations: {
    checkAuthorization: {
      deprecated: "octokit.oauthAuthorizations.checkAuthorization() has been renamed to octokit.apps.checkAuthorization() (2019-11-05)",
      method: "GET",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    createAuthorization: {
      deprecated: "octokit.oauthAuthorizations.createAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization",
      method: "POST",
      params: {
        client_id: {
          type: "string"
        },
        client_secret: {
          type: "string"
        },
        fingerprint: {
          type: "string"
        },
        note: {
          required: true,
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations"
    },
    deleteAuthorization: {
      deprecated: "octokit.oauthAuthorizations.deleteAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-an-authorization",
      method: "DELETE",
      params: {
        authorization_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/authorizations/:authorization_id"
    },
    deleteGrant: {
      deprecated: "octokit.oauthAuthorizations.deleteGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-a-grant",
      method: "DELETE",
      params: {
        grant_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/applications/grants/:grant_id"
    },
    getAuthorization: {
      deprecated: "octokit.oauthAuthorizations.getAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-authorization",
      method: "GET",
      params: {
        authorization_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/authorizations/:authorization_id"
    },
    getGrant: {
      deprecated: "octokit.oauthAuthorizations.getGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-grant",
      method: "GET",
      params: {
        grant_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/applications/grants/:grant_id"
    },
    getOrCreateAuthorizationForApp: {
      deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForApp() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app",
      method: "PUT",
      params: {
        client_id: {
          required: true,
          type: "string"
        },
        client_secret: {
          required: true,
          type: "string"
        },
        fingerprint: {
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/clients/:client_id"
    },
    getOrCreateAuthorizationForAppAndFingerprint: {
      deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app-and-fingerprint",
      method: "PUT",
      params: {
        client_id: {
          required: true,
          type: "string"
        },
        client_secret: {
          required: true,
          type: "string"
        },
        fingerprint: {
          required: true,
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/clients/:client_id/:fingerprint"
    },
    getOrCreateAuthorizationForAppFingerprint: {
      deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppFingerprint() has been renamed to octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() (2018-12-27)",
      method: "PUT",
      params: {
        client_id: {
          required: true,
          type: "string"
        },
        client_secret: {
          required: true,
          type: "string"
        },
        fingerprint: {
          required: true,
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/clients/:client_id/:fingerprint"
    },
    listAuthorizations: {
      deprecated: "octokit.oauthAuthorizations.listAuthorizations() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-authorizations",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/authorizations"
    },
    listGrants: {
      deprecated: "octokit.oauthAuthorizations.listGrants() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-grants",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/applications/grants"
    },
    resetAuthorization: {
      deprecated: "octokit.oauthAuthorizations.resetAuthorization() has been renamed to octokit.apps.resetAuthorization() (2019-11-05)",
      method: "POST",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    revokeAuthorizationForApplication: {
      deprecated: "octokit.oauthAuthorizations.revokeAuthorizationForApplication() has been renamed to octokit.apps.revokeAuthorizationForApplication() (2019-11-05)",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    revokeGrantForApplication: {
      deprecated: "octokit.oauthAuthorizations.revokeGrantForApplication() has been renamed to octokit.apps.revokeGrantForApplication() (2019-11-05)",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/grants/:access_token"
    },
    updateAuthorization: {
      deprecated: "octokit.oauthAuthorizations.updateAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#update-an-existing-authorization",
      method: "PATCH",
      params: {
        add_scopes: {
          type: "string[]"
        },
        authorization_id: {
          required: true,
          type: "integer"
        },
        fingerprint: {
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        remove_scopes: {
          type: "string[]"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/:authorization_id"
    }
  },
  orgs: {
    addOrUpdateMembership: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        role: {
          enum: ["admin", "member"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/memberships/:username"
    },
    blockUser: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks/:username"
    },
    checkBlockedUser: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks/:username"
    },
    checkMembership: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/members/:username"
    },
    checkPublicMembership: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/public_members/:username"
    },
    concealMembership: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/public_members/:username"
    },
    convertMemberToOutsideCollaborator: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/outside_collaborators/:username"
    },
    createHook: {
      method: "POST",
      params: {
        active: {
          type: "boolean"
        },
        config: {
          required: true,
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks"
    },
    createInvitation: {
      method: "POST",
      params: {
        email: {
          type: "string"
        },
        invitee_id: {
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        role: {
          enum: ["admin", "direct_member", "billing_manager"],
          type: "string"
        },
        team_ids: {
          type: "integer[]"
        }
      },
      url: "/orgs/:org/invitations"
    },
    deleteHook: {
      method: "DELETE",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id"
    },
    get: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org"
    },
    getHook: {
      method: "GET",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id"
    },
    getMembership: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/memberships/:username"
    },
    getMembershipForAuthenticatedUser: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/user/memberships/orgs/:org"
    },
    list: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "integer"
        }
      },
      url: "/organizations"
    },
    listBlockedUsers: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks"
    },
    listForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/orgs"
    },
    listForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/orgs"
    },
    listHooks: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/hooks"
    },
    listInstallations: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/installations"
    },
    listInvitationTeams: {
      method: "GET",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/invitations/:invitation_id/teams"
    },
    listMembers: {
      method: "GET",
      params: {
        filter: {
          enum: ["2fa_disabled", "all"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["all", "admin", "member"],
          type: "string"
        }
      },
      url: "/orgs/:org/members"
    },
    listMemberships: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        state: {
          enum: ["active", "pending"],
          type: "string"
        }
      },
      url: "/user/memberships/orgs"
    },
    listOutsideCollaborators: {
      method: "GET",
      params: {
        filter: {
          enum: ["2fa_disabled", "all"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/outside_collaborators"
    },
    listPendingInvitations: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/invitations"
    },
    listPublicMembers: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/public_members"
    },
    pingHook: {
      method: "POST",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id/pings"
    },
    publicizeMembership: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/public_members/:username"
    },
    removeMember: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/members/:username"
    },
    removeMembership: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/memberships/:username"
    },
    removeOutsideCollaborator: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/outside_collaborators/:username"
    },
    unblockUser: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks/:username"
    },
    update: {
      method: "PATCH",
      params: {
        billing_email: {
          type: "string"
        },
        company: {
          type: "string"
        },
        default_repository_permission: {
          enum: ["read", "write", "admin", "none"],
          type: "string"
        },
        description: {
          type: "string"
        },
        email: {
          type: "string"
        },
        has_organization_projects: {
          type: "boolean"
        },
        has_repository_projects: {
          type: "boolean"
        },
        location: {
          type: "string"
        },
        members_allowed_repository_creation_type: {
          enum: ["all", "private", "none"],
          type: "string"
        },
        members_can_create_internal_repositories: {
          type: "boolean"
        },
        members_can_create_private_repositories: {
          type: "boolean"
        },
        members_can_create_public_repositories: {
          type: "boolean"
        },
        members_can_create_repositories: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org"
    },
    updateHook: {
      method: "PATCH",
      params: {
        active: {
          type: "boolean"
        },
        config: {
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id"
    },
    updateMembership: {
      method: "PATCH",
      params: {
        org: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["active"],
          required: true,
          type: "string"
        }
      },
      url: "/user/memberships/orgs/:org"
    }
  },
  projects: {
    addCollaborator: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/:project_id/collaborators/:username"
    },
    createCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        column_id: {
          required: true,
          type: "integer"
        },
        content_id: {
          type: "integer"
        },
        content_type: {
          type: "string"
        },
        note: {
          type: "string"
        }
      },
      url: "/projects/columns/:column_id/cards"
    },
    createColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        name: {
          required: true,
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id/columns"
    },
    createForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        }
      },
      url: "/user/projects"
    },
    createForOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/projects"
    },
    createForRepo: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/projects"
    },
    delete: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id"
    },
    deleteCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        card_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/cards/:card_id"
    },
    deleteColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        column_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/:column_id"
    },
    get: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id"
    },
    getCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        card_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/cards/:card_id"
    },
    getColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        column_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/:column_id"
    },
    listCards: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        archived_state: {
          enum: ["all", "archived", "not_archived"],
          type: "string"
        },
        column_id: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/projects/columns/:column_id/cards"
    },
    listCollaborators: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        affiliation: {
          enum: ["outside", "direct", "all"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id/collaborators"
    },
    listColumns: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id/columns"
    },
    listForOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/orgs/:org/projects"
    },
    listForRepo: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/projects"
    },
    listForUser: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/projects"
    },
    moveCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        card_id: {
          required: true,
          type: "integer"
        },
        column_id: {
          type: "integer"
        },
        position: {
          required: true,
          type: "string",
          validation: "^(top|bottom|after:\\d+)$"
        }
      },
      url: "/projects/columns/cards/:card_id/moves"
    },
    moveColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        column_id: {
          required: true,
          type: "integer"
        },
        position: {
          required: true,
          type: "string",
          validation: "^(first|last|after:\\d+)$"
        }
      },
      url: "/projects/columns/:column_id/moves"
    },
    removeCollaborator: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/:project_id/collaborators/:username"
    },
    reviewUserPermissionLevel: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/:project_id/collaborators/:username/permission"
    },
    update: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        name: {
          type: "string"
        },
        organization_permission: {
          type: "string"
        },
        private: {
          type: "boolean"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        }
      },
      url: "/projects/:project_id"
    },
    updateCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PATCH",
      params: {
        archived: {
          type: "boolean"
        },
        card_id: {
          required: true,
          type: "integer"
        },
        note: {
          type: "string"
        }
      },
      url: "/projects/columns/cards/:card_id"
    },
    updateColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PATCH",
      params: {
        column_id: {
          required: true,
          type: "integer"
        },
        name: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/columns/:column_id"
    }
  },
  pulls: {
    checkIfMerged: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/merge"
    },
    create: {
      method: "POST",
      params: {
        base: {
          required: true,
          type: "string"
        },
        body: {
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        head: {
          required: true,
          type: "string"
        },
        maintainer_can_modify: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls"
    },
    createComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        commit_id: {
          required: true,
          type: "string"
        },
        in_reply_to: {
          deprecated: true,
          description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
          type: "integer"
        },
        line: {
          type: "integer"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        position: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        side: {
          enum: ["LEFT", "RIGHT"],
          type: "string"
        },
        start_line: {
          type: "integer"
        },
        start_side: {
          enum: ["LEFT", "RIGHT", "side"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    createCommentReply: {
      deprecated: "octokit.pulls.createCommentReply() has been renamed to octokit.pulls.createComment() (2019-09-09)",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        commit_id: {
          required: true,
          type: "string"
        },
        in_reply_to: {
          deprecated: true,
          description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
          type: "integer"
        },
        line: {
          type: "integer"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        position: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        side: {
          enum: ["LEFT", "RIGHT"],
          type: "string"
        },
        start_line: {
          type: "integer"
        },
        start_side: {
          enum: ["LEFT", "RIGHT", "side"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    createFromIssue: {
      deprecated: "octokit.pulls.createFromIssue() is deprecated, see https://developer.github.com/v3/pulls/#create-a-pull-request",
      method: "POST",
      params: {
        base: {
          required: true,
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        head: {
          required: true,
          type: "string"
        },
        issue: {
          required: true,
          type: "integer"
        },
        maintainer_can_modify: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls"
    },
    createReview: {
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        comments: {
          type: "object[]"
        },
        "comments[].body": {
          required: true,
          type: "string"
        },
        "comments[].path": {
          required: true,
          type: "string"
        },
        "comments[].position": {
          required: true,
          type: "integer"
        },
        commit_id: {
          type: "string"
        },
        event: {
          enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
    },
    createReviewCommentReply: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments/:comment_id/replies"
    },
    createReviewRequest: {
      method: "POST",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        reviewers: {
          type: "string[]"
        },
        team_reviewers: {
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    deleteComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    deletePendingReview: {
      method: "DELETE",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    },
    deleteReviewRequest: {
      method: "DELETE",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        reviewers: {
          type: "string[]"
        },
        team_reviewers: {
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    dismissReview: {
      method: "PUT",
      params: {
        message: {
          required: true,
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/dismissals"
    },
    get: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number"
    },
    getComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    getCommentsForReview: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments"
    },
    getReview: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    },
    list: {
      method: "GET",
      params: {
        base: {
          type: "string"
        },
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        head: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "popularity", "long-running"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls"
    },
    listComments: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    listCommentsForRepo: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments"
    },
    listCommits: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/commits"
    },
    listFiles: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/files"
    },
    listReviewRequests: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    listReviews: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
    },
    merge: {
      method: "PUT",
      params: {
        commit_message: {
          type: "string"
        },
        commit_title: {
          type: "string"
        },
        merge_method: {
          enum: ["merge", "squash", "rebase"],
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/merge"
    },
    submitReview: {
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        event: {
          enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
          required: true,
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/events"
    },
    update: {
      method: "PATCH",
      params: {
        base: {
          type: "string"
        },
        body: {
          type: "string"
        },
        maintainer_can_modify: {
          type: "boolean"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number"
    },
    updateBranch: {
      headers: {
        accept: "application/vnd.github.lydian-preview+json"
      },
      method: "PUT",
      params: {
        expected_head_sha: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/update-branch"
    },
    updateComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    updateReview: {
      method: "PUT",
      params: {
        body: {
          required: true,
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    }
  },
  rateLimit: {
    get: {
      method: "GET",
      params: {},
      url: "/rate_limit"
    }
  },
  reactions: {
    createForCommitComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id/reactions"
    },
    createForIssue: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/reactions"
    },
    createForIssueComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
    },
    createForPullRequestReviewComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
    },
    createForTeamDiscussion: {
      deprecated: "octokit.reactions.createForTeamDiscussion() has been renamed to octokit.reactions.createForTeamDiscussionLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    },
    createForTeamDiscussionComment: {
      deprecated: "octokit.reactions.createForTeamDiscussionComment() has been renamed to octokit.reactions.createForTeamDiscussionCommentLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    createForTeamDiscussionCommentInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    createForTeamDiscussionCommentLegacy: {
      deprecated: "octokit.reactions.createForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-comment-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    createForTeamDiscussionInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
    },
    createForTeamDiscussionLegacy: {
      deprecated: "octokit.reactions.createForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    },
    delete: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "DELETE",
      params: {
        reaction_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/reactions/:reaction_id"
    },
    listForCommitComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id/reactions"
    },
    listForIssue: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/reactions"
    },
    listForIssueComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
    },
    listForPullRequestReviewComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
    },
    listForTeamDiscussion: {
      deprecated: "octokit.reactions.listForTeamDiscussion() has been renamed to octokit.reactions.listForTeamDiscussionLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    },
    listForTeamDiscussionComment: {
      deprecated: "octokit.reactions.listForTeamDiscussionComment() has been renamed to octokit.reactions.listForTeamDiscussionCommentLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    listForTeamDiscussionCommentInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    listForTeamDiscussionCommentLegacy: {
      deprecated: "octokit.reactions.listForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-comment-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    listForTeamDiscussionInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
    },
    listForTeamDiscussionLegacy: {
      deprecated: "octokit.reactions.listForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    }
  },
  repos: {
    acceptInvitation: {
      method: "PATCH",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/repository_invitations/:invitation_id"
    },
    addCollaborator: {
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username"
    },
    addDeployKey: {
      method: "POST",
      params: {
        key: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        read_only: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys"
    },
    addProtectedBranchAdminEnforcement: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    addProtectedBranchAppRestrictions: {
      method: "POST",
      params: {
        apps: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    addProtectedBranchRequiredSignatures: {
      headers: {
        accept: "application/vnd.github.zzzax-preview+json"
      },
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    addProtectedBranchRequiredStatusChecksContexts: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    addProtectedBranchTeamRestrictions: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        teams: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    addProtectedBranchUserRestrictions: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        users: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    checkCollaborator: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username"
    },
    checkVulnerabilityAlerts: {
      headers: {
        accept: "application/vnd.github.dorian-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/vulnerability-alerts"
    },
    compareCommits: {
      method: "GET",
      params: {
        base: {
          required: true,
          type: "string"
        },
        head: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/compare/:base...:head"
    },
    createCommitComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        commit_sha: {
          required: true,
          type: "string"
        },
        line: {
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          type: "string"
        },
        position: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          alias: "commit_sha",
          deprecated: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/comments"
    },
    createDeployment: {
      method: "POST",
      params: {
        auto_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        environment: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        payload: {
          type: "string"
        },
        production_environment: {
          type: "boolean"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        required_contexts: {
          type: "string[]"
        },
        task: {
          type: "string"
        },
        transient_environment: {
          type: "boolean"
        }
      },
      url: "/repos/:owner/:repo/deployments"
    },
    createDeploymentStatus: {
      method: "POST",
      params: {
        auto_inactive: {
          type: "boolean"
        },
        deployment_id: {
          required: true,
          type: "integer"
        },
        description: {
          type: "string"
        },
        environment: {
          enum: ["production", "staging", "qa"],
          type: "string"
        },
        environment_url: {
          type: "string"
        },
        log_url: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["error", "failure", "inactive", "in_progress", "queued", "pending", "success"],
          required: true,
          type: "string"
        },
        target_url: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
    },
    createDispatchEvent: {
      method: "POST",
      params: {
        client_payload: {
          type: "object"
        },
        event_type: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/dispatches"
    },
    createFile: {
      deprecated: "octokit.repos.createFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
      method: "PUT",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          required: true,
          type: "string"
        },
        "author.name": {
          required: true,
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          required: true,
          type: "string"
        },
        "committer.name": {
          required: true,
          type: "string"
        },
        content: {
          required: true,
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    createForAuthenticatedUser: {
      method: "POST",
      params: {
        allow_merge_commit: {
          type: "boolean"
        },
        allow_rebase_merge: {
          type: "boolean"
        },
        allow_squash_merge: {
          type: "boolean"
        },
        auto_init: {
          type: "boolean"
        },
        delete_branch_on_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        gitignore_template: {
          type: "string"
        },
        has_issues: {
          type: "boolean"
        },
        has_projects: {
          type: "boolean"
        },
        has_wiki: {
          type: "boolean"
        },
        homepage: {
          type: "string"
        },
        is_template: {
          type: "boolean"
        },
        license_template: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          type: "integer"
        },
        visibility: {
          enum: ["public", "private", "visibility", "internal"],
          type: "string"
        }
      },
      url: "/user/repos"
    },
    createFork: {
      method: "POST",
      params: {
        organization: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/forks"
    },
    createHook: {
      method: "POST",
      params: {
        active: {
          type: "boolean"
        },
        config: {
          required: true,
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks"
    },
    createInOrg: {
      method: "POST",
      params: {
        allow_merge_commit: {
          type: "boolean"
        },
        allow_rebase_merge: {
          type: "boolean"
        },
        allow_squash_merge: {
          type: "boolean"
        },
        auto_init: {
          type: "boolean"
        },
        delete_branch_on_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        gitignore_template: {
          type: "string"
        },
        has_issues: {
          type: "boolean"
        },
        has_projects: {
          type: "boolean"
        },
        has_wiki: {
          type: "boolean"
        },
        homepage: {
          type: "string"
        },
        is_template: {
          type: "boolean"
        },
        license_template: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          type: "integer"
        },
        visibility: {
          enum: ["public", "private", "visibility", "internal"],
          type: "string"
        }
      },
      url: "/orgs/:org/repos"
    },
    createOrUpdateFile: {
      method: "PUT",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          required: true,
          type: "string"
        },
        "author.name": {
          required: true,
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          required: true,
          type: "string"
        },
        "committer.name": {
          required: true,
          type: "string"
        },
        content: {
          required: true,
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    createRelease: {
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        prerelease: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag_name: {
          required: true,
          type: "string"
        },
        target_commitish: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases"
    },
    createStatus: {
      method: "POST",
      params: {
        context: {
          type: "string"
        },
        description: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["error", "failure", "pending", "success"],
          required: true,
          type: "string"
        },
        target_url: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/statuses/:sha"
    },
    createUsingTemplate: {
      headers: {
        accept: "application/vnd.github.baptiste-preview+json"
      },
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          type: "string"
        },
        private: {
          type: "boolean"
        },
        template_owner: {
          required: true,
          type: "string"
        },
        template_repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:template_owner/:template_repo/generate"
    },
    declineInvitation: {
      method: "DELETE",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/repository_invitations/:invitation_id"
    },
    delete: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo"
    },
    deleteCommitComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id"
    },
    deleteDownload: {
      method: "DELETE",
      params: {
        download_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/downloads/:download_id"
    },
    deleteFile: {
      method: "DELETE",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          type: "string"
        },
        "author.name": {
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          type: "string"
        },
        "committer.name": {
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    deleteHook: {
      method: "DELETE",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id"
    },
    deleteInvitation: {
      method: "DELETE",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/invitations/:invitation_id"
    },
    deleteRelease: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id"
    },
    deleteReleaseAsset: {
      method: "DELETE",
      params: {
        asset_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    disableAutomatedSecurityFixes: {
      headers: {
        accept: "application/vnd.github.london-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/automated-security-fixes"
    },
    disablePagesSite: {
      headers: {
        accept: "application/vnd.github.switcheroo-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    disableVulnerabilityAlerts: {
      headers: {
        accept: "application/vnd.github.dorian-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/vulnerability-alerts"
    },
    enableAutomatedSecurityFixes: {
      headers: {
        accept: "application/vnd.github.london-preview+json"
      },
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/automated-security-fixes"
    },
    enablePagesSite: {
      headers: {
        accept: "application/vnd.github.switcheroo-preview+json"
      },
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        source: {
          type: "object"
        },
        "source.branch": {
          enum: ["master", "gh-pages"],
          type: "string"
        },
        "source.path": {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    enableVulnerabilityAlerts: {
      headers: {
        accept: "application/vnd.github.dorian-preview+json"
      },
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/vulnerability-alerts"
    },
    get: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo"
    },
    getAppsWithAccessToProtectedBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    getArchiveLink: {
      method: "GET",
      params: {
        archive_format: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/:archive_format/:ref"
    },
    getBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch"
    },
    getBranchProtection: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection"
    },
    getClones: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        per: {
          enum: ["day", "week"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/clones"
    },
    getCodeFrequencyStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/code_frequency"
    },
    getCollaboratorPermissionLevel: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username/permission"
    },
    getCombinedStatusForRef: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/status"
    },
    getCommit: {
      method: "GET",
      params: {
        commit_sha: {
          alias: "ref",
          deprecated: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          alias: "ref",
          deprecated: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref"
    },
    getCommitActivityStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/commit_activity"
    },
    getCommitComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id"
    },
    getCommitRefSha: {
      deprecated: "octokit.repos.getCommitRefSha() is deprecated, see https://developer.github.com/v3/repos/commits/#get-a-single-commit",
      headers: {
        accept: "application/vnd.github.v3.sha"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref"
    },
    getContents: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        ref: {
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    getContributorsStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/contributors"
    },
    getDeployKey: {
      method: "GET",
      params: {
        key_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys/:key_id"
    },
    getDeployment: {
      method: "GET",
      params: {
        deployment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id"
    },
    getDeploymentStatus: {
      method: "GET",
      params: {
        deployment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        status_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id/statuses/:status_id"
    },
    getDownload: {
      method: "GET",
      params: {
        download_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/downloads/:download_id"
    },
    getHook: {
      method: "GET",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id"
    },
    getLatestPagesBuild: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds/latest"
    },
    getLatestRelease: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/latest"
    },
    getPages: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    getPagesBuild: {
      method: "GET",
      params: {
        build_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds/:build_id"
    },
    getParticipationStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/participation"
    },
    getProtectedBranchAdminEnforcement: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    getProtectedBranchPullRequestReviewEnforcement: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    getProtectedBranchRequiredSignatures: {
      headers: {
        accept: "application/vnd.github.zzzax-preview+json"
      },
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    getProtectedBranchRequiredStatusChecks: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    getProtectedBranchRestrictions: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
    },
    getPunchCardStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/punch_card"
    },
    getReadme: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/readme"
    },
    getRelease: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id"
    },
    getReleaseAsset: {
      method: "GET",
      params: {
        asset_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    getReleaseByTag: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/tags/:tag"
    },
    getTeamsWithAccessToProtectedBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    getTopPaths: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/popular/paths"
    },
    getTopReferrers: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/popular/referrers"
    },
    getUsersWithAccessToProtectedBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    getViews: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        per: {
          enum: ["day", "week"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/views"
    },
    list: {
      method: "GET",
      params: {
        affiliation: {
          type: "string"
        },
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated", "pushed", "full_name"],
          type: "string"
        },
        type: {
          enum: ["all", "owner", "public", "private", "member"],
          type: "string"
        },
        visibility: {
          enum: ["all", "public", "private"],
          type: "string"
        }
      },
      url: "/user/repos"
    },
    listAppsWithAccessToProtectedBranch: {
      deprecated: "octokit.repos.listAppsWithAccessToProtectedBranch() has been renamed to octokit.repos.getAppsWithAccessToProtectedBranch() (2019-09-13)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    listAssetsForRelease: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id/assets"
    },
    listBranches: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        protected: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches"
    },
    listBranchesForHeadCommit: {
      headers: {
        accept: "application/vnd.github.groot-preview+json"
      },
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/branches-where-head"
    },
    listCollaborators: {
      method: "GET",
      params: {
        affiliation: {
          enum: ["outside", "direct", "all"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators"
    },
    listCommentsForCommit: {
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          alias: "commit_sha",
          deprecated: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/comments"
    },
    listCommitComments: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments"
    },
    listCommits: {
      method: "GET",
      params: {
        author: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        path: {
          type: "string"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        },
        since: {
          type: "string"
        },
        until: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits"
    },
    listContributors: {
      method: "GET",
      params: {
        anon: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contributors"
    },
    listDeployKeys: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys"
    },
    listDeploymentStatuses: {
      method: "GET",
      params: {
        deployment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
    },
    listDeployments: {
      method: "GET",
      params: {
        environment: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        },
        task: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments"
    },
    listDownloads: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/downloads"
    },
    listForOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated", "pushed", "full_name"],
          type: "string"
        },
        type: {
          enum: ["all", "public", "private", "forks", "sources", "member", "internal"],
          type: "string"
        }
      },
      url: "/orgs/:org/repos"
    },
    listForUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated", "pushed", "full_name"],
          type: "string"
        },
        type: {
          enum: ["all", "owner", "member"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/repos"
    },
    listForks: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["newest", "oldest", "stargazers"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/forks"
    },
    listHooks: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks"
    },
    listInvitations: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/invitations"
    },
    listInvitationsForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/repository_invitations"
    },
    listLanguages: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/languages"
    },
    listPagesBuilds: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds"
    },
    listProtectedBranchRequiredStatusChecksContexts: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    listProtectedBranchTeamRestrictions: {
      deprecated: "octokit.repos.listProtectedBranchTeamRestrictions() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-09)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    listProtectedBranchUserRestrictions: {
      deprecated: "octokit.repos.listProtectedBranchUserRestrictions() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-09)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    listPublic: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "integer"
        }
      },
      url: "/repositories"
    },
    listPullRequestsAssociatedWithCommit: {
      headers: {
        accept: "application/vnd.github.groot-preview+json"
      },
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/pulls"
    },
    listReleases: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases"
    },
    listStatusesForRef: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/statuses"
    },
    listTags: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/tags"
    },
    listTeams: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/teams"
    },
    listTeamsWithAccessToProtectedBranch: {
      deprecated: "octokit.repos.listTeamsWithAccessToProtectedBranch() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-13)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    listTopics: {
      headers: {
        accept: "application/vnd.github.mercy-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/topics"
    },
    listUsersWithAccessToProtectedBranch: {
      deprecated: "octokit.repos.listUsersWithAccessToProtectedBranch() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-13)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    merge: {
      method: "POST",
      params: {
        base: {
          required: true,
          type: "string"
        },
        commit_message: {
          type: "string"
        },
        head: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/merges"
    },
    pingHook: {
      method: "POST",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id/pings"
    },
    removeBranchProtection: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection"
    },
    removeCollaborator: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username"
    },
    removeDeployKey: {
      method: "DELETE",
      params: {
        key_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys/:key_id"
    },
    removeProtectedBranchAdminEnforcement: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    removeProtectedBranchAppRestrictions: {
      method: "DELETE",
      params: {
        apps: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    removeProtectedBranchPullRequestReviewEnforcement: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    removeProtectedBranchRequiredSignatures: {
      headers: {
        accept: "application/vnd.github.zzzax-preview+json"
      },
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    removeProtectedBranchRequiredStatusChecks: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    removeProtectedBranchRequiredStatusChecksContexts: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    removeProtectedBranchRestrictions: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
    },
    removeProtectedBranchTeamRestrictions: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        teams: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    removeProtectedBranchUserRestrictions: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        users: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    replaceProtectedBranchAppRestrictions: {
      method: "PUT",
      params: {
        apps: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    replaceProtectedBranchRequiredStatusChecksContexts: {
      method: "PUT",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    replaceProtectedBranchTeamRestrictions: {
      method: "PUT",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        teams: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    replaceProtectedBranchUserRestrictions: {
      method: "PUT",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        users: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    replaceTopics: {
      headers: {
        accept: "application/vnd.github.mercy-preview+json"
      },
      method: "PUT",
      params: {
        names: {
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/topics"
    },
    requestPageBuild: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds"
    },
    retrieveCommunityProfileMetrics: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/community/profile"
    },
    testPushHook: {
      method: "POST",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id/tests"
    },
    transfer: {
      method: "POST",
      params: {
        new_owner: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_ids: {
          type: "integer[]"
        }
      },
      url: "/repos/:owner/:repo/transfer"
    },
    update: {
      method: "PATCH",
      params: {
        allow_merge_commit: {
          type: "boolean"
        },
        allow_rebase_merge: {
          type: "boolean"
        },
        allow_squash_merge: {
          type: "boolean"
        },
        archived: {
          type: "boolean"
        },
        default_branch: {
          type: "string"
        },
        delete_branch_on_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        has_issues: {
          type: "boolean"
        },
        has_projects: {
          type: "boolean"
        },
        has_wiki: {
          type: "boolean"
        },
        homepage: {
          type: "string"
        },
        is_template: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        },
        visibility: {
          enum: ["public", "private", "visibility", "internal"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo"
    },
    updateBranchProtection: {
      method: "PUT",
      params: {
        allow_deletions: {
          type: "boolean"
        },
        allow_force_pushes: {
          allowNull: true,
          type: "boolean"
        },
        branch: {
          required: true,
          type: "string"
        },
        enforce_admins: {
          allowNull: true,
          required: true,
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        required_linear_history: {
          type: "boolean"
        },
        required_pull_request_reviews: {
          allowNull: true,
          required: true,
          type: "object"
        },
        "required_pull_request_reviews.dismiss_stale_reviews": {
          type: "boolean"
        },
        "required_pull_request_reviews.dismissal_restrictions": {
          type: "object"
        },
        "required_pull_request_reviews.dismissal_restrictions.teams": {
          type: "string[]"
        },
        "required_pull_request_reviews.dismissal_restrictions.users": {
          type: "string[]"
        },
        "required_pull_request_reviews.require_code_owner_reviews": {
          type: "boolean"
        },
        "required_pull_request_reviews.required_approving_review_count": {
          type: "integer"
        },
        required_status_checks: {
          allowNull: true,
          required: true,
          type: "object"
        },
        "required_status_checks.contexts": {
          required: true,
          type: "string[]"
        },
        "required_status_checks.strict": {
          required: true,
          type: "boolean"
        },
        restrictions: {
          allowNull: true,
          required: true,
          type: "object"
        },
        "restrictions.apps": {
          type: "string[]"
        },
        "restrictions.teams": {
          required: true,
          type: "string[]"
        },
        "restrictions.users": {
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection"
    },
    updateCommitComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id"
    },
    updateFile: {
      deprecated: "octokit.repos.updateFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
      method: "PUT",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          required: true,
          type: "string"
        },
        "author.name": {
          required: true,
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          required: true,
          type: "string"
        },
        "committer.name": {
          required: true,
          type: "string"
        },
        content: {
          required: true,
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    updateHook: {
      method: "PATCH",
      params: {
        active: {
          type: "boolean"
        },
        add_events: {
          type: "string[]"
        },
        config: {
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        remove_events: {
          type: "string[]"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id"
    },
    updateInformationAboutPagesSite: {
      method: "PUT",
      params: {
        cname: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        source: {
          enum: ['"gh-pages"', '"master"', '"master /docs"'],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    updateInvitation: {
      method: "PATCH",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        permissions: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/invitations/:invitation_id"
    },
    updateProtectedBranchPullRequestReviewEnforcement: {
      method: "PATCH",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        dismiss_stale_reviews: {
          type: "boolean"
        },
        dismissal_restrictions: {
          type: "object"
        },
        "dismissal_restrictions.teams": {
          type: "string[]"
        },
        "dismissal_restrictions.users": {
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        require_code_owner_reviews: {
          type: "boolean"
        },
        required_approving_review_count: {
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    updateProtectedBranchRequiredStatusChecks: {
      method: "PATCH",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        strict: {
          type: "boolean"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    updateRelease: {
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        prerelease: {
          type: "boolean"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag_name: {
          type: "string"
        },
        target_commitish: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id"
    },
    updateReleaseAsset: {
      method: "PATCH",
      params: {
        asset_id: {
          required: true,
          type: "integer"
        },
        label: {
          type: "string"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    uploadReleaseAsset: {
      method: "POST",
      params: {
        data: {
          mapTo: "data",
          required: true,
          type: "string | object"
        },
        file: {
          alias: "data",
          deprecated: true,
          type: "string | object"
        },
        headers: {
          required: true,
          type: "object"
        },
        "headers.content-length": {
          required: true,
          type: "integer"
        },
        "headers.content-type": {
          required: true,
          type: "string"
        },
        label: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        url: {
          required: true,
          type: "string"
        }
      },
      url: ":url"
    }
  },
  search: {
    code: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["indexed"],
          type: "string"
        }
      },
      url: "/search/code"
    },
    commits: {
      headers: {
        accept: "application/vnd.github.cloak-preview+json"
      },
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["author-date", "committer-date"],
          type: "string"
        }
      },
      url: "/search/commits"
    },
    issues: {
      deprecated: "octokit.search.issues() has been renamed to octokit.search.issuesAndPullRequests() (2018-12-27)",
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"],
          type: "string"
        }
      },
      url: "/search/issues"
    },
    issuesAndPullRequests: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"],
          type: "string"
        }
      },
      url: "/search/issues"
    },
    labels: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        q: {
          required: true,
          type: "string"
        },
        repository_id: {
          required: true,
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/search/labels"
    },
    repos: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["stars", "forks", "help-wanted-issues", "updated"],
          type: "string"
        }
      },
      url: "/search/repositories"
    },
    topics: {
      method: "GET",
      params: {
        q: {
          required: true,
          type: "string"
        }
      },
      url: "/search/topics"
    },
    users: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["followers", "repositories", "joined"],
          type: "string"
        }
      },
      url: "/search/users"
    }
  },
  teams: {
    addMember: {
      deprecated: "octokit.teams.addMember() has been renamed to octokit.teams.addMemberLegacy() (2020-01-16)",
      method: "PUT",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    addMemberLegacy: {
      deprecated: "octokit.teams.addMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-team-member-legacy",
      method: "PUT",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    addOrUpdateMembership: {
      deprecated: "octokit.teams.addOrUpdateMembership() has been renamed to octokit.teams.addOrUpdateMembershipLegacy() (2020-01-16)",
      method: "PUT",
      params: {
        role: {
          enum: ["member", "maintainer"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    addOrUpdateMembershipInOrg: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        role: {
          enum: ["member", "maintainer"],
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/memberships/:username"
    },
    addOrUpdateMembershipLegacy: {
      deprecated: "octokit.teams.addOrUpdateMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-or-update-team-membership-legacy",
      method: "PUT",
      params: {
        role: {
          enum: ["member", "maintainer"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    addOrUpdateProject: {
      deprecated: "octokit.teams.addOrUpdateProject() has been renamed to octokit.teams.addOrUpdateProjectLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    addOrUpdateProjectInOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects/:project_id"
    },
    addOrUpdateProjectLegacy: {
      deprecated: "octokit.teams.addOrUpdateProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-project-legacy",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    addOrUpdateRepo: {
      deprecated: "octokit.teams.addOrUpdateRepo() has been renamed to octokit.teams.addOrUpdateRepoLegacy() (2020-01-16)",
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    addOrUpdateRepoInOrg: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
    },
    addOrUpdateRepoLegacy: {
      deprecated: "octokit.teams.addOrUpdateRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-repository-legacy",
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    checkManagesRepo: {
      deprecated: "octokit.teams.checkManagesRepo() has been renamed to octokit.teams.checkManagesRepoLegacy() (2020-01-16)",
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    checkManagesRepoInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
    },
    checkManagesRepoLegacy: {
      deprecated: "octokit.teams.checkManagesRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#check-if-a-team-manages-a-repository-legacy",
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    create: {
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        maintainers: {
          type: "string[]"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        repo_names: {
          type: "string[]"
        }
      },
      url: "/orgs/:org/teams"
    },
    createDiscussion: {
      deprecated: "octokit.teams.createDiscussion() has been renamed to octokit.teams.createDiscussionLegacy() (2020-01-16)",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    createDiscussionComment: {
      deprecated: "octokit.teams.createDiscussionComment() has been renamed to octokit.teams.createDiscussionCommentLegacy() (2020-01-16)",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    createDiscussionCommentInOrg: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
    },
    createDiscussionCommentLegacy: {
      deprecated: "octokit.teams.createDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#create-a-comment-legacy",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    createDiscussionInOrg: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions"
    },
    createDiscussionLegacy: {
      deprecated: "octokit.teams.createDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#create-a-discussion-legacy",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    delete: {
      deprecated: "octokit.teams.delete() has been renamed to octokit.teams.deleteLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    deleteDiscussion: {
      deprecated: "octokit.teams.deleteDiscussion() has been renamed to octokit.teams.deleteDiscussionLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    deleteDiscussionComment: {
      deprecated: "octokit.teams.deleteDiscussionComment() has been renamed to octokit.teams.deleteDiscussionCommentLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    deleteDiscussionCommentInOrg: {
      method: "DELETE",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
    },
    deleteDiscussionCommentLegacy: {
      deprecated: "octokit.teams.deleteDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#delete-a-comment-legacy",
      method: "DELETE",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    deleteDiscussionInOrg: {
      method: "DELETE",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
    },
    deleteDiscussionLegacy: {
      deprecated: "octokit.teams.deleteDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#delete-a-discussion-legacy",
      method: "DELETE",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    deleteInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug"
    },
    deleteLegacy: {
      deprecated: "octokit.teams.deleteLegacy() is deprecated, see https://developer.github.com/v3/teams/#delete-team-legacy",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    get: {
      deprecated: "octokit.teams.get() has been renamed to octokit.teams.getLegacy() (2020-01-16)",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    getByName: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug"
    },
    getDiscussion: {
      deprecated: "octokit.teams.getDiscussion() has been renamed to octokit.teams.getDiscussionLegacy() (2020-01-16)",
      method: "GET",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    getDiscussionComment: {
      deprecated: "octokit.teams.getDiscussionComment() has been renamed to octokit.teams.getDiscussionCommentLegacy() (2020-01-16)",
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    getDiscussionCommentInOrg: {
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
    },
    getDiscussionCommentLegacy: {
      deprecated: "octokit.teams.getDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#get-a-single-comment-legacy",
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    getDiscussionInOrg: {
      method: "GET",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
    },
    getDiscussionLegacy: {
      deprecated: "octokit.teams.getDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#get-a-single-discussion-legacy",
      method: "GET",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    getLegacy: {
      deprecated: "octokit.teams.getLegacy() is deprecated, see https://developer.github.com/v3/teams/#get-team-legacy",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    getMember: {
      deprecated: "octokit.teams.getMember() has been renamed to octokit.teams.getMemberLegacy() (2020-01-16)",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    getMemberLegacy: {
      deprecated: "octokit.teams.getMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-member-legacy",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    getMembership: {
      deprecated: "octokit.teams.getMembership() has been renamed to octokit.teams.getMembershipLegacy() (2020-01-16)",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    getMembershipInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/memberships/:username"
    },
    getMembershipLegacy: {
      deprecated: "octokit.teams.getMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-membership-legacy",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    list: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/teams"
    },
    listChild: {
      deprecated: "octokit.teams.listChild() has been renamed to octokit.teams.listChildLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/teams"
    },
    listChildInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/teams"
    },
    listChildLegacy: {
      deprecated: "octokit.teams.listChildLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-child-teams-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/teams"
    },
    listDiscussionComments: {
      deprecated: "octokit.teams.listDiscussionComments() has been renamed to octokit.teams.listDiscussionCommentsLegacy() (2020-01-16)",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    listDiscussionCommentsInOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
    },
    listDiscussionCommentsLegacy: {
      deprecated: "octokit.teams.listDiscussionCommentsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#list-comments-legacy",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    listDiscussions: {
      deprecated: "octokit.teams.listDiscussions() has been renamed to octokit.teams.listDiscussionsLegacy() (2020-01-16)",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    listDiscussionsInOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions"
    },
    listDiscussionsLegacy: {
      deprecated: "octokit.teams.listDiscussionsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#list-discussions-legacy",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    listForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/teams"
    },
    listMembers: {
      deprecated: "octokit.teams.listMembers() has been renamed to octokit.teams.listMembersLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["member", "maintainer", "all"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/members"
    },
    listMembersInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["member", "maintainer", "all"],
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/members"
    },
    listMembersLegacy: {
      deprecated: "octokit.teams.listMembersLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-team-members-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["member", "maintainer", "all"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/members"
    },
    listPendingInvitations: {
      deprecated: "octokit.teams.listPendingInvitations() has been renamed to octokit.teams.listPendingInvitationsLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/invitations"
    },
    listPendingInvitationsInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/invitations"
    },
    listPendingInvitationsLegacy: {
      deprecated: "octokit.teams.listPendingInvitationsLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-pending-team-invitations-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/invitations"
    },
    listProjects: {
      deprecated: "octokit.teams.listProjects() has been renamed to octokit.teams.listProjectsLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects"
    },
    listProjectsInOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects"
    },
    listProjectsLegacy: {
      deprecated: "octokit.teams.listProjectsLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-projects-legacy",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects"
    },
    listRepos: {
      deprecated: "octokit.teams.listRepos() has been renamed to octokit.teams.listReposLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos"
    },
    listReposInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos"
    },
    listReposLegacy: {
      deprecated: "octokit.teams.listReposLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-repos-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos"
    },
    removeMember: {
      deprecated: "octokit.teams.removeMember() has been renamed to octokit.teams.removeMemberLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    removeMemberLegacy: {
      deprecated: "octokit.teams.removeMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-member-legacy",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    removeMembership: {
      deprecated: "octokit.teams.removeMembership() has been renamed to octokit.teams.removeMembershipLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    removeMembershipInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/memberships/:username"
    },
    removeMembershipLegacy: {
      deprecated: "octokit.teams.removeMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-membership-legacy",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    removeProject: {
      deprecated: "octokit.teams.removeProject() has been renamed to octokit.teams.removeProjectLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    removeProjectInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects/:project_id"
    },
    removeProjectLegacy: {
      deprecated: "octokit.teams.removeProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-project-legacy",
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    removeRepo: {
      deprecated: "octokit.teams.removeRepo() has been renamed to octokit.teams.removeRepoLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    removeRepoInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
    },
    removeRepoLegacy: {
      deprecated: "octokit.teams.removeRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-repository-legacy",
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    reviewProject: {
      deprecated: "octokit.teams.reviewProject() has been renamed to octokit.teams.reviewProjectLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    reviewProjectInOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects/:project_id"
    },
    reviewProjectLegacy: {
      deprecated: "octokit.teams.reviewProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#review-a-team-project-legacy",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    update: {
      deprecated: "octokit.teams.update() has been renamed to octokit.teams.updateLegacy() (2020-01-16)",
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    updateDiscussion: {
      deprecated: "octokit.teams.updateDiscussion() has been renamed to octokit.teams.updateDiscussionLegacy() (2020-01-16)",
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    updateDiscussionComment: {
      deprecated: "octokit.teams.updateDiscussionComment() has been renamed to octokit.teams.updateDiscussionCommentLegacy() (2020-01-16)",
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    updateDiscussionCommentInOrg: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
    },
    updateDiscussionCommentLegacy: {
      deprecated: "octokit.teams.updateDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#edit-a-comment-legacy",
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    updateDiscussionInOrg: {
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
    },
    updateDiscussionLegacy: {
      deprecated: "octokit.teams.updateDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#edit-a-discussion-legacy",
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    updateInOrg: {
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug"
    },
    updateLegacy: {
      deprecated: "octokit.teams.updateLegacy() is deprecated, see https://developer.github.com/v3/teams/#edit-team-legacy",
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    }
  },
  users: {
    addEmails: {
      method: "POST",
      params: {
        emails: {
          required: true,
          type: "string[]"
        }
      },
      url: "/user/emails"
    },
    block: {
      method: "PUT",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/blocks/:username"
    },
    checkBlocked: {
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/blocks/:username"
    },
    checkFollowing: {
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/following/:username"
    },
    checkFollowingForUser: {
      method: "GET",
      params: {
        target_user: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/following/:target_user"
    },
    createGpgKey: {
      method: "POST",
      params: {
        armored_public_key: {
          type: "string"
        }
      },
      url: "/user/gpg_keys"
    },
    createPublicKey: {
      method: "POST",
      params: {
        key: {
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/user/keys"
    },
    deleteEmails: {
      method: "DELETE",
      params: {
        emails: {
          required: true,
          type: "string[]"
        }
      },
      url: "/user/emails"
    },
    deleteGpgKey: {
      method: "DELETE",
      params: {
        gpg_key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/gpg_keys/:gpg_key_id"
    },
    deletePublicKey: {
      method: "DELETE",
      params: {
        key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/keys/:key_id"
    },
    follow: {
      method: "PUT",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/following/:username"
    },
    getAuthenticated: {
      method: "GET",
      params: {},
      url: "/user"
    },
    getByUsername: {
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username"
    },
    getContextForUser: {
      method: "GET",
      params: {
        subject_id: {
          type: "string"
        },
        subject_type: {
          enum: ["organization", "repository", "issue", "pull_request"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/hovercard"
    },
    getGpgKey: {
      method: "GET",
      params: {
        gpg_key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/gpg_keys/:gpg_key_id"
    },
    getPublicKey: {
      method: "GET",
      params: {
        key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/keys/:key_id"
    },
    list: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/users"
    },
    listBlocked: {
      method: "GET",
      params: {},
      url: "/user/blocks"
    },
    listEmails: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/emails"
    },
    listFollowersForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/followers"
    },
    listFollowersForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/followers"
    },
    listFollowingForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/following"
    },
    listFollowingForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/following"
    },
    listGpgKeys: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/gpg_keys"
    },
    listGpgKeysForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/gpg_keys"
    },
    listPublicEmails: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/public_emails"
    },
    listPublicKeys: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/keys"
    },
    listPublicKeysForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/keys"
    },
    togglePrimaryEmailVisibility: {
      method: "PATCH",
      params: {
        email: {
          required: true,
          type: "string"
        },
        visibility: {
          required: true,
          type: "string"
        }
      },
      url: "/user/email/visibility"
    },
    unblock: {
      method: "DELETE",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/blocks/:username"
    },
    unfollow: {
      method: "DELETE",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/following/:username"
    },
    updateAuthenticated: {
      method: "PATCH",
      params: {
        bio: {
          type: "string"
        },
        blog: {
          type: "string"
        },
        company: {
          type: "string"
        },
        email: {
          type: "string"
        },
        hireable: {
          type: "boolean"
        },
        location: {
          type: "string"
        },
        name: {
          type: "string"
        }
      },
      url: "/user"
    }
  }
};

const VERSION = "2.4.0";

function registerEndpoints(octokit, routes) {
  Object.keys(routes).forEach(namespaceName => {
    if (!octokit[namespaceName]) {
      octokit[namespaceName] = {};
    }

    Object.keys(routes[namespaceName]).forEach(apiName => {
      const apiOptions = routes[namespaceName][apiName];
      const endpointDefaults = ["method", "url", "headers"].reduce((map, key) => {
        if (typeof apiOptions[key] !== "undefined") {
          map[key] = apiOptions[key];
        }

        return map;
      }, {});
      endpointDefaults.request = {
        validate: apiOptions.params
      };
      let request = octokit.request.defaults(endpointDefaults); // patch request & endpoint methods to support deprecated parameters.
      // Not the most elegant solution, but we don’t want to move deprecation
      // logic into octokit/endpoint.js as it’s out of scope

      const hasDeprecatedParam = Object.keys(apiOptions.params || {}).find(key => apiOptions.params[key].deprecated);

      if (hasDeprecatedParam) {
        const patch = patchForDeprecation.bind(null, octokit, apiOptions);
        request = patch(octokit.request.defaults(endpointDefaults), `.${namespaceName}.${apiName}()`);
        request.endpoint = patch(request.endpoint, `.${namespaceName}.${apiName}.endpoint()`);
        request.endpoint.merge = patch(request.endpoint.merge, `.${namespaceName}.${apiName}.endpoint.merge()`);
      }

      if (apiOptions.deprecated) {
        octokit[namespaceName][apiName] = Object.assign(function deprecatedEndpointMethod() {
          octokit.log.warn(new deprecation.Deprecation(`[@octokit/rest] ${apiOptions.deprecated}`));
          octokit[namespaceName][apiName] = request;
          return request.apply(null, arguments);
        }, request);
        return;
      }

      octokit[namespaceName][apiName] = request;
    });
  });
}

function patchForDeprecation(octokit, apiOptions, method, methodName) {
  const patchedMethod = options => {
    options = Object.assign({}, options);
    Object.keys(options).forEach(key => {
      if (apiOptions.params[key] && apiOptions.params[key].deprecated) {
        const aliasKey = apiOptions.params[key].alias;
        octokit.log.warn(new deprecation.Deprecation(`[@octokit/rest] "${key}" parameter is deprecated for "${methodName}". Use "${aliasKey}" instead`));

        if (!(aliasKey in options)) {
          options[aliasKey] = options[key];
        }

        delete options[key];
      }
    });
    return method(options);
  };

  Object.keys(method).forEach(key => {
    patchedMethod[key] = method[key];
  });
  return patchedMethod;
}

/**
 * This plugin is a 1:1 copy of internal @octokit/rest plugins. The primary
 * goal is to rebuild @octokit/rest on top of @octokit/core. Once that is
 * done, we will remove the registerEndpoints methods and return the methods
 * directly as with the other plugins. At that point we will also remove the
 * legacy workarounds and deprecations.
 *
 * See the plan at
 * https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/1
 */

function restEndpointMethods(octokit) {
  // @ts-ignore
  octokit.registerEndpoints = registerEndpoints.bind(null, octokit);
  registerEndpoints(octokit, endpointsByScope); // Aliasing scopes for backward compatibility
  // See https://github.com/octokit/rest.js/pull/1134

  [["gitdata", "git"], ["authorization", "oauthAuthorizations"], ["pullRequests", "pulls"]].forEach(([deprecatedScope, scope]) => {
    Object.defineProperty(octokit, deprecatedScope, {
      get() {
        octokit.log.warn( // @ts-ignore
        new deprecation.Deprecation(`[@octokit/plugin-rest-endpoint-methods] "octokit.${deprecatedScope}.*" methods are deprecated, use "octokit.${scope}.*" instead`)); // @ts-ignore

        return octokit[scope];
      }

    });
  });
  return {};
}
restEndpointMethods.VERSION = VERSION;

exports.restEndpointMethods = restEndpointMethods;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 21:
/***/ (function(module) {

"use strict";


const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};


/***/ }),

/***/ 22:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getPage

const deprecate = __webpack_require__(307)
const getPageLinks = __webpack_require__(327)
const HttpError = __webpack_require__(504)

function getPage (octokit, link, which, headers) {
  deprecate(`octokit.get${which.charAt(0).toUpperCase() + which.slice(1)}Page() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  const url = getPageLinks(link)[which]

  if (!url) {
    const urlError = new HttpError(`No ${which} page found`, 404)
    return Promise.reject(urlError)
  }

  const requestOptions = {
    url,
    headers: applyAcceptHeader(link, headers)
  }

  const promise = octokit.request(requestOptions)

  return promise
}

function applyAcceptHeader (res, headers) {
  const previous = res.headers && res.headers['x-github-media-type']

  if (!previous || (headers && headers.accept)) {
    return headers
  }
  headers = headers || {}
  headers.accept = 'application/vnd.' + previous
    .replace('; param=', '.')
    .replace('; format=', '+')

  return headers
}


/***/ }),

/***/ 23:
/***/ (function(module) {

"use strict";


/**
 * Tries to execute a function and discards any error that occurs.
 * @param {Function} fn - Function that might or might not throw an error.
 * @returns {?*} Return-value of the function when no error occurred.
 */
module.exports = function(fn) {

	try { return fn() } catch (e) {}

}

/***/ }),

/***/ 25:
/***/ (function(module) {

"use strict";


var isStream = module.exports = function (stream) {
	return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
};

isStream.writable = function (stream) {
	return isStream(stream) && stream.writable !== false && typeof stream._write === 'function' && typeof stream._writableState === 'object';
};

isStream.readable = function (stream) {
	return isStream(stream) && stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
};

isStream.duplex = function (stream) {
	return isStream.writable(stream) && isStream.readable(stream);
};

isStream.transform = function (stream) {
	return isStream.duplex(stream) && typeof stream._transform === 'function' && typeof stream._transformState === 'object';
};


/***/ }),

/***/ 27:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(__webpack_require__(277));
/**
 * Creates a specification for a set of files that will be downloaded
 * @param artifactName the name of the artifact
 * @param artifactEntries a set of container entries that describe that files that make up an artifact
 * @param downloadPath the path where the artifact will be downloaded to
 * @param includeRootDirectory specifies if there should be an extra directory (denoted by the artifact name) where the artifact files should be downloaded to
 */
function getDownloadSpecification(artifactName, artifactEntries, downloadPath, includeRootDirectory) {
    const directories = new Set();
    const specifications = {
        rootDownloadLocation: includeRootDirectory
            ? path.join(downloadPath, artifactName)
            : downloadPath,
        directoryStructure: [],
        filesToDownload: []
    };
    for (const entry of artifactEntries) {
        // Ignore artifacts in the container that don't begin with the same name
        if (entry.path.startsWith(`${artifactName}/`) ||
            entry.path.startsWith(`${artifactName}\\`)) {
            // normalize all separators to the local OS
            const normalizedPathEntry = path.normalize(entry.path);
            // entry.path always starts with the artifact name, if includeRootDirectory is false, remove the name from the beginning of the path
            const filePath = path.join(downloadPath, includeRootDirectory
                ? normalizedPathEntry
                : normalizedPathEntry.replace(artifactName, ''));
            // Case insensitive folder structure maintained in the backend, not every folder is created so the 'folder'
            // itemType cannot be relied upon. The file must be used to determine the directory structure
            if (entry.itemType === 'file') {
                // Get the directories that we need to create from the filePath for each individual file
                directories.add(path.dirname(filePath));
                specifications.filesToDownload.push({
                    sourceLocation: entry.contentLocation,
                    targetPath: filePath
                });
            }
        }
    }
    specifications.directoryStructure = Array.from(directories);
    return specifications;
}
exports.getDownloadSpecification = getDownloadSpecification;
//# sourceMappingURL=download-specification.js.map

/***/ }),

/***/ 31:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(__webpack_require__(827));
const upload_specification_1 = __webpack_require__(420);
const upload_http_client_1 = __webpack_require__(79);
const utils_1 = __webpack_require__(435);
const download_http_client_1 = __webpack_require__(549);
const download_specification_1 = __webpack_require__(27);
const config_variables_1 = __webpack_require__(973);
const path_1 = __webpack_require__(277);
class DefaultArtifactClient {
    /**
     * Constructs a DefaultArtifactClient
     */
    static create() {
        return new DefaultArtifactClient();
    }
    /**
     * Uploads an artifact
     */
    uploadArtifact(name, files, rootDirectory, options) {
        return __awaiter(this, void 0, void 0, function* () {
            utils_1.checkArtifactName(name);
            // Get specification for the files being uploaded
            const uploadSpecification = upload_specification_1.getUploadSpecification(name, rootDirectory, files);
            const uploadResponse = {
                artifactName: name,
                artifactItems: [],
                size: 0,
                failedItems: []
            };
            const uploadHttpClient = new upload_http_client_1.UploadHttpClient();
            if (uploadSpecification.length === 0) {
                core.warning(`No files found that can be uploaded`);
            }
            else {
                // Create an entry for the artifact in the file container
                const response = yield uploadHttpClient.createArtifactInFileContainer(name);
                if (!response.fileContainerResourceUrl) {
                    core.debug(response.toString());
                    throw new Error('No URL provided by the Artifact Service to upload an artifact to');
                }
                core.debug(`Upload Resource URL: ${response.fileContainerResourceUrl}`);
                // Upload each of the files that were found concurrently
                const uploadResult = yield uploadHttpClient.uploadArtifactToFileContainer(response.fileContainerResourceUrl, uploadSpecification, options);
                // Update the size of the artifact to indicate we are done uploading
                // The uncompressed size is used for display when downloading a zip of the artifact from the UI
                yield uploadHttpClient.patchArtifactSize(uploadResult.totalSize, name);
                core.info(`Finished uploading artifact ${name}. Reported size is ${uploadResult.uploadSize} bytes. There were ${uploadResult.failedItems.length} items that failed to upload`);
                uploadResponse.artifactItems = uploadSpecification.map(item => item.absoluteFilePath);
                uploadResponse.size = uploadResult.uploadSize;
                uploadResponse.failedItems = uploadResult.failedItems;
            }
            return uploadResponse;
        });
    }
    downloadArtifact(name, path, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const downloadHttpClient = new download_http_client_1.DownloadHttpClient();
            const artifacts = yield downloadHttpClient.listArtifacts();
            if (artifacts.count === 0) {
                throw new Error(`Unable to find any artifacts for the associated workflow`);
            }
            const artifactToDownload = artifacts.value.find(artifact => {
                return artifact.name === name;
            });
            if (!artifactToDownload) {
                throw new Error(`Unable to find an artifact with the name: ${name}`);
            }
            const items = yield downloadHttpClient.getContainerItems(artifactToDownload.name, artifactToDownload.fileContainerResourceUrl);
            if (!path) {
                path = config_variables_1.getWorkSpaceDirectory();
            }
            path = path_1.normalize(path);
            path = path_1.resolve(path);
            // During upload, empty directories are rejected by the remote server so there should be no artifacts that consist of only empty directories
            const downloadSpecification = download_specification_1.getDownloadSpecification(name, items.value, path, ((_a = options) === null || _a === void 0 ? void 0 : _a.createArtifactFolder) || false);
            if (downloadSpecification.filesToDownload.length === 0) {
                core.info(`No downloadable files were found for the artifact: ${artifactToDownload.name}`);
            }
            else {
                // Create all necessary directories recursively before starting any download
                yield utils_1.createDirectoriesForArtifact(downloadSpecification.directoryStructure);
                yield downloadHttpClient.downloadSingleArtifact(downloadSpecification.filesToDownload);
            }
            return {
                artifactName: name,
                downloadPath: downloadSpecification.rootDownloadLocation
            };
        });
    }
    downloadAllArtifacts(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const downloadHttpClient = new download_http_client_1.DownloadHttpClient();
            const response = [];
            const artifacts = yield downloadHttpClient.listArtifacts();
            if (artifacts.count === 0) {
                core.info('Unable to find any artifacts for the associated workflow');
                return response;
            }
            if (!path) {
                path = config_variables_1.getWorkSpaceDirectory();
            }
            path = path_1.normalize(path);
            path = path_1.resolve(path);
            let downloadedArtifacts = 0;
            while (downloadedArtifacts < artifacts.count) {
                const currentArtifactToDownload = artifacts.value[downloadedArtifacts];
                downloadedArtifacts += 1;
                // Get container entries for the specific artifact
                const items = yield downloadHttpClient.getContainerItems(currentArtifactToDownload.name, currentArtifactToDownload.fileContainerResourceUrl);
                const downloadSpecification = download_specification_1.getDownloadSpecification(currentArtifactToDownload.name, items.value, path, true);
                if (downloadSpecification.filesToDownload.length === 0) {
                    core.info(`No downloadable files were found for any artifact ${currentArtifactToDownload.name}`);
                }
                else {
                    yield utils_1.createDirectoriesForArtifact(downloadSpecification.directoryStructure);
                    yield downloadHttpClient.downloadSingleArtifact(downloadSpecification.filesToDownload);
                }
                response.push({
                    artifactName: currentArtifactToDownload.name,
                    downloadPath: downloadSpecification.rootDownloadLocation
                });
            }
            return response;
        });
    }
}
exports.DefaultArtifactClient = DefaultArtifactClient;
//# sourceMappingURL=artifact-client.js.map

/***/ }),

/***/ 32:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __webpack_require__(357);
const fs = __webpack_require__(747);
const path = __webpack_require__(277);
_a = fs.promises, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
exports.IS_WINDOWS = process.platform === 'win32';
function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
exports.exists = exists;
function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
exports.isDirectory = isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
exports.isRooted = isRooted;
/**
 * Recursively create a directory at `fsPath`.
 *
 * This implementation is optimistic, meaning it attempts to create the full
 * path first, and backs up the path stack from there.
 *
 * @param fsPath The path to create
 * @param maxDepth The maximum recursion depth
 * @param depth The current recursion depth
 */
function mkdirP(fsPath, maxDepth = 1000, depth = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, 'a path argument must be provided');
        fsPath = path.resolve(fsPath);
        if (depth >= maxDepth)
            return exports.mkdir(fsPath);
        try {
            yield exports.mkdir(fsPath);
            return;
        }
        catch (err) {
            switch (err.code) {
                case 'ENOENT': {
                    yield mkdirP(path.dirname(fsPath), maxDepth, depth + 1);
                    yield exports.mkdir(fsPath);
                    return;
                }
                default: {
                    let stats;
                    try {
                        stats = yield exports.stat(fsPath);
                    }
                    catch (err2) {
                        throw err;
                    }
                    if (!stats.isDirectory())
                        throw err;
                }
            }
        }
    });
}
exports.mkdirP = mkdirP;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield exports.stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = path.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield exports.stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = path.dirname(filePath);
                        const upperName = path.basename(filePath).toUpperCase();
                        for (const actualName of yield exports.readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = path.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
exports.tryGetExecutablePath = tryGetExecutablePath;
function normalizeSeparators(p) {
    p = p || '';
    if (exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
}
//# sourceMappingURL=io-util.js.map

/***/ }),

/***/ 35:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

var shebangRegex = __webpack_require__(885);

module.exports = function (str) {
	var match = str.match(shebangRegex);

	if (!match) {
		return null;
	}

	var arr = match[0].replace(/#! ?/, '').split(' ');
	var bin = arr[0].split('/').pop();
	var arg = arr[1];

	return (bin === 'env' ?
		arg :
		bin + (arg ? ' ' + arg : '')
	);
};


/***/ }),

/***/ 46:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(50));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    throw error;
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 48:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = paginatePlugin;

const { paginateRest } = __webpack_require__(17);

function paginatePlugin(octokit) {
  Object.assign(octokit, paginateRest(octokit));
}


/***/ }),

/***/ 50:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const macosRelease = __webpack_require__(767);
const winRelease = __webpack_require__(691);

const osName = (platform, release) => {
	if (!platform && release) {
		throw new Error('You can\'t specify a `release` without specifying `platform`');
	}

	platform = platform || os.platform();

	let id;

	if (platform === 'darwin') {
		if (!release && os.platform() === 'darwin') {
			release = os.release();
		}

		const prefix = release ? (Number(release.split('.')[0]) > 15 ? 'macOS' : 'OS X') : 'macOS';
		id = release ? macosRelease(release).name : '';
		return prefix + (id ? ' ' + id : '');
	}

	if (platform === 'linux') {
		if (!release && os.platform() === 'linux') {
			release = os.release();
		}

		id = release ? release.replace(/^(\d+\.\d+).*/, '$1') : '';
		return 'Linux' + (id ? ' ' + id : '');
	}

	if (platform === 'win32') {
		if (!release && os.platform() === 'win32') {
			release = os.release();
		}

		id = release ? winRelease(release) : '';
		return 'Windows' + (id ? ' ' + id : '');
	}

	return platform;
};

module.exports = osName;


/***/ }),

/***/ 51:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const childProcess = __webpack_require__(129);
const path = __webpack_require__(277);
const util_1 = __webpack_require__(669);
const ioUtil = __webpack_require__(32);
const exec = util_1.promisify(childProcess.exec);
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory()
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield copyFile(source, newDest, force);
        }
    });
}
exports.cp = cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
exports.mv = mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Node doesn't provide a delete operation, only an unlink function. This means that if the file is being used by another
            // program (e.g. antivirus), it won't be deleted. To address this, we shell out the work to rd/del.
            try {
                if (yield ioUtil.isDirectory(inputPath, true)) {
                    yield exec(`rd /s /q "${inputPath}"`);
                }
                else {
                    yield exec(`del /f /a "${inputPath}"`);
                }
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
            // Shelling out fails to remove a symlink folder with missing source, this unlink catches that
            try {
                yield ioUtil.unlink(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
        }
        else {
            let isDir = false;
            try {
                isDir = yield ioUtil.isDirectory(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
                return;
            }
            if (isDir) {
                yield exec(`rm -rf "${inputPath}"`);
            }
            else {
                yield ioUtil.unlink(inputPath);
            }
        }
    });
}
exports.rmRF = rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ioUtil.mkdirP(fsPath);
    });
}
exports.mkdirP = mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (ioUtil.IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
        }
        try {
            // build the list of extensions to try
            const extensions = [];
            if (ioUtil.IS_WINDOWS && process.env.PATHEXT) {
                for (const extension of process.env.PATHEXT.split(path.delimiter)) {
                    if (extension) {
                        extensions.push(extension);
                    }
                }
            }
            // if it's rooted, return it if exists. otherwise return empty.
            if (ioUtil.isRooted(tool)) {
                const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
                if (filePath) {
                    return filePath;
                }
                return '';
            }
            // if any path separators, return empty
            if (tool.includes('/') || (ioUtil.IS_WINDOWS && tool.includes('\\'))) {
                return '';
            }
            // build the list of directories
            //
            // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
            // it feels like we should not do this. Checking the current directory seems like more of a use
            // case of a shell, and the which() function exposed by the toolkit should strive for consistency
            // across platforms.
            const directories = [];
            if (process.env.PATH) {
                for (const p of process.env.PATH.split(path.delimiter)) {
                    if (p) {
                        directories.push(p);
                    }
                }
            }
            // return the first match
            for (const directory of directories) {
                const filePath = yield ioUtil.tryGetExecutablePath(directory + path.sep + tool, extensions);
                if (filePath) {
                    return filePath;
                }
            }
            return '';
        }
        catch (err) {
            throw new Error(`which failed with message ${err.message}`);
        }
    });
}
exports.which = which;
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    return { force, recursive };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}
//# sourceMappingURL=io.js.map

/***/ }),

/***/ 66:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const path = __webpack_require__(277);
const childProcess = __webpack_require__(129);
const crossSpawn = __webpack_require__(99);
const stripEof = __webpack_require__(571);
const npmRunPath = __webpack_require__(222);
const isStream = __webpack_require__(25);
const _getStream = __webpack_require__(305);
const pFinally = __webpack_require__(219);
const onExit = __webpack_require__(292);
const errname = __webpack_require__(147);
const stdio = __webpack_require__(256);

const TEN_MEGABYTES = 1000 * 1000 * 10;

function handleArgs(cmd, args, opts) {
	let parsed;

	opts = Object.assign({
		extendEnv: true,
		env: {}
	}, opts);

	if (opts.extendEnv) {
		opts.env = Object.assign({}, process.env, opts.env);
	}

	if (opts.__winShell === true) {
		delete opts.__winShell;
		parsed = {
			command: cmd,
			args,
			options: opts,
			file: cmd,
			original: {
				cmd,
				args
			}
		};
	} else {
		parsed = crossSpawn._parse(cmd, args, opts);
	}

	opts = Object.assign({
		maxBuffer: TEN_MEGABYTES,
		buffer: true,
		stripEof: true,
		preferLocal: true,
		localDir: parsed.options.cwd || process.cwd(),
		encoding: 'utf8',
		reject: true,
		cleanup: true
	}, parsed.options);

	opts.stdio = stdio(opts);

	if (opts.preferLocal) {
		opts.env = npmRunPath.env(Object.assign({}, opts, {cwd: opts.localDir}));
	}

	if (opts.detached) {
		// #115
		opts.cleanup = false;
	}

	if (process.platform === 'win32' && path.basename(parsed.command) === 'cmd.exe') {
		// #116
		parsed.args.unshift('/q');
	}

	return {
		cmd: parsed.command,
		args: parsed.args,
		opts,
		parsed
	};
}

function handleInput(spawned, input) {
	if (input === null || input === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
}

function handleOutput(opts, val) {
	if (val && opts.stripEof) {
		val = stripEof(val);
	}

	return val;
}

function handleShell(fn, cmd, opts) {
	let file = '/bin/sh';
	let args = ['-c', cmd];

	opts = Object.assign({}, opts);

	if (process.platform === 'win32') {
		opts.__winShell = true;
		file = process.env.comspec || 'cmd.exe';
		args = ['/s', '/c', `"${cmd}"`];
		opts.windowsVerbatimArguments = true;
	}

	if (opts.shell) {
		file = opts.shell;
		delete opts.shell;
	}

	return fn(file, args, opts);
}

function getStream(process, stream, {encoding, buffer, maxBuffer}) {
	if (!process[stream]) {
		return null;
	}

	let ret;

	if (!buffer) {
		// TODO: Use `ret = util.promisify(stream.finished)(process[stream]);` when targeting Node.js 10
		ret = new Promise((resolve, reject) => {
			process[stream]
				.once('end', resolve)
				.once('error', reject);
		});
	} else if (encoding) {
		ret = _getStream(process[stream], {
			encoding,
			maxBuffer
		});
	} else {
		ret = _getStream.buffer(process[stream], {maxBuffer});
	}

	return ret.catch(err => {
		err.stream = stream;
		err.message = `${stream} ${err.message}`;
		throw err;
	});
}

function makeError(result, options) {
	const {stdout, stderr} = result;

	let err = result.error;
	const {code, signal} = result;

	const {parsed, joinedCmd} = options;
	const timedOut = options.timedOut || false;

	if (!err) {
		let output = '';

		if (Array.isArray(parsed.opts.stdio)) {
			if (parsed.opts.stdio[2] !== 'inherit') {
				output += output.length > 0 ? stderr : `\n${stderr}`;
			}

			if (parsed.opts.stdio[1] !== 'inherit') {
				output += `\n${stdout}`;
			}
		} else if (parsed.opts.stdio !== 'inherit') {
			output = `\n${stderr}${stdout}`;
		}

		err = new Error(`Command failed: ${joinedCmd}${output}`);
		err.code = code < 0 ? errname(code) : code;
	}

	err.stdout = stdout;
	err.stderr = stderr;
	err.failed = true;
	err.signal = signal || null;
	err.cmd = joinedCmd;
	err.timedOut = timedOut;

	return err;
}

function joinCmd(cmd, args) {
	let joinedCmd = cmd;

	if (Array.isArray(args) && args.length > 0) {
		joinedCmd += ' ' + args.join(' ');
	}

	return joinedCmd;
}

module.exports = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);
	const {encoding, buffer, maxBuffer} = parsed.opts;
	const joinedCmd = joinCmd(cmd, args);

	let spawned;
	try {
		spawned = childProcess.spawn(parsed.cmd, parsed.args, parsed.opts);
	} catch (err) {
		return Promise.reject(err);
	}

	let removeExitHandler;
	if (parsed.opts.cleanup) {
		removeExitHandler = onExit(() => {
			spawned.kill();
		});
	}

	let timeoutId = null;
	let timedOut = false;

	const cleanup = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}

		if (removeExitHandler) {
			removeExitHandler();
		}
	};

	if (parsed.opts.timeout > 0) {
		timeoutId = setTimeout(() => {
			timeoutId = null;
			timedOut = true;
			spawned.kill(parsed.opts.killSignal);
		}, parsed.opts.timeout);
	}

	const processDone = new Promise(resolve => {
		spawned.on('exit', (code, signal) => {
			cleanup();
			resolve({code, signal});
		});

		spawned.on('error', err => {
			cleanup();
			resolve({error: err});
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', err => {
				cleanup();
				resolve({error: err});
			});
		}
	});

	function destroy() {
		if (spawned.stdout) {
			spawned.stdout.destroy();
		}

		if (spawned.stderr) {
			spawned.stderr.destroy();
		}
	}

	const handlePromise = () => pFinally(Promise.all([
		processDone,
		getStream(spawned, 'stdout', {encoding, buffer, maxBuffer}),
		getStream(spawned, 'stderr', {encoding, buffer, maxBuffer})
	]).then(arr => {
		const result = arr[0];
		result.stdout = arr[1];
		result.stderr = arr[2];

		if (result.error || result.code !== 0 || result.signal !== null) {
			const err = makeError(result, {
				joinedCmd,
				parsed,
				timedOut
			});

			// TODO: missing some timeout logic for killed
			// https://github.com/nodejs/node/blob/master/lib/child_process.js#L203
			// err.killed = spawned.killed || killed;
			err.killed = err.killed || spawned.killed;

			if (!parsed.opts.reject) {
				return err;
			}

			throw err;
		}

		return {
			stdout: handleOutput(parsed.opts, result.stdout),
			stderr: handleOutput(parsed.opts, result.stderr),
			code: 0,
			failed: false,
			killed: false,
			signal: null,
			cmd: joinedCmd,
			timedOut: false
		};
	}), destroy);

	crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);

	handleInput(spawned, parsed.opts.input);

	spawned.then = (onfulfilled, onrejected) => handlePromise().then(onfulfilled, onrejected);
	spawned.catch = onrejected => handlePromise().catch(onrejected);

	return spawned;
};

// TODO: set `stderr: 'ignore'` when that option is implemented
module.exports.stdout = (...args) => module.exports(...args).then(x => x.stdout);

// TODO: set `stdout: 'ignore'` when that option is implemented
module.exports.stderr = (...args) => module.exports(...args).then(x => x.stderr);

module.exports.shell = (cmd, opts) => handleShell(module.exports, cmd, opts);

module.exports.sync = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);
	const joinedCmd = joinCmd(cmd, args);

	if (isStream(parsed.opts.input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}

	const result = childProcess.spawnSync(parsed.cmd, parsed.args, parsed.opts);
	result.code = result.status;

	if (result.error || result.status !== 0 || result.signal !== null) {
		const err = makeError(result, {
			joinedCmd,
			parsed
		});

		if (!parsed.opts.reject) {
			return err;
		}

		throw err;
	}

	return {
		stdout: handleOutput(parsed.opts, result.stdout),
		stderr: handleOutput(parsed.opts, result.stderr),
		code: 0,
		failed: false,
		signal: null,
		cmd: joinedCmd,
		timedOut: false
	};
};

module.exports.shellSync = (cmd, opts) => handleShell(module.exports.sync, cmd, opts);


/***/ }),

/***/ 71:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var request = __webpack_require__(714);
var universalUserAgent = __webpack_require__(566);

const VERSION = "4.3.1";

class GraphqlError extends Error {
  constructor(request, response) {
    const message = response.data.errors[0].message;
    super(message);
    Object.assign(this, response.data);
    this.name = "GraphqlError";
    this.request = request; // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

}

const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query"];
function graphql(request, query, options) {
  options = typeof query === "string" ? options = Object.assign({
    query
  }, options) : options = query;
  const requestOptions = Object.keys(options).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = options[key];
      return result;
    }

    if (!result.variables) {
      result.variables = {};
    }

    result.variables[key] = options[key];
    return result;
  }, {});
  return request(requestOptions).then(response => {
    if (response.data.errors) {
      throw new GraphqlError(requestOptions, {
        data: response.data
      });
    }

    return response.data.data;
  });
}

function withDefaults(request$1, newDefaults) {
  const newRequest = request$1.defaults(newDefaults);

  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: request.request.endpoint
  });
}

const graphql$1 = withDefaults(request.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

exports.graphql = graphql$1;
exports.withCustomRequest = withCustomRequest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 79:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(__webpack_require__(747));
const tmp = __importStar(__webpack_require__(461));
const stream = __importStar(__webpack_require__(413));
const utils_1 = __webpack_require__(435);
const config_variables_1 = __webpack_require__(973);
const util_1 = __webpack_require__(669);
const url_1 = __webpack_require__(835);
const perf_hooks_1 = __webpack_require__(630);
const upload_status_reporter_1 = __webpack_require__(433);
const core_1 = __webpack_require__(827);
const http_manager_1 = __webpack_require__(98);
const upload_gzip_1 = __webpack_require__(522);
const stat = util_1.promisify(fs.stat);
class UploadHttpClient {
    constructor() {
        this.uploadHttpManager = new http_manager_1.HttpManager(config_variables_1.getUploadFileConcurrency());
        this.statusReporter = new upload_status_reporter_1.UploadStatusReporter();
    }
    /**
     * Creates a file container for the new artifact in the remote blob storage/file service
     * @param {string} artifactName Name of the artifact being created
     * @returns The response from the Artifact Service if the file container was successfully created
     */
    createArtifactInFileContainer(artifactName) {
        return __awaiter(this, void 0, void 0, function* () {
            const parameters = {
                Type: 'actions_storage',
                Name: artifactName
            };
            const data = JSON.stringify(parameters, null, 2);
            const artifactUrl = utils_1.getArtifactUrl();
            // use the first client from the httpManager, `keep-alive` is not used so the connection will close immediatly
            const client = this.uploadHttpManager.getClient(0);
            const requestOptions = utils_1.getRequestOptions('application/json', false, false);
            const rawResponse = yield client.post(artifactUrl, data, requestOptions);
            const body = yield rawResponse.readBody();
            if (utils_1.isSuccessStatusCode(rawResponse.message.statusCode) && body) {
                return JSON.parse(body);
            }
            else {
                // eslint-disable-next-line no-console
                console.log(rawResponse);
                throw new Error(`Unable to create a container for the artifact ${artifactName}`);
            }
        });
    }
    /**
     * Concurrently upload all of the files in chunks
     * @param {string} uploadUrl Base Url for the artifact that was created
     * @param {SearchResult[]} filesToUpload A list of information about the files being uploaded
     * @returns The size of all the files uploaded in bytes
     */
    uploadArtifactToFileContainer(uploadUrl, filesToUpload, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const FILE_CONCURRENCY = config_variables_1.getUploadFileConcurrency();
            const MAX_CHUNK_SIZE = config_variables_1.getUploadChunkSize();
            core_1.debug(`File Concurrency: ${FILE_CONCURRENCY}, and Chunk Size: ${MAX_CHUNK_SIZE}`);
            const parameters = [];
            // by default, file uploads will continue if there is an error unless specified differently in the options
            let continueOnError = true;
            if (options) {
                if (options.continueOnError === false) {
                    continueOnError = false;
                }
            }
            // prepare the necessary parameters to upload all the files
            for (const file of filesToUpload) {
                const resourceUrl = new url_1.URL(uploadUrl);
                resourceUrl.searchParams.append('itemPath', file.uploadFilePath);
                parameters.push({
                    file: file.absoluteFilePath,
                    resourceUrl: resourceUrl.toString(),
                    maxChunkSize: MAX_CHUNK_SIZE,
                    continueOnError
                });
            }
            const parallelUploads = [...new Array(FILE_CONCURRENCY).keys()];
            const failedItemsToReport = [];
            let currentFile = 0;
            let completedFiles = 0;
            let uploadFileSize = 0;
            let totalFileSize = 0;
            let abortPendingFileUploads = false;
            this.statusReporter.setTotalNumberOfFilesToUpload(filesToUpload.length);
            this.statusReporter.start();
            // only allow a certain amount of files to be uploaded at once, this is done to reduce potential errors
            yield Promise.all(parallelUploads.map((index) => __awaiter(this, void 0, void 0, function* () {
                while (currentFile < filesToUpload.length) {
                    const currentFileParameters = parameters[currentFile];
                    currentFile += 1;
                    if (abortPendingFileUploads) {
                        failedItemsToReport.push(currentFileParameters.file);
                        continue;
                    }
                    const startTime = perf_hooks_1.performance.now();
                    const uploadFileResult = yield this.uploadFileAsync(index, currentFileParameters);
                    core_1.debug(`File: ${++completedFiles}/${filesToUpload.length}. ${currentFileParameters.file} took ${(perf_hooks_1.performance.now() - startTime).toFixed(3)} milliseconds to finish upload`);
                    uploadFileSize += uploadFileResult.successfullUploadSize;
                    totalFileSize += uploadFileResult.totalSize;
                    if (uploadFileResult.isSuccess === false) {
                        failedItemsToReport.push(currentFileParameters.file);
                        if (!continueOnError) {
                            // existing uploads will be able to finish however all pending uploads will fail fast
                            abortPendingFileUploads = true;
                        }
                    }
                    this.statusReporter.incrementProcessedCount();
                }
            })));
            this.statusReporter.stop();
            // done uploading, safety dispose all connections
            this.uploadHttpManager.disposeAndReplaceAllClients();
            core_1.info(`Total size of all the files uploaded is ${uploadFileSize} bytes`);
            return {
                uploadSize: uploadFileSize,
                totalSize: totalFileSize,
                failedItems: failedItemsToReport
            };
        });
    }
    /**
     * Asynchronously uploads a file. The file is compressed and uploaded using GZip if it is determined to save space.
     * If the upload file is bigger than the max chunk size it will be uploaded via multiple calls
     * @param {number} httpClientIndex The index of the httpClient that is being used to make all of the calls
     * @param {UploadFileParameters} parameters Information about the file that needs to be uploaded
     * @returns The size of the file that was uploaded in bytes along with any failed uploads
     */
    uploadFileAsync(httpClientIndex, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalFileSize = (yield stat(parameters.file)).size;
            let offset = 0;
            let isUploadSuccessful = true;
            let failedChunkSizes = 0;
            let uploadFileSize = 0;
            let isGzip = true;
            // the file that is being uploaded is less than 64k in size, to increase thoroughput and to minimize disk I/O
            // for creating a new GZip file, an in-memory buffer is used for compression
            if (totalFileSize < 65536) {
                const buffer = yield upload_gzip_1.createGZipFileInBuffer(parameters.file);
                let uploadStream;
                if (totalFileSize < buffer.byteLength) {
                    // compression did not help with reducing the size, use a readable stream from the original file for upload
                    uploadStream = fs.createReadStream(parameters.file);
                    isGzip = false;
                    uploadFileSize = totalFileSize;
                }
                else {
                    // create a readable stream using a PassThrough stream that is both readable and writable
                    const passThrough = new stream.PassThrough();
                    passThrough.end(buffer);
                    uploadStream = passThrough;
                    uploadFileSize = buffer.byteLength;
                }
                const result = yield this.uploadChunk(httpClientIndex, parameters.resourceUrl, uploadStream, 0, uploadFileSize - 1, uploadFileSize, isGzip, totalFileSize);
                if (!result) {
                    // chunk failed to upload
                    isUploadSuccessful = false;
                    failedChunkSizes += uploadFileSize;
                    core_1.warning(`Aborting upload for ${parameters.file} due to failure`);
                }
                return {
                    isSuccess: isUploadSuccessful,
                    successfullUploadSize: uploadFileSize - failedChunkSizes,
                    totalSize: totalFileSize
                };
            }
            else {
                // the file that is being uploaded is greater than 64k in size, a temprorary file gets created on disk using the
                // npm tmp-promise package and this file gets used during compression for the GZip file that gets created
                return tmp
                    .file()
                    .then((tmpFile) => __awaiter(this, void 0, void 0, function* () {
                    // create a GZip file of the original file being uploaded, the original file should not be modified in any way
                    uploadFileSize = yield upload_gzip_1.createGZipFileOnDisk(parameters.file, tmpFile.path);
                    let uploadFilePath = tmpFile.path;
                    // compression did not help with size reduction, use the original file for upload and delete the temp GZip file
                    if (totalFileSize < uploadFileSize) {
                        uploadFileSize = totalFileSize;
                        uploadFilePath = parameters.file;
                        isGzip = false;
                        tmpFile.cleanup();
                    }
                    let abortFileUpload = false;
                    // upload only a single chunk at a time
                    while (offset < uploadFileSize) {
                        const chunkSize = Math.min(uploadFileSize - offset, parameters.maxChunkSize);
                        if (abortFileUpload) {
                            // if we don't want to continue in the event of an error, any pending upload chunks will be marked as failed
                            failedChunkSizes += chunkSize;
                            continue;
                        }
                        // if an individual file is greater than 100MB (1024*1024*100) in size, display extra information about the upload status
                        if (uploadFileSize > 104857600) {
                            this.statusReporter.updateLargeFileStatus(parameters.file, offset, uploadFileSize);
                        }
                        const start = offset;
                        const end = offset + chunkSize - 1;
                        offset += parameters.maxChunkSize;
                        const result = yield this.uploadChunk(httpClientIndex, parameters.resourceUrl, fs.createReadStream(uploadFilePath, {
                            start,
                            end,
                            autoClose: false
                        }), start, end, uploadFileSize, isGzip, totalFileSize);
                        if (!result) {
                            // Chunk failed to upload, report as failed and do not continue uploading any more chunks for the file. It is possible that part of a chunk was
                            // successfully uploaded so the server may report a different size for what was uploaded
                            isUploadSuccessful = false;
                            failedChunkSizes += chunkSize;
                            core_1.warning(`Aborting upload for ${parameters.file} due to failure`);
                            abortFileUpload = true;
                        }
                    }
                }))
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    // only after the file upload is complete and the temporary file is deleted, return the UploadResult
                    return new Promise(resolve => {
                        resolve({
                            isSuccess: isUploadSuccessful,
                            successfullUploadSize: uploadFileSize - failedChunkSizes,
                            totalSize: totalFileSize
                        });
                    });
                }));
            }
        });
    }
    /**
     * Uploads a chunk of an individual file to the specified resourceUrl. If the upload fails and the status code
     * indicates a retryable status, we try to upload the chunk as well
     * @param {number} httpClientIndex The index of the httpClient being used to make all the necessary calls
     * @param {string} resourceUrl Url of the resource that the chunk will be uploaded to
     * @param {NodeJS.ReadableStream} data Stream of the file that will be uploaded
     * @param {number} start Starting byte index of file that the chunk belongs to
     * @param {number} end Ending byte index of file that the chunk belongs to
     * @param {number} uploadFileSize Total size of the file in bytes that is being uploaded
     * @param {boolean} isGzip Denotes if we are uploading a Gzip compressed stream
     * @param {number} totalFileSize Original total size of the file that is being uploaded
     * @returns if the chunk was successfully uploaded
     */
    uploadChunk(httpClientIndex, resourceUrl, data, start, end, uploadFileSize, isGzip, totalFileSize) {
        return __awaiter(this, void 0, void 0, function* () {
            // prepare all the necessary headers before making any http call
            const requestOptions = utils_1.getRequestOptions('application/octet-stream', true, isGzip, totalFileSize, end - start + 1, utils_1.getContentRange(start, end, uploadFileSize));
            const uploadChunkRequest = () => __awaiter(this, void 0, void 0, function* () {
                const client = this.uploadHttpManager.getClient(httpClientIndex);
                return yield client.sendStream('PUT', resourceUrl, data, requestOptions);
            });
            let retryCount = 0;
            const retryLimit = config_variables_1.getUploadRetryCount();
            // allow for failed chunks to be retried multiple times
            while (retryCount <= retryLimit) {
                try {
                    const response = yield uploadChunkRequest();
                    // Always read the body of the response. There is potential for a resource leak if the body is not read which will
                    // result in the connection remaining open along with unintended consequences when trying to dispose of the client
                    yield response.readBody();
                    if (utils_1.isSuccessStatusCode(response.message.statusCode)) {
                        return true;
                    }
                    else if (utils_1.isRetryableStatusCode(response.message.statusCode)) {
                        retryCount++;
                        if (retryCount > retryLimit) {
                            core_1.info(`Retry limit has been reached for chunk at offset ${start} to ${resourceUrl}`);
                            return false;
                        }
                        else {
                            core_1.info(`HTTP ${response.message.statusCode} during chunk upload, will retry at offset ${start} after ${config_variables_1.getRetryWaitTimeInMilliseconds} milliseconds. Retry count #${retryCount}. URL ${resourceUrl}`);
                            this.uploadHttpManager.disposeAndReplaceClient(httpClientIndex);
                            yield new Promise(resolve => setTimeout(resolve, config_variables_1.getRetryWaitTimeInMilliseconds()));
                        }
                    }
                    else {
                        core_1.info(`#ERROR# Unable to upload chunk to ${resourceUrl}`);
                        // eslint-disable-next-line no-console
                        console.log(response);
                        return false;
                    }
                }
                catch (error) {
                    // eslint-disable-next-line no-console
                    console.log(error);
                    retryCount++;
                    if (retryCount > retryLimit) {
                        core_1.info(`Retry limit has been reached for chunk at offset ${start} to ${resourceUrl}`);
                        return false;
                    }
                    else {
                        core_1.info(`Retrying chunk upload after encountering an error`);
                        this.uploadHttpManager.disposeAndReplaceClient(httpClientIndex);
                        yield new Promise(resolve => setTimeout(resolve, config_variables_1.getRetryWaitTimeInMilliseconds()));
                    }
                }
            }
            return false;
        });
    }
    /**
     * Updates the size of the artifact from -1 which was initially set when the container was first created for the artifact.
     * Updating the size indicates that we are done uploading all the contents of the artifact
     */
    patchArtifactSize(size, artifactName) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestOptions = utils_1.getRequestOptions('application/json', false, false);
            const resourceUrl = new url_1.URL(utils_1.getArtifactUrl());
            resourceUrl.searchParams.append('artifactName', artifactName);
            const parameters = { Size: size };
            const data = JSON.stringify(parameters, null, 2);
            core_1.debug(`URL is ${resourceUrl.toString()}`);
            // use the first client from the httpManager, `keep-alive` is not used so the connection will close immediatly
            const client = this.uploadHttpManager.getClient(0);
            const rawResponse = yield client.patch(resourceUrl.toString(), data, requestOptions);
            const body = yield rawResponse.readBody();
            if (utils_1.isSuccessStatusCode(rawResponse.message.statusCode)) {
                core_1.debug(`Artifact ${artifactName} has been successfully uploaded, total size ${size}`);
            }
            else if (rawResponse.message.statusCode === 404) {
                throw new Error(`An Artifact with the name ${artifactName} was not found`);
            }
            else {
                // eslint-disable-next-line no-console
                console.log(body);
                throw new Error(`Unable to finish uploading artifact ${artifactName}`);
            }
        });
    }
}
exports.UploadHttpClient = UploadHttpClient;
//# sourceMappingURL=upload-http-client.js.map

/***/ }),

/***/ 83:
/***/ (function(module) {

module.exports = {"_from":"@octokit/rest@^16.43.1","_id":"@octokit/rest@16.43.1","_inBundle":false,"_integrity":"sha512-gfFKwRT/wFxq5qlNjnW2dh+qh74XgTQ2B179UX5K1HYCluioWj8Ndbgqw2PVqa1NnVJkGHp2ovMpVn/DImlmkw==","_location":"/@actions/github/@octokit/rest","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"@octokit/rest@^16.43.1","name":"@octokit/rest","escapedName":"@octokit%2frest","scope":"@octokit","rawSpec":"^16.43.1","saveSpec":null,"fetchSpec":"^16.43.1"},"_requiredBy":["/@actions/github"],"_resolved":"https://registry.npmjs.org/@octokit/rest/-/rest-16.43.1.tgz","_shasum":"3b11e7d1b1ac2bbeeb23b08a17df0b20947eda6b","_spec":"@octokit/rest@^16.43.1","_where":"/Users/ericwf/other-workspace/libcxx-actions/javascript-action/node_modules/@actions/github","author":{"name":"Gregor Martynus","url":"https://github.com/gr2m"},"bugs":{"url":"https://github.com/octokit/rest.js/issues"},"bundleDependencies":false,"bundlesize":[{"path":"./dist/octokit-rest.min.js.gz","maxSize":"33 kB"}],"contributors":[{"name":"Mike de Boer","email":"info@mikedeboer.nl"},{"name":"Fabian Jakobs","email":"fabian@c9.io"},{"name":"Joe Gallo","email":"joe@brassafrax.com"},{"name":"Gregor Martynus","url":"https://github.com/gr2m"}],"dependencies":{"@octokit/auth-token":"^2.4.0","@octokit/plugin-paginate-rest":"^1.1.1","@octokit/plugin-request-log":"^1.0.0","@octokit/plugin-rest-endpoint-methods":"2.4.0","@octokit/request":"^5.2.0","@octokit/request-error":"^1.0.2","atob-lite":"^2.0.0","before-after-hook":"^2.0.0","btoa-lite":"^1.0.0","deprecation":"^2.0.0","lodash.get":"^4.4.2","lodash.set":"^4.3.2","lodash.uniq":"^4.5.0","octokit-pagination-methods":"^1.1.0","once":"^1.4.0","universal-user-agent":"^4.0.0"},"deprecated":false,"description":"GitHub REST API client for Node.js","devDependencies":{"@gimenete/type-writer":"^0.1.3","@octokit/auth":"^1.1.1","@octokit/fixtures-server":"^5.0.6","@octokit/graphql":"^4.2.0","@types/node":"^13.1.0","bundlesize":"^0.18.0","chai":"^4.1.2","compression-webpack-plugin":"^3.1.0","cypress":"^3.0.0","glob":"^7.1.2","http-proxy-agent":"^4.0.0","lodash.camelcase":"^4.3.0","lodash.merge":"^4.6.1","lodash.upperfirst":"^4.3.1","lolex":"^5.1.2","mkdirp":"^1.0.0","mocha":"^7.0.1","mustache":"^4.0.0","nock":"^11.3.3","npm-run-all":"^4.1.2","nyc":"^15.0.0","prettier":"^1.14.2","proxy":"^1.0.0","semantic-release":"^17.0.0","sinon":"^8.0.0","sinon-chai":"^3.0.0","sort-keys":"^4.0.0","string-to-arraybuffer":"^1.0.0","string-to-jsdoc-comment":"^1.0.0","typescript":"^3.3.1","webpack":"^4.0.0","webpack-bundle-analyzer":"^3.0.0","webpack-cli":"^3.0.0"},"files":["index.js","index.d.ts","lib","plugins"],"homepage":"https://github.com/octokit/rest.js#readme","keywords":["octokit","github","rest","api-client"],"license":"MIT","name":"@octokit/rest","nyc":{"ignore":["test"]},"publishConfig":{"access":"public"},"release":{"publish":["@semantic-release/npm",{"path":"@semantic-release/github","assets":["dist/*","!dist/*.map.gz"]}]},"repository":{"type":"git","url":"git+https://github.com/octokit/rest.js.git"},"scripts":{"build":"npm-run-all build:*","build:browser":"npm-run-all build:browser:*","build:browser:development":"webpack --mode development --entry . --output-library=Octokit --output=./dist/octokit-rest.js --profile --json > dist/bundle-stats.json","build:browser:production":"webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=Octokit --output-path=./dist --output-filename=octokit-rest.min.js --devtool source-map","build:ts":"npm run -s update-endpoints:typescript","coverage":"nyc report --reporter=html && open coverage/index.html","generate-bundle-report":"webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html","lint":"prettier --check '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json","lint:fix":"prettier --write '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json","postvalidate:ts":"tsc --noEmit --target es6 test/typescript-validate.ts","prebuild:browser":"mkdirp dist/","pretest":"npm run -s lint","prevalidate:ts":"npm run -s build:ts","start-fixtures-server":"octokit-fixtures-server","test":"nyc mocha test/mocha-node-setup.js \"test/*/**/*-test.js\"","test:browser":"cypress run --browser chrome","update-endpoints":"npm-run-all update-endpoints:*","update-endpoints:fetch-json":"node scripts/update-endpoints/fetch-json","update-endpoints:typescript":"node scripts/update-endpoints/typescript","validate:ts":"tsc --target es6 --noImplicitAny index.d.ts"},"types":"index.d.ts","version":"16.43.1"};

/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 98:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(435);
/**
 * Used for managing http clients during either upload or download
 */
class HttpManager {
    constructor(clientCount) {
        if (clientCount < 1) {
            throw new Error('There must be at least one client');
        }
        this.clients = new Array(clientCount).fill(utils_1.createHttpClient());
    }
    getClient(index) {
        return this.clients[index];
    }
    // client disposal is necessary if a keep-alive connection is used to properly close the connection
    // for more information see: https://github.com/actions/http-client/blob/04e5ad73cd3fd1f5610a32116b0759eddf6570d2/index.ts#L292
    disposeAndReplaceClient(index) {
        this.clients[index].dispose();
        this.clients[index] = utils_1.createHttpClient();
    }
    disposeAndReplaceAllClients() {
        for (const [index] of this.clients.entries()) {
            this.disposeAndReplaceClient(index);
        }
    }
}
exports.HttpManager = HttpManager;
//# sourceMappingURL=http-manager.js.map

/***/ }),

/***/ 99:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const cp = __webpack_require__(129);
const parse = __webpack_require__(198);
const enoent = __webpack_require__(21);

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;


/***/ }),

/***/ 100:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = which
which.sync = whichSync

var isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

var path = __webpack_require__(277)
var COLON = isWindows ? ';' : ':'
var isexe = __webpack_require__(881)

function getNotFoundError (cmd) {
  var er = new Error('not found: ' + cmd)
  er.code = 'ENOENT'

  return er
}

function getPathInfo (cmd, opt) {
  var colon = opt.colon || COLON
  var pathEnv = opt.path || process.env.PATH || ''
  var pathExt = ['']

  pathEnv = pathEnv.split(colon)

  var pathExtExe = ''
  if (isWindows) {
    pathEnv.unshift(process.cwd())
    pathExtExe = (opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM')
    pathExt = pathExtExe.split(colon)


    // Always test the cmd itself first.  isexe will check to make sure
    // it's found in the pathExt set.
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  if (cmd.match(/\//) || isWindows && cmd.match(/\\/))
    pathEnv = ['']

  return {
    env: pathEnv,
    ext: pathExt,
    extExe: pathExtExe
  }
}

function which (cmd, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  ;(function F (i, l) {
    if (i === l) {
      if (opt.all && found.length)
        return cb(null, found)
      else
        return cb(getNotFoundError(cmd))
    }

    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && (/^\.[\\\/]/).test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    ;(function E (ii, ll) {
      if (ii === ll) return F(i + 1, l)
      var ext = pathExt[ii]
      isexe(p + ext, { pathExt: pathExtExe }, function (er, is) {
        if (!er && is) {
          if (opt.all)
            found.push(p + ext)
          else
            return cb(null, p + ext)
        }
        return E(ii + 1, ll)
      })
    })(0, pathExt.length)
  })(0, pathEnv.length)
}

function whichSync (cmd, opt) {
  opt = opt || {}

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  for (var i = 0, l = pathEnv.length; i < l; i ++) {
    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && /^\.[\\\/]/.test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    for (var j = 0, ll = pathExt.length; j < ll; j ++) {
      var cur = p + pathExt[j]
      var is
      try {
        is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}


/***/ }),

/***/ 110:
/***/ (function(module) {

module.exports = eval("require")("encoding");


/***/ }),

/***/ 120:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tr = __webpack_require__(860);
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
exports.exec = exec;
//# sourceMappingURL=exec.js.map

/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 132:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const url = __webpack_require__(835);
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env["https_proxy"] ||
            process.env["HTTPS_PROXY"];
    }
    else {
        proxyVar = process.env["http_proxy"] ||
            process.env["HTTP_PROXY"];
    }
    if (proxyVar) {
        proxyUrl = url.parse(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env["no_proxy"] || process.env["NO_PROXY"] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy.split(',').map(x => x.trim().toUpperCase()).filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 133:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = globSync
globSync.GlobSync = GlobSync

var fs = __webpack_require__(747)
var rp = __webpack_require__(544)
var minimatch = __webpack_require__(750)
var Minimatch = minimatch.Minimatch
var Glob = __webpack_require__(696).Glob
var util = __webpack_require__(669)
var path = __webpack_require__(277)
var assert = __webpack_require__(357)
var isAbsolute = __webpack_require__(829)
var common = __webpack_require__(214)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync))
    return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false)
  }
  this._finish()
}

GlobSync.prototype._finish = function () {
  assert(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null)
      for (var p in matchset) {
        try {
          p = self._makeAbs(p)
          var real = rp.realpathSync(p, self.realpathCache)
          set[real] = true
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true
          else
            throw er
        }
      }
    })
  }
  common.finish(this)
}


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert(this instanceof GlobSync)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip processing
  if (childrenIgnored(this, read))
    return

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix)
      newPattern = [prefix, e]
    else
      newPattern = [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}


GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e))
    return

  var abs = this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute) {
    e = abs
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  if (this.stat)
    this._stat(e)
}


GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries
  var lstat
  var stat
  try {
    lstat = fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE'
  else
    entries = this._readdir(abs, false)

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  var entries

  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries

  // mark and cache dir-ness
  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false)

  var len = entries.length
  var isSym = this.symlinks[abs]

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
}

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    } else {
      stat = lstat
    }
  }

  this.statCache[abs] = stat

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return false

  return c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}


/***/ }),

/***/ 135:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

const Endpoints = {
  actions: {
    cancelWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],
    createOrUpdateSecretForRepo: ["PUT /repos/{owner}/{repo}/actions/secrets/{name}"],
    createRegistrationToken: ["POST /repos/{owner}/{repo}/actions/runners/registration-token"],
    createRemoveToken: ["POST /repos/{owner}/{repo}/actions/runners/remove-token"],
    deleteArtifact: ["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    deleteSecretFromRepo: ["DELETE /repos/{owner}/{repo}/actions/secrets/{name}"],
    downloadArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{name}"],
    getSelfHostedRunner: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowJob: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listDownloadsForSelfHostedRunnerApplication: ["GET /repos/{owner}/{repo}/actions/runners/downloads"],
    listJobsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],
    listRepoWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/runs"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listSecretsForRepo: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowJobLogs: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],
    listWorkflowRunArtifacts: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],
    listWorkflowRunLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    listWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    removeSelfHostedRunner: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    checkStarringRepo: ["GET /user/starred/{owner}/{repo}", {}, {
      renamed: ["activity", "checkRepoIsStarredByAuthenticatedUser"]
    }],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: ["DELETE /notifications/threads/{thread_id}/subscription"],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscription: ["PUT /notifications", {}, {
      renamed: ["activity", "getThreadSubscriptionForAuthenticatedUser"]
    }],
    getThreadSubscriptionForAuthenticatedUser: ["GET /notifications/threads/{thread_id}/subscription"],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listEventsForOrg: ["GET /users/{username}/events/orgs/{org}", {}, {
      renamed: ["activity", "listOrgEventsForAuthenticatedUser"]
    }],
    listEventsForUser: ["GET /users/{username}/events", {}, {
      renamed: ["activity", "listEventsForAuthenticatedUser"]
    }],
    listFeeds: ["GET /feeds", {}, {
      renamed: ["activity", "getFeeds"]
    }],
    listNotifications: ["GET /notifications", {}, {
      renamed: ["activity", "listNotificationsForAuthenticatedUser"]
    }],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listNotificationsForRepo: ["GET /repos/{owner}/{repo}/notifications", {}, {
      renamed: ["activity", "listRepoNotificationsForAuthenticatedUser"]
    }],
    listOrgEventsForAuthenticatedUser: ["GET /users/{username}/events/orgs/{org}"],
    listPublicEvents: ["GET /events"],
    listPublicEventsForOrg: ["GET /orgs/{org}/events", {}, {
      renamed: ["activity", "listPublicOrgEvents"]
    }],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: ["GET /users/{username}/received_events/public"],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: ["GET /repos/{owner}/{repo}/notifications"],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markAsRead: ["PUT /notifications", {}, {
      renamed: ["activity", "markNotificationsAsRead"]
    }],
    markNotificationsAsRead: ["PUT /notifications"],
    markNotificationsAsReadForRepo: ["PUT /repos/{owner}/{repo}/notifications", {}, {
      renamed: ["activity", "markRepoNotificationsAsRead"]
    }],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: ["PUT /notifications/threads/{thread_id}/subscription"],
    starRepo: ["PUT /user/starred/{owner}/{repo}", {}, {
      renamed: ["activity", "starRepoForAuthenticatedUser"]
    }],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepo: ["DELETE /user/starred/{owner}/{repo}", {}, {
      renamed: ["activity", "unstarRepoForAuthenticatedUser"]
    }],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: ["PUT /user/installations/{installation_id}/repositories/{repository_id}", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    checkAccountIsAssociatedWithAny: ["GET /marketplace_listing/accounts/{account_id}", {}, {
      renamed: ["apps", "getSubscriptionPlanForAccount"]
    }],
    checkAccountIsAssociatedWithAnyStubbed: ["GET /marketplace_listing/stubbed/accounts/{account_id}", {}, {
      renamed: ["apps", "getSubscriptionPlanForAccountStubbed"]
    }],
    checkToken: ["POST /applications/{client_id}/token"],
    createContentAttachment: ["POST /content_references/{content_reference_id}/attachments", {
      mediaType: {
        previews: ["corsair"]
      }
    }],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationToken: ["POST /app/installations/{installation_id}/access_tokens", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}", {
      mediaType: {
        previews: ["gambit", "machine-man"]
      }
    }],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    getBySlug: ["GET /apps/{app_slug}", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    getInstallation: ["GET /app/installations/{installation_id}", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    getOrgInstallation: ["GET /orgs/{org}/installation", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    getSubscriptionPlanForAccount: ["GET /marketplace_listing/accounts/{account_id}"],
    getSubscriptionPlanForAccountStubbed: ["GET /marketplace_listing/stubbed/accounts/{account_id}"],
    getUserInstallation: ["GET /users/{username}/installation", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],
    listAccountsUserOrOrgOnPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts", {}, {
      renamed: ["apps", "listAccountsForPlan"]
    }],
    listAccountsUserOrOrgOnPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts", {}, {
      renamed: ["apps", "listAccountsForPlanStubbed"]
    }],
    listInstallationReposForAuthenticatedUser: ["GET /user/installations/{installation_id}/repositories", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    listInstallations: ["GET /app/installations", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    listInstallationsForAuthenticatedUser: ["GET /user/installations", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    listMarketplacePurchasesForAuthenticatedUser: ["GET /user/marketplace_purchases", {}, {
      renamed: ["apps", "listSubscriptionsForAuthenticatedUser"]
    }],
    listMarketplacePurchasesForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed", {}, {
      renamed: ["apps", "listSubscriptionsForAuthenticatedUserStubbed"]
    }],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listRepos: ["GET /installation/repositories", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed"],
    removeRepoFromInstallation: ["DELETE /user/installations/{installation_id}/repositories/{repository_id}", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationToken: ["DELETE /installation/token", {
      mediaType: {
        previews: ["gambit"]
      }
    }]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    listAnnotations: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    listForSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    rerequestSuite: ["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    setSuitesPreferences: ["PATCH /repos/{owner}/{repo}/check-suites/preferences", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}", {
      mediaType: {
        previews: ["antiope"]
      }
    }]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    getConductCode: ["GET /codes_of_conduct/{key}", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    getForRepo: ["GET /repos/{owner}/{repo}/community/code_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    listConductCodes: ["GET /codes_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }, {
      renamed: ["codesOfConduct", "getAllCodesOfConduct"]
    }]
  },
  emojis: {
    get: ["GET /emojis"]
  },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listPublicForUser: ["GET /users/{username}/gists", {}, {
      renamed: ["gists", "listForUser"]
    }],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getTemplate: ["GET /gitignore/templates/{name}"],
    listTemplates: ["GET /gitignore/templates"]
  },
  interactions: {
    addOrUpdateRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits", {
      mediaType: {
        previews: ["sombra"]
      }
    }],
    addOrUpdateRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits", {
      mediaType: {
        previews: ["sombra"]
      }
    }],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits", {
      mediaType: {
        previews: ["sombra"]
      }
    }],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits", {
      mediaType: {
        previews: ["sombra"]
      }
    }],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits", {
      mediaType: {
        previews: ["sombra"]
      }
    }],
    removeRestrictionsForRepo: ["DELETE /repos/{owner}/{repo}/interaction-limits", {
      mediaType: {
        previews: ["sombra"]
      }
    }]
  },
  issues: {
    addAssignees: ["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    checkAssignee: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: ["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: ["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: ["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", {
      mediaType: {
        previews: ["mockingbird"]
      }
    }],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    listMilestonesForRepo: ["GET /repos/{owner}/{repo}/milestones"],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    removeAssignees: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    removeLabel: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],
    removeLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels", {}, {
      renamed: ["issues", "removeAllLabels"]
    }],
    replaceAllLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    replaceLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels", {}, {
      renamed: ["issues", "replaceAllLabels"]
    }],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: ["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"],
    listCommonlyUsed: ["GET /licenses"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: ["POST /markdown/raw", {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    }]
  },
  meta: {
    get: ["GET /meta"]
  },
  migrations: {
    cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
    deleteArchiveForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    deleteArchiveForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    downloadArchiveForOrg: ["GET /orgs/{org}/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getArchiveForAuthenticatedUser: ["GET /user/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
    getImportProgress: ["GET /repos/{owner}/{repo}/import"],
    getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listForAuthenticatedUser: ["GET /user/migrations", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listForOrg: ["GET /orgs/{org}/migrations", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listReposForUser: ["GET /user/{migration_id}/repositories", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
    setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    startImport: ["PUT /repos/{owner}/{repo}/import"],
    unlockRepoForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    unlockRepoForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    updateImport: ["PATCH /repos/{owner}/{repo}/import"]
  },
  orgs: {
    addOrUpdateMembership: ["PUT /orgs/{org}/memberships/{username}"],
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembership: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembership: ["GET /orgs/{org}/public_members/{username}"],
    concealMembership: ["DELETE /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: ["PUT /orgs/{org}/outside_collaborators/{username}"],
    createHook: ["POST /orgs/{org}/hooks"],
    createInvitation: ["POST /orgs/{org}/invitations"],
    deleteHook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    get: ["GET /orgs/{org}"],
    getHook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getMembership: ["GET /orgs/{org}/memberships/{username}"],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    list: ["GET /organizations"],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listHooks: ["GET /orgs/{org}/hooks"],
    listInstallations: ["GET /orgs/{org}/installations", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listMembers: ["GET /orgs/{org}/members"],
    listMemberships: ["GET /user/memberships/orgs"],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    pingHook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    publicizeMembership: ["PUT /orgs/{org}/public_members/{username}"],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembership: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: ["DELETE /orgs/{org}/outside_collaborators/{username}"],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateHook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateMembership: ["PATCH /user/memberships/orgs/{org}"]
  },
  projects: {
    addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createCard: ["POST /projects/columns/{column_id}/cards", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createColumn: ["POST /projects/{project_id}/columns", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForAuthenticatedUser: ["POST /user/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForOrg: ["POST /orgs/{org}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForRepo: ["POST /repos/{owner}/{repo}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    delete: ["DELETE /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    deleteCard: ["DELETE /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    deleteColumn: ["DELETE /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    get: ["GET /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getCard: ["GET /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getColumn: ["GET /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listCards: ["GET /projects/columns/{column_id}/cards", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listCollaborators: ["GET /projects/{project_id}/collaborators", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listColumns: ["GET /projects/{project_id}/columns", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForOrg: ["GET /orgs/{org}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForRepo: ["GET /repos/{owner}/{repo}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForUser: ["GET /users/{username}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    moveCard: ["POST /projects/columns/cards/{card_id}/moves", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    moveColumn: ["POST /projects/columns/{column_id}/moves", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    removeCollaborator: ["DELETE /projects/{project_id}/collaborators/{username}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    reviewUserPermissionLevel: ["GET /projects/{project_id}/collaborators/{username}/permission", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    update: ["PATCH /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateCard: ["PATCH /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateColumn: ["PATCH /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewCommentReply: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],
    createReviewRequest: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    deleteComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    deletePendingReview: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    deleteReviewRequest: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    dismissReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    getCommentsForReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],
    getReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listComments: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listReviewRequests: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    submitReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch", {
      mediaType: {
        previews: ["lydian"]
      }
    }],
    updateComment: ["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    updateReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"]
  },
  rateLimit: {
    get: ["GET /rate_limit"]
  },
  reactions: {
    createForCommitComment: ["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForIssue: ["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForIssueComment: ["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForPullRequestReviewComment: ["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForTeamDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForTeamDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    delete: ["DELETE /reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }, {
      renamed: ["reactions", "deleteLegacy"]
    }],
    deleteForCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForIssue: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForIssueComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForPullRequestComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForTeamDiscussion: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForTeamDiscussionComment: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteLegacy: ["DELETE /reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }, {
      deprecated: "octokit.reactions.deleteLegacy() is deprecated, see https://developer.github.com/v3/reactions/#delete-a-reaction-legacy"
    }],
    listForCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForIssueComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForPullRequestReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForTeamDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForTeamDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }]
  },
  repos: {
    acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    addProtectedBranchAdminEnforcement: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    addProtectedBranchAppRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    addProtectedBranchRequiredSignatures: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    addProtectedBranchRequiredStatusChecksContexts: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    addProtectedBranchTeamRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    addProtectedBranchUserRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkVulnerabilityAlerts: ["GET /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    createCommitComment: ["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentStatus: ["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createHook: ["POST /repos/{owner}/{repo}/hooks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateFile: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createUsingTemplate: ["POST /repos/{template_owner}/{template_repo}/generate", {
      mediaType: {
        previews: ["baptiste"]
      }
    }],
    declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteDeployment: ["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],
    deleteDownload: ["DELETE /repos/{owner}/{repo}/downloads/{download_id}"],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteHook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    deleteInvitation: ["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: ["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    disableAutomatedSecurityFixes: ["DELETE /repos/{owner}/{repo}/automated-security-fixes", {
      mediaType: {
        previews: ["london"]
      }
    }],
    disablePagesSite: ["DELETE /repos/{owner}/{repo}/pages", {
      mediaType: {
        previews: ["switcheroo"]
      }
    }],
    disableVulnerabilityAlerts: ["DELETE /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    enableAutomatedSecurityFixes: ["PUT /repos/{owner}/{repo}/automated-security-fixes", {
      mediaType: {
        previews: ["london"]
      }
    }],
    enablePagesSite: ["POST /repos/{owner}/{repo}/pages", {
      mediaType: {
        previews: ["switcheroo"]
      }
    }],
    enableVulnerabilityAlerts: ["PUT /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    get: ["GET /repos/{owner}/{repo}"],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    getAppsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],
    getArchiveLink: ["GET /repos/{owner}/{repo}/{archive_format}/{ref}"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: ["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getContents: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentStatus: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],
    getDownload: ["GET /repos/{owner}/{repo}/downloads/{download_id}"],
    getHook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getProtectedBranchAdminEnforcement: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    getProtectedBranchPullRequestReviewEnforcement: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    getProtectedBranchRequiredSignatures: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    getProtectedBranchRequiredStatusChecks: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    getProtectedBranchRestrictions: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getTeamsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    list: ["GET /user/repos", {}, {
      renamed: ["repos", "listForAuthenticatedUser"]
    }],
    listAssetsForRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", {
      mediaType: {
        previews: ["groot"]
      }
    }],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    listCommitComments: ["GET /repos/{owner}/{repo}/comments"],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentStatuses: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listDownloads: ["GET /repos/{owner}/{repo}/downloads"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listHooks: ["GET /repos/{owner}/{repo}/hooks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listProtectedBranchRequiredStatusChecksContexts: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", {
      mediaType: {
        previews: ["groot"]
      }
    }],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listStatusesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listTopics: ["GET /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }, {
      renamed: ["repos", "getAllTopics"]
    }],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    pingHook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    removeBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],
    removeCollaborator: ["DELETE /repos/{owner}/{repo}/collaborators/{username}"],
    removeDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    removeProtectedBranchAdminEnforcement: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    removeProtectedBranchAppRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    removeProtectedBranchPullRequestReviewEnforcement: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    removeProtectedBranchRequiredSignatures: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    removeProtectedBranchRequiredStatusChecks: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    removeProtectedBranchRequiredStatusChecksContexts: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    removeProtectedBranchRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    removeProtectedBranchTeamRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    removeProtectedBranchUserRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    replaceProtectedBranchAppRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    replaceProtectedBranchRequiredStatusChecksContexts: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    replaceProtectedBranchTeamRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    replaceProtectedBranchUserRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    replaceTopics: ["PUT /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }, {
      renamed: ["repos", "replaceAllTopics"]
    }],
    requestPageBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    retrieveCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    testPushHook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateHook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: ["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],
    updateProtectedBranchPullRequestReviewEnforcement: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    updateProtectedBranchRequiredStatusChecks: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: ["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    uploadReleaseAsset: ["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}", {
      baseUrl: "https://uploads.github.com"
    }]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits", {
      mediaType: {
        previews: ["cloak"]
      }
    }],
    issuesAndPullRequests: ["GET /search/issues"],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics"],
    users: ["GET /search/users"]
  },
  teams: {
    addOrUpdateMembershipInOrg: ["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    addOrUpdateProjectInOrg: ["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    addOrUpdateRepoInOrg: ["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    checkManagesRepoInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    deleteDiscussionInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    getDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    getMembershipInOrg: ["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: ["GET /orgs/{org}/teams/{team_slug}/invitations"],
    listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    removeProjectInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],
    removeRepoInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    reviewProjectInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateDiscussionCommentInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    updateDiscussionInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmails: ["POST /user/emails"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowing: ["GET /user/following/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    createGpgKey: ["POST /user/gpg_keys"],
    createPublicKey: ["POST /user/keys"],
    deleteEmails: ["DELETE /user/emails"],
    deleteGpgKey: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicKey: ["DELETE /user/keys/{key_id}"],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKey: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicKey: ["GET /user/keys/{key_id}"],
    list: ["GET /users"],
    listBlocked: ["GET /user/blocks"],
    listEmails: ["GET /user/emails"],
    listFollowedByAuthenticated: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForAuthenticatedUser: ["GET /user/following", {}, {
      renamed: ["users", "listFollowedByAuthenticated"]
    }],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeys: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmails: ["GET /user/public_emails"],
    listPublicKeys: ["GET /user/keys"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    togglePrimaryEmailVisibility: ["PATCH /user/email/visibility"],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};

const VERSION = "3.4.0";

function endpointsToMethods(octokit, endpointsMap) {
  const newMethods = {};

  for (const [scope, endpoints] of Object.entries(endpointsMap)) {
    for (const [methodName, endpoint] of Object.entries(endpoints)) {
      const [route, defaults, decorations] = endpoint;
      const [method, url] = route.split(/ /);
      const endpointDefaults = Object.assign({
        method,
        url
      }, defaults);

      if (!newMethods[scope]) {
        newMethods[scope] = {};
      }

      const scopeMethods = newMethods[scope];

      if (decorations) {
        scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
        continue;
      }

      scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
    }
  }

  return newMethods;
}

function decorate(octokit, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit.request.defaults(defaults);

  function withDecorations(...args) {
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
    let options = requestWithDefaults.endpoint.merge(...args); // There are currently no other decorations than `.mapToData`

    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: undefined
      });
      return requestWithDefaults(options);
    } // NOTE: there are currently no deprecations. But we keep the code
    //       below for future reference


    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
    }

    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    } // There currently are no renamed parameters
    // if (decorations.renamedParameters) {
    //   // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
    //   const options = requestWithDefaults.endpoint.merge(...args);
    //   for (const [name, alias] of Object.entries(
    //     decorations.renamedParameters
    //   )) {
    //     if (name in options) {
    //       octokit.log.warn(
    //         `"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`
    //       );
    //       if (!(alias in options)) {
    //         options[alias] = options[name];
    //       }
    //       delete options[name];
    //     }
    //   }
    //   return requestWithDefaults(options);
    // }
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488


    return requestWithDefaults(...args);
  }

  return Object.assign(withDecorations, requestWithDefaults);
}

/**
 * This plugin is a 1:1 copy of internal @octokit/rest plugins. The primary
 * goal is to rebuild @octokit/rest on top of @octokit/core. Once that is
 * done, we will remove the registerEndpoints methods and return the methods
 * directly as with the other plugins. At that point we will also remove the
 * legacy workarounds and deprecations.
 *
 * See the plan at
 * https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/1
 */

function restEndpointMethods(octokit) {
  return endpointsToMethods(octokit, Endpoints);
}
restEndpointMethods.VERSION = VERSION;

exports.restEndpointMethods = restEndpointMethods;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 147:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

// Older verions of Node.js might not have `util.getSystemErrorName()`.
// In that case, fall back to a deprecated internal.
const util = __webpack_require__(669);

let uv;

if (typeof util.getSystemErrorName === 'function') {
	module.exports = util.getSystemErrorName;
} else {
	try {
		uv = process.binding('uv');

		if (typeof uv.errname !== 'function') {
			throw new TypeError('uv.errname is not a function');
		}
	} catch (err) {
		console.error('execa/lib/errname: unable to establish process.binding(\'uv\')', err);
		uv = null;
	}

	module.exports = code => errname(uv, code);
}

// Used for testing the fallback behavior
module.exports.__test__ = errname;

function errname(uv, code) {
	if (uv) {
		return uv.errname(code);
	}

	if (!(code < 0)) {
		throw new Error('err >= 0');
	}

	return `Unknown system error ${code}`;
}



/***/ }),

/***/ 148:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Originally pulled from https://github.com/JasonEtco/actions-toolkit/blob/master/src/github.ts
const graphql_1 = __webpack_require__(71);
const rest_1 = __webpack_require__(606);
const Context = __importStar(__webpack_require__(390));
const httpClient = __importStar(__webpack_require__(7));
// We need this in order to extend Octokit
rest_1.Octokit.prototype = new rest_1.Octokit();
exports.context = new Context.Context();
class GitHub extends rest_1.Octokit {
    constructor(token, opts) {
        super(GitHub.getOctokitOptions(GitHub.disambiguate(token, opts)));
        this.graphql = GitHub.getGraphQL(GitHub.disambiguate(token, opts));
    }
    /**
     * Disambiguates the constructor overload parameters
     */
    static disambiguate(token, opts) {
        return [
            typeof token === 'string' ? token : '',
            typeof token === 'object' ? token : opts || {}
        ];
    }
    static getOctokitOptions(args) {
        const token = args[0];
        const options = Object.assign({}, args[1]); // Shallow clone - don't mutate the object provided by the caller
        // Auth
        const auth = GitHub.getAuthString(token, options);
        if (auth) {
            options.auth = auth;
        }
        // Proxy
        const agent = GitHub.getProxyAgent(options);
        if (agent) {
            // Shallow clone - don't mutate the object provided by the caller
            options.request = options.request ? Object.assign({}, options.request) : {};
            // Set the agent
            options.request.agent = agent;
        }
        return options;
    }
    static getGraphQL(args) {
        const defaults = {};
        const token = args[0];
        const options = args[1];
        // Authorization
        const auth = this.getAuthString(token, options);
        if (auth) {
            defaults.headers = {
                authorization: auth
            };
        }
        // Proxy
        const agent = GitHub.getProxyAgent(options);
        if (agent) {
            defaults.request = { agent };
        }
        return graphql_1.graphql.defaults(defaults);
    }
    static getAuthString(token, options) {
        // Validate args
        if (!token && !options.auth) {
            throw new Error('Parameter token or opts.auth is required');
        }
        else if (token && options.auth) {
            throw new Error('Parameters token and opts.auth may not both be specified');
        }
        return typeof options.auth === 'string' ? options.auth : `token ${token}`;
    }
    static getProxyAgent(options) {
        var _a;
        if (!((_a = options.request) === null || _a === void 0 ? void 0 : _a.agent)) {
            const serverUrl = 'https://api.github.com';
            if (httpClient.getProxyUrl(serverUrl)) {
                const hc = new httpClient.HttpClient();
                return hc.getAgent(serverUrl);
            }
        }
        return undefined;
    }
}
exports.GitHub = GitHub;
//# sourceMappingURL=github.js.map

/***/ }),

/***/ 154:
/***/ (function(module) {

"use strict";


/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

module.exports = isPlainObject;


/***/ }),

/***/ 162:
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    Set = getNative(root, 'Set'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each
 * element is kept.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length)
    ? baseUniq(array)
    : [];
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = uniq;


/***/ }),

/***/ 170:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasFirstPage

const deprecate = __webpack_require__(307)
const getPageLinks = __webpack_require__(327)

function hasFirstPage (link) {
  deprecate(`octokit.hasFirstPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).first
}


/***/ }),

/***/ 171:
/***/ (function(module) {

module.exports = register

function register (state, name, method, options) {
  if (typeof method !== 'function') {
    throw new Error('method for before hook must be a function')
  }

  if (!options) {
    options = {}
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options)
    }, method)()
  }

  return Promise.resolve()
    .then(function () {
      if (!state.registry[name]) {
        return method(options)
      }

      return (state.registry[name]).reduce(function (method, registered) {
        return registered.hook.bind(null, method, options)
      }, method)()
    })
}


/***/ }),

/***/ 181:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

function DOMParser(options){
	this.options = options ||{locator:{}};
}

DOMParser.prototype.parseFromString = function(source,mimeType){
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var isHTML = /\/x?html?$/.test(mimeType);//mimeType.toLowerCase().indexOf('html') > -1;
  	var entityMap = isHTML?htmlEntity.entityMap:{'lt':'<','gt':'>','amp':'&','quot':'"','apos':"'"};
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}

	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(isHTML){
		defaultNSMap['']= 'http://www.w3.org/1999/xhtml';
	}
	defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';
	if(source){
		sax.parse(source,defaultNSMap,entityMap);
	}else{
		sax.errorHandler.error("invalid doc source");
	}
	return domBuilder.doc;
}
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {}
	var isCallback = errorImpl instanceof Function;
	locator = locator||{}
	function build(key){
		var fn = errorImpl[key];
		if(!fn && isCallback){
			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg)}:errorImpl;
		}
		errorHandler[key] = fn && function(msg){
			fn('[xmldom '+key+']\t'+msg+_locator(locator));
		}||function(){};
	}
	build('warning');
	build('error');
	build('fatalError');
	return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler
 *
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */
DOMHandler.prototype = {
	startDocument : function() {
    	this.doc = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.doc.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.doc;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;

		this.locator && position(this.locator,el)
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			this.locator &&position(attrs.getLocator(i),attr);
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr)
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement
		var tagName = current.tagName;
		this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.doc.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins)
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
		//console.log(chars)
		if(chars){
			if (this.cdata) {
				var charNode = this.doc.createCDATASection(chars);
			} else {
				var charNode = this.doc.createTextNode(chars);
			}
			if(this.currentElement){
				this.currentElement.appendChild(charNode);
			}else if(/^\s*$/.test(chars)){
				this.doc.appendChild(charNode);
				//process xml
			}
			this.locator && position(this.locator,charNode)
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.doc.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
	    var comm = this.doc.createComment(chars);
	    this.locator && position(this.locator,comm)
	    appendElement(this, comm);
	},

	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},

	startDTD:function(name, publicId, systemId) {
		var impl = this.doc.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt)
	        appendElement(this, dt);
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
	},
	error:function(error) {
		console.error('[xmldom error]\t'+error,_locator(this.locator));
	},
	fatalError:function(error) {
		console.error('[xmldom fatalError]\t'+error,_locator(this.locator));
	    throw error;
	}
}
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else{//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null}
})

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.doc.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

//if(typeof require == 'function'){
var htmlEntity = __webpack_require__(497);
var XMLReader = __webpack_require__(907).XMLReader;
var DOMImplementation = exports.DOMImplementation = __webpack_require__(703).DOMImplementation;
exports.XMLSerializer = __webpack_require__(703).XMLSerializer ;
exports.DOMParser = DOMParser;
//}


/***/ }),

/***/ 183:
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(870);

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),

/***/ 198:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(277);
const niceTry = __webpack_require__(23);
const resolveCommand = __webpack_require__(386);
const escape = __webpack_require__(597);
const readShebang = __webpack_require__(983);
const semver = __webpack_require__(806);

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

// `options.shell` is supported in Node ^4.8.0, ^5.7.0 and >= 6.0.0
const supportsShellOption = niceTry(() => semver.satisfies(process.version, '^4.8.0 || ^5.7.0 || >= 6.0.0', true)) || false;

function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);

    const shebang = parsed.file && readShebang(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path.normalize(parsed.command);

        // Escape command & arguments
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parseShell(parsed) {
    // If node supports the shell option, there's no need to mimic its behavior
    if (supportsShellOption) {
        return parsed;
    }

    // Mimic node shell option
    // See https://github.com/nodejs/node/blob/b9f6a2dc059a1062776133f3d4fd848c4da7d150/lib/child_process.js#L335
    const shellCommand = [parsed.command].concat(parsed.args).join(' ');

    if (isWin) {
        parsed.command = typeof parsed.options.shell === 'string' ? parsed.options.shell : process.env.comspec || 'cmd.exe';
        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    } else {
        if (typeof parsed.options.shell === 'string') {
            parsed.command = parsed.options.shell;
        } else if (process.platform === 'android') {
            parsed.command = '/system/bin/sh';
        } else {
            parsed.command = '/bin/sh';
        }

        parsed.args = ['-c', shellCommand];
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parseShell(parsed) : parseNonShell(parsed);
}

module.exports = parse;


/***/ }),

/***/ 208:
/***/ (function(module) {

module.exports = eval("require")("xunit-viewer");


/***/ }),

/***/ 211:
/***/ (function(module) {

module.exports = require("https");

/***/ }),

/***/ 214:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

exports.alphasort = alphasort
exports.alphasorti = alphasorti
exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var path = __webpack_require__(277)
var minimatch = __webpack_require__(750)
var isAbsolute = __webpack_require__(829)
var Minimatch = minimatch.Minimatch

function alphasorti (a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase())
}

function alphasort (a, b) {
  return a.localeCompare(b)
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || []

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore]

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap)
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts (self, pattern, options) {
  if (!options)
    options = {}

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir)
    self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, "cwd"))
    self.cwd = cwd
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, "/")
  self.root = path.resolve(self.root)
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/")

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
  self.nomount = !!options.nomount

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true
  options.nocomment = true

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish (self) {
  var nou = self.nounique
  var all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i]
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i]
        if (nou)
          all.push(literal)
        else
          all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou)
        all.push.apply(all, m)
      else
        m.forEach(function (m) {
          all[m] = true
        })
    }
  }

  if (!nou)
    all = Object.keys(all)

  if (!self.nosort)
    all = all.sort(self.nocase ? alphasorti : alphasort)

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i])
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e))
        var c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark (self, p) {
  var abs = makeAbs(self, p)
  var c = self.cache[abs]
  var m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c)
    var slash = p.slice(-1) === '/'

    if (isDir && !slash)
      m += '/'
    else if (!isDir && slash)
      m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f)
  } else if (isAbsolute(f) || f === '') {
    abs = f
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f)
  } else {
    abs = path.resolve(f)
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/')

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}


/***/ }),

/***/ 215:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return (s || '')
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return (s || '')
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 219:
/***/ (function(module) {

"use strict";

module.exports = (promise, onFinally) => {
	onFinally = onFinally || (() => {});

	return promise.then(
		val => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => val),
		err => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => {
			throw err;
		})
	);
};


/***/ }),

/***/ 222:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const path = __webpack_require__(277);
const pathKey = __webpack_require__(839);

module.exports = opts => {
	opts = Object.assign({
		cwd: process.cwd(),
		path: process.env[pathKey()]
	}, opts);

	let prev;
	let pth = path.resolve(opts.cwd);
	const ret = [];

	while (prev !== pth) {
		ret.push(path.join(pth, 'node_modules/.bin'));
		prev = pth;
		pth = path.resolve(pth, '..');
	}

	// ensure the running `node` binary is used
	ret.push(path.dirname(process.execPath));

	return ret.concat(opts.path).join(path.delimiter);
};

module.exports.env = opts => {
	opts = Object.assign({
		env: process.env
	}, opts);

	const env = Object.assign({}, opts.env);
	const path = pathKey({env});

	opts.path = env[path];
	env[path] = module.exports(opts);

	return env;
};


/***/ }),

/***/ 252:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = __webpack_require__(990);


/***/ }),

/***/ 256:
/***/ (function(module) {

"use strict";

const alias = ['stdin', 'stdout', 'stderr'];

const hasAlias = opts => alias.some(x => Boolean(opts[x]));

module.exports = opts => {
	if (!opts) {
		return null;
	}

	if (opts.stdio && hasAlias(opts)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${alias.map(x => `\`${x}\``).join(', ')}`);
	}

	if (typeof opts.stdio === 'string') {
		return opts.stdio;
	}

	const stdio = opts.stdio || [];

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const result = [];
	const len = Math.max(stdio.length, alias.length);

	for (let i = 0; i < len; i++) {
		let value = null;

		if (stdio[i] !== undefined) {
			value = stdio[i];
		} else if (opts[alias[i]] !== undefined) {
			value = opts[alias[i]];
		}

		result[i] = value;
	}

	return result;
};


/***/ }),

/***/ 265:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationPlugin;

const { createTokenAuth } = __webpack_require__(268);
const { Deprecation } = __webpack_require__(593);
const once = __webpack_require__(870);

const beforeRequest = __webpack_require__(618);
const requestError = __webpack_require__(492);
const validate = __webpack_require__(844);
const withAuthorizationPrefix = __webpack_require__(398);

const deprecateAuthBasic = once((log, deprecation) => log.warn(deprecation));
const deprecateAuthObject = once((log, deprecation) => log.warn(deprecation));

function authenticationPlugin(octokit, options) {
  // If `options.authStrategy` is set then use it and pass in `options.auth`
  if (options.authStrategy) {
    const auth = options.authStrategy(options.auth);
    octokit.hook.wrap("request", auth.hook);
    octokit.auth = auth;
    return;
  }

  // If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
  // is unauthenticated. The `octokit.auth()` method is a no-op and no request hook is registred.
  if (!options.auth) {
    octokit.auth = () =>
      Promise.resolve({
        type: "unauthenticated"
      });
    return;
  }

  const isBasicAuthString =
    typeof options.auth === "string" &&
    /^basic/.test(withAuthorizationPrefix(options.auth));

  // If only `options.auth` is set to a string, use the default token authentication strategy.
  if (typeof options.auth === "string" && !isBasicAuthString) {
    const auth = createTokenAuth(options.auth);
    octokit.hook.wrap("request", auth.hook);
    octokit.auth = auth;
    return;
  }

  // Otherwise log a deprecation message
  const [deprecationMethod, deprecationMessapge] = isBasicAuthString
    ? [
        deprecateAuthBasic,
        'Setting the "new Octokit({ auth })" option to a Basic Auth string is deprecated. Use https://github.com/octokit/auth-basic.js instead. See (https://octokit.github.io/rest.js/#authentication)'
      ]
    : [
        deprecateAuthObject,
        'Setting the "new Octokit({ auth })" option to an object without also setting the "authStrategy" option is deprecated and will be removed in v17. See (https://octokit.github.io/rest.js/#authentication)'
      ];
  deprecationMethod(
    octokit.log,
    new Deprecation("[@octokit/rest] " + deprecationMessapge)
  );

  octokit.auth = () =>
    Promise.resolve({
      type: "deprecated",
      message: deprecationMessapge
    });

  validate(options.auth);

  const state = {
    octokit,
    auth: options.auth
  };

  octokit.hook.before("request", beforeRequest.bind(null, state));
  octokit.hook.error("request", requestError.bind(null, state));
}


/***/ }),

/***/ 268:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

async function auth(token) {
  const tokenType = token.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token) ? "installation" : "oauth";
  return {
    type: "token",
    token: token,
    tokenType
  };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }

  return `token ${token}`;
}

async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(route, parameters);
  endpoint.headers.authorization = withAuthorizationPrefix(token);
  return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }

  if (typeof token !== "string") {
    throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
  }

  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

exports.createTokenAuth = createTokenAuth;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 276:
/***/ (function(module, __unusedexports, __webpack_require__) {

try {
  var util = __webpack_require__(669);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __webpack_require__(851);
}


/***/ }),

/***/ 277:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 281:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getLastPage

const getPage = __webpack_require__(22)

function getLastPage (octokit, link, headers) {
  return getPage(octokit, link, 'last', headers)
}


/***/ }),

/***/ 292:
/***/ (function(module, __unusedexports, __webpack_require__) {

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
var assert = __webpack_require__(357)
var signals = __webpack_require__(776)
var isWin = /^win/i.test(process.platform)

var EE = __webpack_require__(614)
/* istanbul ignore if */
if (typeof EE !== 'function') {
  EE = EE.EventEmitter
}

var emitter
if (process.__signal_exit_emitter__) {
  emitter = process.__signal_exit_emitter__
} else {
  emitter = process.__signal_exit_emitter__ = new EE()
  emitter.count = 0
  emitter.emitted = {}
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
  emitter.setMaxListeners(Infinity)
  emitter.infinite = true
}

module.exports = function (cb, opts) {
  assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

  if (loaded === false) {
    load()
  }

  var ev = 'exit'
  if (opts && opts.alwaysLast) {
    ev = 'afterexit'
  }

  var remove = function () {
    emitter.removeListener(ev, cb)
    if (emitter.listeners('exit').length === 0 &&
        emitter.listeners('afterexit').length === 0) {
      unload()
    }
  }
  emitter.on(ev, cb)

  return remove
}

module.exports.unload = unload
function unload () {
  if (!loaded) {
    return
  }
  loaded = false

  signals.forEach(function (sig) {
    try {
      process.removeListener(sig, sigListeners[sig])
    } catch (er) {}
  })
  process.emit = originalProcessEmit
  process.reallyExit = originalProcessReallyExit
  emitter.count -= 1
}

function emit (event, code, signal) {
  if (emitter.emitted[event]) {
    return
  }
  emitter.emitted[event] = true
  emitter.emit(event, code, signal)
}

// { <signal>: <listener fn>, ... }
var sigListeners = {}
signals.forEach(function (sig) {
  sigListeners[sig] = function listener () {
    // If there are no other listeners, an exit is coming!
    // Simplest way: remove us and then re-send the signal.
    // We know that this will kill the process, so we can
    // safely emit now.
    var listeners = process.listeners(sig)
    if (listeners.length === emitter.count) {
      unload()
      emit('exit', null, sig)
      /* istanbul ignore next */
      emit('afterexit', null, sig)
      /* istanbul ignore next */
      if (isWin && sig === 'SIGHUP') {
        // "SIGHUP" throws an `ENOSYS` error on Windows,
        // so use a supported signal instead
        sig = 'SIGINT'
      }
      process.kill(process.pid, sig)
    }
  }
})

module.exports.signals = function () {
  return signals
}

module.exports.load = load

var loaded = false

function load () {
  if (loaded) {
    return
  }
  loaded = true

  // This is the number of onSignalExit's that are in play.
  // It's important so that we can count the correct number of
  // listeners on signals, and don't wait for the other one to
  // handle it instead of us.
  emitter.count += 1

  signals = signals.filter(function (sig) {
    try {
      process.on(sig, sigListeners[sig])
      return true
    } catch (er) {
      return false
    }
  })

  process.emit = processEmit
  process.reallyExit = processReallyExit
}

var originalProcessReallyExit = process.reallyExit
function processReallyExit (code) {
  process.exitCode = code || 0
  emit('exit', process.exitCode, null)
  /* istanbul ignore next */
  emit('afterexit', process.exitCode, null)
  /* istanbul ignore next */
  originalProcessReallyExit.call(process, process.exitCode)
}

var originalProcessEmit = process.emit
function processEmit (ev, arg) {
  if (ev === 'exit') {
    if (arg !== undefined) {
      process.exitCode = arg
    }
    var ret = originalProcessEmit.apply(this, arguments)
    emit('exit', process.exitCode, null)
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null)
    return ret
  } else {
    return originalProcessEmit.apply(this, arguments)
  }
}


/***/ }),

/***/ 305:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const pump = __webpack_require__(631);
const bufferStream = __webpack_require__(314);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = Object.assign({maxBuffer: Infinity}, options);

	const {maxBuffer} = options;

	let stream;
	return new Promise((resolve, reject) => {
		const rejectPromise = error => {
			if (error) { // A null check
				error.bufferedData = stream.getBufferedValue();
			}
			reject(error);
		};

		stream = pump(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	}).then(() => stream.getBufferedValue());
}

module.exports = getStream;
module.exports.buffer = (stream, options) => getStream(stream, Object.assign({}, options, {encoding: 'buffer'}));
module.exports.array = (stream, options) => getStream(stream, Object.assign({}, options, {array: true}));
module.exports.MaxBufferError = MaxBufferError;


/***/ }),

/***/ 307:
/***/ (function(module) {

module.exports = deprecate

const loggedMessages = {}

function deprecate (message) {
  if (loggedMessages[message]) {
    return
  }

  console.warn(`DEPRECATED (@octokit/rest): ${message}`)
  loggedMessages[message] = 1
}


/***/ }),

/***/ 309:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getPreviousPage

const getPage = __webpack_require__(22)

function getPreviousPage (octokit, link, headers) {
  return getPage(octokit, link, 'prev', headers)
}


/***/ }),

/***/ 314:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {PassThrough} = __webpack_require__(413);

module.exports = options => {
	options = Object.assign({}, options);

	const {array} = options;
	let {encoding} = options;
	const buffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || buffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (buffer) {
		encoding = null;
	}

	let len = 0;
	const ret = [];
	const stream = new PassThrough({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	stream.on('data', chunk => {
		ret.push(chunk);

		if (objectMode) {
			len = ret.length;
		} else {
			len += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return ret;
		}

		return buffer ? Buffer.concat(ret, len) : ret.join('');
	};

	stream.getBufferedLength = () => len;

	return stream;
};


/***/ }),

/***/ 318:
/***/ (function(module) {

module.exports = removeHook

function removeHook (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name]
    .map(function (registered) { return registered.orig })
    .indexOf(method)

  if (index === -1) {
    return
  }

  state.registry[name].splice(index, 1)
}


/***/ }),

/***/ 327:
/***/ (function(module) {

module.exports = getPageLinks

function getPageLinks (link) {
  link = link.link || link.headers.link || ''

  const links = {}

  // link format:
  // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
  link.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (m, uri, type) => {
    links[type] = uri
  })

  return links
}


/***/ }),

/***/ 337:
/***/ (function(module, __unusedexports, __webpack_require__) {

/*!
 * Tmp
 *
 * Copyright (c) 2011-2017 KARASZI Istvan <github@spam.raszi.hu>
 *
 * MIT Licensed
 */

/*
 * Module dependencies.
 */
const fs = __webpack_require__(747);
const os = __webpack_require__(87);
const path = __webpack_require__(277);
const crypto = __webpack_require__(417);
const _c = fs.constants && os.constants ?
  { fs: fs.constants, os: os.constants } :
  process.binding('constants');
const rimraf = __webpack_require__(700);

/*
 * The working inner variables.
 */
const
  // the random characters to choose from
  RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',

  TEMPLATE_PATTERN = /XXXXXX/,

  DEFAULT_TRIES = 3,

  CREATE_FLAGS = (_c.O_CREAT || _c.fs.O_CREAT) | (_c.O_EXCL || _c.fs.O_EXCL) | (_c.O_RDWR || _c.fs.O_RDWR),

  EBADF = _c.EBADF || _c.os.errno.EBADF,
  ENOENT = _c.ENOENT || _c.os.errno.ENOENT,

  DIR_MODE = 448 /* 0o700 */,
  FILE_MODE = 384 /* 0o600 */,

  EXIT = 'exit',

  SIGINT = 'SIGINT',

  // this will hold the objects need to be removed on exit
  _removeObjects = [];

var
  _gracefulCleanup = false;

/**
 * Random name generator based on crypto.
 * Adapted from http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
 *
 * @param {number} howMany
 * @returns {string} the generated random name
 * @private
 */
function _randomChars(howMany) {
  var
    value = [],
    rnd = null;

  // make sure that we do not fail because we ran out of entropy
  try {
    rnd = crypto.randomBytes(howMany);
  } catch (e) {
    rnd = crypto.pseudoRandomBytes(howMany);
  }

  for (var i = 0; i < howMany; i++) {
    value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
  }

  return value.join('');
}

/**
 * Checks whether the `obj` parameter is defined or not.
 *
 * @param {Object} obj
 * @returns {boolean} true if the object is undefined
 * @private
 */
function _isUndefined(obj) {
  return typeof obj === 'undefined';
}

/**
 * Parses the function arguments.
 *
 * This function helps to have optional arguments.
 *
 * @param {(Options|Function)} options
 * @param {Function} callback
 * @returns {Array} parsed arguments
 * @private
 */
function _parseArguments(options, callback) {
  /* istanbul ignore else */
  if (typeof options === 'function') {
    return [{}, options];
  }

  /* istanbul ignore else */
  if (_isUndefined(options)) {
    return [{}, callback];
  }

  return [options, callback];
}

/**
 * Generates a new temporary name.
 *
 * @param {Object} opts
 * @returns {string} the new random name according to opts
 * @private
 */
function _generateTmpName(opts) {

  const tmpDir = _getTmpDir();

  // fail early on missing tmp dir
  if (isBlank(opts.dir) && isBlank(tmpDir)) {
    throw new Error('No tmp dir specified');
  }

  /* istanbul ignore else */
  if (!isBlank(opts.name)) {
    return path.join(opts.dir || tmpDir, opts.name);
  }

  // mkstemps like template
  // opts.template has already been guarded in tmpName() below
  /* istanbul ignore else */
  if (opts.template) {
    var template = opts.template;
    // make sure that we prepend the tmp path if none was given
    /* istanbul ignore else */
    if (path.basename(template) === template)
      template = path.join(opts.dir || tmpDir, template);
    return template.replace(TEMPLATE_PATTERN, _randomChars(6));
  }

  // prefix and postfix
  const name = [
    (isBlank(opts.prefix) ? 'tmp-' : opts.prefix),
    process.pid,
    _randomChars(12),
    (opts.postfix ? opts.postfix : '')
  ].join('');

  return path.join(opts.dir || tmpDir, name);
}

/**
 * Gets a temporary file name.
 *
 * @param {(Options|tmpNameCallback)} options options or callback
 * @param {?tmpNameCallback} callback the callback function
 */
function tmpName(options, callback) {
  var
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1],
    tries = !isBlank(opts.name) ? 1 : opts.tries || DEFAULT_TRIES;

  /* istanbul ignore else */
  if (isNaN(tries) || tries < 0)
    return cb(new Error('Invalid tries'));

  /* istanbul ignore else */
  if (opts.template && !opts.template.match(TEMPLATE_PATTERN))
    return cb(new Error('Invalid template provided'));

  (function _getUniqueName() {
    try {
      const name = _generateTmpName(opts);

      // check whether the path exists then retry if needed
      fs.stat(name, function (err) {
        /* istanbul ignore else */
        if (!err) {
          /* istanbul ignore else */
          if (tries-- > 0) return _getUniqueName();

          return cb(new Error('Could not get a unique tmp filename, max tries reached ' + name));
        }

        cb(null, name);
      });
    } catch (err) {
      cb(err);
    }
  }());
}

/**
 * Synchronous version of tmpName.
 *
 * @param {Object} options
 * @returns {string} the generated random name
 * @throws {Error} if the options are invalid or could not generate a filename
 */
function tmpNameSync(options) {
  var
    args = _parseArguments(options),
    opts = args[0],
    tries = !isBlank(opts.name) ? 1 : opts.tries || DEFAULT_TRIES;

  /* istanbul ignore else */
  if (isNaN(tries) || tries < 0)
    throw new Error('Invalid tries');

  /* istanbul ignore else */
  if (opts.template && !opts.template.match(TEMPLATE_PATTERN))
    throw new Error('Invalid template provided');

  do {
    const name = _generateTmpName(opts);
    try {
      fs.statSync(name);
    } catch (e) {
      return name;
    }
  } while (tries-- > 0);

  throw new Error('Could not get a unique tmp filename, max tries reached');
}

/**
 * Creates and opens a temporary file.
 *
 * @param {(Options|fileCallback)} options the config options or the callback function
 * @param {?fileCallback} callback
 */
function file(options, callback) {
  var
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1];

  // gets a temporary filename
  tmpName(opts, function _tmpNameCreated(err, name) {
    /* istanbul ignore else */
    if (err) return cb(err);

    // create and open the file
    fs.open(name, CREATE_FLAGS, opts.mode || FILE_MODE, function _fileCreated(err, fd) {
      /* istanbul ignore else */
      if (err) return cb(err);

      if (opts.discardDescriptor) {
        return fs.close(fd, function _discardCallback(err) {
          /* istanbul ignore else */
          if (err) {
            // Low probability, and the file exists, so this could be
            // ignored.  If it isn't we certainly need to unlink the
            // file, and if that fails too its error is more
            // important.
            try {
              fs.unlinkSync(name);
            } catch (e) {
              if (!isENOENT(e)) {
                err = e;
              }
            }
            return cb(err);
          }
          cb(null, name, undefined, _prepareTmpFileRemoveCallback(name, -1, opts));
        });
      }
      /* istanbul ignore else */
      if (opts.detachDescriptor) {
        return cb(null, name, fd, _prepareTmpFileRemoveCallback(name, -1, opts));
      }
      cb(null, name, fd, _prepareTmpFileRemoveCallback(name, fd, opts));
    });
  });
}

/**
 * Synchronous version of file.
 *
 * @param {Options} options
 * @returns {FileSyncObject} object consists of name, fd and removeCallback
 * @throws {Error} if cannot create a file
 */
function fileSync(options) {
  var
    args = _parseArguments(options),
    opts = args[0];

  const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
  const name = tmpNameSync(opts);
  var fd = fs.openSync(name, CREATE_FLAGS, opts.mode || FILE_MODE);
  /* istanbul ignore else */
  if (opts.discardDescriptor) {
    fs.closeSync(fd);
    fd = undefined;
  }

  return {
    name: name,
    fd: fd,
    removeCallback: _prepareTmpFileRemoveCallback(name, discardOrDetachDescriptor ? -1 : fd, opts)
  };
}

/**
 * Creates a temporary directory.
 *
 * @param {(Options|dirCallback)} options the options or the callback function
 * @param {?dirCallback} callback
 */
function dir(options, callback) {
  var
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1];

  // gets a temporary filename
  tmpName(opts, function _tmpNameCreated(err, name) {
    /* istanbul ignore else */
    if (err) return cb(err);

    // create the directory
    fs.mkdir(name, opts.mode || DIR_MODE, function _dirCreated(err) {
      /* istanbul ignore else */
      if (err) return cb(err);

      cb(null, name, _prepareTmpDirRemoveCallback(name, opts));
    });
  });
}

/**
 * Synchronous version of dir.
 *
 * @param {Options} options
 * @returns {DirSyncObject} object consists of name and removeCallback
 * @throws {Error} if it cannot create a directory
 */
function dirSync(options) {
  var
    args = _parseArguments(options),
    opts = args[0];

  const name = tmpNameSync(opts);
  fs.mkdirSync(name, opts.mode || DIR_MODE);

  return {
    name: name,
    removeCallback: _prepareTmpDirRemoveCallback(name, opts)
  };
}

/**
 * Removes files asynchronously.
 *
 * @param {Object} fdPath
 * @param {Function} next
 * @private
 */
function _removeFileAsync(fdPath, next) {
  const _handler = function (err) {
    if (err && !isENOENT(err)) {
      // reraise any unanticipated error
      return next(err);
    }
    next();
  }

  if (0 <= fdPath[0])
    fs.close(fdPath[0], function (err) {
      fs.unlink(fdPath[1], _handler);
    });
  else fs.unlink(fdPath[1], _handler);
}

/**
 * Removes files synchronously.
 *
 * @param {Object} fdPath
 * @private
 */
function _removeFileSync(fdPath) {
  try {
    if (0 <= fdPath[0]) fs.closeSync(fdPath[0]);
  } catch (e) {
    // reraise any unanticipated error
    if (!isEBADF(e) && !isENOENT(e)) throw e;
  } finally {
    try {
      fs.unlinkSync(fdPath[1]);
    }
    catch (e) {
      // reraise any unanticipated error
      if (!isENOENT(e)) throw e;
    }
  }
}

/**
 * Prepares the callback for removal of the temporary file.
 *
 * @param {string} name the path of the file
 * @param {number} fd file descriptor
 * @param {Object} opts
 * @returns {fileCallback}
 * @private
 */
function _prepareTmpFileRemoveCallback(name, fd, opts) {
  const removeCallbackSync = _prepareRemoveCallback(_removeFileSync, [fd, name]);
  const removeCallback = _prepareRemoveCallback(_removeFileAsync, [fd, name], removeCallbackSync);

  if (!opts.keep) _removeObjects.unshift(removeCallbackSync);

  return removeCallback;
}

/**
 * Simple wrapper for rimraf.
 *
 * @param {string} dirPath
 * @param {Function} next
 * @private
 */
function _rimrafRemoveDirWrapper(dirPath, next) {
  rimraf(dirPath, next);
}

/**
 * Simple wrapper for rimraf.sync.
 *
 * @param {string} dirPath
 * @private
 */
function _rimrafRemoveDirSyncWrapper(dirPath, next) {
  try {
    return next(null, rimraf.sync(dirPath));
  } catch (err) {
    return next(err);
  }
}

/**
 * Prepares the callback for removal of the temporary directory.
 *
 * @param {string} name
 * @param {Object} opts
 * @returns {Function} the callback
 * @private
 */
function _prepareTmpDirRemoveCallback(name, opts) {
  const removeFunction = opts.unsafeCleanup ? _rimrafRemoveDirWrapper : fs.rmdir.bind(fs);
  const removeFunctionSync = opts.unsafeCleanup ? _rimrafRemoveDirSyncWrapper : fs.rmdirSync.bind(fs);
  const removeCallbackSync = _prepareRemoveCallback(removeFunctionSync, name);
  const removeCallback = _prepareRemoveCallback(removeFunction, name, removeCallbackSync);
  if (!opts.keep) _removeObjects.unshift(removeCallbackSync);

  return removeCallback;
}

/**
 * Creates a guarded function wrapping the removeFunction call.
 *
 * @param {Function} removeFunction
 * @param {Object} arg
 * @returns {Function}
 * @private
 */
function _prepareRemoveCallback(removeFunction, arg, cleanupCallbackSync) {
  var called = false;

  return function _cleanupCallback(next) {
    next = next || function () {};
    if (!called) {
      const toRemove = cleanupCallbackSync || _cleanupCallback;
      const index = _removeObjects.indexOf(toRemove);
      /* istanbul ignore else */
      if (index >= 0) _removeObjects.splice(index, 1);

      called = true;
      // sync?
      if (removeFunction.length === 1) {
        try {
          removeFunction(arg);
          return next(null);
        }
        catch (err) {
          // if no next is provided and since we are
          // in silent cleanup mode on process exit,
          // we will ignore the error
          return next(err);
        }
      } else return removeFunction(arg, next);
    } else return next(new Error('cleanup callback has already been called'));
  };
}

/**
 * The garbage collector.
 *
 * @private
 */
function _garbageCollector() {
  /* istanbul ignore else */
  if (!_gracefulCleanup) return;

  // the function being called removes itself from _removeObjects,
  // loop until _removeObjects is empty
  while (_removeObjects.length) {
    try {
      _removeObjects[0]();
    } catch (e) {
      // already removed?
    }
  }
}

/**
 * Helper for testing against EBADF to compensate changes made to Node 7.x under Windows.
 */
function isEBADF(error) {
  return isExpectedError(error, -EBADF, 'EBADF');
}

/**
 * Helper for testing against ENOENT to compensate changes made to Node 7.x under Windows.
 */
function isENOENT(error) {
  return isExpectedError(error, -ENOENT, 'ENOENT');
}

/**
 * Helper to determine whether the expected error code matches the actual code and errno,
 * which will differ between the supported node versions.
 *
 * - Node >= 7.0:
 *   error.code {string}
 *   error.errno {string|number} any numerical value will be negated
 *
 * - Node >= 6.0 < 7.0:
 *   error.code {string}
 *   error.errno {number} negated
 *
 * - Node >= 4.0 < 6.0: introduces SystemError
 *   error.code {string}
 *   error.errno {number} negated
 *
 * - Node >= 0.10 < 4.0:
 *   error.code {number} negated
 *   error.errno n/a
 */
function isExpectedError(error, code, errno) {
  return error.code === code || error.code === errno;
}

/**
 * Helper which determines whether a string s is blank, that is undefined, or empty or null.
 *
 * @private
 * @param {string} s
 * @returns {Boolean} true whether the string s is blank, false otherwise
 */
function isBlank(s) {
  return s === null || s === undefined || !s.trim();
}

/**
 * Sets the graceful cleanup.
 */
function setGracefulCleanup() {
  _gracefulCleanup = true;
}

/**
 * Returns the currently configured tmp dir from os.tmpdir().
 *
 * @private
 * @returns {string} the currently configured tmp dir
 */
function _getTmpDir() {
  return os.tmpdir();
}

/**
 * If there are multiple different versions of tmp in place, make sure that
 * we recognize the old listeners.
 *
 * @param {Function} listener
 * @private
 * @returns {Boolean} true whether listener is a legacy listener
 */
function _is_legacy_listener(listener) {
  return (listener.name === '_exit' || listener.name === '_uncaughtExceptionThrown')
    && listener.toString().indexOf('_garbageCollector();') > -1;
}

/**
 * Safely install SIGINT listener.
 *
 * NOTE: this will only work on OSX and Linux.
 *
 * @private
 */
function _safely_install_sigint_listener() {

  const listeners = process.listeners(SIGINT);
  const existingListeners = [];
  for (let i = 0, length = listeners.length; i < length; i++) {
    const lstnr = listeners[i];
    /* istanbul ignore else */
    if (lstnr.name === '_tmp$sigint_listener') {
      existingListeners.push(lstnr);
      process.removeListener(SIGINT, lstnr);
    }
  }
  process.on(SIGINT, function _tmp$sigint_listener(doExit) {
    for (let i = 0, length = existingListeners.length; i < length; i++) {
      // let the existing listener do the garbage collection (e.g. jest sandbox)
      try {
        existingListeners[i](false);
      } catch (err) {
        // ignore
      }
    }
    try {
      // force the garbage collector even it is called again in the exit listener
      _garbageCollector();
    } finally {
      if (!!doExit) {
        process.exit(0);
      }
    }
  });
}

/**
 * Safely install process exit listener.
 *
 * @private
 */
function _safely_install_exit_listener() {
  const listeners = process.listeners(EXIT);

  // collect any existing listeners
  const existingListeners = [];
  for (let i = 0, length = listeners.length; i < length; i++) {
    const lstnr = listeners[i];
    /* istanbul ignore else */
    // TODO: remove support for legacy listeners once release 1.0.0 is out
    if (lstnr.name === '_tmp$safe_listener' || _is_legacy_listener(lstnr)) {
      // we must forget about the uncaughtException listener, hopefully it is ours
      if (lstnr.name !== '_uncaughtExceptionThrown') {
        existingListeners.push(lstnr);
      }
      process.removeListener(EXIT, lstnr);
    }
  }
  // TODO: what was the data parameter good for?
  process.addListener(EXIT, function _tmp$safe_listener(data) {
    for (let i = 0, length = existingListeners.length; i < length; i++) {
      // let the existing listener do the garbage collection (e.g. jest sandbox)
      try {
        existingListeners[i](data);
      } catch (err) {
        // ignore
      }
    }
    _garbageCollector();
  });
}

_safely_install_exit_listener();
_safely_install_sigint_listener();

/**
 * Configuration options.
 *
 * @typedef {Object} Options
 * @property {?number} tries the number of tries before give up the name generation
 * @property {?string} template the "mkstemp" like filename template
 * @property {?string} name fix name
 * @property {?string} dir the tmp directory to use
 * @property {?string} prefix prefix for the generated name
 * @property {?string} postfix postfix for the generated name
 * @property {?boolean} unsafeCleanup recursively removes the created temporary directory, even when it's not empty
 */

/**
 * @typedef {Object} FileSyncObject
 * @property {string} name the name of the file
 * @property {string} fd the file descriptor
 * @property {fileCallback} removeCallback the callback function to remove the file
 */

/**
 * @typedef {Object} DirSyncObject
 * @property {string} name the name of the directory
 * @property {fileCallback} removeCallback the callback function to remove the directory
 */

/**
 * @callback tmpNameCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 */

/**
 * @callback fileCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 * @param {number} fd the file descriptor
 * @param {cleanupCallback} fn the cleanup callback function
 */

/**
 * @callback dirCallback
 * @param {?Error} err the error object if anything goes wrong
 * @param {string} name the temporary file name
 * @param {cleanupCallback} fn the cleanup callback function
 */

/**
 * Removes the temporary created file or directory.
 *
 * @callback cleanupCallback
 * @param {simpleCallback} [next] function to call after entry was removed
 */

/**
 * Callback function for function composition.
 * @see {@link https://github.com/raszi/node-tmp/issues/57|raszi/node-tmp#57}
 *
 * @callback simpleCallback
 */

// exporting all the needed methods

// evaluate os.tmpdir() lazily, mainly for simplifying testing but it also will
// allow users to reconfigure the temporary directory
Object.defineProperty(module.exports, 'tmpdir', {
  enumerable: true,
  configurable: false,
  get: function () {
    return _getTmpDir();
  }
});

module.exports.dir = dir;
module.exports.dirSync = dirSync;

module.exports.file = file;
module.exports.fileSync = fileSync;

module.exports.tmpName = tmpName;
module.exports.tmpNameSync = tmpNameSync;

module.exports.setGracefulCleanup = setGracefulCleanup;


/***/ }),

/***/ 344:
/***/ (function(module, __unusedexports, __webpack_require__) {

var register = __webpack_require__(171)
var addHook = __webpack_require__(582)
var removeHook = __webpack_require__(318)

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection


/***/ }),

/***/ 348:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = __webpack_require__(277);
var isWindows = process.platform === 'win32';
var fs = __webpack_require__(747);

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

exports.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


exports.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};


/***/ }),

/***/ 355:
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

module.exports = set;


/***/ }),

/***/ 357:
/***/ (function(module) {

module.exports = require("assert");

/***/ }),

/***/ 359:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationPlugin;

const { Deprecation } = __webpack_require__(593);
const once = __webpack_require__(870);

const deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation));

const authenticate = __webpack_require__(365);
const beforeRequest = __webpack_require__(467);
const requestError = __webpack_require__(18);

function authenticationPlugin(octokit, options) {
  if (options.auth) {
    octokit.authenticate = () => {
      deprecateAuthenticate(
        octokit.log,
        new Deprecation(
          '[@octokit/rest] octokit.authenticate() is deprecated and has no effect when "auth" option is set on Octokit constructor'
        )
      );
    };
    return;
  }
  const state = {
    octokit,
    auth: false
  };
  octokit.authenticate = authenticate.bind(null, state);
  octokit.hook.before("request", beforeRequest.bind(null, state));
  octokit.hook.error("request", requestError.bind(null, state));
}


/***/ }),

/***/ 365:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticate;

const { Deprecation } = __webpack_require__(593);
const once = __webpack_require__(870);

const deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation));

function authenticate(state, options) {
  deprecateAuthenticate(
    state.octokit.log,
    new Deprecation(
      '[@octokit/rest] octokit.authenticate() is deprecated. Use "auth" constructor option instead.'
    )
  );

  if (!options) {
    state.auth = false;
    return;
  }

  switch (options.type) {
    case "basic":
      if (!options.username || !options.password) {
        throw new Error(
          "Basic authentication requires both a username and password to be set"
        );
      }
      break;

    case "oauth":
      if (!options.token && !(options.key && options.secret)) {
        throw new Error(
          "OAuth2 authentication requires a token or key & secret to be set"
        );
      }
      break;

    case "token":
    case "app":
      if (!options.token) {
        throw new Error("Token authentication requires a token to be set");
      }
      break;

    default:
      throw new Error(
        "Invalid authentication type, must be 'basic', 'oauth', 'token' or 'app'"
      );
  }

  state.auth = options;
}


/***/ }),

/***/ 386:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(277);
const which = __webpack_require__(100);
const pathKey = __webpack_require__(839)();

function resolveCommandAttempt(parsed, withoutPathExt) {
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (hasCustomCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which.sync(parsed.command, {
            path: (parsed.options.env || process.env)[pathKey],
            pathExt: withoutPathExt ? path.delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        process.chdir(cwd);
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

module.exports = resolveCommand;


/***/ }),

/***/ 390:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __webpack_require__(747);
const os_1 = __webpack_require__(87);
class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os_1.EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map

/***/ }),

/***/ 398:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = withAuthorizationPrefix;

const atob = __webpack_require__(805);

const REGEX_IS_BASIC_AUTH = /^[\w-]+:/;

function withAuthorizationPrefix(authorization) {
  if (/^(basic|bearer|token) /i.test(authorization)) {
    return authorization;
  }

  try {
    if (REGEX_IS_BASIC_AUTH.test(atob(authorization))) {
      return `basic ${authorization}`;
    }
  } catch (error) {}

  if (authorization.split(/\./).length === 3) {
    return `bearer ${authorization}`;
  }

  return `token ${authorization}`;
}


/***/ }),

/***/ 413:
/***/ (function(module) {

module.exports = require("stream");

/***/ }),

/***/ 416:
/***/ (function(module, __unusedexports, __webpack_require__) {

var concatMap = __webpack_require__(812);
var balanced = __webpack_require__(502);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),

/***/ 417:
/***/ (function(module) {

module.exports = require("crypto");

/***/ }),

/***/ 420:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(__webpack_require__(747));
const core_1 = __webpack_require__(827);
const path_1 = __webpack_require__(277);
const utils_1 = __webpack_require__(435);
/**
 * Creates a specification that describes how each file that is part of the artifact will be uploaded
 * @param artifactName the name of the artifact being uploaded. Used during upload to denote where the artifact is stored on the server
 * @param rootDirectory an absolute file path that denotes the path that should be removed from the beginning of each artifact file
 * @param artifactFiles a list of absolute file paths that denote what should be uploaded as part of the artifact
 */
function getUploadSpecification(artifactName, rootDirectory, artifactFiles) {
    utils_1.checkArtifactName(artifactName);
    const specifications = [];
    if (!fs.existsSync(rootDirectory)) {
        throw new Error(`Provided rootDirectory ${rootDirectory} does not exist`);
    }
    if (!fs.lstatSync(rootDirectory).isDirectory()) {
        throw new Error(`Provided rootDirectory ${rootDirectory} is not a valid directory`);
    }
    // Normalize and resolve, this allows for either absolute or relative paths to be used
    rootDirectory = path_1.normalize(rootDirectory);
    rootDirectory = path_1.resolve(rootDirectory);
    /*
       Example to demonstrate behavior
       
       Input:
         artifactName: my-artifact
         rootDirectory: '/home/user/files/plz-upload'
         artifactFiles: [
           '/home/user/files/plz-upload/file1.txt',
           '/home/user/files/plz-upload/file2.txt',
           '/home/user/files/plz-upload/dir/file3.txt'
         ]
       
       Output:
         specifications: [
           ['/home/user/files/plz-upload/file1.txt', 'my-artifact/file1.txt'],
           ['/home/user/files/plz-upload/file1.txt', 'my-artifact/file2.txt'],
           ['/home/user/files/plz-upload/file1.txt', 'my-artifact/dir/file3.txt']
         ]
    */
    for (let file of artifactFiles) {
        if (!fs.existsSync(file)) {
            throw new Error(`File ${file} does not exist`);
        }
        if (!fs.lstatSync(file).isDirectory()) {
            // Normalize and resolve, this allows for either absolute or relative paths to be used
            file = path_1.normalize(file);
            file = path_1.resolve(file);
            if (!file.startsWith(rootDirectory)) {
                throw new Error(`The rootDirectory: ${rootDirectory} is not a parent directory of the file: ${file}`);
            }
            // Check for forbidden characters in file paths that will be rejected during upload
            const uploadPath = file.replace(rootDirectory, '');
            utils_1.checkArtifactFilePath(uploadPath);
            /*
              uploadFilePath denotes where the file will be uploaded in the file container on the server. During a run, if multiple artifacts are uploaded, they will all
              be saved in the same container. The artifact name is used as the root directory in the container to separate and distinguish uploaded artifacts
      
              path.join handles all the following cases and would return 'artifact-name/file-to-upload.txt
                join('artifact-name/', 'file-to-upload.txt')
                join('artifact-name/', '/file-to-upload.txt')
                join('artifact-name', 'file-to-upload.txt')
                join('artifact-name', '/file-to-upload.txt')
            */
            specifications.push({
                absoluteFilePath: file,
                uploadFilePath: path_1.join(artifactName, uploadPath)
            });
        }
        else {
            // Directories are rejected by the server during upload
            core_1.debug(`Removing ${file} from rawSearchResults because it is a directory`);
        }
    }
    return specifications;
}
exports.getUploadSpecification = getUploadSpecification;
//# sourceMappingURL=upload-specification.js.map

/***/ }),

/***/ 421:
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(719)
var reqs = Object.create(null)
var once = __webpack_require__(870)

module.exports = wrappy(inflight)

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  } else {
    reqs[key] = [cb]
    return makeres(key)
  }
}

function makeres (key) {
  return once(function RES () {
    var cbs = reqs[key]
    var len = cbs.length
    var args = slice(arguments)

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args)
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else {
        delete reqs[key]
      }
    }
  })
}

function slice (args) {
  var length = args.length
  var array = []

  for (var i = 0; i < length; i++) array[i] = args[i]
  return array
}


/***/ }),

/***/ 429:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = registerPlugin;

const factory = __webpack_require__(535);

function registerPlugin(plugins, pluginFunction) {
  return factory(
    plugins.includes(pluginFunction) ? plugins : plugins.concat(pluginFunction)
  );
}


/***/ }),

/***/ 433:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(827);
/**
 * Upload Status Reporter that displays information about the progress/status of an artifact that is being uploaded
 *
 * Every 10 seconds, the total status of the upload gets displayed. If there is a large file that is being uploaded,
 * extra information about the individual status of an upload can also be displayed
 */
class UploadStatusReporter {
    constructor() {
        this.totalNumberOfFilesToUpload = 0;
        this.processedCount = 0;
        this.largeUploads = new Map();
        this.totalUploadStatus = undefined;
        this.largeFileUploadStatus = undefined;
    }
    setTotalNumberOfFilesToUpload(fileTotal) {
        this.totalNumberOfFilesToUpload = fileTotal;
    }
    start() {
        const _this = this;
        // displays information about the total upload status every 10 seconds
        this.totalUploadStatus = setInterval(function () {
            // display 1 decimal place without any rounding
            const percentage = _this.formatPercentage(_this.processedCount, _this.totalNumberOfFilesToUpload);
            core_1.info(`Total file(s): ${_this.totalNumberOfFilesToUpload} ---- Processed file #${_this.processedCount} (${percentage.slice(0, percentage.indexOf('.') + 2)}%)`);
        }, 10000);
        // displays extra information about any large files that take a significant amount of time to upload every 1 second
        this.largeFileUploadStatus = setInterval(function () {
            for (const value of Array.from(_this.largeUploads.values())) {
                core_1.info(value);
            }
            // delete all entires in the map after displaying the information so it will not be displayed again unless explicitly added
            _this.largeUploads = new Map();
        }, 1000);
    }
    updateLargeFileStatus(fileName, numerator, denomiator) {
        // display 1 decimal place without any rounding
        const percentage = this.formatPercentage(numerator, denomiator);
        const displayInformation = `Uploading ${fileName} (${percentage.slice(0, percentage.indexOf('.') + 2)}%)`;
        // any previously added display information should be overwritten for the specific large file because a map is being used
        this.largeUploads.set(fileName, displayInformation);
    }
    stop() {
        if (this.totalUploadStatus) {
            clearInterval(this.totalUploadStatus);
        }
        if (this.largeFileUploadStatus) {
            clearInterval(this.largeFileUploadStatus);
        }
    }
    incrementProcessedCount() {
        this.processedCount++;
    }
    formatPercentage(numerator, denominator) {
        // toFixed() rounds, so use extra precision to display accurate information even though 4 decimal places are not displayed
        return ((numerator / denominator) * 100).toFixed(4).toString();
    }
}
exports.UploadStatusReporter = UploadStatusReporter;
//# sourceMappingURL=upload-status-reporter.js.map

/***/ }),

/***/ 435:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(827);
const fs_1 = __webpack_require__(747);
const http_client_1 = __webpack_require__(7);
const auth_1 = __webpack_require__(458);
const config_variables_1 = __webpack_require__(973);
/**
 * Parses a env variable that is a number
 */
function parseEnvNumber(key) {
    const value = Number(process.env[key]);
    if (Number.isNaN(value) || value < 0) {
        return undefined;
    }
    return value;
}
exports.parseEnvNumber = parseEnvNumber;
/**
 * Various utility functions to help with the necessary API calls
 */
function getApiVersion() {
    return '6.0-preview';
}
exports.getApiVersion = getApiVersion;
function isSuccessStatusCode(statusCode) {
    if (!statusCode) {
        return false;
    }
    return statusCode >= 200 && statusCode < 300;
}
exports.isSuccessStatusCode = isSuccessStatusCode;
function isRetryableStatusCode(statusCode) {
    if (!statusCode) {
        return false;
    }
    const retryableStatusCodes = [
        http_client_1.HttpCodes.BadGateway,
        http_client_1.HttpCodes.ServiceUnavailable,
        http_client_1.HttpCodes.GatewayTimeout
    ];
    return retryableStatusCodes.includes(statusCode);
}
exports.isRetryableStatusCode = isRetryableStatusCode;
function getContentRange(start, end, total) {
    // Format: `bytes start-end/fileSize
    // start and end are inclusive
    // For a 200 byte chunk starting at byte 0:
    // Content-Range: bytes 0-199/200
    return `bytes ${start}-${end}/${total}`;
}
exports.getContentRange = getContentRange;
/**
 * Sets all the necessary headers when making HTTP calls
 * @param {string} contentType the type of content being uploaded
 * @param {boolean} isKeepAlive is the same connection being used to make multiple calls
 * @param {boolean} isGzip is the connection being used to upload GZip compressed content
 * @param {number} uncompressedLength the original size of the content if something is being uploaded that has been compressed
 * @param {number} contentLength the length of the content that is being uploaded
 * @param {string} contentRange the range of the content that is being uploaded
 * @returns appropriate request options to make a specific http call
 */
function getRequestOptions(contentType, isKeepAlive, isGzip, uncompressedLength, contentLength, contentRange) {
    const requestOptions = {
        // same Accept type for each http call that gets made
        Accept: `application/json;api-version=${getApiVersion()}`
    };
    if (contentType) {
        requestOptions['Content-Type'] = contentType;
    }
    if (isKeepAlive) {
        requestOptions['Connection'] = 'Keep-Alive';
        // keep alive for at least 10 seconds before closing the connection
        requestOptions['Keep-Alive'] = '10';
    }
    if (isGzip) {
        requestOptions['Content-Encoding'] = 'gzip';
        requestOptions['x-tfs-filelength'] = uncompressedLength;
    }
    if (contentLength) {
        requestOptions['Content-Length'] = contentLength;
    }
    if (contentRange) {
        requestOptions['Content-Range'] = contentRange;
    }
    return requestOptions;
}
exports.getRequestOptions = getRequestOptions;
function createHttpClient() {
    return new http_client_1.HttpClient('action/artifact', [
        new auth_1.BearerCredentialHandler(config_variables_1.getRuntimeToken())
    ]);
}
exports.createHttpClient = createHttpClient;
function getArtifactUrl() {
    const artifactUrl = `${config_variables_1.getRuntimeUrl()}_apis/pipelines/workflows/${config_variables_1.getWorkFlowRunId()}/artifacts?api-version=${getApiVersion()}`;
    core_1.debug(`Artifact Url: ${artifactUrl}`);
    return artifactUrl;
}
exports.getArtifactUrl = getArtifactUrl;
/**
 * Invalid characters that cannot be in the artifact name or an uploaded file. Will be rejected
 * from the server if attempted to be sent over. These characters are not allowed due to limitations with certain
 * file systems such as NTFS. To maintain platform-agnostic behavior, all characters that are not supported by an
 * individual filesystem/platform will not be supported on all fileSystems/platforms
 *
 * FilePaths can include characters such as \ and / which are not permitted in the artifact name alone
 */
const invalidArtifactFilePathCharacters = [
    '"',
    ':',
    '<',
    '>',
    '|',
    '*',
    '?',
    ' '
];
const invalidArtifactNameCharacters = [
    ...invalidArtifactFilePathCharacters,
    '\\',
    '/'
];
/**
 * Scans the name of the artifact to make sure there are no illegal characters
 */
function checkArtifactName(name) {
    if (!name) {
        throw new Error(`Artifact name: ${name}, is incorrectly provided`);
    }
    for (const invalidChar of invalidArtifactNameCharacters) {
        if (name.includes(invalidChar)) {
            throw new Error(`Artifact name is not valid: ${name}. Contains character: "${invalidChar}". Invalid artifact name characters include: ${invalidArtifactNameCharacters.toString()}.`);
        }
    }
}
exports.checkArtifactName = checkArtifactName;
/**
 * Scans the name of the filePath used to make sure there are no illegal characters
 */
function checkArtifactFilePath(path) {
    if (!path) {
        throw new Error(`Artifact path: ${path}, is incorrectly provided`);
    }
    for (const invalidChar of invalidArtifactFilePathCharacters) {
        if (path.includes(invalidChar)) {
            throw new Error(`Artifact path is not valid: ${path}. Contains character: "${invalidChar}". Invalid characters include: ${invalidArtifactFilePathCharacters.toString()}.`);
        }
    }
}
exports.checkArtifactFilePath = checkArtifactFilePath;
function createDirectoriesForArtifact(directories) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const directory of directories) {
            yield fs_1.promises.mkdir(directory, {
                recursive: true
            });
        }
    });
}
exports.createDirectoriesForArtifact = createDirectoriesForArtifact;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 458:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        options.headers['Authorization'] = 'Basic ' + Buffer.from(this.username + ':' + this.password).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Bearer ' + this.token;
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Basic ' + Buffer.from('PAT:' + this.token).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;


/***/ }),

/***/ 460:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var core = __webpack_require__(900);
var pluginRequestLog = __webpack_require__(721);
var pluginPaginateRest = __webpack_require__(545);
var pluginRestEndpointMethods = __webpack_require__(135);

const VERSION = "17.1.4";

const Octokit = core.Octokit.plugin(pluginRequestLog.requestLog, pluginRestEndpointMethods.restEndpointMethods, pluginPaginateRest.paginateRest).defaults({
  userAgent: `octokit-rest.js/${VERSION}`
});

exports.Octokit = Octokit;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 461:
/***/ (function(module, __unusedexports, __webpack_require__) {

const {promisify} = __webpack_require__(669);
const tmp = __webpack_require__(337);

// file
module.exports.fileSync = tmp.fileSync;
const fileWithOptions = promisify((options, cb) =>
  tmp.file(options, (err, path, fd, cleanup) =>
    err ? cb(err) : cb(undefined, { path, fd, cleanup: promisify(cleanup) })
  )
);
module.exports.file = async (options) => fileWithOptions(options);

module.exports.withFile = async function withFile(fn, options) {
  const { path, fd, cleanup } = await module.exports.file(options);
  try {
    return await fn({ path, fd });
  } finally {
    await cleanup();
  }
};


// directory
module.exports.dirSync = tmp.dirSync;
const dirWithOptions = promisify((options, cb) =>
  tmp.dir(options, (err, path, cleanup) =>
    err ? cb(err) : cb(undefined, { path, cleanup: promisify(cleanup) })
  )
);
module.exports.dir = async (options) => dirWithOptions(options);

module.exports.withDir = async function withDir(fn, options) {
  const { path, cleanup } = await module.exports.dir(options);
  try {
    return await fn({ path });
  } finally {
    await cleanup();
  }
};


// name generation
module.exports.tmpNameSync = tmp.tmpNameSync;
module.exports.tmpName = promisify(tmp.tmpName);

module.exports.tmpdir = tmp.tmpdir;

module.exports.setGracefulCleanup = tmp.setGracefulCleanup;


/***/ }),

/***/ 467:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationBeforeRequest;

const btoa = __webpack_require__(730);
const uniq = __webpack_require__(162);

function authenticationBeforeRequest(state, options) {
  if (!state.auth.type) {
    return;
  }

  if (state.auth.type === "basic") {
    const hash = btoa(`${state.auth.username}:${state.auth.password}`);
    options.headers.authorization = `Basic ${hash}`;
    return;
  }

  if (state.auth.type === "token") {
    options.headers.authorization = `token ${state.auth.token}`;
    return;
  }

  if (state.auth.type === "app") {
    options.headers.authorization = `Bearer ${state.auth.token}`;
    const acceptHeaders = options.headers.accept
      .split(",")
      .concat("application/vnd.github.machine-man-preview+json");
    options.headers.accept = uniq(acceptHeaders)
      .filter(Boolean)
      .join(",");
    return;
  }

  options.url += options.url.indexOf("?") === -1 ? "?" : "&";

  if (state.auth.token) {
    options.url += `access_token=${encodeURIComponent(state.auth.token)}`;
    return;
  }

  const key = encodeURIComponent(state.auth.key);
  const secret = encodeURIComponent(state.auth.secret);
  options.url += `client_id=${key}&client_secret=${secret}`;
}


/***/ }),

/***/ 492:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationRequestError;

const { RequestError } = __webpack_require__(552);

function authenticationRequestError(state, error, options) {
  if (!error.headers) throw error;

  const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error;
  }

  if (
    error.status === 401 &&
    otpRequired &&
    error.request &&
    error.request.headers["x-github-otp"]
  ) {
    if (state.otp) {
      delete state.otp; // no longer valid, request again
    } else {
      throw new RequestError(
        "Invalid one-time password for two-factor authentication",
        401,
        {
          headers: error.headers,
          request: options
        }
      );
    }
  }

  if (typeof state.auth.on2fa !== "function") {
    throw new RequestError(
      "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa();
    })
    .then(oneTimePassword => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(options.headers, {
          "x-github-otp": oneTimePassword
        })
      });
      return state.octokit.request(newOptions).then(response => {
        // If OTP still valid, then persist it for following requests
        state.otp = oneTimePassword;
        return response;
      });
    });
}


/***/ }),

/***/ 497:
/***/ (function(__unusedmodule, exports) {

exports.entityMap = {
       lt: '<',
       gt: '>',
       amp: '&',
       quot: '"',
       apos: "'",
       Agrave: "À",
       Aacute: "Á",
       Acirc: "Â",
       Atilde: "Ã",
       Auml: "Ä",
       auml: "ä",
       Aring: "Å",
       aring: "å",
       AElig: "Æ",
       Ccedil: "Ç",
       Egrave: "È",
       Eacute: "É",
       Ecirc: "Ê",
       Euml: "Ë",
       Igrave: "Ì",
       Iacute: "Í",
       Icirc: "Î",
       Iuml: "Ï",
       ETH: "Ð",
       Ntilde: "Ñ",
       Ograve: "Ò",
       Oacute: "Ó",
       Ocirc: "Ô",
       Otilde: "Õ",
       Ouml: "Ö",
       ouml: "ö",
       Oslash: "Ø",
       Ugrave: "Ù",
       Uacute: "Ú",
       Ucirc: "Û",
       Uuml: "Ü",
       Yacute: "Ý",
       THORN: "Þ",
       szlig: "ß",
       agrave: "à",
       aacute: "á",
       acirc: "â",
       atilde: "ã",
       auml: "ä",
       aring: "å",
       aelig: "æ",
       ccedil: "ç",
       egrave: "è",
       eacute: "é",
       ecirc: "ê",
       euml: "ë",
       igrave: "ì",
       iacute: "í",
       icirc: "î",
       iuml: "ï",
       eth: "ð",
       ntilde: "ñ",
       ograve: "ò",
       oacute: "ó",
       ocirc: "ô",
       otilde: "õ",
       ouml: "ö",
       oslash: "ø",
       ugrave: "ù",
       uacute: "ú",
       ucirc: "û",
       uuml: "ü",
       yacute: "ý",
       thorn: "þ",
       yuml: "ÿ",
       nbsp: " ",
       iexcl: "¡",
       cent: "¢",
       pound: "£",
       curren: "¤",
       yen: "¥",
       brvbar: "¦",
       sect: "§",
       uml: "¨",
       copy: "©",
       ordf: "ª",
       laquo: "«",
       not: "¬",
       shy: "­­",
       reg: "®",
       macr: "¯",
       deg: "°",
       plusmn: "±",
       sup2: "²",
       sup3: "³",
       acute: "´",
       micro: "µ",
       para: "¶",
       middot: "·",
       cedil: "¸",
       sup1: "¹",
       ordm: "º",
       raquo: "»",
       frac14: "¼",
       frac12: "½",
       frac34: "¾",
       iquest: "¿",
       times: "×",
       divide: "÷",
       forall: "∀",
       part: "∂",
       exist: "∃",
       empty: "∅",
       nabla: "∇",
       isin: "∈",
       notin: "∉",
       ni: "∋",
       prod: "∏",
       sum: "∑",
       minus: "−",
       lowast: "∗",
       radic: "√",
       prop: "∝",
       infin: "∞",
       ang: "∠",
       and: "∧",
       or: "∨",
       cap: "∩",
       cup: "∪",
       'int': "∫",
       there4: "∴",
       sim: "∼",
       cong: "≅",
       asymp: "≈",
       ne: "≠",
       equiv: "≡",
       le: "≤",
       ge: "≥",
       sub: "⊂",
       sup: "⊃",
       nsub: "⊄",
       sube: "⊆",
       supe: "⊇",
       oplus: "⊕",
       otimes: "⊗",
       perp: "⊥",
       sdot: "⋅",
       Alpha: "Α",
       Beta: "Β",
       Gamma: "Γ",
       Delta: "Δ",
       Epsilon: "Ε",
       Zeta: "Ζ",
       Eta: "Η",
       Theta: "Θ",
       Iota: "Ι",
       Kappa: "Κ",
       Lambda: "Λ",
       Mu: "Μ",
       Nu: "Ν",
       Xi: "Ξ",
       Omicron: "Ο",
       Pi: "Π",
       Rho: "Ρ",
       Sigma: "Σ",
       Tau: "Τ",
       Upsilon: "Υ",
       Phi: "Φ",
       Chi: "Χ",
       Psi: "Ψ",
       Omega: "Ω",
       alpha: "α",
       beta: "β",
       gamma: "γ",
       delta: "δ",
       epsilon: "ε",
       zeta: "ζ",
       eta: "η",
       theta: "θ",
       iota: "ι",
       kappa: "κ",
       lambda: "λ",
       mu: "μ",
       nu: "ν",
       xi: "ξ",
       omicron: "ο",
       pi: "π",
       rho: "ρ",
       sigmaf: "ς",
       sigma: "σ",
       tau: "τ",
       upsilon: "υ",
       phi: "φ",
       chi: "χ",
       psi: "ψ",
       omega: "ω",
       thetasym: "ϑ",
       upsih: "ϒ",
       piv: "ϖ",
       OElig: "Œ",
       oelig: "œ",
       Scaron: "Š",
       scaron: "š",
       Yuml: "Ÿ",
       fnof: "ƒ",
       circ: "ˆ",
       tilde: "˜",
       ensp: " ",
       emsp: " ",
       thinsp: " ",
       zwnj: "‌",
       zwj: "‍",
       lrm: "‎",
       rlm: "‏",
       ndash: "–",
       mdash: "—",
       lsquo: "‘",
       rsquo: "’",
       sbquo: "‚",
       ldquo: "“",
       rdquo: "”",
       bdquo: "„",
       dagger: "†",
       Dagger: "‡",
       bull: "•",
       hellip: "…",
       permil: "‰",
       prime: "′",
       Prime: "″",
       lsaquo: "‹",
       rsaquo: "›",
       oline: "‾",
       euro: "€",
       trade: "™",
       larr: "←",
       uarr: "↑",
       rarr: "→",
       darr: "↓",
       harr: "↔",
       crarr: "↵",
       lceil: "⌈",
       rceil: "⌉",
       lfloor: "⌊",
       rfloor: "⌋",
       loz: "◊",
       spades: "♠",
       clubs: "♣",
       hearts: "♥",
       diams: "♦"
};
//for(var  n in exports.entityMap){console.log(exports.entityMap[n].charCodeAt())}


/***/ }),

/***/ 502:
/***/ (function(module) {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 504:
/***/ (function(module) {

module.exports = class HttpError extends Error {
  constructor (message, code, headers) {
    super(message)

    // Maintains proper stack trace (only available on V8)
    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.name = 'HttpError'
    this.code = code
    this.headers = headers
  }
}


/***/ }),

/***/ 522:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(__webpack_require__(747));
const zlib = __importStar(__webpack_require__(761));
const util_1 = __webpack_require__(669);
const stat = util_1.promisify(fs.stat);
/**
 * Creates a Gzip compressed file of an original file at the provided temporary filepath location
 * @param {string} originalFilePath filepath of whatever will be compressed. The original file will be unmodified
 * @param {string} tempFilePath the location of where the Gzip file will be created
 * @returns the size of gzip file that gets created
 */
function createGZipFileOnDisk(originalFilePath, tempFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const inputStream = fs.createReadStream(originalFilePath);
            const gzip = zlib.createGzip();
            const outputStream = fs.createWriteStream(tempFilePath);
            inputStream.pipe(gzip).pipe(outputStream);
            outputStream.on('finish', () => __awaiter(this, void 0, void 0, function* () {
                // wait for stream to finish before calculating the size which is needed as part of the Content-Length header when starting an upload
                const size = (yield stat(tempFilePath)).size;
                resolve(size);
            }));
            outputStream.on('error', error => {
                // eslint-disable-next-line no-console
                console.log(error);
                reject;
            });
        });
    });
}
exports.createGZipFileOnDisk = createGZipFileOnDisk;
/**
 * Creates a GZip file in memory using a buffer. Should be used for smaller files to reduce disk I/O
 * @param originalFilePath the path to the original file that is being GZipped
 * @returns a buffer with the GZip file
 */
function createGZipFileInBuffer(originalFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            const inputStream = fs.createReadStream(originalFilePath);
            const gzip = zlib.createGzip();
            inputStream.pipe(gzip);
            // read stream into buffer, using experimental async itterators see https://github.com/nodejs/readable-stream/issues/403#issuecomment-479069043
            const chunks = [];
            try {
                for (var gzip_1 = __asyncValues(gzip), gzip_1_1; gzip_1_1 = yield gzip_1.next(), !gzip_1_1.done;) {
                    const chunk = gzip_1_1.value;
                    chunks.push(chunk);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (gzip_1_1 && !gzip_1_1.done && (_a = gzip_1.return)) yield _a.call(gzip_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            resolve(Buffer.concat(chunks));
        }));
    });
}
exports.createGZipFileInBuffer = createGZipFileInBuffer;
//# sourceMappingURL=upload-gzip.js.map

/***/ }),

/***/ 535:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = factory;

const Octokit = __webpack_require__(963);
const registerPlugin = __webpack_require__(429);

function factory(plugins) {
  const Api = Octokit.bind(null, plugins || []);
  Api.plugin = registerPlugin.bind(null, plugins || []);
  return Api;
}


/***/ }),

/***/ 544:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __webpack_require__(747)
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __webpack_require__(348)

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb)
    } else {
      cb(er, result)
    }
  })
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch () {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}


/***/ }),

/***/ 545:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

const VERSION = "2.0.2";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint.
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not.
 *
 * We check if a "total_count" key is present in the response data, but also make sure that
 * a "url" property is not, as the "Get the combined status for a specific ref" endpoint would
 * otherwise match: https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
 */
function normalizePaginatedListResponse(octokit, url, response) {
  const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
  if (!responseNeedsNormalization) return; // keep the additional properties intact as there is currently no other way
  // to retrieve the same information.

  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;

  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }

  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }

  response.data.total_count = totalCount;
}

function iterator(octokit, route, parameters) {
  const options = octokit.request.endpoint(route, parameters);
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      next() {
        if (!url) {
          return Promise.resolve({
            done: true
          });
        }

        return octokit.request({
          method,
          url,
          headers
        }).then(response => {
          normalizePaginatedListResponse(octokit, url, response); // `response.headers.link` format:
          // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
          // sets `url` to undefined if "next" URL is not present or `link` header is not set

          url = ((response.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
          return {
            value: response
          };
        });
      }

    })
  };
}

function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = undefined;
  }

  return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}

function gather(octokit, results, iterator, mapFn) {
  return iterator.next().then(result => {
    if (result.done) {
      return results;
    }

    let earlyExit = false;

    function done() {
      earlyExit = true;
    }

    results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);

    if (earlyExit) {
      return results;
    }

    return gather(octokit, results, iterator, mapFn);
  });
}

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION;

exports.paginateRest = paginateRest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 549:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(__webpack_require__(747));
const zlib = __importStar(__webpack_require__(761));
const utils_1 = __webpack_require__(435);
const url_1 = __webpack_require__(835);
const http_manager_1 = __webpack_require__(98);
const config_variables_1 = __webpack_require__(973);
const core_1 = __webpack_require__(827);
class DownloadHttpClient {
    constructor() {
        this.downloadHttpManager = new http_manager_1.HttpManager(config_variables_1.getDownloadFileConcurrency());
    }
    /**
     * Gets a list of all artifacts that are in a specific container
     */
    listArtifacts() {
        return __awaiter(this, void 0, void 0, function* () {
            const artifactUrl = utils_1.getArtifactUrl();
            // use the first client from the httpManager, `keep-alive` is not used so the connection will close immediatly
            const client = this.downloadHttpManager.getClient(0);
            const requestOptions = utils_1.getRequestOptions('application/json');
            const rawResponse = yield client.get(artifactUrl, requestOptions);
            const body = yield rawResponse.readBody();
            if (utils_1.isSuccessStatusCode(rawResponse.message.statusCode) && body) {
                return JSON.parse(body);
            }
            // eslint-disable-next-line no-console
            console.log(rawResponse);
            throw new Error(`Unable to list artifacts for the run`);
        });
    }
    /**
     * Fetches a set of container items that describe the contents of an artifact
     * @param artifactName the name of the artifact
     * @param containerUrl the artifact container URL for the run
     */
    getContainerItems(artifactName, containerUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // the itemPath search parameter controls which containers will be returned
            const resourceUrl = new url_1.URL(containerUrl);
            resourceUrl.searchParams.append('itemPath', artifactName);
            // no concurrent calls so a single httpClient without the http-manager is sufficient
            const client = utils_1.createHttpClient();
            // no keep-alive header, client disposal is not necessary
            const requestOptions = utils_1.getRequestOptions('application/json');
            const rawResponse = yield client.get(resourceUrl.toString(), requestOptions);
            const body = yield rawResponse.readBody();
            if (utils_1.isSuccessStatusCode(rawResponse.message.statusCode) && body) {
                return JSON.parse(body);
            }
            // eslint-disable-next-line no-console
            console.log(rawResponse);
            throw new Error(`Unable to get ContainersItems from ${resourceUrl}`);
        });
    }
    /**
     * Concurrently downloads all the files that are part of an artifact
     * @param downloadItems information about what items to download and where to save them
     */
    downloadSingleArtifact(downloadItems) {
        return __awaiter(this, void 0, void 0, function* () {
            const DOWNLOAD_CONCURRENCY = config_variables_1.getDownloadFileConcurrency();
            // limit the number of files downloaded at a single time
            const parallelDownloads = [...new Array(DOWNLOAD_CONCURRENCY).keys()];
            let downloadedFiles = 0;
            yield Promise.all(parallelDownloads.map((index) => __awaiter(this, void 0, void 0, function* () {
                while (downloadedFiles < downloadItems.length) {
                    const currentFileToDownload = downloadItems[downloadedFiles];
                    downloadedFiles += 1;
                    yield this.downloadIndividualFile(index, currentFileToDownload.sourceLocation, currentFileToDownload.targetPath);
                }
            })));
            // done downloading, safety dispose all connections
            this.downloadHttpManager.disposeAndReplaceAllClients();
        });
    }
    /**
     * Downloads an individual file
     * @param httpClientIndex the index of the http client that is used to make all of the calls
     * @param artifactLocation origin location where a file will be downloaded from
     * @param downloadPath destination location for the file being downloaded
     */
    downloadIndividualFile(httpClientIndex, artifactLocation, downloadPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = fs.createWriteStream(downloadPath);
            const client = this.downloadHttpManager.getClient(httpClientIndex);
            const requestOptions = utils_1.getRequestOptions('application/octet-stream', true);
            const response = yield client.get(artifactLocation, requestOptions);
            // check the response headers to determine if the file was compressed using gzip
            const isGzip = (headers) => {
                return ('content-encoding' in headers && headers['content-encoding'] === 'gzip');
            };
            if (utils_1.isSuccessStatusCode(response.message.statusCode)) {
                yield this.pipeResponseToStream(response, stream, isGzip(response.message.headers));
            }
            else if (utils_1.isRetryableStatusCode(response.message.statusCode)) {
                core_1.warning(`Received http ${response.message.statusCode} during file download, will retry ${artifactLocation} after 10 seconds`);
                // if an error is encountered, dispose of the http connection, and create a new one
                this.downloadHttpManager.disposeAndReplaceClient(httpClientIndex);
                yield new Promise(resolve => setTimeout(resolve, config_variables_1.getRetryWaitTimeInMilliseconds()));
                const retryResponse = yield client.get(artifactLocation);
                if (utils_1.isSuccessStatusCode(retryResponse.message.statusCode)) {
                    yield this.pipeResponseToStream(response, stream, isGzip(response.message.headers));
                }
                else {
                    // eslint-disable-next-line no-console
                    console.log(retryResponse);
                    throw new Error(`Unable to download ${artifactLocation}`);
                }
            }
            else {
                // eslint-disable-next-line no-console
                console.log(response);
                throw new Error(`Unable to download ${artifactLocation}`);
            }
        });
    }
    /**
     * Pipes the response from downloading an individual file to the appropriate stream
     * @param response the http response recieved when downloading a file
     * @param stream the stream where the file should be written to
     * @param isGzip does the response need to be be uncompressed
     */
    pipeResponseToStream(response, stream, isGzip) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                if (isGzip) {
                    // pipe the response into gunzip to decompress
                    const gunzip = zlib.createGunzip();
                    response.message
                        .pipe(gunzip)
                        .pipe(stream)
                        .on('close', () => {
                        resolve();
                    });
                }
                else {
                    response.message.pipe(stream).on('close', () => {
                        resolve();
                    });
                }
            });
        });
    }
}
exports.DownloadHttpClient = DownloadHttpClient;
//# sourceMappingURL=download-http-client.js.map

/***/ }),

/***/ 552:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __webpack_require__(593);
var once = _interopDefault(__webpack_require__(870));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 562:
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),

/***/ 566:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(50));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    throw error;
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 571:
/***/ (function(module) {

"use strict";

module.exports = function (x) {
	var lf = typeof x === 'string' ? '\n' : '\n'.charCodeAt();
	var cr = typeof x === 'string' ? '\r' : '\r'.charCodeAt();

	if (x[x.length - 1] === lf) {
		x = x.slice(0, x.length - 1);
	}

	if (x[x.length - 1] === cr) {
		x = x.slice(0, x.length - 1);
	}

	return x;
};


/***/ }),

/***/ 572:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasPreviousPage

const deprecate = __webpack_require__(307)
const getPageLinks = __webpack_require__(327)

function hasPreviousPage (link) {
  deprecate(`octokit.hasPreviousPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).prev
}


/***/ }),

/***/ 575:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = parseOptions;

const { Deprecation } = __webpack_require__(593);
const { getUserAgent } = __webpack_require__(46);
const once = __webpack_require__(870);

const pkg = __webpack_require__(83);

const deprecateOptionsTimeout = once((log, deprecation) =>
  log.warn(deprecation)
);
const deprecateOptionsAgent = once((log, deprecation) => log.warn(deprecation));
const deprecateOptionsHeaders = once((log, deprecation) =>
  log.warn(deprecation)
);

function parseOptions(options, log, hook) {
  if (options.headers) {
    options.headers = Object.keys(options.headers).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = options.headers[key];
      return newObj;
    }, {});
  }

  const clientDefaults = {
    headers: options.headers || {},
    request: options.request || {},
    mediaType: {
      previews: [],
      format: ""
    }
  };

  if (options.baseUrl) {
    clientDefaults.baseUrl = options.baseUrl;
  }

  if (options.userAgent) {
    clientDefaults.headers["user-agent"] = options.userAgent;
  }

  if (options.previews) {
    clientDefaults.mediaType.previews = options.previews;
  }

  if (options.timeZone) {
    clientDefaults.headers["time-zone"] = options.timeZone;
  }

  if (options.timeout) {
    deprecateOptionsTimeout(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({timeout}) is deprecated. Use {request: {timeout}} instead. See https://github.com/octokit/request.js#request"
      )
    );
    clientDefaults.request.timeout = options.timeout;
  }

  if (options.agent) {
    deprecateOptionsAgent(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({agent}) is deprecated. Use {request: {agent}} instead. See https://github.com/octokit/request.js#request"
      )
    );
    clientDefaults.request.agent = options.agent;
  }

  if (options.headers) {
    deprecateOptionsHeaders(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({headers}) is deprecated. Use {userAgent, previews} instead. See https://github.com/octokit/request.js#request"
      )
    );
  }

  const userAgentOption = clientDefaults.headers["user-agent"];
  const defaultUserAgent = `octokit.js/${pkg.version} ${getUserAgent()}`;

  clientDefaults.headers["user-agent"] = [userAgentOption, defaultUserAgent]
    .filter(Boolean)
    .join(" ");

  clientDefaults.request.hook = hook.bind(null, "request");

  return clientDefaults;
}


/***/ }),

/***/ 582:
/***/ (function(module) {

module.exports = addHook

function addHook (state, kind, name, hook) {
  var orig = hook
  if (!state.registry[name]) {
    state.registry[name] = []
  }

  if (kind === 'before') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options))
    }
  }

  if (kind === 'after') {
    hook = function (method, options) {
      var result
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_
          return orig(result, options)
        })
        .then(function () {
          return result
        })
    }
  }

  if (kind === 'error') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options)
        })
    }
  }

  state.registry[name].push({
    hook: hook,
    orig: orig
  })
}


/***/ }),

/***/ 588:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = paginationMethodsPlugin

function paginationMethodsPlugin (octokit) {
  octokit.getFirstPage = __webpack_require__(2).bind(null, octokit)
  octokit.getLastPage = __webpack_require__(281).bind(null, octokit)
  octokit.getNextPage = __webpack_require__(981).bind(null, octokit)
  octokit.getPreviousPage = __webpack_require__(309).bind(null, octokit)
  octokit.hasFirstPage = __webpack_require__(170)
  octokit.hasLastPage = __webpack_require__(15)
  octokit.hasNextPage = __webpack_require__(662)
  octokit.hasPreviousPage = __webpack_require__(572)
}


/***/ }),

/***/ 593:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;


/***/ }),

/***/ 597:
/***/ (function(module) {

"use strict";


// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

module.exports.command = escapeCommand;
module.exports.argument = escapeArgument;


/***/ }),

/***/ 605:
/***/ (function(module) {

module.exports = require("http");

/***/ }),

/***/ 606:
/***/ (function(module, __unusedexports, __webpack_require__) {

const { requestLog } = __webpack_require__(721);
const {
  restEndpointMethods
} = __webpack_require__(19);

const Core = __webpack_require__(689);

const CORE_PLUGINS = [
  __webpack_require__(265),
  __webpack_require__(359), // deprecated: remove in v17
  requestLog,
  __webpack_require__(48),
  restEndpointMethods,
  __webpack_require__(5),

  __webpack_require__(588) // deprecated: remove in v17
];

const OctokitRest = Core.plugin(CORE_PLUGINS);

function DeprecatedOctokit(options) {
  const warn =
    options && options.log && options.log.warn
      ? options.log.warn
      : console.warn;
  warn(
    '[@octokit/rest] `const Octokit = require("@octokit/rest")` is deprecated. Use `const { Octokit } = require("@octokit/rest")` instead'
  );
  return new OctokitRest(options);
}

const Octokit = Object.assign(DeprecatedOctokit, {
  Octokit: OctokitRest
});

Object.keys(OctokitRest).forEach(key => {
  /* istanbul ignore else */
  if (OctokitRest.hasOwnProperty(key)) {
    Octokit[key] = OctokitRest[key];
  }
});

module.exports = Octokit;


/***/ }),

/***/ 614:
/***/ (function(module) {

module.exports = require("events");

/***/ }),

/***/ 618:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationBeforeRequest;

const btoa = __webpack_require__(730);

const withAuthorizationPrefix = __webpack_require__(398);

function authenticationBeforeRequest(state, options) {
  if (typeof state.auth === "string") {
    options.headers.authorization = withAuthorizationPrefix(state.auth);
    return;
  }

  if (state.auth.username) {
    const hash = btoa(`${state.auth.username}:${state.auth.password}`);
    options.headers.authorization = `Basic ${hash}`;
    if (state.otp) {
      options.headers["x-github-otp"] = state.otp;
    }
    return;
  }

  if (state.auth.clientId) {
    // There is a special case for OAuth applications, when `clientId` and `clientSecret` is passed as
    // Basic Authorization instead of query parameters. The only routes where that applies share the same
    // URL though: `/applications/:client_id/tokens/:access_token`.
    //
    //  1. [Check an authorization](https://developer.github.com/v3/oauth_authorizations/#check-an-authorization)
    //  2. [Reset an authorization](https://developer.github.com/v3/oauth_authorizations/#reset-an-authorization)
    //  3. [Revoke an authorization for an application](https://developer.github.com/v3/oauth_authorizations/#revoke-an-authorization-for-an-application)
    //
    // We identify by checking the URL. It must merge both "/applications/:client_id/tokens/:access_token"
    // as well as "/applications/123/tokens/token456"
    if (/\/applications\/:?[\w_]+\/tokens\/:?[\w_]+($|\?)/.test(options.url)) {
      const hash = btoa(`${state.auth.clientId}:${state.auth.clientSecret}`);
      options.headers.authorization = `Basic ${hash}`;
      return;
    }

    options.url += options.url.indexOf("?") === -1 ? "?" : "&";
    options.url += `client_id=${state.auth.clientId}&client_secret=${state.auth.clientSecret}`;
    return;
  }

  return Promise.resolve()

    .then(() => {
      return state.auth();
    })

    .then(authorization => {
      options.headers.authorization = withAuthorizationPrefix(authorization);
    });
}


/***/ }),

/***/ 622:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(827);
const github = __webpack_require__(148);
const create_annotations_for_results = __webpack_require__(896);
const xunitViewer = __webpack_require__(208);
const artifact = __webpack_require__(633);
const artifactClient = artifact.create();
const rootDirectory = '.'; // Also possible to use __dirname
const artifactOptions = {
  continueOnError: false
};
const artifactName = "my-artifact";

// most @actions toolkit packages have async methods
async function run() {
  try {
    const input = core.getInput('xunit_path');
    create_annotations_for_results(input);

    await xunitViewer({
      server: false,
      results: input,
      ignore: ['_thingy', 'invalid'],
      title: 'Xunit View Sample Tests',
      output: 'output.html'
    });
    const files = ['output.html'];
    const uploadResponse = await artifactClient.uploadArtifact(artifactName, files, rootDirectory, options);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run()


/***/ }),

/***/ 627:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


module.exports = validate;

const { RequestError } = __webpack_require__(552);
const get = __webpack_require__(562);
const set = __webpack_require__(355);

function validate(octokit, options) {
  if (!options.request.validate) {
    return;
  }
  const { validate: params } = options.request;

  Object.keys(params).forEach(parameterName => {
    const parameter = get(params, parameterName);

    const expectedType = parameter.type;
    let parentParameterName;
    let parentValue;
    let parentParamIsPresent = true;
    let parentParameterIsArray = false;

    if (/\./.test(parameterName)) {
      parentParameterName = parameterName.replace(/\.[^.]+$/, "");
      parentParameterIsArray = parentParameterName.slice(-2) === "[]";
      if (parentParameterIsArray) {
        parentParameterName = parentParameterName.slice(0, -2);
      }
      parentValue = get(options, parentParameterName);
      parentParamIsPresent =
        parentParameterName === "headers" ||
        (typeof parentValue === "object" && parentValue !== null);
    }

    const values = parentParameterIsArray
      ? (get(options, parentParameterName) || []).map(
          value => value[parameterName.split(/\./).pop()]
        )
      : [get(options, parameterName)];

    values.forEach((value, i) => {
      const valueIsPresent = typeof value !== "undefined";
      const valueIsNull = value === null;
      const currentParameterName = parentParameterIsArray
        ? parameterName.replace(/\[\]/, `[${i}]`)
        : parameterName;

      if (!parameter.required && !valueIsPresent) {
        return;
      }

      // if the parent parameter is of type object but allows null
      // then the child parameters can be ignored
      if (!parentParamIsPresent) {
        return;
      }

      if (parameter.allowNull && valueIsNull) {
        return;
      }

      if (!parameter.allowNull && valueIsNull) {
        throw new RequestError(
          `'${currentParameterName}' cannot be null`,
          400,
          {
            request: options
          }
        );
      }

      if (parameter.required && !valueIsPresent) {
        throw new RequestError(
          `Empty value for parameter '${currentParameterName}': ${JSON.stringify(
            value
          )}`,
          400,
          {
            request: options
          }
        );
      }

      // parse to integer before checking for enum
      // so that string "1" will match enum with number 1
      if (expectedType === "integer") {
        const unparsedValue = value;
        value = parseInt(value, 10);
        if (isNaN(value)) {
          throw new RequestError(
            `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
              unparsedValue
            )} is NaN`,
            400,
            {
              request: options
            }
          );
        }
      }

      if (parameter.enum && parameter.enum.indexOf(String(value)) === -1) {
        throw new RequestError(
          `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
            value
          )}`,
          400,
          {
            request: options
          }
        );
      }

      if (parameter.validation) {
        const regex = new RegExp(parameter.validation);
        if (!regex.test(value)) {
          throw new RequestError(
            `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
              value
            )}`,
            400,
            {
              request: options
            }
          );
        }
      }

      if (expectedType === "object" && typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch (exception) {
          throw new RequestError(
            `JSON parse error of value for parameter '${currentParameterName}': ${JSON.stringify(
              value
            )}`,
            400,
            {
              request: options
            }
          );
        }
      }

      set(options, parameter.mapTo || currentParameterName, value);
    });
  });

  return options;
}


/***/ }),

/***/ 630:
/***/ (function(module) {

module.exports = require("perf_hooks");

/***/ }),

/***/ 631:
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(870)
var eos = __webpack_require__(183)
var fs = __webpack_require__(747) // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),

/***/ 633:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const artifact_client_1 = __webpack_require__(31);
/**
 * Constructs an ArtifactClient
 */
function create() {
    return artifact_client_1.DefaultArtifactClient.create();
}
exports.create = create;
//# sourceMappingURL=artifact-client.js.map

/***/ }),

/***/ 662:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasNextPage

const deprecate = __webpack_require__(307)
const getPageLinks = __webpack_require__(327)

function hasNextPage (link) {
  deprecate(`octokit.hasNextPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).next
}


/***/ }),

/***/ 669:
/***/ (function(module) {

module.exports = require("util");

/***/ }),

/***/ 689:
/***/ (function(module, __unusedexports, __webpack_require__) {

const factory = __webpack_require__(535);

module.exports = factory();


/***/ }),

/***/ 691:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const execa = __webpack_require__(66);

// Reference: https://www.gaijin.at/en/lstwinver.php
const names = new Map([
	['10.0', '10'],
	['6.3', '8.1'],
	['6.2', '8'],
	['6.1', '7'],
	['6.0', 'Vista'],
	['5.2', 'Server 2003'],
	['5.1', 'XP'],
	['5.0', '2000'],
	['4.9', 'ME'],
	['4.1', '98'],
	['4.0', '95']
]);

const windowsRelease = release => {
	const version = /\d+\.\d/.exec(release || os.release());

	if (release && !version) {
		throw new Error('`release` argument doesn\'t match `n.n`');
	}

	const ver = (version || [])[0];

	// Server 2008, 2012 and 2016 versions are ambiguous with desktop versions and must be detected at runtime.
	// If `release` is omitted or we're on a Windows system, and the version number is an ambiguous version
	// then use `wmic` to get the OS caption: https://msdn.microsoft.com/en-us/library/aa394531(v=vs.85).aspx
	// If the resulting caption contains the year 2008, 2012 or 2016, it is a server version, so return a server OS name.
	if ((!release || release === os.release()) && ['6.1', '6.2', '6.3', '10.0'].includes(ver)) {
		const stdout = execa.sync('wmic', ['os', 'get', 'Caption']).stdout || '';
		const year = (stdout.match(/2008|2012|2016/) || [])[0];
		if (year) {
			return `Server ${year}`;
		}
	}

	return names.get(ver);
};

module.exports = windowsRelease;


/***/ }),

/***/ 696:
/***/ (function(module, __unusedexports, __webpack_require__) {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

module.exports = glob

var fs = __webpack_require__(747)
var rp = __webpack_require__(544)
var minimatch = __webpack_require__(750)
var Minimatch = minimatch.Minimatch
var inherits = __webpack_require__(276)
var EE = __webpack_require__(614).EventEmitter
var path = __webpack_require__(277)
var assert = __webpack_require__(357)
var isAbsolute = __webpack_require__(829)
var globSync = __webpack_require__(133)
var common = __webpack_require__(214)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __webpack_require__(421)
var util = __webpack_require__(669)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __webpack_require__(870)

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  if (!options) options = {}

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
glob.glob = glob

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var g = new Glob(pattern, options)
  var set = g.minimatch.set

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  if (typeof cb === 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done)
  }
  sync = false

  function done () {
    --self._processing
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish()
        })
      } else {
        self._finish()
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0)
    return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next)

  function next () {
    if (--n === 0)
      self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset)
    return cb()

  var found = Object.keys(matchset)
  var self = this
  var n = found.length

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null)
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true
      else if (er.syscall === 'stat')
        set[p] = true
      else
        self.emit('error', er) // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume')
    this.paused = false
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0)
      this._emitQueue.length = 0
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i]
        this._emitMatch(e[0], e[1])
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0)
      this._processQueue.length = 0
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i]
        this._processing--
        this._process(p[0], p[1], p[2], p[3])
      }
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb === 'function')

  if (this.aborted)
    return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e
      else
        e = prefix + e
    }
    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute)
    e = abs

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  if (st)
    this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs
  var self = this
  var lstatcb = inflight(lstatkey, lstatcb_)

  if (lstatcb)
    fs.lstat(abs, lstatcb)

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else
      self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this
  fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb)
    else
      self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort()
      }
      if (!this.silent)
        console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs]
  var len = entries.length

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
  cb()
}

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE'
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this
  var statcb = inflight('stat\0' + abs, lstatcb_)
  if (statcb)
    fs.lstat(abs, statcb)

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb)
        else
          self._stat2(f, abs, er, stat, cb)
      })
    } else {
      self._stat2(f, abs, er, lstat, cb)
    }
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
}


/***/ }),

/***/ 700:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = rimraf
rimraf.sync = rimrafSync

var assert = __webpack_require__(357)
var path = __webpack_require__(277)
var fs = __webpack_require__(747)
var glob = __webpack_require__(696)
var _0666 = parseInt('666', 8)

var defaultGlobOpts = {
  nosort: true,
  silent: true
}

// for EMFILE handling
var timeout = 0

var isWindows = (process.platform === "win32")

function defaults (options) {
  var methods = [
    'unlink',
    'chmod',
    'stat',
    'lstat',
    'rmdir',
    'readdir'
  ]
  methods.forEach(function(m) {
    options[m] = options[m] || fs[m]
    m = m + 'Sync'
    options[m] = options[m] || fs[m]
  })

  options.maxBusyTries = options.maxBusyTries || 3
  options.emfileWait = options.emfileWait || 1000
  if (options.glob === false) {
    options.disableGlob = true
  }
  options.disableGlob = options.disableGlob || false
  options.glob = options.glob || defaultGlobOpts
}

function rimraf (p, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  assert(p, 'rimraf: missing path')
  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
  assert.equal(typeof cb, 'function', 'rimraf: callback function required')
  assert(options, 'rimraf: invalid options argument provided')
  assert.equal(typeof options, 'object', 'rimraf: options should be object')

  defaults(options)

  var busyTries = 0
  var errState = null
  var n = 0

  if (options.disableGlob || !glob.hasMagic(p))
    return afterGlob(null, [p])

  options.lstat(p, function (er, stat) {
    if (!er)
      return afterGlob(null, [p])

    glob(p, options.glob, afterGlob)
  })

  function next (er) {
    errState = errState || er
    if (--n === 0)
      cb(errState)
  }

  function afterGlob (er, results) {
    if (er)
      return cb(er)

    n = results.length
    if (n === 0)
      return cb()

    results.forEach(function (p) {
      rimraf_(p, options, function CB (er) {
        if (er) {
          if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") &&
              busyTries < options.maxBusyTries) {
            busyTries ++
            var time = busyTries * 100
            // try again, with the same exact callback as this one.
            return setTimeout(function () {
              rimraf_(p, options, CB)
            }, time)
          }

          // this one won't happen if graceful-fs is used.
          if (er.code === "EMFILE" && timeout < options.emfileWait) {
            return setTimeout(function () {
              rimraf_(p, options, CB)
            }, timeout ++)
          }

          // already gone
          if (er.code === "ENOENT") er = null
        }

        timeout = 0
        next(er)
      })
    })
  }
}

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
function rimraf_ (p, options, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  // sunos lets the root user unlink directories, which is... weird.
  // so we have to lstat here and make sure it's not a dir.
  options.lstat(p, function (er, st) {
    if (er && er.code === "ENOENT")
      return cb(null)

    // Windows can EPERM on stat.  Life is suffering.
    if (er && er.code === "EPERM" && isWindows)
      fixWinEPERM(p, options, er, cb)

    if (st && st.isDirectory())
      return rmdir(p, options, er, cb)

    options.unlink(p, function (er) {
      if (er) {
        if (er.code === "ENOENT")
          return cb(null)
        if (er.code === "EPERM")
          return (isWindows)
            ? fixWinEPERM(p, options, er, cb)
            : rmdir(p, options, er, cb)
        if (er.code === "EISDIR")
          return rmdir(p, options, er, cb)
      }
      return cb(er)
    })
  })
}

function fixWinEPERM (p, options, er, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')
  if (er)
    assert(er instanceof Error)

  options.chmod(p, _0666, function (er2) {
    if (er2)
      cb(er2.code === "ENOENT" ? null : er)
    else
      options.stat(p, function(er3, stats) {
        if (er3)
          cb(er3.code === "ENOENT" ? null : er)
        else if (stats.isDirectory())
          rmdir(p, options, er, cb)
        else
          options.unlink(p, cb)
      })
  })
}

function fixWinEPERMSync (p, options, er) {
  assert(p)
  assert(options)
  if (er)
    assert(er instanceof Error)

  try {
    options.chmodSync(p, _0666)
  } catch (er2) {
    if (er2.code === "ENOENT")
      return
    else
      throw er
  }

  try {
    var stats = options.statSync(p)
  } catch (er3) {
    if (er3.code === "ENOENT")
      return
    else
      throw er
  }

  if (stats.isDirectory())
    rmdirSync(p, options, er)
  else
    options.unlinkSync(p)
}

function rmdir (p, options, originalEr, cb) {
  assert(p)
  assert(options)
  if (originalEr)
    assert(originalEr instanceof Error)
  assert(typeof cb === 'function')

  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
  // if we guessed wrong, and it's not a directory, then
  // raise the original error.
  options.rmdir(p, function (er) {
    if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
      rmkids(p, options, cb)
    else if (er && er.code === "ENOTDIR")
      cb(originalEr)
    else
      cb(er)
  })
}

function rmkids(p, options, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  options.readdir(p, function (er, files) {
    if (er)
      return cb(er)
    var n = files.length
    if (n === 0)
      return options.rmdir(p, cb)
    var errState
    files.forEach(function (f) {
      rimraf(path.join(p, f), options, function (er) {
        if (errState)
          return
        if (er)
          return cb(errState = er)
        if (--n === 0)
          options.rmdir(p, cb)
      })
    })
  })
}

// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
function rimrafSync (p, options) {
  options = options || {}
  defaults(options)

  assert(p, 'rimraf: missing path')
  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
  assert(options, 'rimraf: missing options')
  assert.equal(typeof options, 'object', 'rimraf: options should be object')

  var results

  if (options.disableGlob || !glob.hasMagic(p)) {
    results = [p]
  } else {
    try {
      options.lstatSync(p)
      results = [p]
    } catch (er) {
      results = glob.sync(p, options.glob)
    }
  }

  if (!results.length)
    return

  for (var i = 0; i < results.length; i++) {
    var p = results[i]

    try {
      var st = options.lstatSync(p)
    } catch (er) {
      if (er.code === "ENOENT")
        return

      // Windows can EPERM on stat.  Life is suffering.
      if (er.code === "EPERM" && isWindows)
        fixWinEPERMSync(p, options, er)
    }

    try {
      // sunos lets the root user unlink directories, which is... weird.
      if (st && st.isDirectory())
        rmdirSync(p, options, null)
      else
        options.unlinkSync(p)
    } catch (er) {
      if (er.code === "ENOENT")
        return
      if (er.code === "EPERM")
        return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
      if (er.code !== "EISDIR")
        throw er

      rmdirSync(p, options, er)
    }
  }
}

function rmdirSync (p, options, originalEr) {
  assert(p)
  assert(options)
  if (originalEr)
    assert(originalEr instanceof Error)

  try {
    options.rmdirSync(p)
  } catch (er) {
    if (er.code === "ENOENT")
      return
    if (er.code === "ENOTDIR")
      throw originalEr
    if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
      rmkidsSync(p, options)
  }
}

function rmkidsSync (p, options) {
  assert(p)
  assert(options)
  options.readdirSync(p).forEach(function (f) {
    rimrafSync(path.join(p, f), options)
  })

  // We only end up here once we got ENOTEMPTY at least once, and
  // at this point, we are guaranteed to have removed all the kids.
  // So, we know that it won't be ENOENT or ENOTDIR or anything else.
  // try really hard to delete stuff on windows, because it has a
  // PROFOUNDLY annoying habit of not closing handles promptly when
  // files are deleted, resulting in spurious ENOTEMPTY errors.
  var retries = isWindows ? 100 : 1
  var i = 0
  do {
    var threw = true
    try {
      var ret = options.rmdirSync(p, options)
      threw = false
      return ret
    } finally {
      if (++i < retries && threw)
        continue
    }
  } while (true)
}


/***/ }),

/***/ 703:
/***/ (function(__unusedmodule, exports) {

/*
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 */

function copy(src,dest){
	for(var p in src){
		dest[p] = src[p];
	}
}
/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknow Class:"+Class)
		}
		pt.constructor = Class
	}
}
var htmlns = 'http://www.w3.org/1999/xhtml' ;
// Node Types
var NodeType = {}
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {}
var ExceptionMessage = {};
var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);


function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else{
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException)
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
};
NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0, 
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long 
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
	 */
	item: function(index) {
		return this[index] || null;
	},
	toString:function(isHTML,nodeFilter){
		for(var buf = [], i = 0;i<this.length;i++){
			serializeToString(this[i],buf,isHTML,nodeFilter);
		}
		return buf.join('');
	}
};
function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if(list._inc != inc){
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list,'length',ls.length);
		copy(ls,list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i];
}

_extends(LiveNodeList,NodeList);
/**
 * 
 * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {
};

function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else{
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	//console.log('remove attr:'+attr)
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1
		while(i<lastIndex){
			list[i] = list[++i]
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else{
		throw DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		//console.log()
		var i = this.length;
		while(i--){
			var attr = this[i];
			//console.log(attr.nodeName,key)
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
		
		
	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
	
	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};
/**
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
 */
function DOMImplementation(/* Object */ features) {
	this._features = {};
	if (features) {
		for (var feature in features) {
			 this._features = features[feature];
		}
	}
};

DOMImplementation.prototype = {
	hasFeature: function(/* string */ feature, /* string */ version) {
		var versions = this._features[feature.toLowerCase()];
		if (versions && (!version || version in versions)) {
			return true;
		} else {
			return false;
		}
	},
	// Introduced in DOM Level 2:
	createDocument:function(namespaceURI,  qualifiedName, doctype){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype;
		if(doctype){
			doc.appendChild(doctype);
		}
		if(qualifiedName){
			var root = doc.createElementNS(namespaceURI,qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	// Introduced in DOM Level 2:
	createDocumentType:function(qualifiedName, publicId, systemId){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId;
		node.systemId = systemId;
		// Introduced in DOM Level 2:
		//readonly attribute DOMString        internalSubset;
		
		//TODO:..
		//  readonly attribute NamedNodeMap     entities;
		//  readonly attribute NamedNodeMap     notations;
		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
};

Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises 
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises 
		this.insertBefore(newChild,oldChild);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else{
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
    				if(map[n] == namespaceURI){
    					return n;
    				}
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(prefix in map){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
}
function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}
function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}
function _onUpdateChild(doc,el,newChild){
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if(newChild){
			cs[cs.length++] = newChild;
		}else{
			//console.log(1)
			var child = el.firstChild;
			var i = 0;
			while(child){
				cs[i++] = child;
				child =child.nextSibling;
			}
			cs.length = i;
		}
	}
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode,child){
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if(previous){
		previous.nextSibling = next;
	}else{
		parentNode.firstChild = next
	}
	if(next){
		next.previousSibling = previous;
	}else{
		parentNode.lastChild = previous;
	}
	_onUpdateChild(parentNode.ownerDocument,parentNode);
	return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode,newChild,nextChild){
	var cp = newChild.parentNode;
	if(cp){
		cp.removeChild(newChild);//remove and update
	}
	if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = newChild.firstChild;
		if (newFirst == null) {
			return newChild;
		}
		var newLast = newChild.lastChild;
	}else{
		newFirst = newLast = newChild;
	}
	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = nextChild;
	
	
	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parentNode.firstChild = newFirst;
	}
	if(nextChild == null){
		parentNode.lastChild = newLast;
	}else{
		nextChild.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parentNode;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parentNode.ownerDocument||parentNode,parentNode);
	//console.log(parentNode.lastChild.nextSibling == null)
	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
		newChild.firstChild = newChild.lastChild = null;
	}
	return newChild;
}
function _appendSingleChild(parentNode,newChild){
	var cp = newChild.parentNode;
	if(cp){
		var pre = parentNode.lastChild;
		cp.removeChild(newChild);//remove and update
		var pre = parentNode.lastChild;
	}
	var pre = parentNode.lastChild;
	newChild.parentNode = parentNode;
	newChild.previousSibling = pre;
	newChild.nextSibling = null;
	if(pre){
		pre.nextSibling = newChild;
	}else{
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument,parentNode,newChild);
	return newChild;
	//console.log("__aa",parentNode.lastChild.nextSibling == null)
}
Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	doctype :  null,
	documentElement :  null,
	_inc : 1,
	
	insertBefore :  function(newChild, refChild){//raises 
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		if(this.documentElement == null && newChild.nodeType == ELEMENT_NODE){
			this.documentElement = newChild;
		}
		
		return _insertBefore(this,newChild,refChild),(newChild.ownerDocument = this),newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == ELEMENT_NODE){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		})
		return rtv;
	},
	
	getElementsByClassName: function(className) {
		const pattern = new RegExp(`(^|\\s)${className}(\\s|$)`);
		return new LiveNodeList(this, base => {
			var ls = [];
			_visitNode(base.documentElement, node => {
				if(node !== base && node.nodeType == ELEMENT_NODE) {
					if(pattern.test(node.getAttribute('class'))) {
						ls.push(node);
					}
				}
			});
			return ls;
		});
	},
	
	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue= node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name)
		attr && this.removeAttributeNode(attr);
	},
	
	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else{
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		//console.log(this == oldAttr.ownerElement)
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},
	
	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},
	
	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;
			
		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
};
CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);
	
	},
	appendChild:function(newChild){
		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
}
_extends(CharacterData,Node);
function Text() {
};
Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
}
_extends(Text,CharacterData);
function Comment() {
};
Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
}
_extends(Comment,CharacterData);

function CDATASection() {
};
CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
}
_extends(CDATASection,CharacterData);


function DocumentType() {
};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
};
DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
	return nodeSerializeToString.call(node,isHtml,nodeFilter);
}
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml,nodeFilter){
	var buf = [];
	var refNode = this.nodeType == 9 && this.documentElement || this;
	var prefix = refNode.prefix;
	var uri = refNode.namespaceURI;
	
	if(uri && prefix == null){
		//console.log(prefix)
		var prefix = refNode.lookupPrefix(uri);
		if(prefix == null){
			//isHTML = true;
			var visibleNamespaces=[
			{namespace:uri,prefix:null}
			//{namespace:uri,prefix:''}
			]
		}
	}
	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
	return buf.join('');
}
function needNamespaceDefine(node,isHTML, visibleNamespaces) {
	var prefix = node.prefix||'';
	var uri = node.namespaceURI;
	if (!prefix && !uri){
		return false;
	}
	if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" 
		|| uri == 'http://www.w3.org/2000/xmlns/'){
		return false;
	}
	
	var i = visibleNamespaces.length 
	//console.log('@@@@',node.tagName,prefix,uri,visibleNamespaces)
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		//console.log(node.nodeType,node.tagName,ns.prefix,prefix)
		if (ns.prefix == prefix){
			return ns.namespace != uri;
		}
	}
	//console.log(isHTML,uri,prefix=='')
	//if(isHTML && prefix ==null && uri == 'http://www.w3.org/1999/xhtml'){
	//	return false;
	//}
	//node.flag = '11111'
	//console.error(3,true,node.flag,node.prefix,node.namespaceURI)
	return true;
}
function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if(nodeFilter){
		node = nodeFilter(node);
		if(node){
			if(typeof node == 'string'){
				buf.push(node);
				return;
			}
		}else{
			return;
		}
		//buf.sort.apply(attrs, attributeSorter);
	}
	switch(node.nodeType){
	case ELEMENT_NODE:
		if (!visibleNamespaces) visibleNamespaces = [];
		var startVisibleNamespaces = visibleNamespaces.length;
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;
		
		isHTML =  (htmlns === node.namespaceURI) ||isHTML 
		buf.push('<',nodeName);
		
		
		
		for(var i=0;i<len;i++){
			// add namespaces for attributes
			var attr = attrs.item(i);
			if (attr.prefix == 'xmlns') {
				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
			}else if(attr.nodeName == 'xmlns'){
				visibleNamespaces.push({ prefix: '', namespace: attr.value });
			}
		}
		for(var i=0;i<len;i++){
			var attr = attrs.item(i);
			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
				var prefix = attr.prefix||'';
				var uri = attr.namespaceURI;
				var ns = prefix ? ' xmlns:' + prefix : " xmlns";
				buf.push(ns, '="' , uri , '"');
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}
		// add namespace for current node		
		if (needNamespaceDefine(node,isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			var ns = prefix ? ' xmlns:' + prefix : " xmlns";
			buf.push(ns, '="' , uri , '"');
			visibleNamespaces.push({ prefix: prefix, namespace:uri });
		}
		
		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				while(child){
					if(child.data){
						buf.push(child.data);
					}else{
						serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					child = child.nextSibling;
				}
			}
			buf.push('</',nodeName,'>');
		}else{
			buf.push('/>');
		}
		// remove added visible namespaces
		//visibleNamespaces.length = startVisibleNamespaces;
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return buf.push(' ',node.name,'="',node.value.replace(/[<&"]/g,_xmlEncoder),'"');
	case TEXT_NODE:
		return buf.push(node.data.replace(/[<&]/g,_xmlEncoder));
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC "',pubid);
			if (sysid && sysid!='.') {
				buf.push( '" "',sysid);
			}
			buf.push('">');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM "',sysid,'">');
		}else{
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for(var n in node){
		var v = node[n];
		if(typeof v != 'object' ){
			if(v != node2[n]){
				node2[n] = v;
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;;
	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});
		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},
			set:function(data){
				switch(this.nodeType){
				case ELEMENT_NODE:
				case DOCUMENT_FRAGMENT_NODE:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;
				default:
					//TODO:
					this.data = data;
					this.value = data;
					this.nodeValue = data;
				}
			}
		})
		
		function getTextContent(node){
			switch(node.nodeType){
			case ELEMENT_NODE:
			case DOCUMENT_FRAGMENT_NODE:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}
		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value
		}
	}
}catch(e){//ie8
}

//if(typeof require == 'function'){
	exports.Node = Node;
	exports.DOMImplementation = DOMImplementation;
	exports.XMLSerializer = XMLSerializer;
//}


/***/ }),

/***/ 714:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var endpoint = __webpack_require__(754);
var universalUserAgent = __webpack_require__(898);
var isPlainObject = _interopDefault(__webpack_require__(154));
var nodeFetch = _interopDefault(__webpack_require__(770));
var requestError = __webpack_require__(717);

const VERSION = "5.3.4";

function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, requestOptions.request)).then(response => {
    url = response.url;
    status = response.status;

    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }

    if (status === 204 || status === 205) {
      return;
    } // GitHub API returns 200 for HEAD requests


    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }

      throw new requestError.RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }

    if (status === 304) {
      throw new requestError.RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    }

    if (status >= 400) {
      return response.text().then(message => {
        const error = new requestError.RequestError(message, status, {
          headers,
          request: requestOptions
        });

        try {
          let responseBody = JSON.parse(error.message);
          Object.assign(error, responseBody);
          let errors = responseBody.errors; // Assumption `errors` would always be in Array format

          error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
        } catch (e) {// ignore, see octokit/rest.js#684
        }

        throw error;
      });
    }

    const contentType = response.headers.get("content-type");

    if (/application\/json/.test(contentType)) {
      return response.json();
    }

    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }

    return getBufferResponse(response);
  }).then(data => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch(error => {
    if (error instanceof requestError.RequestError) {
      throw error;
    }

    throw new requestError.RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}

function withDefaults(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);

  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint)
    });
    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint)
  });
}

const request = withDefaults(endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  }
});

exports.request = request;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 717:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __webpack_require__(593);
var once = _interopDefault(__webpack_require__(870));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 719:
/***/ (function(module) {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 721:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

const VERSION = "1.0.0";

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function requestLog(octokit) {
  octokit.hook.wrap("request", (request, options) => {
    octokit.log.debug("request", options);
    const start = Date.now();
    const requestOptions = octokit.request.endpoint.parse(options);
    const path = requestOptions.url.replace(options.baseUrl, "");
    return request(options).then(response => {
      octokit.log.info(`${requestOptions.method} ${path} - ${response.status} in ${Date.now() - start}ms`);
      return response;
    }).catch(error => {
      octokit.log.info(`${requestOptions.method} ${path} - ${error.status} in ${Date.now() - start}ms`);
      throw error;
    });
  });
}
requestLog.VERSION = VERSION;

exports.requestLog = requestLog;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 730:
/***/ (function(module) {

module.exports = function btoa(str) {
  return new Buffer(str).toString('base64')
}


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 750:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __webpack_require__(277)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __webpack_require__(416)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ 754:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isPlainObject = _interopDefault(__webpack_require__(154));
var universalUserAgent = __webpack_require__(898);

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach(key => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, {
        [key]: options[key]
      });else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, {
        [key]: options[key]
      });
    }
  });
  return result;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {
      method,
      url
    } : {
      url: method
    }, options);
  } else {
    options = Object.assign({}, route);
  } // lowercase header names before merging with defaults to avoid duplicates


  options.headers = lowercaseKeys(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return url + separator + names.map(name => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }

    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* istanbul ignore file */
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }

    return part;
  }).join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
      result = [];

  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }

  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];

      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }

      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });

      if (operator && operator !== "+") {
        var separator = ",";

        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }

        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{+$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequset = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequset) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  } // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  } // default content-type for JSON if body is set


  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string


  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  } // Only return body/request keys if present


  return Object.assign({
    method,
    url,
    headers
  }, typeof body !== "undefined" ? {
    body
  } : null, options.request ? {
    request: options.request
  } : null);
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  });
}

const VERSION = "6.0.0";

const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`; // DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.

const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};

const endpoint = withDefaults(null, DEFAULTS);

exports.endpoint = endpoint;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 761:
/***/ (function(module) {

module.exports = require("zlib");

/***/ }),

/***/ 765:
/***/ (function(module) {

module.exports = require("process");

/***/ }),

/***/ 767:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);

const nameMap = new Map([
	[19, 'Catalina'],
	[18, 'Mojave'],
	[17, 'High Sierra'],
	[16, 'Sierra'],
	[15, 'El Capitan'],
	[14, 'Yosemite'],
	[13, 'Mavericks'],
	[12, 'Mountain Lion'],
	[11, 'Lion'],
	[10, 'Snow Leopard'],
	[9, 'Leopard'],
	[8, 'Tiger'],
	[7, 'Panther'],
	[6, 'Jaguar'],
	[5, 'Puma']
]);

const macosRelease = release => {
	release = Number((release || os.release()).split('.')[0]);
	return {
		name: nameMap.get(release),
		version: '10.' + (release - 4)
	};
};

module.exports = macosRelease;
// TODO: remove this in the next major version
module.exports.default = macosRelease;


/***/ }),

/***/ 770:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Stream = _interopDefault(__webpack_require__(413));
var http = _interopDefault(__webpack_require__(605));
var Url = _interopDefault(__webpack_require__(835));
var https = _interopDefault(__webpack_require__(211));
var zlib = _interopDefault(__webpack_require__(761));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = __webpack_require__(110).convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;


/***/ }),

/***/ 776:
/***/ (function(module) {

// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
]

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  )
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  )
}


/***/ }),

/***/ 805:
/***/ (function(module) {

module.exports = function atob(str) {
  return Buffer.from(str, 'base64').toString('binary')
}


/***/ }),

/***/ 806:
/***/ (function(module, exports) {

exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var R = 0

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*'
var NUMERICIDENTIFIERLOOSE = R++
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')'

var MAINVERSIONLOOSE = R++
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')'

var PRERELEASEIDENTIFIERLOOSE = R++
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))'

var PRERELEASELOOSE = R++
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?'

src[FULL] = '^' + FULLPLAIN + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?'

var LOOSE = R++
src[LOOSE] = '^' + LOOSEPLAIN + '$'

var GTLT = R++
src[GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
var XRANGEIDENTIFIER = R++
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*'

var XRANGEPLAIN = R++
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?'

var XRANGEPLAINLOOSE = R++
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?'

var XRANGE = R++
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$'
var XRANGELOOSE = R++
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
var COERCE = R++
src[COERCE] = '(?:^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++
src[LONETILDE] = '(?:~>?)'

var TILDETRIM = R++
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+'
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

var TILDE = R++
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$'
var TILDELOOSE = R++
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++
src[LONECARET] = '(?:\\^)'

var CARETTRIM = R++
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+'
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g')
var caretTrimReplace = '$1^'

var CARET = R++
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$'
var CARETLOOSE = R++
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$'
var COMPARATOR = R++
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$'

var HYPHENRANGELOOSE = R++
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
var STAR = R++
src[STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  var r = options.loose ? re[LOOSE] : re[FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version)
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options)
  }

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[LOOSE] : re[FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version')
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version')
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version')
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compare(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.rcompare(a, b, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError('Invalid operator: ' + op)
  }
}

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1]
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY) {
    return true
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease) {
      return range
    } else {
      return new Range(range.raw, options)
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options)
  }

  if (!(this instanceof Range)) {
    return new Range(range, options)
  }

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required')
  }

  return this.set.some(function (thisComparators) {
    return thisComparators.every(function (thisComparator) {
      return range.set.some(function (rangeComparators) {
        return rangeComparators.every(function (rangeComparator) {
          return thisComparator.intersects(rangeComparator, options)
        })
      })
    })
  })
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
function toComparators (range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value
    }).join(' ').trim().split(' ')
  })
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator (comp, options) {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

function isX (id) {
  return !id || id.toLowerCase() === 'x' || id === '*'
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options)
  }).join(' ')
}

function replaceTilde (comp, options) {
  var r = options.loose ? re[TILDELOOSE] : re[TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options)
  }).join(' ')
}

function replaceCaret (comp, options) {
  debug('caret', comp, options)
  var r = options.loose ? re[CARETLOOSE] : re[CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[XRANGELOOSE] : re[XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '')
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
  }

  return (from + ' ' + to).trim()
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true
    }
  }
  return false
}

function testSet (set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
function validRange (range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  var match = version.match(re[COERCE])

  if (match == null) {
    return null
  }

  return parse(match[1] +
    '.' + (match[2] || '0') +
    '.' + (match[3] || '0'))
}


/***/ }),

/***/ 812:
/***/ (function(module) {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 821:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(747)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),

/***/ 827:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(215);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(277));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command_1.issueCommand('set-env', { name }, val);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store
 */
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message
 */
function error(message) {
    command_1.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command_1.issue('warning', message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store
 */
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 829:
/***/ (function(module) {

"use strict";


function posix(path) {
	return path.charAt(0) === '/';
}

function win32(path) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;


/***/ }),

/***/ 835:
/***/ (function(module) {

module.exports = require("url");

/***/ }),

/***/ 839:
/***/ (function(module) {

"use strict";

module.exports = opts => {
	opts = opts || {};

	const env = opts.env || process.env;
	const platform = opts.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(env).find(x => x.toUpperCase() === 'PATH') || 'Path';
};


/***/ }),

/***/ 844:
/***/ (function(module) {

module.exports = validateAuth;

function validateAuth(auth) {
  if (typeof auth === "string") {
    return;
  }

  if (typeof auth === "function") {
    return;
  }

  if (auth.username && auth.password) {
    return;
  }

  if (auth.clientId && auth.clientSecret) {
    return;
  }

  throw new Error(`Invalid "auth" option: ${JSON.stringify(auth)}`);
}


/***/ }),

/***/ 851:
/***/ (function(module) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 854:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(747)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),

/***/ 860:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __webpack_require__(87);
const events = __webpack_require__(614);
const child = __webpack_require__(129);
const path = __webpack_require__(277);
const io = __webpack_require__(51);
const ioUtil = __webpack_require__(32);
/* eslint-disable @typescript-eslint/unbound-method */
const IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends events.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(os.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + os.EOL.length);
                n = s.indexOf(os.EOL);
            }
            strBuffer = s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
        }
    }
    _getSpawnFileName() {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!ioUtil.isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield io.which(this.toolPath, true);
            return new Promise((resolve, reject) => {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                const fileName = this._getSpawnFileName();
                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                const stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                const errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
            });
        });
    }
}
exports.ToolRunner = ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
exports.argStringToArray = argStringToArray;
class ExecState extends events.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay /
                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}
//# sourceMappingURL=toolrunner.js.map

/***/ }),

/***/ 870:
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(719)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 881:
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __webpack_require__(854)
} else {
  core = __webpack_require__(821)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),

/***/ 885:
/***/ (function(module) {

"use strict";

module.exports = /^#!.*/;


/***/ }),

/***/ 896:
/***/ (function(module, __unusedexports, __webpack_require__) {

const { Octokit } = __webpack_require__(460);
const { createTokenAuth } = __webpack_require__(268);
const { exec } = __webpack_require__(120);
const  core  = __webpack_require__(827);
var DOMParser = __webpack_require__(181).DOMParser;

const { execSync } = __webpack_require__(129);
const { spawn, spawnSync } = __webpack_require__(129);
const path = __webpack_require__(277);
const fs = __webpack_require__(747);
const process = __webpack_require__(765);

function handle_error(err) {
  console.error(err)
}

let create_annotations_for_results = function(xml_file) {
    const xml_string = fs.readFileSync(xml_file, 'utf8');
    var parser = new DOMParser({
      errorHandler: {
        warning: function (w) {
          console.warn(w)
        }, error: handle_error, fatalError: handle_error
      }
    });
    var doc = parser.parseFromString(xml_string);
    var elems = doc.getElementsByTagName("testcase");
    for (var i = 0; i < elems.length; ++i) {
      const tc = elems[i];
      if (!tc.hasChildNodes())
        continue;


      const failures = tc.getElementsByTagName("failure");
      if (failures.length != 1) {
        throw "shit";
      }

      const test_path = tc.getAttribute('classname');
      const test_name = tc.getAttribute('name');
      var output = 'TEST ';
      output = test_path;
      output += test_name;
      output += "FAILED\n ";
      output += failures[0].firstChild.data;
      core.error(output);
    }
}

module.exports = create_annotations_for_results;


/***/ }),

/***/ 898:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(50));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    return "<environment undetectable>";
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 900:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var universalUserAgent = __webpack_require__(898);
var beforeAfterHook = __webpack_require__(344);
var request = __webpack_require__(714);
var graphql = __webpack_require__(71);
var authToken = __webpack_require__(268);

const VERSION = "2.4.3";

class Octokit {
  constructor(options = {}) {
    const hook = new beforeAfterHook.Collection();
    const requestDefaults = {
      baseUrl: request.request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        hook: hook.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    }; // prepend default user agent with `options.userAgent` if set

    requestDefaults.headers["user-agent"] = [options.userAgent, `octokit-core.js/${VERSION} ${universalUserAgent.getUserAgent()}`].filter(Boolean).join(" ");

    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }

    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }

    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }

    this.request = request.request.defaults(requestDefaults);
    this.graphql = graphql.withCustomRequest(this.request).defaults(requestDefaults);
    this.log = Object.assign({
      debug: () => {},
      info: () => {},
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    }, options.log);
    this.hook = hook; // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
    //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registred.
    // (2) If only `options.auth` is set, use the default token authentication strategy.
    // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
    // TODO: type `options.auth` based on `options.authStrategy`.

    if (!options.authStrategy) {
      if (!options.auth) {
        // (1)
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        // (2)
        const auth = authToken.createTokenAuth(options.auth); // @ts-ignore  ¯\_(ツ)_/¯

        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
    } else {
      const auth = options.authStrategy(Object.assign({
        request: this.request
      }, options.auth)); // @ts-ignore  ¯\_(ツ)_/¯

      hook.wrap("request", auth.hook);
      this.auth = auth;
    } // apply plugins
    // https://stackoverflow.com/a/16345172


    const classConstructor = this.constructor;
    classConstructor.plugins.forEach(plugin => {
      Object.assign(this, plugin(this, options));
    });
  }

  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};
        super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
          userAgent: `${options.userAgent} ${defaults.userAgent}`
        } : null));
      }

    };
    return OctokitWithDefaults;
  }
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */


  static plugin(p1, ...p2) {
    var _a;

    if (p1 instanceof Array) {
      console.warn(["Passing an array of plugins to Octokit.plugin() has been deprecated.", "Instead of:", "  Octokit.plugin([plugin1, plugin2, ...])", "Use:", "  Octokit.plugin(plugin1, plugin2, ...)"].join("\n"));
    }

    const currentPlugins = this.plugins;
    let newPlugins = [...(p1 instanceof Array ? p1 : [p1]), ...p2];
    const NewOctokit = (_a = class extends this {}, _a.plugins = currentPlugins.concat(newPlugins.filter(plugin => !currentPlugins.includes(plugin))), _a);
    return NewOctokit;
  }

}
Octokit.VERSION = VERSION;
Octokit.plugins = [];

exports.Octokit = Octokit;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 907:
/***/ (function(__unusedmodule, exports) {

//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring 
var S_ATTR_SPACE=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
var S_ATTR_END = 5;//attr value end and no space(quot end)
var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7;//closed el<el />

function XMLReader(){
	
}

XMLReader.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {})
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
}
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
	function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if(k in entityMap){
			return entityMap[k]; 
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else{
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		if(end>start){
			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
			locator&&position(start);
			domBuilder.characters(xt,0,end-start);
			start = end
		}
	}
	function position(p,m){
		while(p>=lineEnd && (m = linePattern.exec(source))){
			lineStart = m.index;
			lineEnd = lineStart + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = p-lineStart+1;
	}
	var lineStart = 0;
	var lineEnd = 0;
	var linePattern = /.*(?:\r\n?|\n)|.*$/g
	var locator = domBuilder.locator;
	
	var parseStack = [{currentNSMap:defaultNSMapCopy}]
	var closeMap = {};
	var start = 0;
	while(true){
		try{
			var tagStart = source.indexOf('<',start);
			if(tagStart<0){
				if(!source.substr(start).match(/^\s*$/)){
					var doc = domBuilder.doc;
	    			var text = doc.createTextNode(source.substr(start));
	    			doc.appendChild(text);
	    			domBuilder.currentElement = text;
				}
				return;
			}
			if(tagStart>start){
				appendText(tagStart);
			}
			switch(source.charAt(tagStart+1)){
			case '/':
				var end = source.indexOf('>',tagStart+3);
				var tagName = source.substring(tagStart+2,end);
				var config = parseStack.pop();
				if(end<0){
					
	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		//console.error('#@@@@@@'+tagName)
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
				//console.error(parseStack.length,parseStack)
				//console.error(config);
				var localNSMap = config.localNSMap;
				var endMatch = config.tagName == tagName;
				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase()
		        if(endIgnoreCaseMach){
		        	domBuilder.endElement(config.uri,config.localName,tagName);
					if(localNSMap){
						for(var prefix in localNSMap){
							domBuilder.endPrefixMapping(prefix) ;
						}
					}
					if(!endMatch){
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName );
					}
		        }else{
		        	parseStack.push(config)
		        }
				
				end++;
				break;
				// end elment
			case '?':// <?...?>
				locator&&position(tagStart);
				end = parseInstruction(source,tagStart,domBuilder);
				break;
			case '!':// <!doctype,<![CDATA,<!--
				locator&&position(tagStart);
				end = parseDCC(source,tagStart,domBuilder,errorHandler);
				break;
			default:
				locator&&position(tagStart);
				var el = new ElementAttributes();
				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
				//elStartEnd
				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
				var len = el.length;
				
				
				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				if(locator && len){
					var locator2 = copyLocator(locator,{});
					//try{//attribute position fixed
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.locator = copyLocator(locator,{});
					}
					//}catch(e){console.error('@@@@@'+e)}
					domBuilder.locator = locator2
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
					domBuilder.locator = locator;
				}else{
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
				}
				
				
				
				if(el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed){
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				}else{
					end++;
				}
			}
		}catch(e){
			errorHandler.error('element parse error: '+e)
			//errorHandler.error('element parse error: '+e);
			end = -1;
			//throw e;
		}
		if(end>start){
			start = end;
		}else{
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(Math.max(tagStart,start)+1);
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_SPACE){
				s = S_EQ;
			}else{
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName');
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
				){//equal
				if(s === S_ATTR){
					errorHandler.warning('attribute value must after "="')
					attrName = source.slice(start,p)
				}
				start = p+1;
				p = source.indexOf(c,start)
				if(p>0){
					value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					el.add(attrName,value,start-1);
					s = S_ATTR_END;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
				//console.log(attrName,value,start,p)
				el.add(attrName,value,start);
				//console.dir(el)
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="');
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				s =S_TAG_CLOSE;
				el.closed = true;
			case S_ATTR_NOQUOT_VALUE:
			case S_ATTR:
			case S_ATTR_SPACE:
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')")
			}
			break;
		case ''://end document
			//throw new Error('unexpected end of input')
			errorHandler.error('unexpected end of input');
			if(s == S_TAG){
				el.setTagName(source.slice(start,p));
			}
			return p;
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				break;//normal
			case S_ATTR_NOQUOT_VALUE://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1)
				}
			case S_ATTR_SPACE:
				if(s === S_ATTR_SPACE){
					value = attrName;
				}
				if(s == S_ATTR_NOQUOT_VALUE){
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value.replace(/&#?\w+;/g,entityReplacer),start)
				}else{
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					}
					el.add(value,value,start)
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_TAG_SPACE;
					break;
				case S_ATTR:
					attrName = source.slice(start,p)
					s = S_ATTR_SPACE;
					break;
				case S_ATTR_NOQUOT_VALUE:
					var value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value,start)
				case S_ATTR_END:
					s = S_TAG_SPACE;
					break;
				//case S_TAG_SPACE:
				//case S_EQ:
				//case S_ATTR_SPACE:
				//	void();break;
				//case S_TAG_CLOSE:
					//ignore warning
				}
			}else{//not space
//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_ATTR_NOQUOT_VALUE:void();break;
				case S_ATTR_SPACE:
					var tagName =  el.tagName;
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!')
					}
					el.add(attrName,attrName,start);
					start = p;
					s = S_ATTR;
					break;
				case S_ATTR_END:
					errorHandler.warning('attribute space is required"'+attrName+'"!!')
				case S_TAG_SPACE:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_ATTR_NOQUOT_VALUE;
					start = p;
					break;
				case S_TAG_CLOSE:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}//end outer switch
		//console.log('p++',p)
		p++;
	}
}
/**
 * @return true if has new namespace define
 */
function appendElement(el,domBuilder,currentNSMap){
	var tagName = el.tagName;
	var localNSMap = null;
	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName
		}else{
			localName = qName;
			prefix = null
			nsPrefix = qName === 'xmlns' && ''
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute 
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {}
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={})
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = 'http://www.w3.org/2000/xmlns/'
			domBuilder.startPrefixMapping(nsPrefix, value) 
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = 'http://www.w3.org/XML/1998/namespace';
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix || '']
				
				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else{
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for(prefix in localNSMap){
				domBuilder.endPrefixMapping(prefix) 
			}
		}
	}else{
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		//parseStack.push(el);
		return true;
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}
			
		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos =  source.lastIndexOf('</'+tagName+'>')
		if(pos<elStartEnd){//忘记闭合
			pos = source.lastIndexOf('</'+tagName)
		}
		closeMap[tagName] =pos
	}
	return pos<elStartEnd;
	//} 
}
function _copy(source,target){
	for(var n in source){target[n] = source[n]}
}
function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2)
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else{
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else{
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA() 
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = len>3 && /^public$/i.test(matchs[2][0]) && matchs[3][0]
			var sysid = len>4 && matchs[4][0];
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name,pubid && pubid.replace(/^(['"])(.*?)\1$/,'$2'),
					sysid && sysid.replace(/^(['"])(.*?)\1$/,'$2'));
			domBuilder.endDTD();
			
			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else{//error
			return -1;
		}
	}
	return -1;
}

/**
 * @param source
 */
function ElementAttributes(source){
	
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	add:function(qName,value,offset){
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this[this.length++] = {qName:qName,value:value,offset:offset}
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getLocator:function(i){return this[i].locator},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//			
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
}



function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

exports.XMLReader = XMLReader;



/***/ }),

/***/ 937:
/***/ (function(module) {

module.exports = require("net");

/***/ }),

/***/ 963:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = Octokit;

const { request } = __webpack_require__(714);
const Hook = __webpack_require__(344);

const parseClientOptions = __webpack_require__(575);

function Octokit(plugins, options) {
  options = options || {};
  const hook = new Hook.Collection();
  const log = Object.assign(
    {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    },
    options && options.log
  );
  const api = {
    hook,
    log,
    request: request.defaults(parseClientOptions(options, log, hook))
  };

  plugins.forEach(pluginFunction => pluginFunction(api, options));

  return api;
}


/***/ }),

/***/ 973:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getUploadFileConcurrency() {
    return 2;
}
exports.getUploadFileConcurrency = getUploadFileConcurrency;
function getUploadChunkSize() {
    return 4 * 1024 * 1024; // 4 MB Chunks
}
exports.getUploadChunkSize = getUploadChunkSize;
function getUploadRetryCount() {
    return 3;
}
exports.getUploadRetryCount = getUploadRetryCount;
function getRetryWaitTimeInMilliseconds() {
    return 10000;
}
exports.getRetryWaitTimeInMilliseconds = getRetryWaitTimeInMilliseconds;
function getDownloadFileConcurrency() {
    return 2;
}
exports.getDownloadFileConcurrency = getDownloadFileConcurrency;
function getRuntimeToken() {
    const token = process.env['ACTIONS_RUNTIME_TOKEN'];
    if (!token) {
        throw new Error('Unable to get ACTIONS_RUNTIME_TOKEN env variable');
    }
    return token;
}
exports.getRuntimeToken = getRuntimeToken;
function getRuntimeUrl() {
    const runtimeUrl = process.env['ACTIONS_RUNTIME_URL'];
    if (!runtimeUrl) {
        throw new Error('Unable to get ACTIONS_RUNTIME_URL env variable');
    }
    return runtimeUrl;
}
exports.getRuntimeUrl = getRuntimeUrl;
function getWorkFlowRunId() {
    const workFlowRunId = process.env['GITHUB_RUN_ID'];
    if (!workFlowRunId) {
        throw new Error('Unable to get GITHUB_RUN_ID env variable');
    }
    return workFlowRunId;
}
exports.getWorkFlowRunId = getWorkFlowRunId;
function getWorkSpaceDirectory() {
    const workspaceDirectory = process.env['GITHUB_WORKSPACE'];
    if (!workspaceDirectory) {
        throw new Error('Unable to get GITHUB_WORKSPACE env variable');
    }
    return workspaceDirectory;
}
exports.getWorkSpaceDirectory = getWorkSpaceDirectory;
//# sourceMappingURL=config-variables.js.map

/***/ }),

/***/ 981:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getNextPage

const getPage = __webpack_require__(22)

function getNextPage (octokit, link, headers) {
  return getPage(octokit, link, 'next', headers)
}


/***/ }),

/***/ 983:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(747);
const shebangCommand = __webpack_require__(35);

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    let buffer;

    if (Buffer.alloc) {
        // Node.js v4.5+ / v5.10+
        buffer = Buffer.alloc(size);
    } else {
        // Old Node.js API
        buffer = new Buffer(size);
        buffer.fill(0); // zero-fill
    }

    let fd;

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

module.exports = readShebang;


/***/ }),

/***/ 990:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


var net = __webpack_require__(937);
var tls = __webpack_require__(16);
var http = __webpack_require__(605);
var https = __webpack_require__(211);
var events = __webpack_require__(614);
var assert = __webpack_require__(357);
var util = __webpack_require__(669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ })

/******/ });