  // элементы в DOM можно получить при помощи функции querySelector
  const fruitsList = document.querySelector('.fruits__list'); // список карточек
  const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
  const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
  const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
  const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
  const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
  const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
  const kindInput = document.querySelector('.kind__input'); // поле с названием вида
  const colorInput = document.querySelector('.color__input'); // поле с названием цвета
  const weightInput = document.querySelector('.weight__input'); // поле с весом
  const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

  // список фруктов в JSON формате
  let fruitsJSON = `[
    {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
    {"kind": "Дуриан", "color": "зеленый", "weight": 35},
    {"kind": "Личи", "color": "розово-красный", "weight": 17},
    {"kind": "Карамбола", "color": "желтый", "weight": 28},
    {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
  ]`;

  // преобразование JSON в объект JavaScript
  let fruits = JSON.parse(fruitsJSON);

  /*** ОТОБРАЖЕНИЕ ***/

  // отрисовка карточек
  const display = () => {
    fruitsList.innerHTML = ''; // Очищаем fruitsList от вложенных элементов

    fruits.forEach((fruit, index) => {
      const li = document.createElement('li'); // Создаем новый элемент <li>
      li.classList.add('fruit__item', `fruit_${fruit.color.replace('-', '').toLowerCase()}`); // Добавляем классы
      li.innerHTML = `
        <div class="fruit__info">
          <div>index: ${index}</div>
          <div>kind: ${fruit.kind}</div>
          <div>color: ${fruit.color}</div>
          <div>weight (кг): ${fruit.weight}</div>
        </div>
      `; // Добавляем информацию о фрукте внутрь <li>
      fruitsList.appendChild(li); // Добавляем <li> в конец списка fruitsList
    });
  };

  const addBorderColor = () => {
    const fruitItems = document.querySelectorAll('.fruit__item');
  
    fruitItems.forEach((item) => {
      const colorClass = Array.from(item.classList).find(cls => cls.startsWith('fruit_'));
      if (colorClass) {
        const color = colorClass.replace('fruit_', ''); // Получаем цвет из класса
        switch (color) {
          case 'фиолетовый':
            item.style.border = `2px solid #8b00ff`;
            break;
          case 'зеленый':
            item.style.border = `2px solid #84cd1b`;
            break;
          case 'розово-красный':
            item.style.border = `2px solid #dc143c`;
            break;
          case 'желтый':
            item.style.border = `2px solid #ffd800`;
            break;
          case 'светло-коричневый':
            item.style.border = `2px solid #cd853f`;
            break;
          default:
            break;
        }
      }
    });
  };
  
  // первая отрисовка карточек
  display();
  addBorderColor();

  /*** ПЕРЕМЕШИВАНИЕ ***/

  // генерация случайного числа в заданном диапазоне
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // перемешивание массива
  const shuffleFruits = () => {
    let result = [];

    while (fruits.length > 0) {
      const randomIndex = getRandomInt(0, fruits.length - 1); // Получаем случайный индекс
      const randomFruit = fruits.splice(randomIndex, 1)[0]; // Вырезаем случайный фрукт из массива
      result.push(randomFruit); // Добавляем его в результат
    }

    fruits = result; // Обновляем массив fruits
  };


  shuffleButton.addEventListener('click', () => {
    shuffleFruits();
    display();
    addBorderColor();
  });

  /*** ФИЛЬТРАЦИЯ ***/

  // фильтрация массива
  const filterFruits = () => {
    const minWeight = parseInt(document.querySelector('.minweight__input').value);
    const maxWeight = parseInt(document.querySelector('.maxweight__input').value);

    fruits = fruits.filter((fruit) => {
      return fruit.weight >= minWeight && fruit.weight <= maxWeight;
    });
  };


  filterButton.addEventListener('click', () => {
    filterFruits();
    display();
    addBorderColor();
  });


  /*** СОРТИРОВКА ***/

  let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
  let sortTime = '-'; // инициализация состояния времени сортировки

  const comparationColor = (a, b) => {
    // Приводим строки к нижнему регистру для унификации сравнения
    const colorA = a.color.toLowerCase();
    const colorB = b.color.toLowerCase();

    if (colorA < colorB) {
      return -1; // Если цвет A идет раньше цвета B в алфавитном порядке, возвращаем -1
    }
    if (colorA > colorB) {
      return 1; // Если цвет A идет позже цвета B в алфавитном порядке, возвращаем 1
    }
    return 0; // Если цвета A и B одинаковые, возвращаем 0
  };


  const sortAPI = {
    bubbleSort(arr, comparation) {
      const n = arr.length;
      let swapped;
      
      do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
          if (comparation(arr[i], arr[i + 1]) > 0) {
            // Обмен элементов
            const temp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = temp;
            swapped = true;
          }
        }
      } while (swapped);
    
      return arr;
    },
    

    quickSort(arr, comparation) {
      if (arr.length <= 1) {
        return arr;
      }
    
      const pivot = arr[0];
      const left = [];
      const right = [];
    
      for (let i = 1; i < arr.length; i++) {
        if (comparation(arr[i], pivot) < 0) {
          left.push(arr[i]);
        } else {
          right.push(arr[i]);
        }
      }
    
      return [...this.quickSort(left, comparation), pivot, ...this.quickSort(right, comparation)];
    },
    

    // выполняет сортировку и производит замер времени
    startSort(sort, arr, comparation) {
      const start = new Date().getTime();
      sort(arr, comparation);
      const end = new Date().getTime();
      sortTime = `${end - start} ms`;
    },
  };

  // инициализация полей
  sortKindLabel.textContent = sortKind;
  sortTimeLabel.textContent = sortTime;

  sortChangeButton.addEventListener('click', () => {
    sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
    sortKindLabel.textContent = sortKind;
  });


  sortActionButton.addEventListener('click', () => {
    sortTimeLabel.textContent = 'sorting...'; // Выводим сообщение о сортировке

    const sort = sortAPI[sortKind];
    sortAPI.startSort(sort, fruits, comparationColor);

    display(); // Отображаем отсортированные фрукты
    addBorderColor();
    // После отображения фруктов обновляем время сортировки
    setTimeout(() => {
      sortTimeLabel.textContent = sortTime; // Выводим время сортировки
    }, 0);
  });


  /*** ДОБАВИТЬ ФРУКТ ***/

  addActionButton.addEventListener('click', () => {
    const kind = kindInput.value.trim();
    const color = colorInput.value.trim();
    const weight = parseInt(weightInput.value.trim());

    if (kind && color && !isNaN(weight)) {
      fruits.push({ kind, color, weight });
      display();
      addBorderColor();
    } else {
      alert('Необходимо заполнить все поля для добавления нового фрукта!');
    }
  });

