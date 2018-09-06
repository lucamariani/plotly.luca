function init_graph_obj(id){
    var obj = {
        graphContentWindow: $('#'+id)[0].contentWindow,
        id: id
    };
    obj.pinger = setInterval(function(){
        obj.graphContentWindow.postMessage({task: 'ping'}, 'https://plot.ly');
    }, 500);
    return obj;
}

var graphs = {};
$('iframe').each(function(i, obj){
    graphs[obj.id] = init_graph_obj(obj.id);
});

// Window "message"s are messages that originate from the embedded iFrames,
// like "pong", zoom, click, and hover.
window.addEventListener('message', function(e){
    var message = e.data;
    var graph;
    for(var i in graphs) {
        if(graphs[i].graphContentWindow === e.source) {
            graph = graphs[i];
        }
    }
    if(typeof graph === "undefined") {
        return;
    }
    var pinger = graph.pinger;
    var graphContentWindow = graph.graphContentWindow;
    var id = graph.id;
    if('pong' in message && message.pong) {
        clearInterval(pinger);
        graphContentWindow.postMessage({
            'task': 'listen',
            'events': ['click', 'hover', 'zoom'] // Customize events here
        }, 'https://plot.ly');
    } else if (message.type==='hover' ||
                message.type==='zoom'  ||
                message.type==='click') {
        console.log(id, '-->', message);
    }
});
