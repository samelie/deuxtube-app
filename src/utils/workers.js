const Workers = (() => {
  function create(string) {
    var blob = URL.createObjectURL(
      new Blob([string], {
      type: 'application/javascript'
    }));

    var worker = new Worker(blob);
    return worker;
  }
  return {
    create
  };
})();

export default Workers
