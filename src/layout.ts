type ID = number

interface Node {
  getId(): string

  addWindow(window: Window): Node
  removeWindow(window: Window): Node | undefined
}

class Window implements Node {
  id: ID

  constructor(id: ID) {
    this.id = id
  }

  getId(): string {
    return `${this.id}`
  }

  addWindow(window: Window): Node {
    return new Group(this, window)
  }

  removeWindow(window: Window): Node | undefined {
    if (this.id === window.id) {
      return undefined
    }

    return this
  }
}

class Group implements Node {
  private left: Node
  private right?: Node

  constructor(left: Node, right?: Node) {
    this.left = left
    this.right = right
  }

  getId(): string {
    if (!this.right) {
      return `(${this.left.getId()})`
    }
    return `(${this.left.getId()},${this.right.getId()})`
  }

  addWindow(window: Window): Node {
    if (!this.right) {
      return new Group(this.left, window)
    }

    return new Group(this.left, this.right.addWindow(window))
  }

  removeWindow(window: Window): Node | undefined {
    const newLeft = this.left.removeWindow(window)
    const newRight = this.right && this.right.removeWindow(window)

    if (!newLeft && !newRight) {
      return undefined
    }

    if (newLeft && newRight) {
      return new Group(newLeft, newRight)
    }

    return newLeft ? newLeft : newRight
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
      return this
    }

    return new Root(this.child.removeWindow(window))
  }

  getId(): string {
    if (!this.child) {
      return "Empty"
    } else {
      return `<${this.child.getId()}>`
    }
  }
}

//type Group = EmptyGroup | MonocleGroup | Group

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
