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
}
