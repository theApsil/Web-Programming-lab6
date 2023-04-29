const columnNames = ["Название города","Население","Площадь","Префектура","Год основания"];
const cityNames = ["Токио","Иокогама","Осака","Нагоя","Саппоро","Кобе","Киото","Фукуока","Кавасаки","Сайтама","Хиросима","Сендай","Китакюсю","Тиба","Сэтагая","Сакаи","Ниигата","Хамамацу","Сидзуока","Сагамихара","Нэрима","Окаяма","Ота","Кумамото","Эдогава","Адати","Кагосима","Фунасаби"];
const population = [37435191,3697894,2668586,2283289,1918096,1530847,1474570,1430371,1373630,1192418,1163806,1029552,986998,938695,855416,835333,813053,811431,710944,706342,702202,701293,674590,670348,661386,629392,605196,605196];
const area = [621.81,437.38,222.30,326.45,1710.00,552.23,827.90,340.96,142.70,217.49,905.13,783.54,487.71,272.08,58.08,149.99,726.10,1511.17,1388.78,328.84,48.16,789.91,59.46,267.23,49.86,53.20,547.06,85.64];
const prefecture = ["Токио","Каганава","Осака","Айти","Хоккайдо","Хиого","Киото","Фукуока","Каганава","Сайтама","Хиросима","Мияги","Фукуока","Тиба","Токио","Осака","Ниигата","Сидзуока","Сидзуока","Каганава","Токио","Окаяма","Токио","Кумамото","Токио","Токио","Кагосима","Тиба"];
const foundation = [1869,1889,1889,1889,1922,1889,1889,1889,1924,2001,1889,1889,1963,1921,1947,1889,1889,1911,1889,1954,1947,1889,1947,1947,1889,1947,1889,1937];

let options = {
    No: "Нет",
    CityName: "Название города",
    Population: "Население",
    Area: "Площадь",
    Prefecture: "Префектура",
    Foundation: "Год основания"
};

let statistics = {
    CityName: Array.from(cityNames),
    Population: Array.from(population),
    Area: Array.from(area),
    Prefecture: Array.from(prefecture),
    Foundation: Array.from(foundation),

    getAllKey: function () {
        let arrKey = [];
        for(let key in this) {
            if (typeof(this[key]) !== 'function') {
                arrKey.push(key)
            }
        }
        return arrKey;
    },
    print: function() {
        let html = '<table id="table-001"><tr>';
        let arrKey = this.getAllKey();
        for(let key in columnNames) {
            html += `<th>${ columnNames[key] }</th>`;
        }
        html += '</tr>';
        for(let i = 0; i < this[arrKey[0]].length; i++) {
            html += '<tr>';
            for(let key in arrKey) {
                html += `<td>${ this[arrKey[key]][i] }</td>`;
            }
            html += '</tr>';
        }
        return html + '</table>';
    }
}

let newStatistics = {
    __proto__: statistics,

    change: function(k, p) {
        let allKey = this.getAllKey();
        for(let key in allKey) {
            let w = this[allKey[key]][k];
            this[allKey[key]][k] = this[allKey[key]][p];
            this[allKey[key]][p] = w;
        }
    },

    isCompareOrder: function(n, arrCompare) {
        for(let k = 0; k < arrCompare.length; k += 2) {
            let sortOrder = (arrCompare[k+1] === true)? 'desc' : 'asc';
            if (doCompare(this[arrCompare[k]][n], this[arrCompare[k]][n + 1], sortOrder)) {
                return true;
            } else if (this[arrCompare[k]][n] === this[arrCompare[k]][n + 1]) {
                continue;
            } else {
                return false;
            }
        }
        return false
    },

    sorted: function(arr) {
        let n = this[arr[0]].length;
        for(let i = 0; i < n - 1; i += 1) {
            for (let j = 0; j < n - i - 1; j++) {
                if (this.isCompareOrder(j, arr)) {
                    this.change(j, j + 1);
                }
            }
        }
        return true;
    },

    getResultLogOpr: function(valueLeft, opr, valueRight) {
        if (opr == '==') {
            return valueLeft == valueRight;
        }
        if (opr == '!=') {
            return valueLeft != valueRight;
        }
        if (opr == '>') {
            return valueLeft > valueRight;
        }
        if (opr == '<') {
            return valueLeft < valueRight;
        }
        if (opr == '>=') {
            return valueLeft >= valueRight;
        }
        if (opr == '<=') {
            return valueLeft <= valueRight;
        }
    },

    where: function(arr) {
        if (arr.length == 0) return;
        let indexTrue = [];
        for (let i in this[arr[0]["key"]])
            indexTrue.push(parseInt(i));
        for (let i in arr) {
            arrTrue = [];
            for (let j = 0; j < this[arr[i]["key"]].length; j++) {
                if (this.getResultLogOpr(this[arr[i]["key"]][j],arr[i]["operation"],arr[i]["value"])){
                    arrTrue.push(j);
                }
            }
            indexTrue = intersection(indexTrue, arrTrue);
        }
        keysThis = this.getAllKey();
        for (let k in keysThis) {
            let newValue = [];
            for (let i in indexTrue) {
                newValue.push(this[keysThis[k]][indexTrue[i]]);
            }
            this[keysThis[k]] = newValue;
        }
    },

    setToDefault: function() {
        this.CityName = Array.from(cityNames);
        this.Population = Array.from(population);
        this.Area = Array.from(area);
        this.Prefecture = Array.from(prefecture);
        this.Foundation = Array.from(foundation);
    }
}

function doCompare (elem1, elem2, sortOrder) {
    switch (sortOrder)
    {
        case 'asc':
            if (elem1 > elem2) return true;
            else return false;
            break;
        case 'desc':
            if (elem1 < elem2) return true;
            else return false;
            break;
    }
}

function intersection (arr1, arr2) {
    let result = [];
    for(let i in arr1)
    {
        if(arr2.includes(arr1[i])) result.push(arr1[i]);
    }
    return result;
}

function createStatsElements() {
    let table = document.getElementById('table');
    table.innerHTML = newStatistics.print();

    let strHTML = "";
    for (let i = 1; i <= 3; i++) {
        let sortLevel;
        switch (i) {
            case 1:
                sortLevel = `<p>Первый уровень:`;
                break;
            case 2:
                sortLevel = `<p>Второй уровень:`;
                break;
            case 3:
                sortLevel = `<p>Третий уровень:`;
                break;
        }

        strHTML += `<div id = "selectDiv${i}" class = "rowFlex">` + sortLevel;
        strHTML += createSelect(options, i) + "</p>";
        strHTML += `<p>По убыванию?
                <input id = "sortOrder${i}" type="checkbox">
            </p></div>`;
    }

    document.getElementById("sortDiv").innerHTML = strHTML;

    strHTML = `
     <div class="rowFlex">
        <p>Название города:</p>
        <input type="text" name="CityNameFilter">
     </div>
     <div class="rowFlex">
        <p>Население:</p>
        <p>oт</p>
        <input type="number" name="PopulationFilterFrom">
        <p>до</p>
        <input type="number" name="PopulationFilterTo">
     </div>
     <div class="rowFlex">
        <p>Площадь:</p>
        <p>oт</p>
        <input type="number" name="AreaFilterFrom">
        <p>до</p>
        <input type="number" name="AreaFilterTo">
     </div>
     <div class="rowFlex">
        <p>Префектура:</p>
        <input type="text" name="PrefectureFilter">
     </div>
        <div class="rowFlex">
        <p>Год основания:</p>
        <p>oт</p>
        <input type="number" name="FoundationFilterFrom">
        <p>до</p>
        <input type="number" name="FoundationFilterTo">
     </div>`

    document.getElementById("filterDiv").innerHTML = strHTML;
}

function createSelect(object, index){
    return `<select id = "select${index}" onchange="getActualOptions()"> ${createOptions(object)} </select>`;
}

function createOptions(object){
    let result = "";
    for (let key in object)
    {
        result += `<option value = "${key}">${object[key]}</option>`;
    }
    return result;
}

function getActualOptions() {
    let arrOptions = [];

    for (let key in options) {
        let newOption = document.createElement('option');
        let optionText = document.createTextNode(options[key]);
        newOption.appendChild(optionText);
        newOption.setAttribute('value', key);
        arrOptions.push(newOption);
    }

    let selectedOption1 = document.getElementById("select1").options[document.getElementById("select1").selectedIndex];
    let selectedOption2 = document.getElementById("select2").options[document.getElementById("select2").selectedIndex];;
    let selectedOption3 = document.getElementById("select3").options[document.getElementById("select3").selectedIndex];;

    for (let i = 0; i < arrOptions.length; i++) {
        let flag = true;
        for(let j = 0; j < document.getElementById("select1").options.length; j++){
            if (document.getElementById("select1").options[j].value === arrOptions[i].value) {
                flag = false;
            }
        }
        if (flag)
            document.getElementById("select1").insertBefore(arrOptions[i].cloneNode(true), document.getElementById("select1").options[i]);
    }

    let index = 0;

    while (index < document.getElementById("select1").length) {
        if (document.getElementById("select1").options[index].value === selectedOption2.value
            && selectedOption2.value !== "No") {
            document.getElementById("select1").options[index] = null;
            index = 0;
        }
        if (document.getElementById("select1").options[index].value === selectedOption3.value
            && selectedOption3.value !== "No") {
            document.getElementById("select1").options[index] = null;
            index = 0;
        }
        index++;
    }

    for (let i = 0; i < arrOptions.length; i++) {
        let flag = true;
        for(let j = 0; j < document.getElementById("select2").options.length; j++){
            if (document.getElementById("select2").options[j].value === arrOptions[i].value)
                flag = false;
        }
        if (flag)
            document.getElementById("select2").insertBefore(arrOptions[i].cloneNode(true), document.getElementById("select2").options[i]);

    }

    index = 0

    while (index < document.getElementById("select2").length) {
        if (document.getElementById("select2").options[index].value === selectedOption1.value
            && selectedOption1.value !== "No") {
            document.getElementById("select2").options[index] = null;
            index = 0;
        }
        if (document.getElementById("select2").options[index].value === selectedOption3.value
            && selectedOption3.value !== "No") {
            document.getElementById("select2").options[index] = null;
            index = 0;
        }
        index++;
    }

    for (let i = 0; i < arrOptions.length; i++) {
        let flag = true;
        for(let j = 0; j < document.getElementById("select3").options.length; j++){
            if (document.getElementById("select3").options[j].value === arrOptions[i].value)
                flag = false;
        }
        if (flag)
            document.getElementById("select3").insertBefore(arrOptions[i].cloneNode(true), document.getElementById("select3").options[i]);

    }

    index = 0

    while (index < document.getElementById("select3").length) {
        if (document.getElementById("select3").options[index].value === selectedOption1.value
            && selectedOption1.value !== "No") {
            document.getElementById("select3").options[index] = null;
            index = 0;
        }
        if (document.getElementById("select3").options[index].value === selectedOption2.value
            && selectedOption2.value !== "No") {
            document.getElementById("select3").options[index] = null;
            index = 0;
        }
        index++;
    }
}

function buttonSorting() {
    let arr = [];
    for (let i = 1; i <= document.getElementsByTagName("select").length; i++) {
        if (document.getElementById(`select${i}`).value !== 'No'
            && document.getElementById(`select${i}`) !== null){
            arr.push(document.getElementById(`select${i}`).value);
            arr.push(document.getElementById(`sortOrder${i}`).checked);
        }
    }

    newStatistics.sorted(arr);
    let table = document.getElementById('table');
    table.innerHTML = newStatistics.print();
}

function buttonFiltering() {
    let arr = [];
    if (document.getElementsByName("CityNameFilter")[0].value !== "") {
        let object = {
            key: "CityName",
            operation: "==",
            value: document.getElementsByName("CityNameFilter")[0].value
        }
        arr.push(object);
    }
    if (document.getElementsByName("PopulationFilterFrom")[0].value !== "") {
        let object = {
            key: "Population",
            operation: ">=",
            value: parseFloat(document.getElementsByName("PopulationFilterFrom")[0].value)
        }
        arr.push(object);
    }
    if (document.getElementsByName("PopulationFilterTo")[0].value !== "") {
        let object = {
            key: "Population",
            operation: "<=",
            value: parseFloat(document.getElementsByName("PopulationFilterTo")[0].value)
        }
        arr.push(object);
    }
    if (document.getElementsByName("AreaFilterFrom")[0].value !== "") {
        let object = {
            key: "Area",
            operation: ">=",
            value: document.getElementsByName("AreaFilterFrom")[0].value
        }
        arr.push(object);
    }
    if (document.getElementsByName("AreaFilterTo")[0].value !== "") {
        let object = {
            key: "Area",
            operation: "<=",
            value: document.getElementsByName("AreaFilterTo")[0].value
        }
        arr.push(object);
    }
    if (document.getElementsByName("PrefectureFilter")[0].value !== "") {
        let object = {
            key: "Prefecture",
            operation: "==",
            value: document.getElementsByName("PrefectureFilter")[0].value
        }
        arr.push(object);
    }
    if (document.getElementsByName("FoundationFilterFrom")[0].value !== "") {
        let object = {
            key: "Foundation",
            operation: ">=",
            value: document.getElementsByName("FoundationFilterFrom")[0].value
        }
        arr.push(object);
    }
    if (document.getElementsByName("FoundationFilterTo")[0].value !== "") {
        let object = {
            key: "Foundation",
            operation: "<=",
            value: document.getElementsByName("FoundationFilterTo")[0].value
        }
        arr.push(object);
    }
    newStatistics.where(arr);
    document.getElementById('table').innerHTML = newStatistics.print();
}

function buttonReset(){
    newStatistics.setToDefault();
    let table = document.getElementById('table');
    table.innerHTML = newStatistics.print();
}