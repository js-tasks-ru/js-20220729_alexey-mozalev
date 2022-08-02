/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const sortedArr = [...arr];

  const strQuickSort = (arr, left = 0, right = arr.length) => {
    if (left >= right) {
      return;
    }

    const pivotInd = findPivotInd(arr, param, left, right);
    strQuickSort(arr, left, pivotInd);
    strQuickSort(arr, pivotInd + 1, right);
  };
  strQuickSort(sortedArr);

  return sortedArr;
}

const strComparisonFn = (str1, str2, sortOrder) => {
  return str1.localeCompare(str2, ['ru', 'en'],
    {caseFirst: sortOrder === 'asc' ? 'upper' : 'lower'}) === (sortOrder === 'asc' ? -1 : 1);
};

const findPivotInd = (arr, sortOrder, left, right) => {
  let swapInd = left;
  // let pivotInd = left;
  let pivotInd = Math.floor(Math.random() * (right - left) + left);
  [arr[pivotInd], arr[left]] = [arr[left], arr[pivotInd]];
  pivotInd = left;
  let pivot = arr[pivotInd];

  for (let i = left + 1; i < right; i++) {
    if (strComparisonFn(arr[i], pivot, sortOrder)) {
      swapInd++;
      [arr[i], arr[swapInd]] = [arr[swapInd], arr[i]];
    }
  }
  if (swapInd !== pivotInd) {
    [arr[pivotInd], arr[swapInd]] = [arr[swapInd], arr[pivotInd]];
  }

  return swapInd;
};

