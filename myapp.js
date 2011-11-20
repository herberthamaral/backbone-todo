window.Todo = Backbone.Model.extend({
    defaults:{
        todo:'',
        is_done: false 
    }
});

window.Todos = Backbone.Collection.extend({
    model: window.Todo,
    url: '/albums',
    localStorage: new Store("Todos"),
    remainingItems: function(){
        return this.filter(function(item){ 
            if (!item.get('is_done'))
                return item;
        });
    }
});

window.EnterTodoView = Backbone.View.extend({
    events:{
        'keypress #todo-text': 'keypress'
    },
    initialize: function(){
        _.bindAll(this, 'render');
    },
    render:function(){
        var renderedContent = _.template($('#todo-enter-view').html());    
        $(this.el).html(renderedContent);
        return this;
    },
    keypress: function(ev){
        el = $(this.el).find('#todo-text');
        if (ev.originalEvent.keyCode==13){
            var todo = new Todo({todo:el.val()});
            window.todos.add(todo);
            todo.save();
            var todoView = new TodoView({model:todo});
            $('#container ul').append(todoView.render().el);
            $(el).val('').blur();
        }
    }
});

window.TodoView = Backbone.View.extend({
    events:{
        'change .done_status': 'change_done_status'
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
    change_done_status:function(){
        this.model.set({is_done:!this.model.get('is_done')});
    }
});

window.RemainingItemsView = Backbone.View.extend({
    initialize: function(){
        _.bindAll(this, 'render');
        window.todos.bind('change', this.render);
        window.todos.bind('add', this.render);
        this.template = _.template($('#remaining-items-view').html());
    },
    render:function(){
        var remaining = window.todos.remainingItems().length;
        var renderedContent = this.template({remaining: remaining});
        $(this.el).html(renderedContent);
        return this;
    }
});

window.NotificationView = Backbone.View.extend({
    initialize: function(){
        _.bindAll(this, 'render');
        window.todos.bind('add', this.render);
        this.template = _.template($('#alert-view').html());
    },
    render:function(){
        content = this.template({});
        $(this.el).html(content);
        setTimeout( function(){ 
            $('body').find('.alert-message').parent().remove();  
        }, 2000);
        return this;
    }
});

start = function(){
    window.todos = new Todos();
    window.entertodoview = new EnterTodoView();
    window.remainingItemsView = new RemainingItemsView();
    todos.bind('add',function(){
        notificationView = new NotificationView();
        $('body').prepend(notificationView.render().el);
    });
    $('#container').prepend(entertodoview.render().el);
    $('#counter').append(remainingItemsView.render().el);
}
