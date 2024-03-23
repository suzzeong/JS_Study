// // createHooks : useState와 useMemo 훅을 생성, 상태 및 메모이제이션 값을 관리
// export function createHooks(callback) {
//   let index = 0;
//   let states = {};

//   // setState 함수: 상태를 업데이트하고, 콜백 함수를 실행하여 컴포넌트를 다시 렌더링
//   const setState = (idx, newState) => {
//     const currentState = states[idx];

//     // 현재 상태와 새로운 상태가 다를 경우에만 상태 업데이트 및 콜백 함수 실행
//     if (currentState !== newState) {
//       states[idx] = newState;
//       callback();
//     }
//   };

//   // useState 함수: 컴포넌트의 상태를 관리하는 훅
//   const useState = (initialState) => {
//     // 상태의 고유 식별자인 idx 생성
//     const idx = index++;

//     // 해당 id로 상태를 조회하고, 없으면 초기 상태로 설정
//     if (!states[idx]) {
//       states[idx] = initialState;
//     }

//     // [현재 상태, setState 함수] 배열 반환
//     return [states[idx], (newState) => setState(idx, newState)];
//   };

//   // useMemo 함수: 결과 값을 메모이제이션하고, 의존성 배열(deps)이 변경될 때에만 값을 계산
//   const useMemo = (fn, deps) => {
//     // 메모이제이션 값의 고유 식별자인 idx 생성
//     const idx = index++;

//     // isEqual 함수: 두 값이 얕은 동등성을 가지는지 확인
//     const isEqual = (value1, value2) => {
//       return JSON.stringify(value1) === JSON.stringify(value2);
//     };

//     // 해당 id로 메모이제이션 값을 조회하고, 없으면 초기 값을 계산하여 설정
//     if (states[idx]) {
//       const [value, prevDeps] = states[idx];

//       // 이전 의존성 배열과 현재 의존성 배열을 비교하여 변경 여부 확인
//       if (isEqual(prevDeps, deps)) {
//         return value;
//       }
//     }

//     // 초기 값을 계산하고 메모이제이션 값 설정
//     const value = fn();
//     states[idx] = [value, deps];

//     return value;
//   };

//   // resetContext 함수: useState와 useMemo의 인덱스를 초기화
//   const resetContext = () => {
//     index = 0;
//   };

//   return { useState, useMemo, resetContext };
// }

// good code
export function createHooks(callback) {
  const stateContext = {
    current: 0,
    states: [],
  };

  const memoContext = {
    current: 0,
    memos: [],
  };

  function resetContext() {
    stateContext.current = 0;
    memoContext.current = 0;
  }

  const useState = (initState) => {
    const { current, states } = stateContext;
    stateContext.current += 1;

    states[current] = states[current] ?? initState;

    const setState = (newState) => {
      if (newState === states[current]) return;
      states[current] = newState;
      callback();
    };

    return [states[current], setState];
  };

  const useMemo = (fn, refs) => {
    const { current, memos } = memoContext;
    memoContext.current += 1;

    const memo = memos[current];

    const resetAndReturn = () => {
      const value = fn();
      memos[current] = {
        value,
        refs,
      };
      return value;
    };

    if (!memo) {
      return resetAndReturn();
    }

    if (refs.length > 0 && memo.refs.find((v, k) => v !== refs[k])) {
      return resetAndReturn();
    }
    return memo.value;
  };

  return { useState, useMemo, resetContext };
}
