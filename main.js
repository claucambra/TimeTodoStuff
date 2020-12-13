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
			tasks: [],
			uncompletedTasks: [],
			completedTasks: []
		}
    this.addTask = this.addTask.bind(this);
		this.deleteTask = this.deleteTask.bind(this);
		this.completeTask = this.completeTask.bind(this);
	}

  addTask(name, details) {
		let taskToAdd = new Task(name, details)
		this.setState({ tasks: [...this.state.tasks, taskToAdd] })
		this.setState(state => {
			state.uncompletedTasks = state.tasks.filter(task => task.status < 100);
			state.completedTasks = state.tasks.filter(task => task.status == 100);
		})
	}

	deleteTask(id) {
		this.setState({ tasks: this.state.tasks.filter(task => task.id != id) });
	}

	completeTask(id) {
		console.log("completing");
		let taskToComplete = this.state.tasks.find(task => task.id == id);
		this.setState(state => state.tasks[state.tasks.indexOf(taskToComplete)].status = 100);
	}

	render () {
		return (
			<div>
				<TaskCreator tasks={this.state.tasks} adder={this.addTask}/>
				<TasksView tasks={this.state.tasks} completer={this.completeTask} deleter={this.deleteTask} completed={this.state.completedTasks} uncompleted={this.state.uncompletedTasks}/>
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
		this.completeHandler = this.completeHandler.bind(this);
		this.cardGenerator = this.cardGenerator.bind(this)
	}

	componentDidUpdate(prevProps) {
		if(prevProps != this.props) {
			console.log("PROPS RECEIVED:", this.props)
		}
	}

	deleteHandler(event) {
		this.props.deleter(event.target.parentElement.id);
	}

	completeHandler(event) {
		this.props.completer(event.target.parentElement.id);
	}

	cardGenerator(taskType) {
		let taskArray;

		switch(taskType) {
			case "uncompleted":
				taskArray = [...this.props.uncompleted];
				break;
			case "completed":
				taskArray = [...this.props.completed];
				break;
			default:
				taskArray = [...this.props.tasks];
				break;
		}

		let returnArr = taskArray.map(task => {
			return(<div className="taskCard" id={task.id}>
				<h3>{task.name}</h3>
				<p>{task.details}</p>
				<button type="button" className="btn btn-success" onClick={this.completeHandler}>Completed</button>
				<button type="button" className="btn btn-primary">More details</button>
				<button type="button" className="btn btn-danger" onClick={this.deleteHandler}>Delete</button>
			</div>)
		});

		return returnArr;
	}

	render () {
		let uncompletedCards = this.cardGenerator("uncompleted");
		let completedCards = this.cardGenerator("completed");
		let allCards = this.cardGenerator()

		return (
			<div>
				<div id="tasks-to-complete">
					<h2>Tasks to complete</h2>
						{uncompletedCards}
				</div>
				<div id="completed-tasks">
						<h2>Completed Tasks</h2>
						{completedCards}
				</div>
			</div>);
	}
}

ReactDOM.render(<TodoApp />, document.getElementById("container"));
