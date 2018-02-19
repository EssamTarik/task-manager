import {combineReducers} from 'redux';
import EmployeesReducer from './EmployeesReducer';
import SearchReducer from './SearchReducer';
import ProjectsReducer from './ProjectsReducer';
import TeamsReducer from './TeamsReducer';
import EmployeesListReducer from './EmployeesListReducer';
import CurrentUserReducer from './CurrentUserReducer';
import CustomerListReducer from './CustomerListReducer';
import CardImagesReducer from './CardImagesReducer';
import ProfilePageReducer from './ProfilePageReducer';
import TeamInfoReducer from './TeamInfoReducer';
import StatusReducer from './StatusReducer';
import ProjectPeopleReducer from './Projects/ProjectPeopleReducer';
import ProjectReudcer from './Projects/ProjectReducer';
import LoggedInUserReducer from './Auth/LoggedInUserReducer';
import FreeTasksReducer from './Projects/FreeTasksReducer';
import AllSprintsReducer from './Projects/AllSprintsReducer';
import IncompleteSprintsReducer from './Projects/IncompleteSprintsReducer';
import CompleteSprintsReducer from './Projects/CompleteSprintsReducer';
import AllIncompleteTasksReducer from './Projects/AllIncompleteTasksReducer';
import SprintReducer from './Sprints/SprintReducer';
import AllProjectsReducer from './Projects/AllProjectsReducer';
import TaskTimelogReducer from './Projects/TaskTimelogReducer';
import TaskNamesReducer from './Tasks/TaskNamesReducer';
import ActiveSprintReducer from './Projects/ActiveSprintReducer';
import projectTabReducer from './Routing/projectTabReducer';
import AttachmentsReducer from './Attachments/AttachmentsReducer';
import LogReducer from './Projects/LogReducer';
import ProjectSettingsStateReducer from './Projects/ProjectSettingsStateReducer';
import UserNotificationsReducer from './Notifications/UserNotificationsReducer';
import UserUnreadNotificationsReducer from './Notifications/UserUnreadNotificationsReducer';
import TaskInfoReducer from './Tasks/TaskInfoReducer';
import EmployeesImagesReducer from './Employees/EmployeesImagesReducer';
import TaskAttachmentsReducer from './Tasks/TaskAttachmentsReducer';
import SprintNamesReducer from './Sprints/SprintNamesReducer';
import TaskDatesReducer from './Projects/TaskDatesReducer';
import { reducer as formReducer } from 'redux-form';
import { reducer as sematable } from 'sematable';

const rootReducer = combineReducers({
	sematable,
	Project: ProjectReudcer,
	ProjectActiveTab: projectTabReducer,
	ProjectSettingsState: ProjectSettingsStateReducer,
	TaskInfo: TaskInfoReducer,
	EmployeesImages: EmployeesImagesReducer,
	AllIncompleteTasks: AllIncompleteTasksReducer,
	TaskDates: TaskDatesReducer,
	ActiveSprint: ActiveSprintReducer,
	CompleteSprints: CompleteSprintsReducer,
	TaskTimelog: TaskTimelogReducer,
	TaskAttachments: TaskAttachmentsReducer,
	SprintNames: SprintNamesReducer,
	AllProjects: AllProjectsReducer,
	UserNotifications: UserNotificationsReducer,
	UserUnreadNotifications: UserUnreadNotificationsReducer,
	LoggedInUser: LoggedInUserReducer,
	TaskNames: TaskNamesReducer,
	Attachments: AttachmentsReducer,
	FreeTasks: FreeTasksReducer,
	Log: LogReducer,
	AllSprints: AllSprintsReducer,
	ProjectPeople: ProjectPeopleReducer,
	IncompleteSprints: IncompleteSprintsReducer,
	Sprint: SprintReducer,
	Employees: EmployeesReducer,
	SearchTarget: SearchReducer,
	ProfilePage: ProfilePageReducer,
	Teams: TeamsReducer,
	form: formReducer,
	EmployeesList: EmployeesListReducer,
	CurrentUser: CurrentUserReducer,
	CustomerList: CustomerListReducer,
	TeamInfo: TeamInfoReducer,
	Status: StatusReducer,
	CardImages: CardImagesReducer
});

export default rootReducer;