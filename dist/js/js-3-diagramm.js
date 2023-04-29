// Возвращает все значения строк из таблицы, в массиве
function GetTable() {
    // Получаем ссылку на таблицу
    let table = document.getElementById("table-001");

    // Получаем список заголовков столбцов
    const headers = [];
    for (let i = 0; i < table.rows[0].cells.length; i++) {
      headers[i] = table.rows[0].cells[i].textContent;
    }


    // Проходим по каждой строке таблицы и сохраняем ее содержимое в массив словарей
    let data = [];

    for (let i = 1; i < table.rows.length; i++) {
      const tableRow = table.rows[i];
      const rowData = {};

      // Проходим по каждой ячейке в строке и сохраняем ее содержимое в соответствующий заголовок столбца
      for (let j = 0; j < tableRow.cells.length; j++) {
        rowData[headers[j]] = tableRow.cells[j].textContent;
      }

      data.push(rowData);
    }

    console.log(data);

    return data;
}

// Проходит по всем значениям входного массива, и мобирает массив значений для графика
function CreateOutpMassForDate(Date, int_mode_y, int_mode_x) { // a, b
    // Date - Входной массив, с таблицей
    // int_mode_y и int_mode_x - число-ключ в массиве Date

    let str_mode;
    let str_mode_date;

    // Устанавливаю строки-ключи для изъятия данных их массива-словаря
    if(int_mode_y == 0) str_mode = "Префектура";
    else if (int_mode_y == 1) str_mode = "Год основания";

    if(int_mode_x == 0) str_mode_date = "Население";
    else if (int_mode_x == 1 ) str_mode_date = "Площадь";

    let outMassForDate_x = {}; // Выходной массив 

    for(let i = 0; i < Date.length; i++) {
        if(outMassForDate_x[Date[i][str_mode]] == null) {
            //console.log('Для данного значения ' + Date[i][str_mode] + ' ещё нет ключа');
            outMassForDate_x[Date[i][str_mode]] = Date[i][str_mode_date];
        } else {
            if(int_mode_x == 0) {
                if (outMassForDate_x[Date[i][str_mode]] < parseFloat(Date[i][str_mode_date])) {
                    outMassForDate_x[Date[i][str_mode]] = parseFloat(Date[i][str_mode_date]);
                    //console.log('Обнаружено население, больше записанного. outMassForDate_x[Date[i][str_mode]] = ' + outMassForDate_x[Date[i][str_mode]]);
                }
            }else if(int_mode_x == 1) {
                if (outMassForDate_x[Date[i][str_mode]] < Date[i][str_mode_date]) {
                    outMassForDate_x[Date[i][str_mode]] = Date[i][str_mode_date];
                    //console.log('Обнаружена площадь, больше записанного. outMassForDate_x[Date[i][str_mode]] = ' + outMassForDate_x[Date[i][str_mode]]);
                }
            }
        }
    } 

    console.log(outMassForDate_x);
    return outMassForDate_x;
}

// Рисует линейный график
function DrawLinearGrafic_02(data_x, data_y, strX, strY, int_color) {
    // Проверяем, что входные данные являются числами
    if (!Array.isArray(data_x) || !Array.isArray(data_y) || data_x.length !== data_y.length) {
        console.error("Invalid input data");
        return;
    }
    for (var i = 0; i < data_x.length; i++) {
        if (isNaN(data_x[i]) || isNaN(data_y[i])) {
            console.error("Invalid input data");
            return;
        }
    }
    
    // Создаем элемент SVG
    var svg = d3.select(".curr-graff")
        .append("svg")
        .attr("width", '700px')
        .attr("height", '400px')
        .attr("margin", 'auto');

    // Создаем функции масштабирования для x и y

    let dat_x = GetMinMaxVal(data_x);
    let dat_y = GetMinMaxVal(data_y);

    var xScale = d3.scaleLinear()
      .domain([dat_x[0], dat_x[1]]) //.domain([0, d3.max(data_x)]) // .domain([0, data_x.length - 1])
      .range([80, 450]);
    
    var yScale = d3.scaleLinear()
      .domain([dat_y[0], dat_y[1]]) //.domain([0, d3.max(data_y)])
      .range([250, 50]);

    // Создаем оси x и y
    var xAxis = d3.axisBottom(xScale);
    //var xAxis;
    //xAxis.tickFormat(d3.format(".0f")).tickValues(data_x.map(d => Number(d).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false})));  
    xAxis.tickFormat(d3.format(".0f"))
        .tickValues(data_x.filter((d, i) => i % 2 === 0).map(d => Number(d).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false})));

    var yAxis = d3.axisLeft(yScale)
        //.tickValues(d3.range(Math.ceil(yScale.domain()[0]), Math.floor(yScale.domain()[1]) + 1, 1))
        //.tickFormat(d3.format(".0f"));

    svg.append("g")
        .attr("transform", "translate(0," + 250 + ")")
        .attr("class", "x-axis")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + 80 + ",0)")
        .attr("class", "y-axis")
        .call(yAxis);

    // Добавляем легенды
    svg.append("g")
        .attr("transform", "translate(190," + 290 + ")")
        .append("text")
        .text(strY)
        .attr("class", "x-legend")
        .style("fill", "gray"); // set color to gray

    svg.append("g")
        .attr("transform", "translate(" + 10 + ", "+ 230 + ") rotate(-90)")
        .append("text")
        .text(strX)
        .attr("class", "y-legend")
        .style("fill", "gray"); // set color to gray

    svg.append("path")
        .datum(data_y)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", "0,0")
        .attr("d", d3.line()
            .x(function(d, i) { return xScale(data_x[i]); })
            .y(function(d) { return yScale(d); })
            .curve(d3.curveCardinal.tension(0.5)) // Задаю степень кривизны линии
        );
}

// Рисует столбчатый график
function DrawGistDiagramm(map, input_b) {    
    let width = 900;
    let height = 300;
    let marginX = 60;
    let marginY = 40;

    let svg = d3.select(".curr-graff")
     .append("svg")
     .attr("height", height)
     .attr("width", width)
     .attr('transform', 'translate(-100, 0)')
     //.style("border", "solid thin grey");
     
    let min = 0;
    let max; 

    if(input_b == 0) max = 3500000;
    else max = 2000;

    let xAxisLen = 600;
    let yAxisLen = height - 2 * marginY;
    let data = Object.entries(map);

    // Функции шкалирования
    let scaleX = d3.scaleBand()
     .domain(data.map(function(d) {
       return d[0];
     }))
     .range([0, xAxisLen])
     .padding(0.45);
     
    let scaleY = d3.scaleLinear()
     .domain([min, max])
     .range([yAxisLen, 0]);
     
    // Создание осей
    let axisX = d3.axisBottom(scaleX);  // Горизонтальная
    let axisY = d3.axisLeft(scaleY)     // Вертикальная
    //var yAxis = d3.axisLeft(yScale)
        //.tickValues(d3.range(Math.ceil(scaleY.domain()[0]), Math.floor(scaleY.domain()[1]) + 1, 1))
        //.tickFormat(d3.format(".0f"));

    svg.append("g")
     .attr("transform", `translate(${marginX}, ${height - marginY})`)
     .call(axisX)
     .attr("class", "x-axis")
     .selectAll('text')
     .style('font-size', '8px');
     
     
    svg.append("g")
     .attr("transform", `translate(${marginX}, ${marginY})`)
     .call(axisY);

    // Цвета столбиков
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    // Создание и отрисовка столбиков гистограммы
    let g = svg.append("g")
        .attr("transform", `translate(${ marginX}, ${ marginY})`)
        .selectAll(".rect")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d) { return scaleX(d[0]); })
        .attr("width", scaleX.bandwidth())
        .attr("y", function(d) { return scaleY(d[1]); })
        .attr("height", function(d) { return yAxisLen - scaleY(d[1]); })
        .attr("fill", function(d) { return color(d[0]); })
        .attr("rx", 3)
        .attr("ry", 3);  
}

// Возвращает минимальное и максимальное значение из массива, с небольшим смещением,
// для более красивого отображения графика
function GetMinMaxVal(mass) {
    for(let i = 0; i<mass.length; i++) {
        // Преобразовываю все данные массива в числа
        mass[i] = parseFloat(mass[i]);
    }

    let min = d3.min(mass); 
    let max = d3.max(mass); 
    let gerr = max-min;

    let outMin = min - gerr*0.1;
    let outMax = max + gerr*0.1;

    let outMass = [outMin, outMax];
    console.log('sizeMass = ' + outMass);
    return outMass;
}

// Проверяет, какие круглые кнопки выбраны в данный момент
function radioButtonCheck() {
    // Получить все радио-кнопки
    const radioButtons = document.querySelectorAll('.block-011 input[type="radio"]');
    
    let inpMassRad = [];

    // Обойти все радио-кнопки и найти выбранные значения
    for (let i = 0; i < radioButtons.length; i++) {
        console.log(radioButtons[i].checked); 
        inpMassRad.push(radioButtons[i].checked);
    }

    if(inpMassRad[0] == true) input_a = 0; else input_a = 1;
    if(inpMassRad[2] == true) input_b = 0; else input_b = 1;

    console.log('input_a = ' + input_a + ", input_b = " + input_b);

    // Если ничего не выбрано, вернёт последние значения
}

// Изменяет отображение блока с графиком, на странице
function setVisibleElementGraf(isVisible) {
    grafDiv[0].style.display = isVisible ? "block" : "none";
}


// ----------- 
// Начало программы

let grafDiv = document.getElementsByClassName('block-graf');

// Скрываю или показываю элемент с диаграммой
let isVisible = false; 
setVisibleElementGraf(isVisible);

let input_a = 0; 
let input_b = 0; 

// -------

let buttDraw = document.getElementById('butt-graf');
let graf_container = document.getElementById('graf-container');

// Выполняется при нажатии на кнопку "Построить" в блоке графика
buttDraw.addEventListener('click', () => {
    console.log('Кнопка нажата!');
    setVisibleElementGraf(true);

    // Удаляю график
    let mainGraf = document.getElementsByClassName('curr-graff');
    mainGraf[0].remove();

    // Создаю новый элемент
    let mainGraf2 = document.createElement("div");
    mainGraf2.className = "curr-graff";

    // И вставляю его в нужное место    
    //console.log('graf_container.nodeName = ' + graf_container.nodeName);
    graf_container.insertBefore(mainGraf2, graf_container.firstChild);

    radioButtonCheck(); // Собираю информацию о выбранных опциях
    MainGenerateGrafic(input_a, input_b); // И отрисовываю график
});

// Рисует нужный график, с нужными данными
function MainGenerateGrafic(input_a, input_b) {
    let data_x = []; 
    let data_y = []; 
    
    // Получаю новые данные из таблицы на странице
    // Так что графики изменяются, после фильтрации значений
    let data = GetTable(); 

    // Получаю массив значений, для построения графика
    let newDate = CreateOutpMassForDate(data, input_a, input_b);
    
    data_x = Object.keys(newDate);
    data_y = Object.values(newDate);
    
    let strLett; // Подпись для линейного графика
    
    if(input_b == 0) strLett = "Максимальное население";
    else if(input_b == 1) strLett = "Максимальная пощадь";
    
    if(input_a == 1) { 
        // Если выбран "Год выхода", то рисую линейный график
        DrawLinearGrafic_02(data_x, data_y, strLett, "Год основания", input_b);
    } else { 
        // Если выбран "Жанр", то рисую столбчатый график
        DrawGistDiagramm(newDate, input_b);
    }
}
