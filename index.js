function createNode(value) {
	return {
		value,
		left: null,
		right: null,
	};
}

class Tree {
	constructor(arr) {
		this.root = null;
		this.buildTree(arr);
	}
	buildTree(arr) {
		const processedArr = [...new Set(arr)].sort((a, b) => a - b);
		const root = helper(processedArr, 0, processedArr.length - 1);
		this.root = root;
		function helper(arr, start, end) {
			if (start > end) return null;
			let mid = Math.floor((start + end) / 2);

			const rootNode = createNode(arr[mid]);
			rootNode.left = helper(arr, start, mid - 1);
			rootNode.right = helper(arr, mid + 1, end);

			return rootNode;
		}
	}
	insert(value) {
		helper(this.root, value);

		function helper(root, value) {
			if (root == null) {
				return createNode(value);
			} else {
				if (root.value === value) {
					return root;
				} else if (root.value < value) {
					root.right = helper(root.right, value);
				} else {
					root.left = helper(root.left, value);
				}
			}
			return root;
		}
	}
	deleteItem(root = this.root, value) {
		// continue here
		if (root == null) return root;
		if (value < root.value) {
			root.left = this.deleteItem(root.left, value);
		} else if (value > root.value) {
			root.right = this.deleteItem(root.right, value);
		} else {
			if (root.left == null && root.right == null) {
				// case 0 - no children
				return null;
			} else if (root.left == null) {
				// case 1 - only one child
				return root.right;
			} else if (root.right == null) {
				return root.left;
			} else {
				// case 3 - having 2 children
				// the idea is to reduce the problem to one of the aforementioned cases
				const temp = this.findMin(root.right);
				root.value = temp.value;
				root.right = this.deleteItem(root.right, temp.value);
			}
		}
		return root;
	}
	find(root = this.root, value) {
		if (root == null) return null;
		if (value < root.value) {
			return this.find(root.left, value);
		} else if (value > root.value) {
			return this.find(root.right, value);
		} else {
			return root;
		}
	}
	levelOrderIterative(cb = null) {
		const queue = [this.root];
		const values = [];
		while (queue.length) {
			const node = queue.shift();
			if (node.left) {
				queue.push(node.left);
			}
			if (node.right) {
				queue.push(node.right);
			}
			if (cb) {
				cb(node);
			} else {
				values.push(node.value);
			}
		}
		if (!cb) return values;
	}
	levelOrderRecursive(cb = null) {
		const values = [];
		const bintree = this.generateBintreeArr(this.root);
		helper(bintree, cb);
		if (!cb) {
			return values;
		}
		function helper(bintree, cb, i = 0) {
			if (i == bintree.length) return null;
			values.push(bintree[i].value);
			if (cb) {
				cb(bintree[i]);
			}
			return helper(bintree, cb, i + 1, values);
		}
	}
	inOrder(cb = null) {
		const values = [];
		helper.bind(this)(cb);
		if (!cb) {
			return values;
		}
		function helper(cb, root = this.root) {
			if (root == null) return null;
			helper(cb, root.left);
			if (cb) {
				cb(root);
			} else {
				values.push(root.value);
			}
			helper(cb, root.right);
		}
	}
	preOrder(cb = null) {
		const values = [];
		helper.bind(this)(cb);
		if (!cb) {
			return values;
		}
		function helper(cb, root = this.root) {
			if (root == null) return null;
			if (cb) {
				cb(root);
			} else {
				values.push(root.value);
			}
			helper(cb, root.left);
			helper(cb, root.right);
		}
	}
	postOrder(cb = null) {
		const values = [];
		helper.bind(this)(cb);
		if (!cb) {
			return values;
		}
		function helper(cb, root = this.root) {
			if (root == null) return null;
			helper(cb, root.left);
			helper(cb, root.right);
			if (cb) {
				cb(root);
			} else {
				values.push(root.value);
			}
		}
	}
	height(node = this.root) {
		if (node == null) return 0;
		return Math.max(this.height(node.left), this.height(node.right)) + 1;
	}
	depth(node) {
		return helper.bind(this)(node);
		function helper(node, root = this.root) {
			if (node.value < root.value) {
				return helper(node, root.left) + 1;
			} else if (node.value > root.value) {
				return helper(node, root.right) + 1;
			} else {
				return 0;
			}
		}
	}
	isBalanced() {
		const leftSubtreeHeight = this.height(this.root.left);
		const rightSubtreeHeight = this.height(this.root.right);
		return Math.abs(leftSubtreeHeight - rightSubtreeHeight) <= 1;
	}
	rebalance() {
		const binTreeArr = this.generateBintreeArr(this.root);
		this.buildTree(binTreeArr.map((node) => node.value));
	}
	generateBintreeArr(root) {
		if (root === null) return [];

		return [root, ...this.generateBintreeArr(root.left), ...this.generateBintreeArr(root.right)];
	}
	findMin(root) {
		let current = root;
		while (current?.left) {
			current = current?.left;
		}
		return current;
	}
	prettyPrint(node, prefix = "", isLeft = true) {
		if (node === null) {
			return;
		}
		if (node.right !== null) {
			this.prettyPrint(node.right, `${prefix}${isLeft ? "|  " : "   "}`, false);
		}
		console.log(`${prefix}${isLeft ? "└──" : "┌──"}${node.value}`);
		if (node.left !== null) {
			this.prettyPrint(node.left, `${prefix}${isLeft ? "   " : "|  "}`, true);
		}
	}
}

driver();

function driver() {
	const tree = new Tree(randomArr(50));
	console.log(`isBalanced: ${tree.isBalanced()}`);
	console.log(`
	
	Level Order: ${tree.levelOrderIterative()}
	----------------------------------------------
	preOrder: ${tree.preOrder()}
	----------------------------------------------
	inOrder: ${tree.inOrder()}
	----------------------------------------------
	postOrder: ${tree.postOrder()}
	
	`);
	for (let i = 0; i < 200; i++) {
		tree.insert(Math.floor(Math.random() * 200));
	}
	console.log(`isBalanced before rebalance: ${tree.isBalanced()}`);
	tree.rebalance();
	console.log(`isBalance after rebalance: ${tree.isBalanced()}`);
	console.log(`
	
	Level Order: ${tree.levelOrderIterative()}
	----------------------------------------------
	preOrder: ${tree.preOrder()}
	----------------------------------------------
	inOrder: ${tree.inOrder()}
	----------------------------------------------
	postOrder: ${tree.postOrder()}
	
	`);
}

function randomArr(length) {
	return Array.from({ length }, (v, k) => Math.floor(Math.random() * length));
}
