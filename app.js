const hero = document.querySelector('.hero');
const slider = document.querySelector('.slider');
const animation = document.querySelector('section.animation-wrapper');
const inputArea = document.querySelector('.all-inputs');
const btnPlus = document.querySelector('.plus-btn');
const btnDes = document.querySelector('.sort-descending');
const btnAsc = document.querySelector('.sort-ascending');
let forms = document.querySelectorAll('form');
let selects = document.querySelectorAll('select');
let credits = document.querySelectorAll('.class-credit');
let btnTrash = document.querySelectorAll('.trash-button');
///////////////////////////////////////////////////////
//開場動畫設定
const time_line = new TimelineMax();

//fromTo的parameter(被控制對象, duration, 原始狀態, 動畫結束後狀態, 調整進場的時間)
time_line
  .fromTo(hero, 1, { height: '0%' }, { height: '100%', ease: Power2.easeInOut })
  .fromTo(
    hero,
    1.2,
    { width: '80%' },
    { width: '100%', ease: Power2.easeInOut }
  )
  .fromTo(
    slider,
    1,
    { x: '-100%' },
    { x: '0%', ease: Power2.easeInOut },
    '-=1.2'
  )
  .fromTo(animation, 0.3, { opacity: 1 }, { opacity: 0 });

setTimeout(() => {
  animation.style.pointerEvents = 'none';
}, 2500);
///////////////////////////////////////////////////////
//grade轉換成數字
const convertor = function (grade) {
  switch (grade) {
    case 'A':
      return 4.0;
    case 'A-':
      return 3.7;
    case 'B+':
      return 3.4;
    case 'B':
      return 3.0;
    case 'B-':
      return 2.7;
    case 'C+':
      return 2.4;
    case 'C':
      return 2.0;
    case 'C-':
      return 1.7;
    case 'D+':
      return 1.4;
    case 'D':
      return 1.0;
    case 'D-':
      return 0.7;
    case 'F':
      return 0.0;
    default:
      return 0;
  }
};
//計算GPA
const setGpa = function () {
  credits = document.querySelectorAll('.class-credit');
  selects = document.querySelectorAll('select');
  //分子
  let sum = 0;
  //分母
  let creditSum = 0;
  for (let i = 0; i < credits.length; i++) {
    if (credits[i].value === '' || selects[i].value === '') {
      creditSum += 0;
      sum += 0;
    } else {
      if (
        credits[i].valueAsNumber < 0 ||
        credits[i].valueAsNumber > 6 ||
        !Number.isInteger(credits[i].valueAsNumber)
      ) {
        alert('所有的credits欄位的值皆需為0~6的整數數字！');
        return;
      }
      creditSum += credits[i].valueAsNumber;
      sum += credits[i].valueAsNumber * convertor(selects[i].value);
    }
  }
  let result = (0).toFixed(2);
  if (creditSum !== 0) {
    result = (sum / creditSum).toFixed(2);
  }
  document.getElementById('result-gpa').innerText = result;
};
//改變select的背景顏色
const changeColor = function (target) {
  if (target.value.startsWith('A')) {
    target.style.backgroundColor = 'lightgreen';
    target.style.color = 'black';
  }
  if (target.value.startsWith('B')) {
    target.style.backgroundColor = 'yellow';
    target.style.color = 'black';
  }
  if (target.value.startsWith('C')) {
    target.style.backgroundColor = 'orange';
    target.style.color = 'black';
  }
  if (target.value.startsWith('D')) {
    target.style.backgroundColor = 'red';
    target.style.color = 'black';
  }
  if (target.value === 'F') {
    target.style.backgroundColor = 'gray';
    target.style.color = 'white';
  }
  if (target.value === '') {
    target.style.backgroundColor = 'white';
  }
};
//Form initial Event
const init = function () {
  //要執行時，再重抓一次
  forms = document.querySelectorAll('form');
  selects = document.querySelectorAll('select');
  credits = document.querySelectorAll('.class-credit');
  btnTrash = document.querySelectorAll('.trash-button');
  //防止按下表單內button後直接提交表單
  forms.forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  });

  //讓select的背景色會依選的選項不同而換色
  selects.forEach((s) => {
    changeColor(s);
    s.addEventListener('change', (e) => {
      setGpa();
      changeColor(e.target);
    });
  });

  //credit改變時也要改GPA
  credits.forEach((c) => {
    c.addEventListener('change', (e) => {
      setGpa();
    });
  });

  //按下垃圾桶按鈕後刪除form
  btnTrash.forEach((b) => {
    //加上remove animation
    b.addEventListener('click', (e) => {
      e.target.parentElement.parentElement.classList.add('remove');
    });
    //在transition結束後才執行移除該form，並重新計算GPA
    let form = b.parentElement.parentElement;
    form.addEventListener('transitionend', (e) => {
      e.target.remove();
      setGpa();
    });
  });

  setGpa();
};

init();

//Handle Sorting
const handleSorting = function (direction) {
  let objArr = [];
  //抓取Form內資料存起來（排序用）
  let graders = document.querySelectorAll('.grader');
  for (let i = 0; i < graders.length; i++) {
    let class_name = graders[i].children[0].value;
    let class_number = graders[i].children[1].value;
    let class_credit = graders[i].children[2].value;
    let class_grade = graders[i].children[3].value;
    //若此form內完全無資料時，就不列入排序資料
    if (
      !(
        class_name === '' &&
        class_number === '' &&
        class_credit === '' &&
        class_grade === ''
      )
    ) {
      objArr.push({
        class_name,
        class_number,
        class_credit: graders[i].children[2].valueAsNumber,
        class_grade,
        class_grade_number: convertor(graders[i].children[3].value),
      });
    }
  }
  //執行 merge sort
  objArr = mergeSort(objArr);
  //處理不同順的排序(更新網頁)
  if (direction === 'descending') {
    objArr = objArr.reverse();
  }
  if (objArr.length !== 0) {
    //清空原先內容並裝新的進去
    inputArea.innerHTML = '';

    for (let i = 0; i < objArr.length; i++) {
      inputArea.innerHTML += `
    <form>
            <div class="grader">
              <input
                type="text"
                placeholder="class category"
                class="class-type"
                list="opt"
                value=${objArr[i].class_name}
              /><!--
              --><input
                type="text"
                placeholder="class number"
                class="class-number"
                value=${objArr[i].class_number}
              /><!--
            --><input
                type="number"
                placeholder="credits"
                min="0"
                max="6"
                class="class-credit"
                value=${objArr[i].class_credit}
              /><!--
            --><select name="select" class="select">
                <option value=""></option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="C-">C-</option>
                <option value="D+">D+</option>
                <option value="D">D</option>
                <option value="D-">D-</option>
                <option value="F">F</option></select
              ><!--
            --><button class="trash-button">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </form>
    `;

      //用JS處理select的選項
      graders = document.querySelectorAll('.grader');
      for (let i = 0; i < graders.length; i++) {
        graders[i].children[3].value = objArr[i].class_grade;
        changeColor(graders[i].children[3]);
      }
    }
    init();
  }
};

//merge function(處理比大小)
const merge = function (arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  //比到其中一邊的數用完
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i].class_grade_number < arr2[j].class_grade_number) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr2[j]);
      j++;
    }
  }
  //處理剩下的
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
};

//merge sort
const mergeSort = function (arr) {
  if (arr.length <= 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle, arr.length);
    return merge(mergeSort(left), mergeSort(right));
  }
};
///////////////////////////////////////////////////////
//Global Event
//防止按下Enter後直接提交表單
window.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
});

//按下按鈕後執行排序(use merge sort)
btnDes.addEventListener('click', () => {
  handleSorting('descending');
});
btnAsc.addEventListener('click', () => {
  handleSorting('ascending');
});

//按下加號按鈕後新增form
btnPlus.addEventListener('click', (e) => {
  const newForm = document.createElement('form');
  const newDiv = document.createElement('div');
  newDiv.classList.add('grader');

  const input1 = document.createElement('input');
  input1.classList.add('class-type');
  input1.setAttribute('type', 'text');
  input1.setAttribute('placeholder', 'class category');
  input1.setAttribute('list', 'opt');

  const input2 = document.createElement('input');
  input2.classList.add('class-number');
  input2.setAttribute('type', 'text');
  input2.setAttribute('placeholder', 'class number');

  const input3 = document.createElement('input');
  input3.classList.add('class-credit');
  input3.setAttribute('type', 'number');
  input3.setAttribute('placeholder', 'credits');
  input3.setAttribute('min', '0');
  input3.setAttribute('max', '6');

  let newSelect = document.createElement('select');
  newSelect.classList.add('select');
  var opt1 = document.createElement('option');
  opt1.setAttribute('value', '');
  let textNode1 = document.createTextNode('');
  opt1.appendChild(textNode1);
  var opt2 = document.createElement('option');
  opt2.setAttribute('value', 'A');
  let textNode2 = document.createTextNode('A');
  opt2.appendChild(textNode2);
  var opt3 = document.createElement('option');
  opt3.setAttribute('value', 'A-');
  let textNode3 = document.createTextNode('A-');
  opt3.appendChild(textNode3);
  var opt4 = document.createElement('option');
  opt4.setAttribute('value', 'B+');
  let textNode4 = document.createTextNode('B+');
  opt4.appendChild(textNode4);
  var opt5 = document.createElement('option');
  opt5.setAttribute('value', 'B');
  let textNode5 = document.createTextNode('B');
  opt5.appendChild(textNode5);
  var opt6 = document.createElement('option');
  opt6.setAttribute('value', 'B-');
  let textNode6 = document.createTextNode('B-');
  opt6.appendChild(textNode6);
  var opt7 = document.createElement('option');
  opt7.setAttribute('value', 'C+');
  let textNode7 = document.createTextNode('C+');
  opt7.appendChild(textNode7);
  var opt8 = document.createElement('option');
  opt8.setAttribute('value', 'C');
  let textNode8 = document.createTextNode('C');
  opt8.appendChild(textNode8);
  var opt9 = document.createElement('option');
  opt9.setAttribute('value', 'C-');
  let textNode9 = document.createTextNode('C-');
  opt9.appendChild(textNode9);
  var opt10 = document.createElement('option');
  opt10.setAttribute('value', 'D+');
  let textNode10 = document.createTextNode('D+');
  opt10.appendChild(textNode10);
  var opt11 = document.createElement('option');
  opt11.setAttribute('value', 'D');
  let textNode11 = document.createTextNode('D');
  opt11.appendChild(textNode11);
  var opt12 = document.createElement('option');
  opt12.setAttribute('value', 'D-');
  let textNode12 = document.createTextNode('D-');
  opt12.appendChild(textNode12);
  var opt13 = document.createElement('option');
  opt13.setAttribute('value', 'F');
  let textNode13 = document.createTextNode('F');
  opt13.appendChild(textNode13);

  newSelect.appendChild(opt1);
  newSelect.appendChild(opt2);
  newSelect.appendChild(opt3);
  newSelect.appendChild(opt4);
  newSelect.appendChild(opt5);
  newSelect.appendChild(opt6);
  newSelect.appendChild(opt7);
  newSelect.appendChild(opt8);
  newSelect.appendChild(opt9);
  newSelect.appendChild(opt10);
  newSelect.appendChild(opt11);
  newSelect.appendChild(opt12);
  newSelect.appendChild(opt13);

  let newButton = document.createElement('button');
  newButton.classList.add('trash-button');
  let newItag = document.createElement('i');
  newItag.classList.add('fas');
  newItag.classList.add('fa-trash');
  newButton.appendChild(newItag);

  // newButton.addEventListener('click', (e) => {
  //   e.preventDefault();
  //   //另一種監聽法：animationend
  //   e.target.parentElement.parentElement.style.animation =
  //     'scaleDown 0.5s ease forwards';
  //   e.target.parentElement.parentElement.addEventListener(
  //     'animationend',
  //     (e) => {
  //       e.target.remove();
  //       setGpa();
  //     }
  //   );
  // });

  newDiv.appendChild(input1);
  newDiv.appendChild(input2);
  newDiv.appendChild(input3);
  newDiv.appendChild(newSelect);
  newDiv.appendChild(newButton);

  newForm.appendChild(newDiv);
  inputArea.appendChild(newForm);
  init();
  newForm.style.animation = 'scaleUp 0.5s ease forwards';
});
