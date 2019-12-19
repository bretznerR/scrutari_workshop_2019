<?php
//http://pad.coredem.info/pads/accueil_a_la_google
$isStart = true;
$q = "";
$qid = "";
if (isset($_REQUEST["q"])) {
    $isStart = false;
    $q = $_REQUEST["q"];
} else if (isset($_REQUEST["qid"])) {
    $isStart = false;
    $qid = $_REQUEST["qid"];
}
$version = "v1";
if (isset($_REQUEST["version"])) {
    $version = $_REQUEST["version"];
}



?><!DOCTYPE html>
<html lang="fr">
<head>
<title>Scrutari - Coredem</title>
<link rel="alternate" type="application/atom+xml" title="Derniers documents recensés" href="https://sct1.scrutari.net/sct/coredem/feed/fiches_fr.atom" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link href="static/images/icon.png" type="image/png" rel="icon">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="static/jquery/1.11.2/jquery.min.js"></script>
<script src="static/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<link rel="stylesheet" href="static/bootstrap/3.3.7/css/bootstrap.min.css">
<script src="static/scrutarijs/scrutarijs.js"></script>
<script src="static/scrutarijs/l10n/fr.js"></script>
<script src="static/scrutarijs/frameworks/bootstrap3.js"></script>
<script src="static/jsrender/0.9.84/jsrender.min.js"></script>
<script src="static/js/scroll-carousels.js"></script>
<?php if ($isStart) {?>
<script src="static/js/index.js"></script>
<?php } else {?>
<script src="static/js/search.js"></script>
<?php } ?>
<script>
    var scrutari_callback = null;
    var scrutariConfig = null;
    var isStart = <?php echo $isStart?"true":"false" ?>;
    $(function () {
        $("script[type='text/x-jsrender']").each(function (index, element) {
            var $element = $(element);
            $.templates($element.data("name"), $element.html());
        });
        scrutariConfig = new Scrutari.Config("coredem","//sct1.scrutari.net/sct/coredem/", "fr", "scrutari-coredem");
        if (!isStart) {
            Scrutari.Client.init(scrutariConfig, "scrutariRow", {
                withCorpus: false,
                baseSort: "title",
                langSort: "title",
                ficheTarget: "_blank",
                initialQuery: "<?php echo addslashes($q)?>",
                initialQId: "<?php echo addslashes($qid)?>",
                permalinkPattern: "https://scrutari.coredem.info/$QID_$LANG",
                ignoreList: "area-title,result-poweredby"
            }, initCallback);
        } else {
            Scrutari.Meta.load(scrutariConfig, function (scrutariMeta) {
                renderLogos(scrutariMeta);
            });
            Scrutari.Ajax.loadFicheArray(scrutariConfig, {
                random: 1,
                flt: "add:d-10,f-30",
                fichefields: "titre,href,icon"
            }, renderFiches);
        }
    });

</script>
<link rel="stylesheet" href="static/scrutarijs/scrutarijs.css">
<link rel="stylesheet" href="static/scrutarijs/frameworks/bootstrap3.css">
<link rel="stylesheet" href="static/css/main.css">
</head>
<body>
<div id="main">

<div class="container" id="body">
<?php if ($isStart) {?>
    <?php
    switch($version) {
        case "v1":
            include("versions/v1.php");
            break;
        case "v2":
            include("versions/v2.php");
            break;
        case "v3":
            include("versions/v3.php");
            break;
        
    }?>
<?php } else {?>
<div class="row" id="scrutariRow">

</div>
<?php }?>
</div>
<div id="footer">
<footer>
<div class="container">
    <div class="row" id="footerRow">
        <div class="col-sm-3">
            <div class="index-FooterTitle">Propulsé par le logiciel libre Scrutari</div>
            <div><a href="http://www.scrutari.net"><img src="static/images/logo-scrutari.png" alt="Site de Scrutari"><br>www.scrutari.net</a></div>
        </div>
        <div class="col-sm-3">
            <div class="index-FooterTitle">Code source disponible sur Framagit</div>
            <div><a href="https://framagit.org/Scrutari"><img src="static/images/logo-framagit.png" alt="Groupe Scrutari sur Framagit"><br>framagit.org/Scrutari</a></div>
        </div>
        <div class="col-sm-3">
            <div class="index-FooterTitle">La Coredem est animée par Ritimo</div>
            <div><a href="http://www.ritimo.org/"><img src="static/images/logo-ritimo.png" alt="Site de Ritimo"><br>www.ritimo.org</a></div>
        </div>
        <div class="col-sm-3">
            <div class="index-FooterTitle">Avec le soutien de la FPH</div>
            <div><a href="http://www.fph.ch/"><img src="static/images/logo-fph.png" alt="Site de la FPH"><br>www.fph.ch</a></div>
        </div>
    </div>
</div>
<div id="boussole">
<ul>
    <li><a href="https://www.coredem.info/rubrique6.html">Le projet de la Coredem</a></li>
    <li><a href="https://www.coredem.info/rubrique7.html">La collection Passerelle</a></li>
    <li><a href="https://www.coredem.info/rubrique3.html">Le logiciel Scrutari</a></li>
    <li><a href="https://www.coredem.info/rubrique21.html">Comment participer </a></li>
</ul>
</div>
</footer>
</div>
</div>
<?php
include("include/htmlparts.php");
?>
<!-- Piwik -->
<script type="text/javascript">
  var _paq = _paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//ritimo.info/analytics/";
    _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['setSiteId', '3']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
<!-- End Piwik Code -->
</body>
</html>
