<?php
$qidParameter = "2019-0402-2314-23,2019-0402-2314-24,2017-0702-2314-3";
if (isset($_REQUEST["qid"])) {
$qidParameter = $_REQUEST["qid"];
}
$qidArray = explode(",", $qidParameter);
$checkedArray = array();
for($i = 0; $i < count($qidArray); $i++) {
    $qid = $qidArray[$i];
    if (preg_match('/^[-0-9a-zA-Z]+$/', $qid)) {
        $checkedArray[] = '"'.$qid.'"';
    }
}
if (count($checkedArray) == 0) {
    exit("Wrong qid value");
}
$javascriptQid = implode(",", $checkedArray);

$withGraphMl = false;
if (isset($_REQUEST["graphml"])) {
    $withGraphMl = true;
}

?>
<!DOCTYPE html>
<html lang="fr">
    <head>
    <title>Scrutari - Coredem</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link href="static/images/icon.png" type="image/png" rel="icon">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="static/jquery/1.11.2/jquery.min.js"></script>
    <script src="static/scrutarijs/scrutarijs.js"></script>
    <script src="static/scrutarijs/l10n/fr.js"></script>
    <script src="static/jsrender/0.9.84/jsrender.min.js"></script>
    <link rel="stylesheet" href="static/scrutarijs/scrutarijs.css">

    <script type="text/javascript" src="static/vis/4.21.0/vis.js"></script>
    <link href="static/vis/4.21.0/vis.css" rel="stylesheet" type="text/css" />
    <script src="static/js/graph.js"></script>
    <style type="text/css">
        #graph {
            width: 100vw;
            height: 100vh;
            border: 1px solid lightgray;
        }
        
        #graphml_block {
            position: absolute;
            top: 0;
            left: 0;
            <?php if (!$withGraphMl) { ?>display: none;<?php }?>
        }
    </style>
    <script>
        var scrutariConfig = null;
        var qidArray = [<?php echo $javascriptQid ?>];
        var visOptions = {
            physics: {
                barnesHut: {
                    avoidOverlap: 0.2,
                    gravitationalConstant: -4000,
                    centralGravity: 0.2
                }
            },
            interaction: {
                zoomView: true
            },
            groups: {
                query: {
                    shape: "box",
                    borderWidth: 3,
                    color:{
                        background: "#544634",
                        border: "#544634"
                    },
                    font: {
                        color: 'white'
                    },
                    shapeProperties: {
                       borderRadius: 4
                    }
                
                },
                base: {
                    borderWidth: 2,
                    color:{
                        background:'white',
                        border: "#544634"
                    },
                    shape: "circularImage",
                    size: 16,
                    shapeProperties: {
                        useImageSize: true,
                        interpolation: false
                    }
                }
            
            },
            edges:{
                color: {
                    color: "#7b664c"
                },
                scaling: {
                    min: 1,
                    max: 6,
                    label: {
                        enabled: false
                    }
                },
                font: {
                    color: '#544634',
                    strokeWidth: 6,
                    strokeColor: 'white'
                },
                shadow: {
                    enabled: false
                }
            }
        };
        var graphId = "graph";
        $(function () {
            scrutariConfig = new Scrutari.Config("coredem","//sct1.scrutari.net/sct/coredem/", "fr", "scrutari-coredem");
            Graph.init(scrutariConfig, graphId, qidArray, visOptions);
        });
        
    </script>
</head>
<body>

<div id="graph"></div>
<div id="graphml_block"><textarea rows="30" cols="60" id="graphml_text"></textarea></div>
</body>
</html>
