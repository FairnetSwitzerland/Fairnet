import msg from './modules/msg';

import lists from './lists.js';

import { setTimeout } from 'timers';


import * as ABPFilterParser from './abp-filter-parser.js';
var parsedFilter = {};

//console.log(lists.all);

// here we use SHARED message handlers, so all the contexts support the same
// commands. in background, we extend the handlers with two special
// notification hooks. but this is NOT typical messaging system usage, since
// you usually want each context to handle different commands. for this you
// don't need handlers factory as used below. simply create individual
// `handlers` object for each context and pass it to msg.init() call. in case
// you don't need the context to support any commands, but want the context to
// cooperate with the rest of the extension via messaging system (you want to
// know when new instance of given context is created / destroyed, or you want
// to be able to issue command requests from this context), you may simply
// omit the `hadnlers` parameter for good when invoking msg.init()
console.log('BACKGROUND SCRIPT RUNNING'); // eslint-disable-line no-console

/**
 * Special background notification handlers onConnect / onDisconnect
 * @param {*} ev Enviroment
 * @param {*} context  The contect
 * @param {*} tabId  The tab id
 */
function logEvent(ev, context, tabId) {
  console.log(`${ev}: context = ${context}, tabId = ${tabId}`); // eslint-disable-line no-console
}

/** All domain filters */
var filters = {};

/**
 * Create the HTML to replace the ad, if needed
 * @param {*} selector  The css selector
 * @param {*} index  The indext that will match inside that selector
 * @param {*} width  The width
 * @param {*} height the height
 * @param {*} callback the callback
 */
function doReplace(selector, index, width, height, callback) {
  if (width > 40 && height > 40) {
    callback('<div style="width:' + width + 'px;height:' + height + 'px;background:#ff9966;display:block;"></div>');
  } else {
    callback('<div style="width:' + width + 'px;height:' + height + 'px;background:transparent;display:block;outline:3px dashed #ff9966;outline-offset:-2px;"></div>');
  }
}

/**
 * Discover all filters for the current domain
 * @param string domain  The current domain name
 * @param function domain  The callback function that will be called at the end.
 */
function doFilter(domain, callback) {

  console.log(`Backgound function called 'dofilter' for the domain '${domain}'`);

  var keysMatched = [];

  if (!domain || domain.length == 0) {
    return null;
  }

  var result = "";

  var keys = Object.keys(filters)

  // For each key on the filters, try to see if the current domain engs with any one the domains of the filter.
  for (var index = 0; index < keys.length; ++index) {
    if (keys[index] && keys[index].length > 0 && (domain.startsWith(keys[index]) || domain.endsWith("." + keys[index]))) {

      keysMatched.push(keys[index]);

      if (result.length != 0) {
        result += ",";
      }
      result += filters[keys[index]];
    }
  }

  console.info(`Filters for domain '${domain}' matched with keys '${keysMatched}' and the result is '${result}'`);

  callback(result);
}



/**
 * Parse the list and let it ready to be used.
 */
function parseList() {
  // Parse filters to the network block
  ABPFilterParser.parse(this.responseText, parsedFilter);
  //console.log(parsedFilter);

  // parse filters to the in-page element block
  //console.log("Parsing the filters...");
  var lines = this.responseText.match(/[^\r?\n]+/g);
  if (!lines) {
    return;
  }
  for (var index = 0; index < lines.length; ++index) {

    // If is a filter rule
    if (lines[index].indexOf("##") != -1) {

      //If it is a a custom filter for adblockplus, or has a negative command, skip
      if (lines[index].indexOf("-abp") != -1 || lines[index].indexOf("~") != -1 || lines[index].indexOf("#@#") != -1) {
        continue;
      }

      var parts = lines[index].split("##");
      var domains = parts[0].split(',');
      var selector = parts[1];

      // for each domain (ignores the global ones)
      if (domains && domains.length > 0) {
        for (var dId = 0; dId < domains.length; ++dId) {
          if (filters[domains[dId]]) {
            filters[domains[dId]] = filters[domains[dId]] + "," + selector;
          } else {
            filters[domains[dId]] = selector;
          }
        }
      }

    }

  }
  console.log("Filters loaded:" + Object.keys(filters).length);
}

/**
 * Open the filter file
 * @param string url The url for the list
 */
function loadList(url, callback) {
  //console.log("Loading filter list....")
  var x = new XMLHttpRequest();
  x.onload = callback;
  x.open("GET", url, true);
  x.send();
}

// Start loading the list of filters based on the local file
//loadList(chrome.runtime.getURL("/filters.txt"));
//loadList(chrome.runtime.getURL("/filters.txt"));

var parsedFilterBasic = {};
ABPFilterParser.parse("||tpc.googlesyndication.com\n||googlesyndication.com/\n||doubleclick.net/\n||2mdn.net/\n||serving-sys.com/\n", parsedFilterBasic);

loadList("https://easylist.to/easylist/easylist.txt", parseList);

//loadList("https://easylist.to/easylist/fanboy-social.txt", parseList);
//loadList("https://easylist.to/easylist/fanboy-annoyance.txt", parseList);
//loadList("https://easylist.to/easylist/easyprivacy.txt", parseList);
//loadList("https://easylist.to/easylistgermany/easylistgermany.txt", parseList);
// loadList("https://easylist-downloads.adblockplus.org/easylistitaly.txt", parseList);
// loadList("https://easylist-downloads.adblockplus.org/easylistdutch.txt", parseList);
// loadList("https://easylist-downloads.adblockplus.org/liste_fr.txt", parseList);
// loadList("https://easylist-downloads.adblockplus.org/easylistchina.txt", parseList);
// loadList("http://stanev.org/abp/adblock_bg.txt", parseList);
// loadList("https://raw.githubusercontent.com/heradhis/indonesianadblockrules/master/subscriptions/abpindo.txt", parseList);
// loadList("https://easylist-downloads.adblockplus.org/Liste_AR.txt", parseList);
// loadList("https://raw.githubusercontent.com/tomasko126/easylistczechandslovak/master/filters.txt", parseList);
// loadList("https://notabug.org/latvian-list/adblock-latvian/raw/master/lists/latvian-list.txt", parseList);
// loadList("https://raw.githubusercontent.com/easylist/EasyListHebrew/master/EasyListHebrew.txt", parseList);
// loadList("http://margevicius.lt/easylistlithuania.txt", parseList);
// loadList("https://easylist-downloads.adblockplus.org/antiadblockfilters.txt", parseList);
// loadList("https://raw.githubusercontent.com/rbrito/easylist-ptbr/master/adblock-rules.txt", parseList);
// loadList("http://adb.juvander.net/Finland_adb.txt", parseList);

// This is a test!
//setTimeout(function () { doFilter("youtube.com", function () { }) }, 1000);

var handlers = {};
handlers.onConnect = logEvent.bind(null, 'onConnect');
handlers.onDisconnect = logEvent.bind(null, 'onDisconnect');
handlers.doFilter = doFilter
handlers.doReplace = doReplace
const message = msg.init('bg', handlers);




// Below this line you will find the filters to block via network.

function saveParsedFilter() {
  ABPFilterParser.parse(this.responseText, parsedFilter);
  console.log(parsedFilter);
}

//loadList("https://easylist.to/easylist/easylist.txt", saveParsedFilter);
//loadList("https://easylist.to/easylist/fanboy-social.txt", saveParsedFilter);
//loadList("https://easylist.to/easylist/fanboy-social.txt", saveParsedFilter);


// First we need to keep track of all urls that 
var tabsURLs = new Map();
chrome.webRequest.onBeforeRequest.addListener(
  function (request) {

    if (request.tabId >= 0 && request.type === "main_frame") {
      tabsURLs.set(request.tabId, request.url);
    } else {

      var tabURL = tabsURLs.get(request.tabId);
      if (!tabURL) {
        return;
      }
      var tabDomain = new URL(tabURL).hostname;
      var urlToCheck = request.url;
      console.debug("Analysing Request (" + request.type + ") from domain " + tabDomain + ". To URL: " + urlToCheck);

      var type = ABPFilterParser.elementTypes.SCRIPT;

      switch (request.type) {
        case "xmlhttprequest": type = ABPFilterParser.elementTypes.XMLHTTPREQUEST; break;
        case "sub_frame": type = ABPFilterParser.elementTypes.SUBDOCUMENT; break;
        case "main_frame": type = ABPFilterParser.elementTypes.DOCUMENT; break;
        case "other": type = ABPFilterParser.elementTypes.OTHER; break;
        case "object": type = ABPFilterParser.elementTypes.OBJECT; break;
        case "stylesheet": type = ABPFilterParser.elementTypes.STYLESHEET; break;
        case "image": type = ABPFilterParser.elementTypes.IMAGE; break;
        case "script": type = ABPFilterParser.elementTypes.SCRIPT; break;
      }

      if (ABPFilterParser.matches(parsedFilter,
        request.url, { domain: tabDomain, elementTypeMaskMap: type }) || ABPFilterParser.matches(parsedFilterBasic,
          request.url, { domain: tabDomain, elementTypeMaskMap: type })) {
        console.log("BLOCKED Request from domain " + tabDomain + ". To URL: " + urlToCheck);
        return { cancel: true };
      }
    }
  },
  {
    urls: ['<all_urls>'],
    types: [
      'main_frame', "script", "image", "sub_frame", "stylesheet", "object", "xmlhttprequest", "csp_report", "media", "websocket", "other"
    ],
  },
  ["blocking"]
);


// for (var count = 0; count < lists.all.length; ++count) {
//   console.log("Loading list from URL: " + lists.all[count].viewUrl);
//   loadList(lists.all[count].viewUrl, parseList);
// }
