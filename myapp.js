//ToDO list
// Lista de Todos
// Todo
//
$(document).ready(function(){
    window.Todo = Backbone.Model.extend({
        defaults:{
            todo:'',
            visible_status:'visible',
            is_done: false
        }
    });

    window.TodoView = Backbone.View.extend({
        events:{
            'click .remove': 'remove',
            'change checkbox': 'check_done'
        },

        initialize: function(){
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);
            this.template = _.template($('#todo-view').html());
        },
        render: function(){
            var renderedContent = this.template(this.model.toJSON());
            $(this.el).html(renderedContent);
            return this;
        },
        remove:function(){
            this.model.set({visible_status:'hidden'});
        },
        check_done:function(){
            $(this.el).find('checkbox').is('checked');
        }
    });

    window.todo = new Todo({todo: 'Ir ao banco'});
    window.todoView = new TodoView({model: todo});
    $('#container').html(todoView.render().el);

});

