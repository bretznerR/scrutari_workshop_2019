/* global jake,process */
/**
 * Installer Jake avec npm install -g jake (NodeJs doit être installé préalablement)
 * 
 * Lancer la compilation avec jake build[$version] où $version est le numéro de version
 */

var fs = require('fs')
   , exec = require('child_process').exec;

task('build', function (version) {
    jake.rmRf('dist');
    jake.mkdirP('dist');
    jake.mkdirP('pkg');
    compileJs(version, 'scrutarijs.js');
    compileL10n();
    moveCss('scrutarijs.css');
    compileFrameworks();
    zip(version);
});

task('default', ['build']);

function compileJs(version, destination) {
    var files = fs.readFileSync('list.txt', 'utf8').split("\n");
    var result = "/* version: " + version + " */\n";
    for (var i = 0, len = files.length; i < len; i++) {
        var fileName = files[i];
        if (fileName.length > 0) {
            var contents = fs.readFileSync("src/js/" + fileName, 'utf8');
            contents = contents.replace(/\/\*[\s\S]*?\*\//g,'');
            result = result + contents;
            console.log(files[i]);
        }
    }
    result = result.replace(/\n\s*\n/g, "\n");
    fs.writeFileSync('dist/' + destination, result, 'utf8');
}

function compileL10n() {
    jake.mkdirP('dist/l10n');
    var langDirs = fs.readdirSync('src/l10n');
    for(var i = 0, len = langDirs.length; i < len; i++) {
        var lang = langDirs[i];
        if ((fs.statSync('src/l10n/' + lang).isDirectory()) && (lang.match(/^[-a-zA-Z_]+$/))) {
            compileLang(lang);
        }
    }
}

function compileLang(lang) {
    console.log(lang);
    var dirPath = 'src/l10n/' + lang + '/';
    var files = fs.readdirSync(dirPath);
    var result = "var SCRUTARI_L10N = {\nlang:'" + lang + "'";
    for(var i = 0, len = files.length; i < len; i++) {
        var fileName = files[i];
        if (fileName.substr(-4) === ".ini") {
            result += convertIniFile(dirPath + fileName);
        }
    }
    for(var i = 0, len = files.length; i < len; i++) {
        var fileName = files[i];
        if (fileName.substr(-5) === ".html") {
            var key = fileName.substring(0, fileName.length - 5);
            result += convertHtmlLangFile(key, dirPath + fileName);
        }
    }
    result += "\n};\n";
    fs.writeFileSync('dist/l10n/' + lang + '.js', result, 'utf8');
}

function convertIniFile(iniFilePath) {
    var result = "";
    var lines = fs.readFileSync(iniFilePath, 'utf8').split("\n");
    for(var i = 0, len = lines.length; i < len; i++) {
        var line = lines[i].trim();
        if (line.length === 0) {
            continue;
        }
        var firstChar = line.substring(0,1);
        var ignore = false;
        switch(firstChar) {
            case ';':
            case '#':
            case '!':
            case '[':
                ignore = true;
        }
        if (ignore) {
            continue;
        }
        var idx = line.indexOf('=');
        if (idx < 1) {
            continue;
        }
        var key = line.substring(0,idx).trim();
        var value = line.substring(idx+1).trim();
        result += ",\n'" + key + "':'";
        result += value.replace(/'/g, "\\'");
        result += "'";
    }
    return result;
}

function convertHtmlLangFile(key, htmlFilePath) {
    var html = fs.readFileSync(htmlFilePath, 'utf8');
    var result = ",\n'_ " + key + ".html':'";
    result += html.replace(/\s+/g, ' ').replace(/'/g, "\\'");
    result += "'";
    return result;
}

function moveCss(cssFileName) {
    jake.cpR('src/css/' + cssFileName, "dist");
    jake.cpR('src/css/images', "dist");
}

function compileFrameworks() {
    jake.mkdirP('dist/frameworks');
    var htmlDirs = fs.readdirSync('src/frameworks');
    for(var i = 0, len = htmlDirs.length; i < len; i++) {
        var frameworkName = htmlDirs[i];
        if ((fs.statSync('src/frameworks/' + frameworkName).isDirectory()) && (frameworkName !== '_default') && (frameworkName.match(/^[-0-9a-zA-Z_]+$/))) {
            compileFrameworkVersion(frameworkName);
            jake.cpR('src/frameworks/' + frameworkName + '/framework.css', 'dist/frameworks/' + frameworkName + '.css');
            var resourcesPath = 'src/frameworks/' + frameworkName + '/resources';
            if (fs.existsSync(resourcesPath)) {
                jake.cpR(resourcesPath, 'dist/frameworks/' + frameworkName);
            }
            console.log(frameworkName);
        }
    }
}

function compileFrameworkVersion(name) {
    var versionPath = 'src/frameworks/' + name + '/';
    var defaultPath = 'src/frameworks/_default/';
    var result = "var SCRUTARI_HTML = {\n_name:'" + name + "'";
    result += ",\nstructure:{\n";
    var structureExistingArray = new Array();
    result += compileFrameworkDir(versionPath + 'structure/', structureExistingArray);
    result += compileFrameworkDir(defaultPath + 'structure/', structureExistingArray);
    result += "\n}";
    result += ",\ntemplates:{\n";
    var templatesExistingArray = new Array();
    result += compileFrameworkDir(versionPath + 'templates/', templatesExistingArray);
    result += compileFrameworkDir(defaultPath + 'templates/', templatesExistingArray);
    result += "\n}";
    result += "\n};\n\n";
    result += fs.readFileSync(versionPath + 'init.js', 'utf8');
    fs.writeFileSync('dist/frameworks/' + name + '.js', result, 'utf8');
}

function compileFrameworkDir(path, existingArray) {
    var files = fs.readdirSync(path);
    var result = "";
    for(var i = 0, len = files.length; i < len; i++) {
        var fileName = files[i];
        if (fileName.substr(-5) === ".html") {
            var key = fileName.substring(0, fileName.length - 5);
            if (existingArray.indexOf(key) === -1) {
                result += convertHtmlFrameworkFile(key, path + fileName, (existingArray.length > 0));
                existingArray.push(key);
            }
        }
    }
    return result;
}

function convertHtmlFrameworkFile(key, htmlFilePath, next) {
    var html = fs.readFileSync(htmlFilePath, 'utf8');
    var result = "";
    if (next) {
        result += ",\n";
    }
    result += "'" + key + "':'";
    result += html.replace(/\s+/g, ' ').replace(/{{!--.*--}}/g, "").replace(/'/g, "\\'");
    result += "'";
    return result;
}

function zip(version) {
    var cmd = "zip -r ../pkg/scrutarijs-" + version + ".zip *";
    var currDir = process.cwd();
    process.chdir('dist');
    exec(cmd, function (err, stdout, stderr) {
          if (err) { throw err; }
          process.chdir(currDir);
      });
}