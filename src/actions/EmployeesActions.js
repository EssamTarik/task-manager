import ref from '../api/firebaseAPI';

		ref.on('value', function(snapshot){
			var employees = snapshot.val();
			employees = lodash.toArray(employees);

			employees = employees.map(function(employee){
				return {name: employee.name, email: employee.email};
			});
			
			this.props.updateEmployees(employees);
			console.log("didmount");
		});
