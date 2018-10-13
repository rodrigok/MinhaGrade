import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FacebookLogin from 'react-facebook-login';
import { loginWithFacebook } from 'meteor-apollo-accounts';
import { ApolloClient } from '../router';
import {
	Menu,
	Icon,
	Form,
	Input,
	Button,
	message,
	Card,
	Select
} from 'antd';

class AccountComponent extends Component {
	static propTypes = {
		routeData: PropTypes.object,
		getFieldDecorator: PropTypes.any,
		form: PropTypes.any
	}

	state = {}

	handleLogin = (e) => {
		e.preventDefault();

		const { routeData } = this.props;

		this.setState({ loading: true });
		this.props.form.validateFields((err, values) => {
			this.setState({ loading: false });
			if (!err) {
				Meteor.loginWithPassword({ email: values.email }, values.password, (error) => {
					if (error) {
						message.error(error.reason);
					}

					routeData.refetch();
				});
			}
		});
	}

	handleSignup = (e) => {
		e.preventDefault();

		const { routeData } = this.props;

		this.setState({ loading: true });
		this.props.form.validateFields((err, { name, email, password, course }) => {
			this.setState({ loading: false });
			if (!err) {
				Accounts.createUser({ email, password, profile: { name, course } }, (error) => {
					if (error) {
						return message.error(error.reason);
					}

					Meteor.loginWithPassword({ email }, password, (error) => {
						if (error) {
							message.error(error.reason);
						}

						routeData.refetch();
					});
				});
			}
		});
	}

	handleForgotPassword = (e) => {
		e.preventDefault();
		this.setState({ loading: true });
		this.props.form.validateFields((err, { email }) => {
			this.setState({ loading: false });
			if (!err) {
				Accounts.forgotPassword({ email }, (error) => {
					if (error) {
						return message.error(error.reason);
					}

					message.info('Email enviado');
					this.setState({
						action: 'login'
					});
				});
			}
		});
	}

	handleChangePassword = (e) => {
		e.preventDefault();
		this.setState({ loading: true });
		this.props.form.validateFields((err, { password, newPassword }) => {
			this.setState({ loading: false });
			if (!err) {
				Accounts.changePassword(password, newPassword, (error) => {
					if (error) {
						return message.error(error.reason);
					}

					message.info('Senha alterada');

					this.setState({
						action: ''
					});
				});
			}
		});
	}

	handleChangeCourse = (e) => {
		e.preventDefault();
		this.setState({ loading: true });
		this.props.form.validateFields((err, { course }) => {
			this.setState({ loading: false });
			if (!err) {
				Meteor.users.update({ _id: Meteor.userId() }, { $set: { 'profile.course': course } });
				message.info('Curso alterado');

				this.setState({
					action: ''
				});

				ApolloClient.resetStore();
			}
		});
	}

	handleLogout = () => {
		const { routeData } = this.props;
		Meteor.logout((() => {
			routeData.refetch();
		}));
	}

	renderLogin() {
		const { getFieldDecorator } = this.props.form;

		const responseFacebook = async({ accessToken }) => {
			await loginWithFacebook({ accessToken }, ApolloClient);
			ApolloClient.resetStore();
		};

		return (
			<Card title='Entrar'>
				<Form onSubmit={this.handleLogin} className='login-form'>
					<FacebookLogin
						appId='185969382302390'
						fields='name,email,picture'
						scope='public_profile,email,user_friends'
						callback={responseFacebook}
					/>
					<Form.Item>
						{getFieldDecorator('email', {
							rules: [{ required: true, type: 'email', message: 'Por favor entre com seu email!' }],
							validateTrigger: 'onBlur'
						})(
							<Input placeholder='Email' />
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: 'Por favor entre com sua senha!' }]
						})(
							<Input type='password' placeholder='Senha' />
						)}
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' className='login-form-button' loading={this.state.loading}>
							Entrar
						</Button>
						<a onClick={() => this.setState({ action: 'forgot-password' })}>Esqueci minha senha</a>
						<a className='login-form-register' onClick={() => this.setState({ action: 'signup' })}>Criar conta</a>
					</Form.Item>
				</Form>
			</Card>
		);
	}

	renderSignup() {
		const { routeData: { courses } } = this.props;
		const { getFieldDecorator } = this.props.form;
		return (
			<Card title='Criar conta'>
				<Form onSubmit={this.handleSignup} className='login-form'>
					<Form.Item>
						{getFieldDecorator('name', {
							rules: [{ required: true, message: 'Por favor entre com seu nome!' }]
						})(
							<Input placeholder='Nome' />
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('email', {
							rules: [{ required: true, type: 'email', message: 'Por favor entre com seu email!' }]
						})(
							<Input placeholder='Email' />
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('course', {
							rules: [{ required: true, message: 'Por favor selecione um curso!' }]
						})(
							<Select
								showSearch
								placeholder='Curso'
								// onChange={(value) => this.setTeacher(value, record)}
							>
								{courses.map(course => (
									<Select.Option key={course._id} value={course._id}>{course.name}</Select.Option>
								))}
							</Select>
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: 'Por favor entre com sua senha!' }]
						})(
							<Input type='password' placeholder='Senha' />
						)}
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' className='login-form-button' loading={this.state.loading}>
							Criar conta
						</Button>
						<a className='login-form-register' onClick={() => this.setState({ action: 'login' })}>Entrar</a>
					</Form.Item>
				</Form>
			</Card>
		);
	}

	renderForgotPassword() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Card title='Esqueci minha senha'>
				<Form onSubmit={this.handleForgotPassword} className='login-form'>
					<Form.Item>
						{getFieldDecorator('email', {
							rules: [{ required: true, type: 'email', message: 'Por favor entre com seu email!' }]
						})(
							<Input placeholder='email' />
						)}
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' className='login-form-button' loading={this.state.loading}>
							Resetar senha
						</Button>
						<a className='login-form-register' onClick={() => this.setState({ action: 'login' })}>Entrar</a>
					</Form.Item>
				</Form>
			</Card>
		);
	}

	renderChangePassword() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Card title='Mudar senha'>
				<Form onSubmit={this.handleChangePassword} className='login-form'>
					<Form.Item>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: 'Por favor entre com sua senha!' }]
						})(
							<Input type='password' placeholder='senha atual' />
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('newPassword', {
							rules: [{ required: true, message: 'Por favor entre com a nova senha!' }]
						})(
							<Input type='password' placeholder='nova senha' />
						)}
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' className='login-form-button' loading={this.state.loading}>
							Mudar senha
						</Button>
						<a className='login-form-register' onClick={() => this.setState({ action: '' })}>Cancelar</a>
					</Form.Item>
				</Form>
			</Card>
		);
	}

	renderChangeCourse() {
		const { routeData: { courses, user } } = this.props;
		const { getFieldDecorator } = this.props.form;
		return (
			<Card title='Mudar curso'>
				<Form onSubmit={this.handleChangeCourse} className='login-form'>
					<Form.Item>
						{getFieldDecorator('course', {
							rules: [{ required: true, message: 'Por favor selecione um curso!' }],
							initialValue: user.profile.course._id
						})(
							<Select
								showSearch
								placeholder='Curso'
								// onChange={(value) => this.setTeacher(value, record)}
							>
								{courses.map(course => (
									<Select.Option key={course._id} value={course._id}>{course.name}</Select.Option>
								))}
							</Select>
						)}
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' className='login-form-button' loading={this.state.loading}>
							Mudar curso
						</Button>
						<a className='login-form-register' onClick={() => this.setState({ action: '' })}>Cancelar</a>
					</Form.Item>
				</Form>
			</Card>
		);
	}

	renderAccount() {
		const { routeData: { user } } = this.props;
		let userEmail;
		if (user) {
			userEmail = user.mainEmail.address;
		}

		return (
			<Card title={userEmail}>
				<Form className='login-form'>
					<Form.Item>
						Curso: {user.profile.course.name}
						<Button onClick={() => this.setState({ action: 'change-course' })} className='login-form-button'>
							Mudar curso
						</Button>
						<Button onClick={() => this.setState({ action: 'change-password' })} className='login-form-button'>
							Mudar senha
						</Button>
						<Button type='primary' onClick={this.handleLogout} className='login-form-button'>
							Sair
						</Button>
					</Form.Item>
				</Form>
			</Card>
		);
	}

	renderMenu() {
		const { routeData: { user } } = this.props;
		if (user) {
			switch (this.state.action) {
				case 'change-password':
					return this.renderChangePassword();
				case 'change-course':
					return this.renderChangeCourse();
				default:
					return this.renderAccount();
			}
		}

		switch (this.state.action) {
			case 'signup':
				return this.renderSignup();
			case 'forgot-password':
				return this.renderForgotPassword();
			default:
				return this.renderLogin();
		}
	}

	render() {
		return (
			<div style={{ width: '300px' }}>
				{this.renderMenu()}
			</div>
		);
	}
}

const WrappedAccountComponent = Form.create()(AccountComponent);



class MenuComponent extends Component {
	static propTypes = {
		routeData: PropTypes.object,
		history: PropTypes.object
	}

	state = {}

	handleClick = (e) => {
		this.props.history.push(e.key);
	}

	renderAdminMenu() {
		const { routeData: { user } } = this.props;
		if (user && user.admin) {
			return (
				<Menu.SubMenu title='Administrar' style={{ float: 'right' }}>
					<Menu.Item key='calendars'>Calendários</Menu.Item>
					<Menu.Item key='teachers'>Professores</Menu.Item>
					<Menu.Item key='courses'>Cursos</Menu.Item>
				</Menu.SubMenu>
			);
		}
	}

	renderAccounts() {
		const { routeData, routeData: { user, loading } } = this.props;

		if (loading) {
			return;
		}

		let userEmail = 'Entrar / Criar Conta';

		if (user) {
			userEmail = <div className='user-menu-content'>
				<div>{user.profile.name}</div>
				<div>{user.mainEmail && user.mainEmail.address}</div>
			</div>;
		}

		return (
			<Menu.SubMenu title={<span><Icon type='user' />{userEmail}</span>} style={{ float: 'right' }} className='user-menu'>
				<WrappedAccountComponent routeData={routeData} />
			</Menu.SubMenu>
		);
	}

	renderCalendar() {
		const { routeData: { calendar, loading } } = this.props;
		if (!loading && calendar) {
			return <Menu.Item key='/calendar'>Calendario</Menu.Item>;
		}
	}

	render() {
		return (
			<Menu
				theme='dark'
				mode='horizontal'
				// defaultSelectedKeys={['2']}
				style={{ lineHeight: '64px' }}
				onClick={this.handleClick}
			>
				<Menu.Item key='/course'>Meu Currículo</Menu.Item>
				{this.renderCalendar()}
				{this.renderAccounts()}
				{this.renderAdminMenu()}
			</Menu>
		);
	}
}

export default withRouter(MenuComponent);
