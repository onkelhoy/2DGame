export default class Node {
  constructor (value) {
    this.value = value
    this.right = null
  }

  compareTo (node) {
    return this.value - node.value
  }
}