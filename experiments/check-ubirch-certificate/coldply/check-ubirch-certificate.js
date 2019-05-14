function verify(){
    let certificate= {
        name: document.getElementById("name").value,
        created: document.getElementById("created").value,
        workshop: document.getElementById("workshop").value
    };
    let str = "{ \"created\": \"" + certificate.created + "\", \"name\": \"" + certificate.name + "\", \"workshop\": \"" + certificate.workshop + "\" }";
    document.getElementById("request_unhashed").innerHTML = str;

    // TODO: hash certificate object
    // var shajs = require('sha.js');

    // workaround: use transId
    let transId = document.getElementById("trans_id").value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            checkResult(this.responseText);
        } else {
            if (this.status == 404) {
                document.getElementById("result_test").innerHTML = "Certificate cannot be found!!!!!";
            } else {
                document.getElementById("result_test").innerHTML = "Problem!!! No clue what really happened....";
            }
        }
    };
    xhttp.open("POST", "https://verify.dev.ubirch.com/api/verify", true);
    xhttp.setRequestHeader("Content-type", "text/plain");
//    xhttp.setRequestHeader("accept", "application/json");
    xhttp.send(transId);

}
function checkResult(result) {
    // Success
    // 1. HTTP Status 200
    // 2. Key Seal != ''"

    if (result) {
        let resultObj = JSON.parse(result);
        if (resultObj) {
            let seal = resultObj["seal"];
            if (seal && seal.length > 0) {
                document.getElementById("seal-img").setAttribute('class', 'visible');
                document.getElementById("result_test").innerHTML = "Success!!!! (show green seal)";
                // TODO: check if Blockchain Transactions exist
                let blockchainTX = resultObj["anchors"];
                if (blockchainTX && blockchainTX.length>0) {
                    // TODO: show it for each item in array
                    // TODO: dynamic blockchain check url -> check name and type of block chain tx
                    let link = "https://rinkeby.etherscan.io/tx/0x";
                    let tx = blockchainTX[0];
                    var txdiv = document.getElementById("bloxTX");
                    var linkTag = document.createElement('a');
                    linkTag.setAttribute('href', link + tx["txid"]);
                    linkTag.setAttribute('target', "_blanc");
                    linkTag.innerHTML = "Check via " + tx["blockchain"] + "-" + tx["network_type"] + ": " + tx["network_info"];
                    txdiv.appendChild(linkTag);
                }

            }
            else {
                document.getElementById("result_test").innerHTML = "Check failed!! Certificate doesn't contain seal!";
            }
        }
    }

}
