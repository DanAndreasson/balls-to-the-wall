self.addEventListener('message', function(e) {
    var data = e.data;
    var xmlhttp =new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            self.postMessage(data);
        }
    };

    switch (data.cmd) {
        case 'profile':
            setInterval(function(){
                xmlhttp.open("POST","/new_balls",true);
                xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                xmlhttp.send({'id': '5263f59c447235c60e000001','wall': false});
            }, 5000);
            break;
        case 'wall':
            self.postMessage('Unknown command: ' + data.msg);
            break;
    }
}, false);
