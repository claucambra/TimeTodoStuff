var tasks = [];

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
	}
	render () {
		return (
			<TaskCreator />
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
	}
	
	inputHandler(event) {
		this.setState({name: event.target.value});
	}
	
	addTask() {
		let taskToAdd = new Task(this.state.name, this.state.details)
		tasks.push(taskToAdd);
		console.log(tasks);
	}
	
	render() {
		return (
			<form onSubmit={this.addTask}>
				<input type="text" id="taskName" placeholder="New Task" onChange={inputHandler}></input>
				<button type="submit">Submit</button>
			</form>
		);
	}
}

/*class TasksView extends React.Component {
	constructor (props) {
		super (props);
	}
	render () {
		return ();
	}
}*/

ReactDOM.render(<TodoApp />, document.getElementById("container"));
