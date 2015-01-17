const Lang = imports.lang;
const Soup = imports.gi.Soup;
const Params = imports.misc.params;

const PROTOCOL = 'https';
const BASE_URL = 'wikidata.org';
const DEFAULT_LANG = 'en';
const API_PATH = 'w/api.php';
const HTTP_TIMEOUT = 10;
const USER_AGENT = 'WikidataSearchProvider extension for GNOME Shell';

/**
 * Client that interacts with the Wikidata API
 *
 * @class Api
 * @uses imports.gi.Soup
 * @uses imports.misc.params
 */
const Api = new Lang.Class({
    Name: 'Api',

    /**
     * Set default parameters and create a Soup session.
     * @constructor
     * @param {Object} params Parameters
     * @private
     */
    _init: function(params) {
        /**
         * @property {Object} _params
         * @private
         */
        this._params = Params.parse(params, {
            /**
             * @property {String} _params.protocol=PROTOCOL API protocol
             */
            protocol: PROTOCOL,
            /**
             * @property {String} _params.base_url=BASE_URL API base url
             */
            base_url: BASE_URL,
            /**
             * @property {String} _params.lang=DEFAULT_LANG API language
             * @accessor
             */
            lang: DEFAULT_LANG,
            /**
             * @property {String} _params.api_path=API_PATH API path
             */
            api_path: API_PATH
        });

        /**
         * @property {Soup.SessionAsync} _session Soup session
         * @private
         */
        this._session = new Soup.SessionAsync();
        Soup.Session.prototype.add_feature.call(
            this._session,
            new Soup.ProxyResolverDefault()
        );
        this._session.user_agent = USER_AGENT;
        this._session.timeout = HTTP_TIMEOUT;
    },

    /**
     * Construct the API URL
     * @returns {String} Language specific API URL that expects a response
     * in JSON
     * @private
     */
    _getApiUrl: function() {
        return '%s://%s/%s?format=json&language=%s'
            .format(PROTOCOL, BASE_URL, API_PATH, this.lang);
    },

    /**
     * Construct query URL using the API URL and query parameters
     * @param {Object} queryParameters
     * @returns {String} Query URL
     * @private
     */
    _getQueryUrl: function(queryParameters) {
        let queryString = '',
            url = this._getApiUrl(),
            parameter;

        for(parameter in queryParameters) {
            if(queryParameters.hasOwnProperty(parameter)) {
                queryString += '&%s=%s'.format(
                    parameter,
                    encodeURIComponent(queryParameters[parameter])
                )
            }
        }

        url += queryString;
        return url;
    },

    /**
     * Query the API
     * @param {Object} queryParameters Query parameters
     * @param {Function} callback Callback that will be called with an
     * error message or a result.
     * @param {null|String} callback.errorMessage Message describing
     * what went wrong
     * @param {Object|null} callback.result Response data parsed in JSON format
     */
    get: function(queryParameters, callback) {
        let query_url = this._getQueryUrl(queryParameters),
            request = Soup.Message.new('GET', query_url),
            result;

        this._session.queue_message(request,
            Lang.bind(this, function(http_session, message) {
                let errorMessage;
                if(message.status_code !== Soup.KnownStatusCode.OK) {
                    errorMessage = "Api.Client.get: Error code: %s"
                        .format(message.status_code);
                    log(errorMessage);
                    callback(errorMessage, null);
                } else {
                    try {
                        result = JSON.parse(request.response_body.data);
                    } catch(e) {
                        errorMessage = "Api.Client.get: %s".format(e);
                        log('%s. Response body: %s'
                            .format(errorMessage, request.response_body.data)
                        );
                        callback(errorMessage, null);
                    }
                    result && callback(null, result);
                }
            })
        );
    },

    /**
     * Search entities
     * @see https://www.wikidata.org/w/api.php?action=help&modules=wbsearchentities
     *
     * @param {String} term Query to search for
     * @param {Function} callback Callback that will be called with an
     * error message or a result.
     * @param {null|String} callback.errorMessage Message describing
     * what went wrong
     * @param {Object|null} callback.result Response data parsed in JSON format
     * @param {Number} [continue_=0] Get results starting at this index
     */
    searchEntities: function (term, callback, continue_) {
        continue_ = continue_ || 0;
        this.get({
            action: 'wbsearchentities',
            search: term,
            type: 'item',
            'continue': continue_,
            // TODO: don't hardcode
            limit: 10
        }, callback);
    },

    /**
     * Delete the Soup session
     */
    destroy: function() {
        this._session.run_dispose();
        this._session = null;
    },

    /**
     * Get the API language
     * @method getLang
     */
    get lang() {
        return this._params.lang;
    },

    /**
     * Set the API language
     * @method getLang
     * @param {String} lang
     */
    set lang(lang) {
        this._params.lang = lang;
    }
});
