let path = 'http://samples.databoom.space/api1/sampledb/collections/allobjects';

window.onload = ()=>{
    init();
};

function init(){
    let oHandler = o(path);
    oHandler.get(function(data) {
        console.log(data);
    });
}

