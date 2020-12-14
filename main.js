/*

Ironic to include a to-do list in the code for a to-do list app, I know.

TO-DO:
- Display modal box on task click. Add some effect on cursor hover.
- Add confirmation box when delete button pressed
- Add display of time allocated (and input section for this
- Replace React state management of tasks with Redux
- Figure out the back-end (...)

*/


class Task {
	constructor(name, details, time) {
		this.name = name;
		this.details = details;
		this.id = Date.now();
		this.creationTime = new Date()
		this.workTime = 0;
		this.completionTime = 0;
		this.expectedTime = time;
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

	addTask(name, details, time) {
		let taskToAdd = new Task(name, details, time)
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
			details: "",
			hours: 0,
			minutes: 0
		}
		this.nameInputHandler = this.nameInputHandler.bind(this);
		this.hourInputHandler = this.hourInputHandler.bind(this);
		this.minuteInputHandler = this.minuteInputHandler.bind(this);
		this.keyHandler = this.keyHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
	}

	nameInputHandler(event) {
		this.setState({ name: event.target.value });
	}
	hourInputHandler(event) {
		this.setState({ hours: event.target.value });
	}
	minuteInputHandler(event) {
		this.setState({ minutes: event.target.value });
	}

	keyHandler(event) {
		if(event.key == "Enter") {
			this.submitHandler();
		}
	}

	submitHandler() {
		if(this.state.name != "") {
			this.props.adder(this.state.name, this.state.details, ((this.state.hours*60*60*1000)+(this.state.minutes*60*1000)));
			this.setState(state => {
				state.name = "";
				state.details = "";
				state.hours = 0;
				state.minutes = 0
			});
		}
	}

	render() {
		return (
			<div className="taskCreator" style={{display:"grid", gridTemplateRows:"1fr 1fr", gridTemplateColumns:"5fr 1fr"}}>
				<div className="input-group" style={{gridArea:"1 / 1 / span 1 / span 1"}}>
					<span className="input-group-text" style={{width:"60px"}}>Task</span>
					<input type="text" id="taskName" className="form-control" placeholder="New Task" onKeyDown={this.keyHandler} onChange={this.nameInputHandler} value={this.state.name} />
				</div>
				<div className="input-group" style={{gridArea:"2 / 1 / span 1 / span 1"}}>
					<span className="input-group-text" style={{width:"60px"}}>Time</span>
					<input type="number" className="form-control numInput" min="0" placeholder="00" onKeyDown={this.keyHandler} onChange={this.hourInputHandler} value={this.state.hours} />
					<span className="input-group-text" >hr</span>
					<input type="number" min="0" className="form-control numInput" placeholder="00" onKeyDown={this.keyHandler} onChange={this.minuteInputHandler} value={this.state.minutes} />
					<span className="input-group-text">m</span>
				</div>
				<div className="submitterButtonArea" style={{gridArea:"1 / 2 / span 2 / span 1"}}>
					<button type="button" className="btn btn-outline-secondary submitterButton">More</button>
					<button type="button" className="btn btn-outline-primary submitterButton" onClick={this.submitHandler}>Submit</button>
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
		this.stateHandler = this.stateHandler.bind(this);
		this.cardGenerator = this.cardGenerator.bind(this)
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.state.activatedTimerTasks !== prevState.activatedTimerTasks) {
			this.props.updateTimes(this.state.activatedTimerTasks)
		}
	}

	stateHandler(event) {
		console.log(event.target.className)
		let taskID = event.target.parentElement.parentElement.id;
		if (event.target.className.includes("deleteButton")) {
			this.props.deleter(taskID);
		} else if (event.target.className.includes("completeButton")) {
			this.props.completer(taskID);
		}
		if(this.state.activatedTimerTasks.includes(taskID)) {
			this.setState({activatedTimerTasks: [...this.state.activatedTimerTasks.filter(ids => ids != taskID)]})
		}
	}

	timerTask(event) {
		let taskID = event.target.parentElement.parentElement.id
		if(this.state.activatedTimerTasks.includes(event.target.parentElement.parentElement.id)) {
			this.setState({activatedTimerTasks: [...this.state.activatedTimerTasks.filter(ids => ids != taskID)]})
		} else {
			this.setState({ activatedTimerTasks: [...this.state.activatedTimerTasks, taskID] })
		}
	}

	msToTime(ms, length) {
		let seconds = Math.floor((ms / 1000) % 60);
		let minutes = Math.floor((ms / (60 * 1000)) % 60);
		let hours = Math.floor((ms / (60 * 60 * 1000)) % 60);

		let hoursToShow = hours > 10 ? `${hours}:` : `0${hours}:`;
		let min, sec;
		if (minutes >= 10 && seconds >= 10) {
			min = `${minutes}`;
			sec = `:${seconds}`;
		} else if (minutes < 10 && seconds < 10) {
			min = `0${minutes}`;
			sec = `:0${seconds}`;
		} else if (minutes < 10) {
			min = `0${minutes}`;
			sec = `:${seconds}`;
		} else if (seconds < 10) {
			min = `${minutes}`
			sec = `:0${seconds}`;
		} else {
			min = `00`
			sec = `00`;
		}

		if (length == "long") {
			if(hours == 0) {
				return min + sec;
			} else {
				return hoursToShow + min + sec;
			}
		} else {
			return hoursToShow + min + " hours"
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

		let timerStartButton = <button type="button" className="btn btn-outline-primary col-5" onClick={this.timerTask}>Start timer</button>
		let timerStopButton = <button type="button" className="btn btn-primary col-5" onClick={this.timerTask}>Stop timer</button>
		let timerDisabledButton = <button type="button" className="btn btn-primary col-5" disabled>Task done</button>

		let returnArr = taskArray.map(task => {
			return(<li className={this.state.activatedTimerTasks.includes(String(task.id)) ? "taskEntryActive list-group-item" : "taskEntryInactive list-group-item"} id={task.id} key={task.id}>
				<div className="row justify-content-between">
					<h3 className="col-8 text-wrap text-break">{task.name}</h3>
					<button type="button" className={completeButton == "Done" ? "btn btn-outline-success col-3 completeButton" : "btn btn-outline-secondary col-3"} onClick={this.stateHandler}>{completeButton}</button>
				</div>
				<div className="row justify-content-between timer-section">
					<p className="col-4 text-wrap text-break"><strong>Finish within:</strong><br /> {this.msToTime(task.expectedTime, "short")}</p>
					<p className="col-4 text-wrap text-break text-end"><strong>Time elapsed:</strong><br />{this.msToTime(task.workTime, "long")}</p>
				</div>
				<div className="row justify-content-between">
					{taskType == "completed" ? timerDisabledButton :
						this.state.activatedTimerTasks.includes(String(task.id)) ? timerStopButton : timerStartButton}
					<button type="button" className="btn btn-outline-danger col-3 deleteButton" onClick={this.stateHandler}>Delete</button>
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
			<div id="taskListView">
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
