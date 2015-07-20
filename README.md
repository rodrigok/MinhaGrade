# gradefaccat

## Como rodar o projeto

### Instalar o Meteor

OS X / Linux
```shell
curl https://install.meteor.com/ | sh
```
Windows: https://install.meteor.com/windows

### Clonar o repositório
```shell
git clone https://github.com/rodrigok/GradeFaccat
```

### Entrar na pastar e rodar o Meteor
```shell
meteor
```

### Abrir a aplicação no browser
http://localhost:3000

### Importar dados
O projeto vai iniciar sem dados, para importar os dados é preciso abrir o console do navegador e executar o seguinte comando
```javascript
Meteor.call('import')
```
