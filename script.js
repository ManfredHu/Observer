
// ------这个事件对象的整体框架------
// EventTarget {事件对象
// 		-- > handlers {事件处理对象
// 			-- > message: [message类型事件队列
// 				handleMessage事件处理函数
// 			]
// 		}
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

//举个栗子
function handleMessage(event) {
	alert("Message received:" + event.message);
}

//创建一个事件对象
var target = new EventTarget();

//添加一个message类型的事件handleMessage
target.addHandler("message", handleMessage);

//触发事件，参数为一个event对象，里面需要有一个event.type属性
target.fire({type:"message", message:"My name is manfredHu"});

//删除事件处理程序
target.removeHandler("message", handleMessage);

//再次出发事件，因为已经删除了没有这个事件，不会执行，也就不会弹框
target.fire({type:"message", message:"My name is manfredHu"});

