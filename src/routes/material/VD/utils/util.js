export function sort(list, column, order) {
  if (order === 'descend') {
    list.sort((a, b) => {
      if (column in a && column in b) {
        return b[column] - a[column];
      }
      if (column in a) {
          return -1
      }
      return 1;
    });
  } else if (order === 'ascend') {
    list.sort((a, b) => {
      if (column in a && column in b) {
        return a[column] - b[column];
      }
      if (column in b) {
          return -1
      }
      return 1;
    });
  }
}
