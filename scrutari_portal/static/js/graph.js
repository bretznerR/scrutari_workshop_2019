Graph = function (scrutariMeta, graphId, qidArray) {
    this.scrutariMeta = scrutariMeta;
    this.scrutariResultArray = new Array();
    this.graphId = graphId;
    this.baseMap = {};
    this.qidArray = qidArray;
    this.queryMap = {};
};

Graph.init = function (scrutariConfig, graphId, qidArray, visOptions) {
    var count = qidArray.length;
    var graph;
    Scrutari.Meta.load(scrutariConfig, function (scrutariMeta) {
        graph = new Graph(scrutariMeta, graphId, qidArray);
        for(let qid of qidArray) {
            let requestParameters = {
                qid: qid,
                start: 1,
                limit: -1,
                fichefields:"codebase",
                moclefields:"codebase"
            };
            Scrutari.Ajax.loadFicheSearchResult(scrutariConfig, requestParameters, function(ficheSearchResult) {
                _addFicheSearchResult(ficheSearchResult, qid);
            }, _ficheSearchResultError);
        }
    });
    
        
    function _addFicheSearchResult(ficheSearchResult, qid) {
        graph.queryMap[qid] = {
            qid: qid,
            sequence: _format(ficheSearchResult.searchMeta.q)
        };
        for(let ficheGroup of ficheSearchResult.ficheGroupArray) {
            for(let fiche of ficheGroup.ficheArray) {
                graph.addFiche(fiche, qid);
            }
        }
        count--;
        if (count === 0) {
            _initGraph();
        }
    }
    
    function _ficheSearchResultError() {
         count--;
        if (count === 0) {
            _initGraph();
        }
    }
    
    function _initGraph() {
        var container = document.getElementById(graphId);
        
        var data = {
            nodes: new vis.DataSet(graph.toNodeArray()),
            edges: new vis.DataSet(graph.toEdgeArray())
        };
         
        var network = new vis.Network(container, data, visOptions);
        $("#graphml_text").text(_getGraphML());
    }
    
    function _format(q) {
        q = q.replace(/\&\&/g, "et");
        q = q.replace(/\|\|/g, "ou");
        return q;
    }
    
    function _getGraphML() {
        var xml = '<?xml version="1.0" encoding="UTF-8"?>\n<graphml xmlns="http://graphml.graphdrawing.org/xmlns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">\n';
        xml += '<key id="d0" for="node" attr.name="Title" attr.type="string"/>\n';
        xml += '<key id="d1" for="node" attr.name="Type" attr.type="string"/>\n';
        xml += '<graph id="scrutari">\n';
        xml += graph.toGraphML();
        xml += '</graph>\n';
        xml += '</graphml>\n';
        return xml;
    }
};


Graph.prototype.toNodeArray = function () {
    var scrutariMeta = this.scrutariMeta;
    var result = new Array();
    for(let qid of this.qidArray) {
        let query = this.queryMap[qid];
        if (query) {
            result.push({
                id: qid,
                label: query.sequence,
                group: "query"
            });
        }
    }
    for(let prop in this.baseMap) {
        let baseInfo = this.baseMap[prop];
        result.push(baseInfo.toNode(scrutariMeta));
    }
    return result;
};

Graph.prototype.toEdgeArray = function () {
     var result = new Array();
     for(let prop in this.baseMap) {
        let baseInfo = this.baseMap[prop];
        baseInfo.pushEdges(result);
    }
    return result;
};


Graph.prototype.addFiche = function (fiche, qid) {
    var baseInfo = this.getBaseInfo(fiche.codebase);
    baseInfo.addFiche(fiche, qid);
};

Graph.prototype.getBaseInfo = function (code) {
    var key = "code_" + code;
    if (this.baseMap.hasOwnProperty(key)) {
        return this.baseMap[key];
    } else {
        var baseInfo = new Graph.BaseInfo(code);
        this.baseMap[key] = baseInfo;
        return baseInfo;
    }
};

Graph.prototype.toGraphML = function () {
    var xml = "";
    var scrutariMeta = this.scrutariMeta;
    for(let qid of this.qidArray) {
        let query = this.queryMap[qid];
        if (query) {
            xml += Graph.toNodeML(qid, query.sequence, "query");
        }
    }
    for(let prop in this.baseMap) {
        let baseInfo = this.baseMap[prop];
        xml += baseInfo.toNodeML(scrutariMeta);
        xml += baseInfo.toEdgesML();
    }
    return xml;
};

Graph.toNodeML = function (id, title, type) {
    var xml = "";
    xml += '<node id="' + id + '">\n';
    xml += '\t<data key="d0">' + title + '</data>\n';
    xml += '\t<data key="d1">' + type + '</data>\n';
    xml += '</node>\n';
    return xml;
};

Graph.BaseInfo = function (code) {
    this.code = code;
    this.countMap = {};
};

Graph.BaseInfo.prototype.addFiche = function (fiche, qid) {
    if (!this.countMap.hasOwnProperty(qid)) {
        this.countMap[qid] = 0;
    }
    this.countMap[qid]++;
};

Graph.BaseInfo.prototype.pushEdges = function (edgeArray) {
    var code = this.code;
    for(let prop in this.countMap) {
        let count = this.countMap[prop];
        edgeArray.push({
            from: prop,
            to: code,
            value: count,
            label: " " + count + " "
        });
    }
};

Graph.BaseInfo.prototype.toNode = function (scrutariMeta) {
    var code = this.code;
    var base = scrutariMeta.getBase(code);
    var baseIcon = base.baseicon;
    if (!baseIcon) {
        baseIcon = "static/images/blank.png";
    }
    return {
        id: code,
        group: "base",
        image: baseIcon,
        title: base.title
    }
};

Graph.BaseInfo.prototype.toNodeML = function (scrutariMeta) {
    var code = this.code;
    var base = scrutariMeta.getBase(code);
    return Graph.toNodeML(code, base.title, "base");
};

Graph.BaseInfo.prototype.toEdgesML = function () {
    var xml = "";
    var code = this.code;
    var p = 1;
    for(let prop in this.countMap) {
        let count = this.countMap[prop];
        xml += '<edge id="' + code + '_' + p + '" source="' + prop + '" target="' + code + '"/>\n';
        p++;
    }
    return xml;
};
