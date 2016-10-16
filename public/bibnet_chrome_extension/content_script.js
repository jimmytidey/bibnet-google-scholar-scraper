chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});

var plugin_is_installed=document.createElement("div");
plugin_is_installed.setAttribute("class", "bibnet_plugin_is_installed");
document.getElementsByTagName("body")[0].appendChild(plugin_is_installed); 