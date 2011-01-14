var privateEval = (function(){
	var	unsafe		= ['eval', 'with', 'Function'],
		accessible	= ['Math', 'String', 'Number', 'parseInt', 'Array', 'RegExp'],
		underControl	= ['Identifier', 'KeyWord', 'FutureWord'],
		ignorable	= ['.', 'var'];

	function execute(code, options){
		var	expr		= new CodeExpression(code, 'JavaScript'),
			result		= [],
			allowed		= (options && options.accessible) || accessible,
			allowUnsafe	= !!(options && options.allowEval),
			l		= expr.length,
			i, type, content, prevtype, prevcontent, func;
		for (i=0; i<l; i++){
			if (expr[i].type === 'Whitespace'){
				result.push(expr[i].content);
				continue;
			}
			prevtype = type;
			prevcontent = content;
			type = expr[i].type;
			content = expr[i].content;
			if (!allowUnsafe && isIn(content, unsafe)){
				throw('Unsafe ' + content);
			}
			if (isIn(type, underControl) && !isIn(content, allowed) && !isIn(prevcontent, ignorable)){
				result.push('scope["' + content + '"]');
				continue;
			}
			result.push(content);
		}
		result = result.join('');
		func = Function('var scope = this;' + result);
		result = (options && options.context) || ({});
		func.call(result);
	}

	function isIn(needle, haystack){
		for (var i=0, l=haystack.length; i<l; i++){
			if (needle === haystack[i]){
				return true;
			}
		}
		return false;
	}

	return execute;
})();
