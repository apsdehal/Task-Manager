(function () {


window.App = {
	Models: {},
	Collections: {},
	Views: {}
};

window.template = function(id){
	return _.template( $('#'+id).html() );
};

App.Models.Task = Backbone.Model.extend({

	validate: function(attrs){
		if(! $.trim(attrs.title) ){
			return "A task requires a valid title";
		}
	},
});

App.Collections.Tasks = Backbone.Collection.extend({
	model: App.Models.Task
});

App.Views.Tasks = Backbone.View.extend({
	tagName: 'ul',

	initialize: function(){
		this.collection.on('add',this.addOne,this)
	},

	render: function(){
		this.collection.each(this.addOne, this);
		return this;
	},

	addOne: function ( task ){
		var taskView = new App.Views.Task({ model:task });

		this.$el.append(taskView.render().el);
	}
});


App.Views.Task = Backbone.View.extend({
	tagName: 'li',

	template: template("taskTemplate"),

	initialize: function(){
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
	},

	events: {
		"click .edit" : "editTask",
		"click .delete": "destroy",
	},

	editTask : function(){
		var newTaskTitle = prompt("What would like to change the title to?",
			this.model.get('title'));

		if(! newTaskTitle ) return ;
		this.model.set('title', newTaskTitle);
	},

	render: function(){
		var template = this.template( this.model.toJSON() );
		this.$el.html( template );
		return this;
	},

	destroy: function(){

		this.model.destroy();

	},

	remove:  function(){
		this.$el.remove();
	}
});

App.Views.AddTask = Backbone.View.extend({
	el: "#addTask",
	initialize: function(){
	},
	events:{
		'submit': 'submit',
	},
	submit: function(e){
		e.preventDefault();
		var newTaskTitle = $(e.currentTarget).find("input[type=text]").val();
		var task = new App.Models.Task( { title: newTaskTitle} );
		$(e.currentTarget).find("input[type=text]").val('');
		this.collection.add(task);

	}

})

var task = new App.Collections.Tasks([
{
	title: 'Go to the store',
	priority: 4
},
{
	title: 'Go to the mall',
	priority: 3
},
{
	title: 'Get to work',
	priority: 5
}]);

var addTaskView = new App.Views.AddTask({collection:task});

var tasksViews = new App.Views.Tasks({ collection:task});

$(".tasks").html(tasksViews.render().el);

})();