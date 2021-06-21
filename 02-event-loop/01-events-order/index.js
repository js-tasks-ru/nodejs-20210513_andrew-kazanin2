/**
 * 2 корневых равнозначных блоков кода, они имеют одинаковый приоритет,
 * по этому выполнятся по очереди
 *
 * 1 - console.log('James');
 *
 * При объявлении promise, до resolve, код выполнится как синхронный
 * 2 - console.log('Richard');
 * В низу setTimeout спрятался еще синхронный "John"
 * 3 - console.log('John');
 *
 * Дальше пошло выполнение promise и смотрим порядок в его scope
 * Хоть оба вывода и асинхронные, promise имеет преимущество перед setTimeout, по этому
 * 4 - promise resolve 'Robert'
 * Остался 'Michael'
 * 5 - console.log('Michael');
* */

// P.S. А вот, что 'James' по интервалу сработает еще раз, вот это я уже не учел

const intervalId = setInterval(() => {
  // 1
  console.log('James');
}, 10);

setTimeout(() => {
  const promise = new Promise((resolve) => {
    // 2
    console.log('Richard');
    resolve('Robert');
  });

  promise
      .then((value) => {
        // 4
        console.log(value);

        setTimeout(() => {
          // 5
          console.log('Michael');

          clearInterval(intervalId);
        }, 10);
      });

  // 3
  console.log('John');
}, 10);
