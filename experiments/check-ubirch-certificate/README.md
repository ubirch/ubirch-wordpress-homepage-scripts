#Check-Ubirch-Certificate

Source code from the test page on codeply: https://www.codeply.com/go/rME6bdiH4O

## Which Problem Should this Script Solve

Landingpage: https://ubirch.de/de/workshop-qr-code/?Name=Max%20Mustermann&Datum=06.06.2060&Workshop=IoT%20und%20Blockchain&TransID=abc123

Verification request:
curl -X POST "https://verify.dev.ubirch.com/api/verify" -H "accept: application/json" -H "Content-Type: text/plain" -d "opi+/mbaHB9AvvZqF0Za4VdKY2OOOFlffzSJdkQpwi93R5zftMOmuVuqoNNT8WlS6Rv1ODHpFnYVPlpTYu8njQ=="

Response:



{code:javascript}
{
    "seal": "liPEEOl+FgxhF1uJrJgVrrUmVeDEQGPT+XEBCUim6CWsWFKCn0PYAjSn24ccMKw6Pj41YyhlcyXjAHGVTcoZo1hmi6u+mPoF9eZjU0fmz54BMQ1cdQQAxEA4lgUACbQDbwjVzCATQ0luEcGa+Wm5HRUFaEgMCDhsvY12QHwif4JrFaYaRxYujyvroD9T/FQxMbikijmF2+ngxEDMzmf3NDkpsnyFzeC0GwvTa7ulqTGVNTgYPtT1Vwz8rtEDN0Q/Eg4z9/4QZqrh7Frpk7qJ8+vRm8L14DH7hZAK",
    "chain": "liPEEOl+FgxhF1uJrJgVrrUmVeDEQACh9OGLOJVFjCSP8BM38Z0GfroQD39N3ECTjtBHowchm5yFWisH5qKf6BUXctV1d2OkT2jD1wFszo+kqLnuCQEAxEA0bS2xcAoI2Yyxuf+/HqOUENCVaSQ2kq/+zlHKmi8b/P+ikJeqCdM4PnoSRYvb42QFbqfv/ZtWswjaBtpCHH6NxEBj0/lxAQlIpuglrFhSgp9D2AI0p9uHHDCsOj4+NWMoZXMl4wBxlU3KGaNYZourvpj6BfXmY1NH5s+eATENXHUE",
    "anchors": [{
        "status": "added",
        "txid": "77cfd2c4dd12dd283feba6ca23fb1eb7b70bdf4073e184b601755be4454b729b",
        "message": "abc55136fdf1cf05df3f068ef7423a4ac5e9db748d021c927a344ce8e30fc50f9db81a5899d30f3714bd6c4724be53370833e62a5254fc0d8e2b9204a1aff82d",
        "blockchain": "ethereum",
        "network_info": "Rinkeby Testnet Network",
        "network_type": "testnet",
        "created": "2019-05-13T14:13:53.967682"
    }]
}
{code}


Ethereum Testnet Explorer
https://rinkeby.etherscan.io/tx/0xa8a2e2a69b5e54e6859cc298733a9e0a22ddf16f78339634e3971d808180afc4


Anforderung:
1. Über Daten des Zertifikats als JSON Objekt einen SHA512 Hash berechnen. 
2. Hash an Verification URL senden
2.1 Ergebnis positiv, wenn
2.1.1 HTTP Status 200 
2.1.2 Key Seal != ''"
2.2. Blockchain Transactions vorhanden, wenn Array Anchor nicht leer
3. Wenn Ergebnis positiv, dann ein Feedback an Nutzer (grünes Siegel, oder so) 
4. Wenn Blockchain TX vorhanden, dann Links zu Explorer einfügen, idealer Weise auch ein blockchain spezifisches Siegel pro TX

Vorschlag Workshop Zertifikat JSON:

{
"created" : "2060-06-06",
"name": "Max Mustermann",
"workshop": "IoT und Blockchain"
}
