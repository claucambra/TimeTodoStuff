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
	}
  
  addTask(name, details) {
		let taskToAdd = new Task(name, details)
    this.setState(state => state.tasks.push(taskToAdd))
	}
  
	render () {
		return (
			<div>
				<TaskCreator tasks={this.state.tasks} adder={this.addTask}/>
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
			<div>
				<input type="text" id="taskName" placeholder="New Task" onChange={this.inputHandler}></input>
				<button type="button" onClick={this.submitHandler}>Submit</button>
			</div>
		);
	}
}

class TasksView extends React.Component {
	constructor (props) {
		super (props);
	}
	
	render () {
		var taskCards = this.props.tasks.map(task => <div class="taskCard"><h1>{task.name}</h1><p>{task.details}</p></div>);
		console.log(this.props.tasks);
		return (<div>{taskCards}</div>);
	}
}

ReactDOM.render(<TodoApp />, document.getElementById("container"));
