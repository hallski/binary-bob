type ID = number

interface Node {
  addWindow(window: Window): Node
  removeWindow(window: Window): Node | undefined

  debugName(): string
}

class Window implements Node {
  id: ID

  constructor(id: ID) {
    this.id = id
  }

  addWindow(window: Window): Node {
    return new BinaryGroup(this, window)
  }

  removeWindow(window: Window): Node | undefined {
    if (this.id === window.id) {
      return undefined
    }

    return this
  }

  debugName(): string {
    return `${this.id}`
  }
}

class BinaryGroup implements Node {
  private left: Node
  private right?: Node

  constructor(left: Node, right?: Node) {
    this.left = left
    this.right = right
  }

  addWindow(window: Window): Node {
    if (!this.right) {
      return new BinaryGroup(this.left, window)
    }

    return new BinaryGroup(this.left, this.right.addWindow(window))
  }

  removeWindow(window: Window): Node | undefined {
    if (this.left instanceof Window && this.left.id === window.id) {
      return this.right
    }

    if (this.right instanceof Window && this.right.id === window.id) {
      return this.left
    }

    const newLeft = this.left && this.left.removeWindow(window)
    const newRight = this.right && this.right.removeWindow(window)

    if (!newLeft && !newRight) {
      return undefined
    }

    if (newLeft && newRight) {
      return new BinaryGroup(newLeft, newRight)
    }

    return newLeft ? newLeft : newRight
  }

  debugName(): string {
    if (!this.left) {
      return "Empty"
    }
    if (!this.right) {
      return `(${this.left.debugName()})`
    }
    return `(${this.left.debugName()},${this.right.debugName()})`
  }
}

class Root {
  private child?: Node

  constructor(child?: Node) {
    this.child = child
  }

  addWindow(window: Window): Root {
    if (this.child) {
      return new Root(this.child.addWindow(window))
    }

    return new Root(window)
  }

  removeWindow(window: Window): Root {
    if (!this.child) {
      return new Root()
    }

    return new Root(this.child.removeWindow(window))
  }

  debugName(): string {
    if (!this.child) {
      return "Empty"
    } else {
      return `<${this.child.debugName()}>`
    }
  }
}

//type Group = EmptyGroup | MonocleGroup | BinaryGroup

interface Layout {
  root: Root
}

export function create(): Layout {
  return { root: new Root() }
}

export function addWindow(layout: Layout, id: ID): Layout {
  return {
    ...layout,
    root: layout.root.addWindow(new Window(id))
  }
}

export function removeWindow(layout: Layout, windowID: ID): Layout {
  return {
    ...layout,
    root: layout.root.removeWindow(new Window(windowID))
  }
}
