import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Menu,
	Icon,
	Form,
	Input,
	Button,
	message,
	Card
} from 'antd';

class AccountComponent extends Component {
	static propTypes = {
		user: PropTypes.object,
		getFieldDecorator: PropTypes.any,
		form: PropTypes.any
	}

	state = {}

	handleLogin = (e) => {
		e.preventDefault();

		const { user } = this.props;

		this.setState({ loading: true });
		this.props.form.validateFields((err, values) => {
			this.setState({ loading: false });
			if (!err) {
				Meteor.loginWithPassword({ email: values.email }, values.password, (error) => {
					if (error) {
						message.error(error.reason);
					}

					user.refetch();
				});
			}
		});
	}

	handleSignup = (e) => {
		e.preventDefault();
		this.setState({ loading: true });
		this.props.form.validateFields((err, { email, password }) => {
			this.setState({ loading: false });
			if (!err) {
				Accounts.createUser({ email, password }, (error) => {
					if (error) {
						return message.error(error.reason);
					}

					Meteor.loginWithPassword({ email }, password, (error) => {
						if (error) {
							message.error(error.reason);
						}
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

	handleLogout = () => {
		const { user } = this.props;
		Meteor.logout((() => {
			user.refetch();
		}));
	}

	renderLogin() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Card title='Entrar'>
				<Form onSubmit={this.handleLogin} className='login-form'>
					<Form.Item>
						{getFieldDecorator('email', {
							rules: [{ required: true, type: 'email', message: 'Por favor entre com seu email!' }],
							validateTrigger: 'onBlur'
						})(
							<Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='email' />
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: 'Por favor entre com sua senha!' }]
						})(
							<Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='senha' />
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
		const { getFieldDecorator } = this.props.form;
		return (
			<Card title='Criar conta'>
				<Form onSubmit={this.handleSignup} className='login-form'>
					<Form.Item>
						{getFieldDecorator('email', {
							rules: [{ required: true, type: 'email', message: 'Por favor entre com seu email!' }]
						})(
							<Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='email' />
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: 'Por favor entre com sua senha!' }]
						})(
							<Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='senha' />
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
							<Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='email' />
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
							<Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='senha atual' />
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('newPassword', {
							rules: [{ required: true, message: 'Por favor entre com a nova senha!' }]
						})(
							<Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='nova senha' />
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

	renderAccount() {
		const { user: { user } } = this.props;
		let userEmail;
		if (user && user.admin) {
			userEmail = user.mainEmail.address;
		}

		return (
			<Card title={userEmail}>
				<Form className='login-form'>
					<Form.Item>
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
		const { user: { user } } = this.props;
		if (user) {
			switch (this.state.action) {
				case 'change-password':
					return this.renderChangePassword();
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
		user: PropTypes.object,
		history: PropTypes.object
	}

	state = {}

	handleClick = (e) => {
		this.props.history.push(e.key);
	}

	renderAdminMenu() {
		const { user: { user } } = this.props;
		if (user && user.admin) {
			return (
				<Menu.SubMenu title='Administrar'>
					<Menu.Item key='calendars'>Calendários</Menu.Item>
					<Menu.Item key='teachers'>Professores</Menu.Item>
					<Menu.Item key='courses'>Cursos</Menu.Item>
				</Menu.SubMenu>
			);
		}
	}

	renderAccounts() {
		const { user, user: { loading } } = this.props;

		if (loading) {
			return;
		}

		let userEmail = 'Entrar / Criar Conta';

		if (user.user) {
			userEmail = user.user.mainEmail.address;
		}

		return (
			<Menu.SubMenu title={<span><Icon type='user' />{userEmail}</span>} style={{ float: 'right' }}>
				<WrappedAccountComponent user={user} />
			</Menu.SubMenu>
		);
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
				<Menu.Item key='/course'>Curso</Menu.Item>
				<Menu.Item key='/calendar'>Calendario</Menu.Item>
				{this.renderAdminMenu()}
				{this.renderAccounts()}
			</Menu>
		);
	}
}

export default withRouter(MenuComponent);