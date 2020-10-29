(function () {
    "use strict";


    // SCORM
    var Scorm = function () {
        this.init = function () {
            pipwerks.SCORM.version = "2004";
            pipwerks.SCORM.init();
        }

        this.getValue = function (name) {
            return pipwerks.SCORM.get(name);
        }

        this.setValue = function (name, value) {
            pipwerks.SCORM.set(name, value);
            pipwerks.SCORM.save();
        }

    };


    // APP
    var App = function (window) {

        var language = 'de', urlParams = {},
            self = this, userData = {}, scorm = new Scorm();


        /**
         * set language hard on index.html
         * @param lang
         */
        this.defaultLanguage = function (lang) {
            language = lang;
        }

        /**
         * Load page by name ( Foldername )
         * @param pagename
         */
        this.load = function (pagename) {
            document.getElementById('iframe').src = './content/' + pagename + '/index.html?pagename=' + pagename;
            updateUserData('location', pagename);
        }


        /*
            private
        */

        var checkComplete = function () {
            for (var i = 0; i < completionList.length; i++) {
                if (!userData.hasOwnProperty(completionList[i])) {
                    return false;
                }
            }
            return true;
        };

        var updateUserData = function (key, value) {
            userData[key] = value;
            scorm.setValue('cmi.suspend_data', JSON.stringify(userData));
            if (checkComplete()) {
                console.log('cmi.completion_status : completed');
                scorm.setValue('cmi.completion_status', 'completed');
            }
        };

        var sendChapterCompleted = function (chapter_id) {
            var allVideoInChapterDone = true;
            var someVideoInChapterDone = false;
            for (var i = 0; i < completionList.length; i++) {
                if (completionList[i].indexOf(chapter_id) === 0) {
                    if (!userData.hasOwnProperty(completionList[i])) {
                        allVideoInChapterDone = false;
                    } else{
                        someVideoInChapterDone = true;
                    }
                }
            }

            if (allVideoInChapterDone) {
                sendToClient(CONST.SET_CHAPTER_COMPLETED, chapter_id);
            } else if(someVideoInChapterDone){
                sendToClient(CONST.SET_CHAPTER_STARTED, chapter_id);
            }
        };

        /**
         * send scorm data to client
         */
        var sendScormData = function () {
            sendToClient(CONST.SET_SCORM_DATA, userData);
        }

        var sendToClient = function (notification, data) {
            document.getElementById('iframe').contentWindow.postMessage({notification: notification, data: data}, '*');
        };

        var onMessage = function (event) {
            var notification = event.data.notification;
            var data = event.data.data;
            switch (notification) {
                case CONST.GET_SCORM_DATA :
                    sendScormData();
                    break;
                case CONST.GOTO :
                    self.load(data);
                    break;
                case CONST.UPDATE_USERDATA:
                    updateUserData(data.key, data.value);
                    break;
                case CONST.GET_CHAPTER_COMPLETED:
                    sendChapterCompleted(data);
                    break;
            }
        };

        var initialize = function () {
            scorm.init();
            var data = scorm.getValue('cmi.suspend_data');
            if (data && data != '' && data != 'null') {
                userData = JSON.parse(data) || {};
            }
            var success = scorm.getValue('cmi.completion_status');
            if (success != 'completed') {
                scorm.setValue('cmi.completion_status', 'incomplete');
            }
        }

        window.addEventListener("message", onMessage, false);

        /**
         * auto startup on window load
         */
        window.onload = function () {
            initialize();
            self.load('index');
        }

    };
    window.app = new App(window);
}());

