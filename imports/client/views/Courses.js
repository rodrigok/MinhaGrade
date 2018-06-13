import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { EditableTableComponent } from '../components/EditableTable';

class CoursesComponent extends EditableTableComponent {

}

export default compose(
	graphql(gql`
		query {
			records: courses {
				_id
				name
			}
		}
	`),
	graphql(gql` mutation removeCourse($_id: String!) { removeCourse(_id: $_id) }`, { name: 'removeMutation' }),
	graphql(gql` mutation createCourse($name: String!) { createCourse(name: $name) }`, { name: 'createMutation' }),
	graphql(gql` mutation updateCourse($_id: String! $name: String!) { updateCourse(_id: $_id name: $name) }`, { name: 'updateMutation' })
)(CoursesComponent);

