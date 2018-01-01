import msg from './modules/msg';


import lists from './lists.js';

console.log(lists.all);

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
      callback('<div style="width:'+width+'px;height:'+height+'px;background:#ff9966;display:block;"></div>');
  }  else {
      callback('<div style="width:'+width+'px;height:'+height+'px;background:transparent;display:block;outline:3px dashed #ff9966;outline-offset:-2px;"></div>');
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
    if (keys[index] && keys[index].length > 0 && (domain.startsWith(keys[index]) || domain.endsWith("." + keys[index]) )){

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
  console.log("Parsing the filters...");
  var lines = this.responseText.match(/[^\r?\n]+/g);

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
  console.log("Filters loaded:");
  console.log(filters);
}

/**
 * Open the filter file
 * @param string url The url for the list
 */
function loadList(url) {
  console.log("Loading filter list....")
  var x = new XMLHttpRequest();
  x.onload = parseList;
  x.open("GET", url, true);
  x.send();
}

// Start loading the list of filters based on the local file
//loadList(chrome.runtime.getURL("/filters.txt"));
//loadList(chrome.runtime.getURL("/filters.txt"));

for (var count = 0; count < lists.all.length; ++count) {
  //loadList(lists.all[count].viewUrl);
}

loadList("https://easylist.to/easylist/fanboy-social.txt");
loadList("https://easylist.to/easylist/fanboy-annoyance.txt");
loadList("https://easylist.to/easylist/easyprivacy.txt");
loadList("https://easylist.to/easylist/easylist.txt");
loadList("https://easylist.to/easylistgermany/easylistgermany.txt");
loadList("https://easylist-downloads.adblockplus.org/easylistitaly.txt");
loadList("https://easylist-downloads.adblockplus.org/easylistdutch.txt");
loadList("https://easylist-downloads.adblockplus.org/liste_fr.txt");
loadList("https://easylist-downloads.adblockplus.org/easylistchina.txt");
loadList("http://stanev.org/abp/adblock_bg.txt");
loadList("https://raw.githubusercontent.com/heradhis/indonesianadblockrules/master/subscriptions/abpindo.txt");
loadList("https://easylist-downloads.adblockplus.org/Liste_AR.txt");
loadList("https://raw.githubusercontent.com/tomasko126/easylistczechandslovak/master/filters.txt");
loadList("https://notabug.org/latvian-list/adblock-latvian/raw/master/lists/latvian-list.txt");
loadList("https://raw.githubusercontent.com/easylist/EasyListHebrew/master/EasyListHebrew.txt");
loadList("http://margevicius.lt/easylistlithuania.txt");
loadList("https://easylist-downloads.adblockplus.org/antiadblockfilters.txt");
loadList("https://raw.githubusercontent.com/rbrito/easylist-ptbr/master/adblock-rules.txt");
loadList("http://adb.juvander.net/Finland_adb.txt");


// This is a test!
setTimeout(function () { doFilter("youtube.com", function () { }) }, 1000);


var handlers = {};
handlers.onConnect = logEvent.bind(null, 'onConnect');
handlers.onDisconnect = logEvent.bind(null, 'onDisconnect');
handlers.doFilter = doFilter
handlers.doReplace = doReplace
const message = msg.init('bg', handlers);


