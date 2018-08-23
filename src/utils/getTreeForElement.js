const getScannableChildrenOfElement = (element, scannables) => {
  const scannableNodes = scannables.map(({ node }) => node);
  const elementChildren = Array.from(element.children || []);
  let scannableChildren = [];

  if (elementChildren.length) {
    elementChildren.forEach(child => {
      const index = scannableNodes.indexOf(child);
      if (index >= 0) {
        const scannableChild = scannables[index];
        scannableChildren.push(scannableChild);
      } else if (child.children && child.children.length) {
        scannableChildren = scannableChildren.concat(
          getScannableChildrenOfElement(child, scannables)
        );
      }
    });
  }

  return scannableChildren;
};

const getTreeForElement = (elementNode, scannables) => {
  const scannableChildren = getScannableChildrenOfElement(elementNode, scannables);

  const newScannables = scannables.filter(e => scannableChildren.indexOf(e) < 0);
  scannableChildren.forEach(sc => {
    if (sc.node.children && sc.node.children.length) {
      sc.children = getTreeForElement(sc.node, newScannables);
    }
  });

  const tree = scannableChildren.reduce((prev, sc, i) => {
    const treeId = `${i}_${sc.element.scannableId}`;
    prev[treeId] = { ...sc, treeId };

    if (sc.children && Object.keys(sc.children).length === 0) {
      delete prev[treeId].children;
    }

    return prev;
  }, {});

  return tree;
};

export default getTreeForElement;
