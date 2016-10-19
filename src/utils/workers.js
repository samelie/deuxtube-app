const Workers = (() => {
  function create(_function) {
    var blob = URL.createObjectURL(
      new Blob([_function.toString()], {
      type: 'application/javascript'
    }));

    var worker = new Worker(blob);
    //URL.revokeObjectURL(blob);
    return worker;
  }
  return {
    create
  };
})();

export default Workers
