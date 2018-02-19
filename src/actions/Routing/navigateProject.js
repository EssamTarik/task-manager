const navigateProject = (activeTab) => {
	return {
		type: "ProjectActiveTabChanged",
		payload: activeTab
	}
}

export default navigateProject;