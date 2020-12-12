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
	}
	render () {
		return (
			<div>
				<TaskCreator tasks={this.state.tasks}/>
				<TasksView tasks={this.state.tasks}/>
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
		this.addTask = this.addTask.bind(this);
		this.inputHandler = this.inputHandler.bind(this);
	}
	
	inputHandler(event) {
		this.setState({name: event.target.value});
	}
	
	addTask(event) {
		let taskToAdd = new Task(this.state.name, this.state.details)
		this.props.tasks.push(taskToAdd);
		console.log(this.props.tasks);
		event.preventDefault();
	}
	
	render() {
		return (
			<form onSubmit={this.addTask}>
				<input type="text" id="taskName" placeholder="New Task" onChange={this.inputHandler}></input>
				<button type="submit">Submit</button>
			</form>
		);
	}
}

class TasksView extends React.Component {
	constructor (props) {
		super (props);
	}
	
	componentDidUpdate(prevProps) {
		if (prevProps != this.props) {
			console.log("beep");
		}
	}
	
	render () {
		var taskCards = this.props.tasks.map(task => <div class="taskCard"><h1>{task.name}</h1><br /><p>{task.details}</p></div>)
		return (<div>{taskCards}</div>);
	}
}

ReactDOM.render(<TodoApp />, document.getElementById("container"));
