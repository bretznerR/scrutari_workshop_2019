<?php
echo includeHtmlPart("jsrender");
echo includeHtmlPart("scrutari-structure");
echo includeHtmlPart("scrutari-template");

function includeHtmlPart($type) {
    $dirPath = 'include/'.$type.'/';
    $files = scandir($dirPath);
    $count = count($files);
    $jsString = "";
     for($i = 0; $i < $count; $i++) {
        $fileName = $files[$i];
        if (substr($fileName,0, 1) === ".") {
            continue;
        }
        $idx = strpos($fileName, ".html");
        if ($idx > 0) {
            $name = substr($fileName, 0, $idx);
            $html = file_get_contents($dirPath."/".$fileName);
            $jsString .= '<script data-name="'.$name.'" type="text/x-'.$type.'">'."\n";
            $jsString .=$html;
            $jsString .= '</script>'."\n\n";
        }
    }
    return $jsString;
}