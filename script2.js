// ------这个事件对象的整体框架------
// person {
// 	继承了EventTarget的对象
// 	-- > handlers {
// 		事件处理对象
// 		-- > message: [message类型事件队列
// 				handleMessage事件处理函数
// 			]
// 	}
// 	-- > say
// }

/*
 *定义一个事件对象，其下的handlers为多个类型的事件队列对象
 */
function EventTarget() {
	this.handlers = {};
}

/*重写EventTarget的原型*/
EventTarget.prototype = {
	constructor: EventTarget, //维护contructor属性

	/*添加事件的函数*/
	addHandler: function(type, handler) {
		/*如果没有这个类型的事件队列则创建一个*/
		if (typeof this.handlers[type] == "undefined") {
			this.handlers[type] = [];
		}
		/*添加事件到对应类型的事件队列里面*/
		this.handlers[type].push(handler);
	},

	/*执行函数*/
	fire: function(event) {
		if (!event.target) {
			event.target = this;
		}
		/*当handlers对象下面已经建立起对应类型的队列的时候*/
		if (this.handlers[event.type] instanceof Array) {
			var handlers = this.handlers[event.type];
			/*执行所有已经添加到事件队列的函数*/
			for (var i = 0, len = handlers.length; i < len; i++) {
				handlers[i](event);
			}
		}
	},

	/*删除事件的函数*/
	removeHandler: function(type, handler) {
		if (this.handlers[type] instanceof Array) {
			var handlers = this.handlers[type];
			for (var i = 0, len = handlers.length; i < len; i++) {
				if (handlers[i] === handler) {
					break;
				}
			}
			//删除第i个元素起的后面的1项
			handlers.splice(i, 1);
		}
	}
};

//-------------------------------------------------------------------------------------
//用寄生组合继承创建的Person，寄生组合继承是完美的继承模式
//-------------------------------------------------------------------------------------
function Person(name, age) {
	EventTarget.call(this);
	this.name = name;
	this.age = age;
}

inheritPrototype(Person, EventTarget);

Person.prototype.say = function(message) {
	//this通常会指向new出来的Person实例
	//fire方法是继承自EventTarget的
	this.fire({
		type: "message",
		message: message
	});
};

//事件处理函数
function handleMessage(event) {
	//event.target在前面一个例子没有用到，但是在Person继承了EventTarget的时候就用到了
	//这里的event.target指向Person
	alert(event.target.name + " says：" + event.message);
}

var person = new Person("manfredHu", 21);

//向对象person中添加事件处理函数handlerMessage
person.addHandler("message", handleMessage);

//调用对象的方法执行事件处理程序
person.say("Say Hello");



//-------------------------------------------------------------------------------------
//用寄生组合继承用到的方法
//-------------------------------------------------------------------------------------

//创建一个继承了o的函数
function object(o) {
	//一个内部函数，原型继承自o
	function F() {}
	F.prototype = o;
	//返回一个构造函数继承自o的内部函数F的实例
	return new F();
}

//函数的作用是使subType继承superType
function inheritPrototype(subType, superType) {
	//创建一个继承了superType.prototype的函数，prototype会是一个继承superType的在object内部定义的函数
	var prototype = object(superType.prototype);
	//维护constructor属性
	prototype.constructor = subType;
	//修改subType的原型，则subType的原型是prototype局部变量，而prototype是一个继承自superType.prototype的函数
	subType.prototype = prototype;
}