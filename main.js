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
	}
	render() {
		return (
			<input type="text" placeholder="New Task"></input>
		);
	}
}

/*
class TasksView extends React.Component {
	constructor (props) {
		super (props);
	}
	render () {
		return ();
	}
}*/

ReactDOM.render(<TodoApp />, document.getElementbyId("container"));
