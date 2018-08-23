const getTreeForElement = (elementNode, scannables) => {
  const children = Array.from(elementNode.children) || [];
  let scannableChildren = [];
  if (children && children.length) {
    const indexes = [];
    scannableChildren = scannables.filter(({ node }, i) => {
      const index = children.indexOf(node);
      if (index >= 0) {
        indexes.push(i);
        return true;
      }
      return false;
    });

    const newScannables = scannables.filter((e, i) => indexes.indexOf(i) < 0);

    scannableChildren.forEach(sc => {
      if (sc.node.children && sc.node.children.length) {
        sc.children = getTreeForElement(sc.node, newScannables);
      }
    });
  }

  const tree = scannableChildren.reduce((prev, sc, i) => {
    const treeId = `${i}_${sc.element.scannableId}`;
    prev[treeId] = { ...sc, treeId };
    return prev;
  }, {});

  return tree;
};

export default getTreeForElement;
