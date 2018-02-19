const FilterEmployeesByName = (searchTarget) => {
	return {
		type: "EmployeesFilteredByName",
		payload: searchTarget
	}
};

export default FilterEmployeesByName;