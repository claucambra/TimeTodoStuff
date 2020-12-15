/*

Ironic to include a to-do list in the code for a to-do list app, I know.

TO-DO:

- Add confirmation box when delete button pressed
- Replace React state management of tasks with Redux
- Figure out the back-end (...)

*/

class Task {
	constructor(name, details, time, dateDue) {
		this.name = name;
		this.details = details;
		this.id = Date.now();
		this.creationTime = (new Date()).toLocaleString();
		this.workTime = 0;
		this.completionTime = 0;
		this.expectedTime = time;
		this.status = 0;
		this.due = dateDue;
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

	componentDidMount() {
		//Get tasks from local localStorage
		if(localStorage.tasks != undefined) {
			this.setState({ tasks: JSON.parse(localStorage.tasks) })
		}
	}

	componentWillUnmount() {
		//Stop running timers
		for(let task of this.state.tasks) {
			clearInterval(this[`${id}Interval`]);
		}
	}
	componentDidUpdate(prevProps, prevState) {
		if(JSON.stringify(this.state) != JSON.stringify(prevState)) {
			//Updates filtered tasks lists
			this.updateTaskLists();

			//Add new timers and delete timers as needed
			let newTimers = this.state.onTimers.filter(id => prevState.onTimers.includes(id) == false)
			let oldTimers = prevState.onTimers.filter(id => this.state.onTimers.includes(id) == false)
			for (let id of newTimers) {
				this[`${id}Interval`] = setInterval(() => {
					let tasksArray = this.state.tasks;
					tasksArray.find(task => task.id == id).workTime += 100;
					this.setState({ tasks: [...tasksArray] });
				}, 100);
			}
			for (let id of oldTimers) {
				clearInterval(this[`${id}Interval`])
			}

			//Write to local storage
			localStorage.setItem("tasks", JSON.stringify(this.state.tasks))
		}
	}

	updateTaskLists() {
		this.setState({
			uncompletedTasks: this.state.tasks.filter(task => task.status < 100),
			completedTasks: this.state.tasks.filter(task => task.status == 100)
		})
	}

	addTask(name, details, time, dateDue) {
		let taskToAdd = new Task(name, details, time, dateDue)
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
			minutes: 0,
			date: 0
		}
		this.nameInputHandler = this.nameInputHandler.bind(this);
		this.detailsInputHandler = this.detailsInputHandler.bind(this);
		this.hourInputHandler = this.hourInputHandler.bind(this);
		this.minuteInputHandler = this.minuteInputHandler.bind(this);
		this.dateInputHandler = this.dateInputHandler.bind(this);
		this.keyHandler = this.keyHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
	}

	nameInputHandler(event) {
		this.setState({ name: event.target.value });
	}
	detailsInputHandler(event) {
		this.setState({ details: event.target.value });
	}
	hourInputHandler(event) {
		this.setState({ hours: event.target.value });
	}
	minuteInputHandler(event) {
		this.setState({ minutes: event.target.value });
	}
	dateInputHandler(event) {
		this.setState({ date: event.target.value });
		console.log(this.state.date)
		console.log(event.target.value)
	}

	keyHandler(event) {
		if(event.key == "Enter") {
			this.submitHandler();
		}
	}

	submitHandler() {
		if(this.state.name != "") {
			this.props.adder(this.state.name, this.state.details, ((this.state.hours*60*60*1000)+(this.state.minutes*60*1000)), this.state.date);
			this.setState(state => {
				state.name = "";
				state.details = "";
				state.hours = 0;
				state.minutes = 0;
				state.date = 0;
			});
		}
	}

	render() {
		let taskNameBox = <div className="form-floating" id="taskNameBox">
				<input type="text" id="taskName" className="form-control" placeholder="New Task" onKeyDown={this.keyHandler} onChange={this.nameInputHandler} value={this.state.name} />
				<label htmlFor="taskName">New Task</label>
			</div>

		let expectedTimeBox = <div className="input-group">
				<span className="input-group-text" style={{width:"60px"}}>Time</span>
				<input type="number" className="form-control numInput" min="0" placeholder="00" onKeyDown={this.keyHandler} onChange={this.hourInputHandler} value={this.state.hours} />
				<span className="input-group-text">hr</span>
				<input type="number" min="0" className="form-control numInput" placeholder="00" onKeyDown={this.keyHandler} onChange={this.minuteInputHandler} value={this.state.minutes} />
				<span className="input-group-text">m</span>
			</div>

		let dueDateBox = <div className="input-group">
				<span className="input-group-text" style={{width:"60px"}}>Due</span>
				<input type="date" className="form-control numInput" min="0" placeholder="00" onKeyDown={this.keyHandler} onChange={this.dateInputHandler} value={this.state.date} />
			</div>

		let inputBoxes = [taskNameBox, expectedTimeBox, dueDateBox];

		return (
			<div className="taskCreator">

				<div className="modal fade" id="expandedCreator" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="expandedCreatorLabel" aria-hidden="true">
				  <div className="modal-dialog">
				    <div className="modal-content">
				      <div className="modal-header">
				        <h5 className="modal-title" id="expandedCreatorLabel">Create a new task</h5>
				        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				      </div>
				      <div className="modal-body">
				        {inputBoxes}
								<div className="form-floating">
								  <textarea className="form-control" placeholder="Extra task details" id="taskDetailsArea" onChange={this.detailsInputHandler} value={this.state.details}></textarea>
								  <label htmlFor="taskDetailsArea">Extra task details</label>
								</div>

				      </div>
				      <div className="modal-footer">
				        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={this.submitHandler}>Submit</button>
				      </div>
				    </div>
				  </div>
				</div>

				<div id="smallCreator" style={{display:"flex"}}>
					{taskNameBox}
					<div className="btn-group submitterButtonArea" role="group" style={{gridArea:"1 / 2 / span 2 / span 1"}} aria-label="Submit buttons">
						<button type="button" className="btn btn-outline-secondary submitterButton" data-bs-toggle="modal" data-bs-target="#expandedCreator">More</button>
						<button type="button" className="btn btn-outline-primary submitterButton" onClick={this.submitHandler}>Submit</button>
					</div>
				</div>
			</div>
		);
	}
}

class TasksView extends React.Component {
	constructor (props) {
		super (props);
		this.state = {
			activatedTimerTasks: [],
			moreViewOpen: false,
			openTask: {}
		}
		this.timerTask = this.timerTask.bind(this);
		this.stateHandler = this.stateHandler.bind(this);
		this.cardGenerator = this.cardGenerator.bind(this);
		this.getTaskInfo = this.getTaskInfo.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.state.activatedTimerTasks !== prevState.activatedTimerTasks) {
			this.props.updateTimes(this.state.activatedTimerTasks)
		}
	}

	stateHandler(event) {
		let taskID = event.target.parentElement.parentElement.id;
		if (event.target.className.includes("deleteButton")) {
			this.props.deleter(taskID);
		} else if (event.target.className.includes("completeButton") ||
		 event.target.className.includes("uncompleteButton")) {
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
		let hours = Math.floor((ms / (60 * 60 * 1000)));

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

		let timerStartButton = <button type="button" className="btn btn-outline-primary col-4" onClick={this.timerTask}>Start timer</button>
		let timerStopButton = <button type="button" className="btn btn-primary col-4" onClick={this.timerTask}>Stop timer</button>
		let timerDisabledButton = <button type="button" className="btn btn-primary col-4" disabled>Task done</button>

		let returnArr = taskArray.map(task => {
			return(<li className={this.state.activatedTimerTasks.includes(String(task.id)) ? "taskEntryActive list-group-item" : "taskEntryInactive list-group-item"} id={task.id} key={task.id}>
				<div className="row justify-content-between">
					<h3 className="col-8 text-wrap text-break">{task.name}</h3>
					<button type="button" className={completeButton == "Done" ? "btn btn-outline-success col-3 completeButton" : "btn btn-outline-secondary col-3 uncompleteButton"} onClick={this.stateHandler}>{completeButton}</button>
				</div>
				{task.due == 0 ? console.log("No due date") : <p><strong>Due: </strong>{task.due}</p>}
				<div className="row justify-content-between timer-section">
					<p className="col-5 text-wrap text-break"><strong>Time elapsed:</strong><br />{this.msToTime(task.workTime, "long")}</p>
					{task.expectedTime == 0 ? <p className="col-5 text-wrap text-break"></p> : <p className="col-5 text-wrap text-break text-end"><strong>Finish within:</strong><br /> {this.msToTime(task.expectedTime, "short")}</p>}
				</div>
				<div className="row justify-content-between">
					{taskType == "completed" ? timerDisabledButton :
						this.state.activatedTimerTasks.includes(String(task.id)) ? timerStopButton : timerStartButton}
						<button type="button" className="btn btn-outline-secondary col-3 moreButton" data-bs-toggle="modal" data-bs-target="#moreView" onClick={this.getTaskInfo}>Details</button>
					<button type="button" className="btn btn-outline-danger col-3 deleteButton" onClick={this.stateHandler}>Delete</button>
				</div>
			</li>)
		});

		return returnArr;
	}

	getTaskInfo(event) {
		/*if(this.state.moreViewOpen = true) {
			this.setState({moreViewOpen: false, openTask: {} });
		} else {*/
			let taskID = event.target.parentElement.parentElement.id;
			this.setState({moreViewOpen: true, openTask: this.props.tasks.find(task => task.id == event.target.parentElement.parentElement.id)});
		//}
	}

	render () {
		let uncompletedCards = this.cardGenerator("uncompleted");
		let completedCards = this.cardGenerator("completed");
		let allCards = this.cardGenerator()

		return (
			<div id="taskListView">

				<div className="modal fade" id="moreView" data-bs-backdrop="modal" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="moreViewLabel" aria-hidden="true">
				  <div className="modal-dialog modal-dialog-centered">
				    <div className="modal-content">
				      <div className="modal-header">
				        <h5 className="modal-title" id="moreViewLabel">Details</h5>
				        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				      </div>
				      <div className="modal-body">

								<div className="form-floating">
								  <textarea className="form-control" placeholder="Extra task details" id="moreViewDetailsArea"  value={this.state.openTask.details}></textarea>
								  <label htmlFor="moreViewDetailsArea">Extra task details</label>
								</div>
								<p>Created: {this.state.openTask.creationTime}</p>
							</div>
						</div>
					</div>
				</div>

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
