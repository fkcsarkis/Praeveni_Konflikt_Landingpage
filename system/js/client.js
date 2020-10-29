// SCORM
var Scorm = function () {
    this.init = function () {
        pipwerks.SCORM.init();

//  Hier ist der eventListener mit dem setLessonState drin, welcher erst dann funktioniert, wenn postMessage ausgegeben wird.
        window.addEventListener("message", receiveMessage);

        function receiveMessage(e) {
            if (e.data === 'WbtCompleted') {
                lessonState[currentWbtName] = true;
                setLessonState();
            }
        }
    };

    this.getValue = function (name) {
        return pipwerks.SCORM.get(name);
    };

    this.setValue = function (name, value) {
        pipwerks.SCORM.set(name, value);
        pipwerks.SCORM.save();
    }
};
// Hier werden die WBT´s angemeldet. Erst wenn alle WBT´s durchgeklickt wurden, wird cmi.suspend.data auf completed gesetzt.
var scorm = new Scorm();
var currentWbtName = "";
var lessonState = {
    "wbt_module_1": false,
    "wbt_module_2": false,
    "wbt_module_3": false,
    "wbt_module_4": false,
    "wbt_module_5": false,
    "wbt_module_6": false,
    "wbt_module_7": false,
    "wbt_module_8": false,
    "wbt_module_9": false,
    "wbt_module_10": false,
    "wbt_module_11": false,
};

(function () {
    scorm.init();
    var data = scorm.getValue('cmi.suspend_data');
    if (data && data != '' && data != 'null') {
        lessonState = JSON.parse(data) || {};
    }
    if (lessonState) {
        setLessonState();
    }
    var success = scorm.getValue('cmi.core.lesson_status');
    if (success != 'completed') {
        scorm.setValue('cmi.core.lesson_status', 'incomplete');
    }
})();

function openFrame(url, wbtName) {
    currentWbtName = wbtName;
    lessonState[wbtName] = true;
    var frame = document.getElementById('rgmFrame1');
    frame.setAttribute('src', url);
    frame.style.display = 'block';

    var frameBox = document.getElementById('frameBackground');
    frameBox.style.display = 'block'
}



function setLessonState() {
    var completed = true;
    for (var i = 1; i <= 10; i++) {
        if (lessonState['wbt_module_' + i]) {
            document.getElementById('wbt_module_' + Number(i + 1)).style.pointerEvents = 'auto';
            // Hier möchte ich wenn alle WBT´s ( inklusive Abschlusstest ) durch sind, den Zertifikat Button anzeigen lassen
            if ("wbt_module11" === true){
                var certificate = document.getElementById('certificate');
                certificate.style.display = 'initial';
                console.log(i);
            }
        }
    }
    for (var key in lessonState) {
        if (lessonState.hasOwnProperty(key) && lessonState[key]) {
            // button stylen
            var button = document.querySelector("button#" + key);
            if (button) {
                button.style.background = '#7893AE';
                button.innerText = "Abgeschlossen";
                button.style.color = '#ffffff';
            }
            /* opacity einstellen
            var opacity = document.querySelectorAll(".opacity");
            opacity.style.opacity = "1";
            alert(123);
            */
        } else if (lessonState.hasOwnProperty(key)) {
            completed = false;
        }
    }
    scorm.setValue('cmi.suspend_data', JSON.stringify(lessonState));
    if (completed) {
        scorm.setValue('cmi.core.lesson_status', 'completed');
    } else {
        scorm.setValue('cmi.core.lesson_status', 'incomplete');
    }
}


function closeFrame() {
    var frame = document.getElementById('rgmFrame1')
    var frameBox = document.getElementById('frameBackground')
    frameBox.style.display = 'none';
    /*Code um Audio nach schließen, auszuschalten*/
    document.getElementById('rgmFrame1').setAttribute('src', '');
    document.getElementById('button')
}


