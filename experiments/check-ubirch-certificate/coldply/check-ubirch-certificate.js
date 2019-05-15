//////   SETTINGS  ////////

// set ubirch verify REST endpoint
const verify_api_url = "https://verify.dev.ubirch.com/api/verify";
// replace with url of seal icon
const seal_icon_url = "https://letsencrypt.org/images/le-logo-lockonly.png";
// add blockchain test data as
//  blockchain: { network_type: {network_info: "info string", url: "url with praefix"}}
const blockchain_transid_check_url = {
    ethereum: {
        testnet: {
            network_info: "Rinkeby Testnet Network",
            url: "https://rinkeby.etherscan.io/tx/0x",
            icon_url: "http://chittagongit.com/images/ethereum-icon/ethereum-icon-28.jpg"
        }
    }
};
const INFO = {
    PROCESSING_VERIFICATION_CALL: 1,
    VERIFICATION_SUCCESSFUL: 2
};
const ERROR = {
    NO_ERROR: 0,
    CERTIFICATE_DATA_MISSING: 1,
    CERTIFICATE_ID_CANNOT_BE_FOUND: 2,
    VERIFICATION_FAILED_EMPTY_RESPONSE: 3,
    VERIFICATION_FAILED_MISSING_SEAL_IN_RESPONSE: 4,
    UNKNOWN_ERROR: 99
};

function handleError(error) {
    switch (error) {
        case ERROR.NO_ERROR:
            break;
        case ERROR.CERTIFICATE_DATA_MISSING:
            displayErrorStr("Certificate data missing - please fill out form!!!");
            break;
        case ERROR.CERTIFICATE_ID_CANNOT_BE_FOUND:
            displayErrorStr("Certificate cannot be found!!!!!");
            break;
        case ERROR.VERIFICATION_FAILED_EMPTY_RESPONSE:
        case ERROR.VERIFICATION_FAILED_MISSING_SEAL_IN_RESPONSE:
            displayErrorStr("Check failed!! Certificat is emptyore doesn't contain seal");
            break;
        case ERROR.UNKNOWN_ERROR:
        default:
            displayErrorStr("Problem!!! No clue what really happened....!");
    }
}
function handleInfo(info) {
    switch (info) {
        case INFO.PROCESSING_VERIFICATION_CALL:
            displayInfoStr("...processing....", true);
            break;
        case INFO.VERIFICATION_SUCCESSFUL:
            displayInfoStr("Success!!!!", true);
            break;
    }
}

//////   CODE  ////////

function verify(){

    cleanupIcons();

    let cert = createCertificate();
    if (!cert) {
        handleError(ERROR.CERTIFICATE_DATA_MISSING);
    } else {
        // TODO: remove debug statement
        console.log(cert);

        // hash certificate object
        let transIdAB = sha512.arrayBuffer(cert);
        let transId = btoa(
            new Uint8Array(transIdAB)
                .reduce((data, byte) => data + String.fromCharCode(byte), ''));
        console.log(transId);

        checkHashOnUbirchBE(transId, checkResponse);
    }
}
function cleanupIcons() {
    // TODO: remove seal and transaction_check icons IF exist
}

function createCertificate() {
    if (document.getElementById("name") && document.getElementById("name").value
        && document.getElementById("created") && document.getElementById("created").value
        && document.getElementById("workshop") && document.getElementById("workshop").value ) {
        let certificate= {
            name: document.getElementById("name").value,
            created: document.getElementById("created").value,
            workshop: document.getElementById("workshop").value
        };
        let str = "{\"created\":\""+certificate.created+"\",\"name\":\""+certificate.name+"\",\"workshop\":\""+certificate.workshop+"\"}";
        return str;
    }
    return undefined;
}
function checkHashOnUbirchBE(hash, checkFkt) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            handleInfo(INFO.PROCESSING_VERIFICATION_CALL, true);
        } else {
            switch (this.status) {
                case 200:
                    checkFkt(this.responseText);
                    break;
                case 404:
                    handleError(ERROR.CERTIFICATE_ID_CANNOT_BE_FOUND, true);
                    break;
                default:
                    handleError(ERROR.UNKNOWN_ERROR, true);
            }
        }
    };
    xhttp.open("POST", verify_api_url, true);
    xhttp.setRequestHeader("Content-type", "text/plain");
//    xhttp.setRequestHeader("accept", "application/json");
    xhttp.send(hash);
}

function checkResponse(result) {
    // Success IF
    // 1. HTTP Status 200 -> if this fkt is called and result isn't empty
    // 2. Key Seal != ''

    if (result) {
        let resultObj = JSON.parse(result);
        if (resultObj) {
            let seal = resultObj["seal"];
            if (seal && seal.length > 0) {

                showSeal();

                // check if Blockchain Transactions exist
                let blockchainTX = resultObj["anchors"];
                if (blockchainTX && blockchainTX.length>0) {
                    // show it for each item in array
                    for(var i = 0; i<blockchainTX.length; i++) {
                        showBloxTXIcon(blockchainTX[i], i);
                    }
                }

            }
            else {
                handleError(ERROR.VERIFICATION_FAILED_MISSING_SEAL_IN_RESPONSE, true);
            }
        }
    }
    else {
        handleError(ERROR.VERIFICATION_FAILED_EMPTY_RESPONSE, true);
    }
}
function showSeal() {
    handleInfo(INFO.VERIFICATION_SUCCESSFUL, true);
    let results_collection = document.getElementById("results_collection");
    results_collection.appendChild(createIconTag(seal_icon_url, "seal_img"));
}
function showBloxTXIcon(bloxTX, index) {
    // check name and type of block chain tx
    if (bloxTX && bloxTX.blockchain && bloxTX.network_type) {
        let bloxTXData = blockchain_transid_check_url && blockchain_transid_check_url[bloxTX.blockchain] && blockchain_transid_check_url[bloxTX.blockchain][bloxTX.network_type];
        if (bloxTXData !== undefined && bloxTX.txid) {
            var results_collection = document.getElementById("results_collection");
            var linkTag = document.createElement('a');
            // add transactionId to url
            linkTag.setAttribute('href', bloxTXData.url + bolxTX.txid);
            linkTag.setAttribute('title', bloxTXData.network_info);
            linkTag.setAttribute('target', "_blanc");
            // if icon url is given add img, otherwise add text
            if (bloxTxData.icon_url === undefined) {
                linkTag.innerHTML = bloxTXData.network_info;
            } else {
                let iconId = "blockchain_transid_check" + (index === undefined ? '' : '_' + index);
                linkTag.appendChild(createIconTag(bloxTxData.icon_url, iconId));
            }
            results_collection.appendChild(linkTag);
        }
    }
}
function createIconTag(src, imgTagId, width, height) {
    let imgTag = document.createElement('img');
    imgTag.setAttribute('width', width === undefined ? '50' : width);
    imgTag.setAttribute('height', width === undefined ? '50' : height);
    imgTag.setAttribute('src', src);
    if (imgTagId !== undefined){
        imgTag.setAttribute('id', imgTagId);
    }
    return imgTag;
}

function displayErrorStr(errorStr, clearInfo) {
    displayAndClear(errorStr, "error_area", clearInfo ? "info_area" : undefined);
}
function displayInfoStr(infoStr, clearError) {
    displayAndClear(infoStr, "info_area", clearError ? "error_area" : undefined);
}
function displayAndClear(infoStr, elemId, clearElemId) {
    document.getElementById(elemId).innerHTML = infoStr;
    if (clearElemId !== undefined) {
        clearTextContainer(clearElemId);
    }
}
function clearTextContainer(containerId) {
    if (document.getElementById(containerId) && document.getElementById(containerId).innerHTML) {
        document.getElementById(containerId).innerHTML = "";
    }
}