async function fetchData(flag = true) {
  return await new Promise((resolve, reject) => {
    if (flag) setTimeout(() => resolve('success'), 100);
    else setTimeout(() => reject('fail'), 100);
  });
}

test('the data is success', () => {
  return fetchData().then((data) => {
    expect(data).toBe('success');
  });
});

test('the fetchData fails with an error', async () => {
  expect.assertions(1); // 비동기가 몇번 호출되었냐는 것
  try {
    await fetchData(false);
  } catch (e) {
    expect(e).toMatch('fail');
  }
});

// about expoect.assertions
// 비동기 함수의 테스트에서 assertions가 몇번 호출되었는가?이다. toEqual 같은 matchers가 promise 내에서 몇번 호출되었나를 나타낸다.
test('learn aboud assertion', async () => {
  expect.assertions(3);

  const data = await fetchData();
  expect(data).toEqual('success');

  await fetchData(false)
    .then((data) => expect(data).toEqual('success'))
    .catch((data) => {
      expect(data).toBe('fail');
      expect(data).toEqual('fail');
    });
});

async function fetchDataWithCallback(f, flag = true) {
  new Promise((resolve, reject) => {
    if (flag) setTimeout(() => resolve('success'), 100);
    else setTimeout(() => reject('fail'), 100);
  })
    .then((data) => f(null, data))
    .catch((err) => f(null, err));
}

// done이라는 인자를 통한 fetchData에 콜백함수가 있는 경우에 대한 테스트
// done을 인자로 사용하는 콜백함수가 test에 담기면, done을 직접 호출하기 전에는 jest가 테스트를 완료시키지 않는다.
test('the fetchDataWithCallback fails with an error', (done) => {
  function callback(error, data) {
    if (error) {
      done(error);
      return;
    }
    // 여기서 try catch 없이 expect 문 뒤에 done()을 실행시키면, done이 실행되지 않는다. -> expect는 throw error을 하기 때문
    // 때문에, 제한 시간까지 기다려야 한다. 하지만 try, catch를 적용하면 try문의 expect가 인자로 들어온 값을 catch로 던짐으로 인해서
    // catch에서 받고, done이 catch문의 인자인 error와 함께 실행된다. jest의 test가 정상작동하여, 오류를 받을 수 있는 것이다.
    try {
      // expect(data).toBe('success');  // 이를 확인하려면 해당 코드를 실행해야한다.
      expect(data).toBe('fail');
      done();
    } catch (error) {
      done(error);
    }
  }

  fetchDataWithCallback(callback, false);
});

// resolves, rejects를 통한 테스트코드
test('the data is success', () => {
  expect.assertions(1);
  return expect(fetchData()).resolves.toBe('success');
});

test('the fetchData fails with an error', () => {
  expect.assertions(1);
  return expect(fetchData(false)).rejects.toBe('fail');
});
