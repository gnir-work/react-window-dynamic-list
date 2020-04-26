/**
 * A very simple cache object which allows us to quickly clear all cached values.
 */
export default class Cache {
  constructor(initialValues) {
    this.values = { ...initialValues };
  }

  clearCache() {
    this.values = {};
  }

  getSize(id, width) {
    // If there are no measurement available, give up and return zero height
    if (!this.values[id] || !this.values[id].length) {
      return 0;
    }

    // Get height for given width
    return this.values[id].reduce(
      (value, breakpoint) =>
        breakpoint.width <= width ? breakpoint.height : value,
      this.values[id].slice(-1)[0].height
    );
  }
}
