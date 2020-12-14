/*

Ironic to include a to-do list in the code for a to-do list app, I know.

TO-DO:
- Code timer
- Display modal box on task click. Add some effect on cursor hover.
- Add confirmation box when delete button pressed
- Add display of time allocated (and input section for this
- Replace React state management of tasks with Redux
- Figure out the back-end (...)

*/


class Task {
	constructor(name, details) {
		this.name = name;
		this.details = details;
		this.id = Date.now();
		this.creationTime = new Date()
		this.workTime = 0;
		this.completionTime = 0;
		this.status = 0;
	}
}

class TodoApp extends React.Component {
	constructor (props) {
		super (props);
		this.state = {
			tasks: [],
			uncompletedTasks: [],
			completedTasks: [],
			onTimers: []
		}
		this.addTask = this.addTask.bind(this);
		this.deleteTask = this.deleteTask.bind(this);
		this.completeTask = this.completeTask.bind(this);
		this.updateTaskTimers = this.updateTaskTimers.bind(this);
	}

	componentWillUnmount() {
    clearInterval(this.timerInterval);
	}
	componentDidUpdate(prevProps, prevState) {
		if(JSON.stringify(this.state) != JSON.stringify(prevState)) {
			this.updateTaskLists();
			let newTimers = this.state.onTimers.filter(id => prevState.onTimers.includes(id) == false)
			let oldTimers = prevState.onTimers.filter(id => this.state.onTimers.includes(id) == false)
			for (let id of newTimers) {
				this[`${id}Interval`] = setInterval(() => {
					let tasksArray = this.state.tasks;
					tasksArray.find(task => task.id == id).workTime += 1000;
					this.setState({ tasks: [...tasksArray] });
				}, 1000);
			}
			for (let id of oldTimers) {
				clearInterval(this[`${id}Interval`])
			}
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
			tasksArray.find(task => task.id == id).completionTime = new Date();
		} else {
			tasksArray.find(task => task.id == id).status = 0;
			tasksArray.find(task => task.id == id).completionTime = 0;
		}
		this.setState({ tasks: [...tasksArray] });
		this.updateTaskLists();
	}

	updateTaskTimers(idArray) {
		this.setState({ onTimers: idArray });
	}

	render () {
		return (
			<div>
				<TaskCreator tasks={this.state.tasks} adder={this.addTask}/>
				<TasksView tasks={this.state.tasks} completer={this.completeTask} deleter={this.deleteTask} completed={this.state.completedTasks} uncompleted={this.state.uncompletedTasks} updateTimes={this.updateTaskTimers}/>
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
		this.state = {
			activatedTimerTasks: []
		}
		this.timerTask = this.timerTask.bind(this);
		this.deleteHandler = this.deleteHandler.bind(this);
		this.completeHandler = this.completeHandler.bind(this);
		this.cardGenerator = this.cardGenerator.bind(this)
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.state.activatedTimerTasks !== prevState.activatedTimerTasks) {
			this.props.updateTimes(this.state.activatedTimerTasks)
		}
	}

	deleteHandler(event) {
		let taskID = event.target.parentElement.parentElement.id
		this.props.deleter(taskID);
		if(this.state.activatedTimerTasks.includes(taskID)) {
			this.setState({activatedTimerTasks: [...this.state.activatedTimerTasks.filter(ids => ids != taskID)]})
		}
	}

	completeHandler(event) {
		this.props.completer(event.target.parentElement.parentElement.id);
	}

	timerTask(event) {
		let taskID = event.target.parentElement.parentElement.id
		if(this.state.activatedTimerTasks.includes(event.target.parentElement.parentElement.id)) {
			this.setState({activatedTimerTasks: [...this.state.activatedTimerTasks.filter(ids => ids != taskID)]})
		} else {
			this.setState({ activatedTimerTasks: [...this.state.activatedTimerTasks, taskID] })
		}
	}

	msToTime(ms) {
		let seconds = Math.floor((ms / 1000) % 60);
		let minutes = Math.floor((ms / (60 * 1000)) % 60);
		let hours = Math.floor((ms / (60 * 60 * 1000)) % 60);

		if (hours != 0) {
			return `${hours*60}:0${seconds}`
		} else if (minutes >= 10 && seconds >= 10) {
			return `${minutes}:${seconds}`;
		} else if (minutes < 10 && seconds < 10) {
			return `0${minutes}:0${seconds}`;
		} else if (minutes < 10) {
			return `0${minutes}:${seconds}`;
		} else if (seconds < 10) {
			return `${minutes}:0${seconds}`;
		}
	}

	cardGenerator(taskType) {
		let taskArray, completeButton;

		switch(taskType) {
			case "uncompleted":
				taskArray = [...this.props.uncompleted];
				completeButton = "Done";
				break;
			case "completed":
				taskArray = [...this.props.completed];
				completeButton = "Undo";
				break;
			default:
				taskArray = [...this.props.tasks];
				break;
		}

		let returnArr = taskArray.map(task => {
			return(<li className="taskEntry list-group-item" id={task.id}>
				<div className="row justify-content-between">
					<h3 className="col-8 text-wrap text-break">{task.name}</h3>
					<button type="button" className={completeButton == "Done" ? "btn btn-outline-success col-3" : "btn btn-outline-secondary col-3"} onClick={this.completeHandler}>{completeButton}</button>
				</div>
				<div className="timer-section">
					<p>Time elapsed: {this.msToTime(task.workTime)}</p>
				</div>
				<div className="row justify-content-between">
					{completeButton == "Done" ? <button type="button" className="btn btn-primary col-5" onClick={this.timerTask}>Start timer</button> : <button type="button" className="btn btn-primary col-5" disabled>Task done</button>}
					<button type="button" className="btn btn-outline-danger col-3" onClick={this.deleteHandler}>Delete</button>
				</div>
			</li>)
		});

		return returnArr;
	}

	render () {
		let uncompletedCards = this.cardGenerator("uncompleted");
		let completedCards = this.cardGenerator("completed");
		let allCards = this.cardGenerator()

		return (
			<div>
				<p>{this.state.timeCurrent}</p>
				<div id="tasks-to-complete" className="categoryHeader">
					<h2>Tasks to complete</h2>
					<ul className="list-group">
						{uncompletedCards}
					</ul>
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
								<ul className="list-group">
									{completedCards}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>);
	}
}

ReactDOM.render(<TodoApp />, document.getElementById("container"));
