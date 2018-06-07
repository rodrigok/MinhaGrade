import { withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
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
		this.setState({loading: true});
		this.props.form.validateFields((err, values) => {
			this.setState({loading: false});
			if (!err) {
				Meteor.loginWithPassword({email: values.email}, values.password, (error) => {
					if (error) {
						message.error(error.reason);
					}
				});
			}
		});
	}

	handleSignup = (e) => {
		e.preventDefault();
		this.setState({loading: true});
		this.props.form.validateFields((err, {email, password}) => {
			this.setState({loading: false});
			if (!err) {
				Accounts.createUser({email, password}, (error) => {
					if (error) {
						return message.error(error.reason);
					}

					Meteor.loginWithPassword({email}, password, (error) => {
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
		this.setState({loading: true});
		this.props.form.validateFields((err, {email}) => {
			this.setState({loading: false});
			if (!err) {
				Accounts.forgotPassword({email}, (error) => {
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
		this.setState({loading: true});
		this.props.form.validateFields((err, {password, newPassword}) => {
			this.setState({loading: false});
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

	renderLogin() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Card title='Entrar'>
				<Form onSubmit={this.handleLogin} className='login-form'>
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
							Entrar
						</Button>
						<a href='' onClick={() => this.setState({action: 'forgot-password'})}>Esqueci minha senha</a>
						<a href='' className='login-form-register' onClick={() => this.setState({action: 'signup'})}>Criar conta</a>
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
						<a href='' className='login-form-register' onClick={() => this.setState({action: 'login'})}>Entrar</a>
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
						<a href='' className='login-form-register' onClick={() => this.setState({action: 'login'})}>Entrar</a>
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
						<a href='' className='login-form-register' onClick={() => this.setState({action: ''})}>Cancelar</a>
					</Form.Item>
				</Form>
			</Card>
		);
	}

	renderAccount() {
		const {user} = this.props;
		let userEmail;
		if (user && user.admin) {
			userEmail = user.emails[0].address;
		}

		return (
			<Card title={userEmail}>
				<Form className='login-form'>
					<Form.Item>
						<Button onClick={() => this.setState({action: 'change-password'})} className='login-form-button'>
							Mudar senha
						</Button>
						<Button type='primary' onClick={() => Meteor.logout()} className='login-form-button'>
							Sair
						</Button>
					</Form.Item>
				</Form>
			</Card>
		);
	}

	render() {
		if (this.props.user) {
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
}

const WrappedAccountComponent = Form.create()(AccountComponent);



class MenuComponent extends Component {
	static propTypes = {
		user: PropTypes.object,
		history: PropTypes.object
	}

	state = {}

	handleClick = (e) => {
		switch (e.key) {
			case 'logout':
				Meteor.logout();
				break;

			default:
				this.props.history.push(e.key);
		}
	}

	renderAdminMenu() {
		const {user} = this.props;
		if (user && user.admin) {
			return <Menu.Item key='calendars'>Editar Calendários</Menu.Item>;
		}
	}

	renderAccounts() {
		const {user} = this.props;
		let userEmail = 'Entrar / Criar Conta';

		if (user) {
			userEmail = user.emails[0].address;
		}

		return (
			<Menu.SubMenu title={<span><Icon type='user' />{userEmail}</span>}>
				<WrappedAccountComponent user={this.props.user} />
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

export default withTracker(() => {
	return {
		history,
		user: Meteor.user()
	};
})(withRouter(MenuComponent));
