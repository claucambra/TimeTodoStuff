class Task {
	constructor(name, details) {
		this.name = name;
		this.details = details;
		this.id = Date.now();
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
		this.completeTask = this.completeTask.bind(this);
	}

  addTask(name, details) {
		let taskToAdd = new Task(name, details)
		this.setState(state => state.tasks.push(taskToAdd))
	}

	deleteTask(id) {
		this.setState(state => state.tasks = state.tasks.filter(task => task.id != id));
	}

	completeTask(id) {
		let taskToComplete = state.tasks.find(task => task.id == id);
		console.log(taskToComplete);
		this.setState(state => state.tasks.taskToComplete.state = 100);
		console.log(this.state.tasks.taskToComplete);
	}

	render () {
		return (
			<div>
				<TaskCreator tasks={this.state.tasks} adder={this.addTask}/>
				<TasksView tasks={this.state.tasks} completer={this.completeTask} deleter={this.deleteTask}/>
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
		this.props.adder(this.state.name, this.state.details);
		this.setState(state => {
			state.name = "";
			state.details = "";
		});
	}

	render() {
		return (
			<div className="input-group">
				<input type="text" id="taskName" className="form-control" placeholder="New Task" onChange={this.inputHandler} value={this.state.name}></input>
				<button type="button" className="btn btn-outline-secondary" onClick={this.submitHandler}>Submit</button>
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
		this.props.deleter(event.target.parentElement.id);
	}

	completeHandler(event) {
		this.props.completer(event.target.parentElement.id);
	}

	render () {
		var taskCards = this.props.tasks.map(task => {
			return(<div className="taskCard" id={task.id}>
				<h1>{task.name}</h1>
				<p>{task.details}</p>
				<button type="button" className="btn btn-success">Completed</button>
				<button type="button" className="btn btn-primary">More details</button>
				<button type="button" className="btn btn-danger" onClick={this.deleteHandler}>Delete</button>
			</div>)
		});
		return (<div>{taskCards}</div>);
	}
}

ReactDOM.render(<TodoApp />, document.getElementById("container"));
