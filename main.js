class Task {
	constructor(name, details) {
		this.name = name;
		this.details = details;
		this.time = Date.now();
		this.status = 0;
	}
}

class TodoApp extends React.Component {
	constructor (props) {
		super (props);
		this.state = {
			tasks: []
		}
    this.addTask = this.addTask.bind(this);
	this.deleteTask = this.deleteTask.bind(this);
	}
  
  addTask(name, details) {
		let taskToAdd = new Task(name, details)
		this.setState(state => state.tasks.push(taskToAdd))
	}
	
	deleteTask(id) {
		this.setState(state => state.tasks.filter(task => task.time != id));
	}
	
	render () {
		return (
			<div>
				<TaskCreator tasks={this.state.tasks} adder={this.addTask}/>
				<TasksView tasks={this.state.tasks} deleter={this.deleteTask}/>
			</div>
		);
	}
}

class TaskCreator extends React.Component {
	constructor (props) {
		super (props);
		this.state = {
			name: "",
			details: ""
		}
		this.inputHandler = this.inputHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
	}
	
	inputHandler(event) {
		this.setState({name: event.target.value});
	}
	
	submitHandler() {
		console.log("added")
		this.props.adder(this.state.name, "placeholder detail");
	}
  
	render() {
		return (
			<div class="input-group">
				<input type="text" id="taskName" class="form-control" placeholder="New Task" onChange={this.inputHandler}></input>
				<button type="button" class="btn btn-outline-secondary" onClick={this.submitHandler}>Submit</button>
			</div>
		);
	}
}

class TasksView extends React.Component {
	constructor (props) {
		super (props);
		this.deleteHandler = this.deleteHandler.bind(this);
	}
	
	deleteHandler(event) {
		this.props.adder(event.target.id);
	}
	
	render () {
		var taskCards = this.props.tasks.map(task => {
			return(<div class="taskCard" id={task.time}>
				<h1>{task.name}</h1>
				<p>{task.details}</p>
				<button type="button" class="btn btn-success">Completed</button>
				<button type="button" class="btn btn-primary">More details</button>
				<button type="button" class="btn btn-danger" onClick={this.deleteHandler}>Delete</button>
			</div>)
		});
		console.log(this.props.tasks);
		return (<div>{taskCards}</div>);
	}
}

ReactDOM.render(<TodoApp />, document.getElementById("container"));
