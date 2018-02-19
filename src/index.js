import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import rootReducer from './reducers/index';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import EmployeesPage from './containers/Employees/EmployeesPage';
import Dashboard from './containers/Dashboard/Dashboard';
import ProjectContainer from './containers/Projects/Dashboard/ProjectContainer';
import ProjectEmployeeContainer from './containers/Projects/Dashboard/ProjectEmployeeContainer';
import ProjectViewerContainer from './containers/Projects/Dashboard/ProjectViewerContainer';
import ProjectDashboard from './containers/Projects/Dashboard/ProjectDashboard';
import ProjectDocuments from './containers/Projects/Dashboard/ProjectDocuments/ProjectDocuments';
import ProjectTasks from './containers/Projects/Dashboard/ProjectTasks/ProjectTasks';
import ProjectIssues from './containers/Projects/Dashboard/ProjectIssues/ProjectIssues';
import ProjectSettingsPage from './containers/Projects/Dashboard/ProjectSettingsPage';
import ProjectUsers from './containers/Projects/Dashboard/ProjectUsers';
import TasksPage from './containers/Tasks/TasksPage';
import TeamsPage from './containers/Teams/TeamsPage';
import LoginPage from './containers/Auth/LoginPage';
import ProjectScrum from './containers/Projects/Dashboard/ProjectScrum';
import TestView from './components/test';
import ProjectsPage from './containers/Projects/ProjectsPageContainer';
import NewEmployeePage from './containers/NewEmployee/NewEmployeePage';
import ProjectReports from './containers/Projects/Dashboard/ProjectReports';
import AdminUsers from './containers/Admin/Users/Users';
import AdminContainer from './containers/Admin/AdminContainer';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import Hello from './components/Hello';
import './index.css';

let store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/login" component={LoginPage} />
			<Route path="/" component={App}>
				<IndexRoute component={ProjectsPage} />				
				<Route path="employees">
					<IndexRoute component={EmployeesPage} />
					<Route path="new" component={NewEmployeePage} /> 
				</Route>

				<Route path="tasks" component={TasksPage} />
				<Route path="teams" component={TeamsPage} />
				<Route path="tests" component={TestView} />
				<Route path="projects/:id/settings" component={ProjectSettingsPage} />
				<Route path="admin" component={AdminContainer}>
					<Route path="users" component={AdminUsers} />
				</Route>
				<Route path="projects">
					<IndexRoute component={ProjectsPage} />
					<Route path="viewer">
						<Route path=":id" component={ProjectViewerContainer}>
							<IndexRoute component={ProjectDashboard} />
							<Route path="reports" component={ProjectReports} />
							{/*<Route path="documents" component={ProjectDocuments} />*/}
							<Route path="issues" component={ProjectIssues} />
							<Route path="scrum" component={(props) => {return <ProjectScrum {...props} viewMode={true} />}} />
						</Route>
					</Route>
					<Route path="employee">
						<Route path=":id" component={ProjectEmployeeContainer}>
							<IndexRoute component={ProjectScrum} />
						</Route>
					</Route>
					<Route path=":id" component={ProjectContainer}>
						<IndexRoute component={ProjectDashboard} />
						<Route path="tasks" component={ProjectTasks} />
						<Route path="reports" component={ProjectReports} />
						<Route path="users" component={ProjectUsers} />
						<Route path="documents" component={ProjectDocuments} />
						<Route path="issues" component={ProjectIssues} />
						<Route path="scrum" component={ProjectScrum} />
					</Route>
				</Route>
			</Route>


		</Router>
	</Provider>
	,
	document.getElementById('root')
);
