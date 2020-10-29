/*
 * author tilo hauke 10/2016
 * simuliert eine SCORM API und nutzt Cookies als Speicher
 */

var ScoApiSim = {
    defaultData: {
        '1.2':{
            'cmi.core.student_name':'Mustermann, Maximilian',
            'cmi.core.student_id':'NoID',  
            'cmi.suspend_data':'',
            'cmi.core.lesson_status':'not attempted',
            'cmi.core.score.raw':'0'
        },
        '2004': {
            'cmi.learner_name':'Mustermann, Maximilian',
            'cmi.learner_id':'NoID',
            'cmi.suspend_data':'',
            'cmi.completion_status':'not attempted',
            'cmi.progress_measure':'0'
        }
    },
    version:'',
    userData:{}, 
    connection:{isActive:true},
    logging:true
};


ScoApiSim.log = function (){
    var args= '°';
    for (var i=0; i < arguments.length; i++){
        args+=' '+arguments[i];
    }
   
   if(ScoApiSim.logging == true) console.log(args);
}

ScoApiSim.simReset = function(){
    ScoApiSim.userData = ScoApiSim.defaultData[ScoApiSim.version];
    ScoApiSim.Commit(); 
    ScoApiSim.reset = true;
}


ScoApiSim.LMSInitialize = ScoApiSim.Initialize = function () {
    ScoApiSim.log('init');
    document.getElementById('scormVersion').innerHTML = "SCORM "+ScoApiSim.version;
    var coo =  document.cookie.match(/sco=[^\;]+/)
    if(coo){
        var enc = String(coo).substring(4);
        var data = JSON.parse(decodeURI(enc));
        if(data) { 
            ScoApiSim.userData = data; 
            ScoApiSim.log(data);
        }
    }
    return "true";
}

ScoApiSim.GetLastError = ScoApiSim.LMSGetLastError = function (){
    return 0;
}

ScoApiSim.GetErrorString = ScoApiSim.LMSGetErrorString = function (n) {
    return "error"+n;
}

ScoApiSim.GetValue = ScoApiSim.LMSGetValue = function(name){
    ScoApiSim.log('get',name);
    var value  = decodeURI(ScoApiSim.userData[name]);
    return  value;
}

ScoApiSim.SetValue = ScoApiSim.LMSSetValue = function(name, value){
    ScoApiSim.log('set',name, typeof value, value);
    ScoApiSim.userData[name]= encodeURI(value);
    return "true";
}

ScoApiSim.Commit = ScoApiSim.LMSCommit = function(){
    if(ScoApiSim.reset){return}
    ScoApiSim.log('save');
    var enc = encodeURI(JSON.stringify(ScoApiSim.userData));
    var exp = new Date();
    exp.setFullYear(exp.getFullYear()+1);
    document.cookie = "sco=" + enc+";expires="+exp.toGMTString()+";";
    return 'true';
}

ScoApiSim.Terminate = ScoApiSim.LMSFinish = function(){ 
    return 'true';
}

ScoApiSim.GetDiagnostic = ScoApiSim.LMSGetDiagnostic= function(errorCode){
    //ScoApiSim.log('debug.getDiagnosticInfo');
    return "Diagnose not available";
} 

Object.defineProperty(window,"API",{
     get: function(){
         ScoApiSim.version = "1.2";
         ScoApiSim.userData = ScoApiSim.defaultData[ScoApiSim.version];
         return ScoApiSim;
     }      
});

Object.defineProperty(window,"API_1484_11",{
    get: function(){
        ScoApiSim.version="2004";
        ScoApiSim.userData = ScoApiSim.defaultData[ScoApiSim.version];
        return ScoApiSim;
    }      
});
