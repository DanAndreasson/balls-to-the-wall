self.addEventListener('message', function(e) {
    var data = e.data;
    var xmlhttp =new XMLHttpRequest();
    var latest = data.latest;
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            var response = JSON.parse(xmlhttp.responseText);
            if (response.length > 0)
            {
                latest = response[0].created_at;
                self.postMessage(
                {
                    'balls':response,
                    'new_latest': data.latest,
                    'wall': data.wall
                });
            }
        }
    };
    switch (data.cmd) {

        case 'get_new_balls':
           interval = setInterval(function(){
                xmlhttp.open("POST","/new_balls",true);
                xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                xmlhttp.send(JSON.stringify({'id': data.id,'wall': data.wall, 'latest':latest}));
            }, 5000);
            break;
    }
}, false);
