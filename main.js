class Task {
	constructor(name, details) {
		this.name = name;
		this.details = details;
		this.id = Date.now();
		this.creationTime = new Date()
		this.time = 0;
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

	componentDidUpdate(prevProps, prevState) {
		if(JSON.stringify(this.state) != JSON.stringify(prevState)) {
			this.updateTaskLists();
		}
	}

	updateTaskLists() {
		this.setState({
			uncompletedTasks: this.state.tasks.filter(task => task.status < 100),
			completedTasks: this.state.tasks.filter(task => task.status == 100)
		})
	}

  addTask(name, details) {
		let taskToAdd = new Task(name, details)
		this.setState({ tasks: [...this.state.tasks, taskToAdd] })
	}

	deleteTask(id) {
		this.setState({ tasks: this.state.tasks.filter(task => task.id != id) });
	}

	completeTask(id) {
		let tasksArray = [...this.state.tasks]
		if (tasksArray.find(task => task.id == id).status < 100) {
			tasksArray.find(task => task.id == id).status = 100;
		} else {
			tasksArray.find(task => task.id == id).status = 0;
		}
		this.setState({ tasks: [...tasksArray] });
		this.updateTaskLists();
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
		this.keyHandler = this.keyHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
	}

	inputHandler(event) {
		this.setState({ name: event.target.value });
	}

	keyHandler(event) {
		if(event.key == "Enter") {
			this.submitHandler();
		}
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
			<div className="taskCreator">
				<div className="input-group">
					<input type="text" id="taskName" className="form-control" placeholder="New Task" onKeyDown={this.keyHandler} onChange={this.inputHandler} value={this.state.name}></input>
					<button type="button" className="btn btn-outline-secondary" onClick={this.submitHandler}>Submit</button>
				</div>
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

	deleteHandler(event) {
		this.props.deleter(event.target.parentElement.id);
	}

	completeHandler(event) {
		this.props.completer(event.target.parentElement.id);
	}

	cardGenerator(taskType) {
		let taskArray, completeButton;

		switch(taskType) {
			case "uncompleted":
				taskArray = [...this.props.uncompleted];
				completeButton = "Completed";
				break;
			case "completed":
				taskArray = [...this.props.completed];
				completeButton = "Not yet completed";
				break;
			default:
				taskArray = [...this.props.tasks];
				break;
		}

		let returnArr = taskArray.map(task => {
			return(<div className="taskCard" id={task.id}>
				<h3>{task.name}</h3>
				<p>{task.creationTime.toLocaleString("en-US", {dateStyle: "medium", timeStyle: "short", hour12: false})}</p>
				<button type="button" className="btn btn-success" onClick={this.completeHandler}>{completeButton}</button>
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
				<div id="tasks-to-complete" className="categoryHeader">
					<h2>Tasks to complete</h2>
						{uncompletedCards}
				</div>
				<div id="completed-tasks" className="categoryHeader accordion">
					<div className="accordion-item">
						<h2 className="accordion-header" id="completedHeader">
							<button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCompleted" aria-expanded="true" aria-controls="collapseCompleted">
								Completed Tasks
							</button>
						</h2>
						<div id="collapseCompleted" className="accordion-collapse collapse" aria-labelledby="completedHeader" data-bs-parent="#completed-tasks">
							<div className="accordion-body">
								{completedCards}
							</div>
						</div>
					</div>
				</div>
			</div>);
	}
}

ReactDOM.render(<TodoApp />, document.getElementById("container"));
