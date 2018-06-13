import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { EditableTableComponent } from '../components/EditableTable';

class TeachersComponent extends EditableTableComponent {

}

export default compose(
	graphql(gql`
		query {
			records: teachers {
				_id
				name
			}
			user {
				_id
				grade
				calendar
			}
		}
	`),
	graphql(gql` mutation removeTeacher($_id: String!) { removeTeacher(_id: $_id) }`, { name: 'removeMutation' }),
	graphql(gql` mutation createTeacher($name: String!) { createTeacher(name: $name) }`, { name: 'createMutation' }),
	graphql(gql` mutation updateTeacher($_id: String! $name: String!) { updateTeacher(_id: $_id name: $name) }`, { name: 'updateMutation' })
)(TeachersComponent);
