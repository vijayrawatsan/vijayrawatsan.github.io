const fs = require('fs');

let test = '{ "zolas":["coke","pepsi","kofola"],"id": "0001", "type": "donut", "name": "Cake", "ppu": 0.55, "batters": { "batter": [ { "id": "1001", "type": "Regular" }, { "id": "1002", "type": "Chocolate" }, { "id": "1003", "type": "Blueberry" }, { "id": "1004", "type": "Devil\'s Food" } ] }, "topping": [ { "id": "5001", "type": "None" }, { "id": "5002", "type": "Glazed" }, { "id": "5005", "type": "Sugar" }, { "id": "5007", "type": "Powdered Sugar" }, { "id": "5006", "type": "Chocolate with Sprinkles" }, { "id": "5003", "type": "Chocolate" }, { "id": "5004", "type": "Maple" } ] }';
// console.log(JSON.stringify(test));
console.log(JSON.stringify(JSON.parse(test), null, 2));
let obj = JSON.parse(test);

function recursivelyGenerateHTML(obj, tab=0) {
    let html = "";
    Object.keys(obj).forEach((key, idx, array) => {
        let suffix = idx === array.length - 1 ? '' : ',';
        if (Array.isArray(obj[key])) {
            let arrayHtml = `<div class="obj ${'tab-' + tab}"><span class="key">${key}</span>:<span>[</span><br><span class="arrvalue">`;
            obj[key].forEach((item, idx, array)=> {
                let suffix = idx === array.length - 1 ? '' : ',<br>';
                if (typeof (item) === 'object') {
                    arrayHtml += `{<span class="ovalue ${'level-'+tab}">${recursivelyGenerateHTML(item, tab + 1)}</span>}${suffix}`;
                } else {
                    arrayHtml += `<span class="pvalue ${'level-'+tab}">"${item}"</span>${suffix}`;
                }
            })
            arrayHtml+= `</span><br>]${suffix}</div>`;
            html += arrayHtml;
        } else if (typeof (obj[key]) === 'object' && obj[key] != null) {
            html +=  `<div class="obj ${'tab-' + tab}"><span class="key">"${key}"</span>:{<span class="ovalue ${'level-'+tab}">${recursivelyGenerateHTML(obj[key], tab + 1)}</span>}${suffix}</div>`;
        } else {
            html += `<div class="obj ${'tab-' + tab}"><span class="key">"${key}"</span>:<span class="pvalue ${'level-'+tab}">"${obj[key]}"</span>${suffix}</div>`;
        }
    });
    return html;
}
let finalHtml = '<html><head><style> .arrvalue > span.pvalue::before {content: "";white-space: pre;} .obj {} .key { color: orange; } .sep { display: table-cell; } .pvalue { color: green; } .tab-0 { margin-left: 8px; } .tab-1 { margin-left: 16px; } .tab-2 { margin-left: 24px; } .tab-3 { margin-left: 32px; } .tab-4 { margin-left: 10px; } </style> <head><body><div class="container">${html}</div></body></html>' 
finalHtml = finalHtml.replace('${html}', "{" + recursivelyGenerateHTML(obj) + "}");

fs.writeFileSync('./parser.html',finalHtml,{encoding:'utf8',flag:'w'})
