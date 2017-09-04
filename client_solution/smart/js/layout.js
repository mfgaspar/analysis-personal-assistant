function createQueryNode(query) {
	var node = document.createElement('div');
	node.className = "clearfix left-align left card-panel green accent-1";
	node.innerHTML = query;
	resultDiv.appendChild(node);
}

function createResponseNode() {
	var node = document.createElement('div');
	node.className = "clearfix right-align right card-panel blue-text text-darken-2 hoverable";
	node.innerHTML = "...";
	resultDiv.appendChild(node);
	return node;
}

function setResponseOnNode(response, node) {
	node.innerHTML = response ? response : "[empty response]";
	node.setAttribute('data-actual-response', response);
}