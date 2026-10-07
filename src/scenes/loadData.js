// The script experiment is over (2026-10-06): everyone gets the funny, not snarky script ("nosnark"), with no surveys.
// Script-selection URL parameters are intentionally ignored: the public game always uses this version.
var LOAD_DATA_TYPE = LOG_DATA_NOSNARK;

function loadScriptSync(src) {
    var s = document.createElement('script');
    s.src = src;
    s.type = "text/javascript";
    s.async = false;
    document.getElementsByTagName('head')[0].appendChild(s);
    console.log('Loaded script data from: '+src);
}

// The public build always uses the funny, non-snarky script. Keep script_type out of the
// public contract so old survey links cannot select a different version.
if (LOAD_DATA_TYPE == LOG_DATA_DRY) {
    loadScriptSync('src/scenes/data_dry.js');
}
else if (LOAD_DATA_TYPE == LOG_DATA_NOHUMOR) {
    loadScriptSync('src/scenes/data_nohumor.js');
}
else if (LOAD_DATA_TYPE == LOG_DATA_NOSNARK) {
    loadScriptSync('src/scenes/data_nosnark.js');
}
else if (LOAD_DATA_TYPE == LOG_DATA_NORMAL) {
    loadScriptSync('src/scenes/data.js');
}

